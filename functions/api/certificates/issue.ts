import {
  ensureSchema,
  getCredentialDefinition,
  getCredentialEligibility,
  json,
  JUNIOR_CREDENTIAL_TYPE,
  makeCertificateId,
  prepareCredentialEligibilityIssued,
  prepareCredentialEligibilityUpsert,
  prepareCredentialEvidenceUpsert,
  validateTurnstile,
  type Env,
} from '../../_lib/certificates';

type LegacyJuniorAttemptRow = {
  score: number | null;
  passed: number;
  certificate_issued: number;
};

type ExistingCertificateRow = {
  certificate_id: string;
  participant_name: string;
  level_code: string;
  level_name: string;
  issued_at: string;
  curriculum_version: string;
  assessment_score: number;
  status: 'valid' | 'revoked';
  attempt_id: string;
};

type IssueBody = {
  credentialType?: string;
  eligibilityId?: string;
  attemptId?: string;
  participantName?: string;
  turnstileToken?: string;
};

function existingCertificateResponse(
  certificate: ExistingCertificateRow,
  credentialType: string,
  eligibilityId: string,
) {
  return json({
    certificateId: certificate.certificate_id,
    credentialType,
    eligibilityId,
    participantName: certificate.participant_name,
    levelCode: certificate.level_code,
    levelName: certificate.level_name,
    issuedAt: certificate.issued_at,
    curriculumVersion: certificate.curriculum_version,
    assessmentScore: certificate.assessment_score,
    status: certificate.status,
    verificationUrl: `/verify/${encodeURIComponent(certificate.certificate_id)}`,
    existing: true,
  });
}

async function findExistingCertificate(db: Env['CERTIFICATES_DB'], eligibilityId: string) {
  return db.prepare(`SELECT certificate_id, participant_name, level_code, level_name, issued_at,
    curriculum_version, assessment_score, status, attempt_id
    FROM certificates WHERE attempt_id = ? AND status = 'valid' LIMIT 1`)
    .bind(eligibilityId)
    .first<ExistingCertificateRow>();
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  const db = context.env.CERTIFICATES_DB;
  await ensureSchema(db);

  let body: IssueBody;
  try { body = await context.request.json() as IssueBody; } catch { return json({ error: 'invalid_json' }, 400); }

  const requestedType = body.credentialType?.trim() || JUNIOR_CREDENTIAL_TYPE;
  const definition = getCredentialDefinition(requestedType);
  if (!definition) return json({ error: 'invalid_credential_type' }, 400);

  const eligibilityId = body.eligibilityId?.trim() || body.attemptId?.trim();
  const participantName = body.participantName?.trim().replace(/\s+/g, ' ');
  const turnstileToken = body.turnstileToken?.trim();
  if (!eligibilityId || !participantName || !turnstileToken) return json({ error: 'missing_fields' }, 400);
  if (participantName.length < 2 || participantName.length > 120) return json({ error: 'invalid_participant_name' }, 400);

  const remoteIp = context.request.headers.get('CF-Connecting-IP') ?? undefined;
  const turnstileOk = await validateTurnstile(context.env.TURNSTILE_SECRET_KEY, turnstileToken, remoteIp);
  if (!turnstileOk) return json({ error: 'turnstile_failed' }, 403);

  // Issuance is idempotent: once an authoritative eligibility has a valid credential,
  // return that credential instead of trapping the user in a duplicate-issuance conflict.
  const existing = await findExistingCertificate(db, eligibilityId);
  if (existing) return existingCertificateResponse(existing, definition.credentialType, eligibilityId);

  let eligibility = await getCredentialEligibility(db, definition.credentialType, eligibilityId);

  // Backward compatibility for Junior attempts graded before P1-B0 created the common evidence layer.
  if (!eligibility && definition.credentialType === JUNIOR_CREDENTIAL_TYPE) {
    const legacy = await db.prepare(`SELECT score, passed, certificate_issued
      FROM junior_assessment_attempts WHERE attempt_id = ?`)
      .bind(eligibilityId).first<LegacyJuniorAttemptRow>();

    if (legacy?.certificate_issued === 1) {
      const legacyExisting = await findExistingCertificate(db, eligibilityId);
      if (legacyExisting) return existingCertificateResponse(legacyExisting, definition.credentialType, eligibilityId);
      return json({ error: 'certificate_already_issued' }, 409);
    }
    if (legacy && legacy.passed === 1 && typeof legacy.score === 'number') {
      const migratedAt = new Date().toISOString();
      const legacyResult = { source: 'legacy_junior_attempt', migratedAt };
      await db.batch([
        prepareCredentialEvidenceUpsert(db, {
          eligibilityId,
          credentialType: JUNIOR_CREDENTIAL_TYPE,
          componentKey: 'junior-assessment',
          score: legacy.score,
          passed: true,
          resultData: legacyResult,
          recordedAt: migratedAt,
        }),
        prepareCredentialEligibilityUpsert(db, {
          eligibilityId,
          credentialType: JUNIOR_CREDENTIAL_TYPE,
          score: legacy.score,
          eligible: true,
          resultData: legacyResult,
          updatedAt: migratedAt,
        }),
      ]);
      eligibility = await getCredentialEligibility(db, JUNIOR_CREDENTIAL_TYPE, eligibilityId);
    }
  }

  if (!eligibility) return json({ error: 'eligibility_not_found' }, 404);
  if (eligibility.eligible !== 1 || typeof eligibility.score !== 'number') return json({ error: 'credential_not_eligible' }, 403);
  if (eligibility.certificate_issued === 1) {
    const eligibilityExisting = await findExistingCertificate(db, eligibilityId);
    if (eligibilityExisting) return existingCertificateResponse(eligibilityExisting, definition.credentialType, eligibilityId);
    return json({ error: 'certificate_already_issued' }, 409);
  }

  const issuedAt = new Date().toISOString();
  const certificateId = makeCertificateId(definition, issuedAt);
  const statements = [
    db.prepare(`INSERT INTO certificates
      (certificate_id, participant_name, level_code, level_name, issued_at, curriculum_version, assessment_score, status, attempt_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'valid', ?, ?)`)
      .bind(
        certificateId,
        participantName,
        definition.levelCode,
        definition.levelName,
        issuedAt,
        definition.curriculumVersion,
        eligibility.score,
        eligibilityId,
        issuedAt,
      ),
    prepareCredentialEligibilityIssued(db, definition.credentialType, eligibilityId, issuedAt),
  ];

  if (definition.credentialType === JUNIOR_CREDENTIAL_TYPE) {
    statements.push(
      db.prepare('UPDATE junior_assessment_attempts SET certificate_issued = 1 WHERE attempt_id = ? AND certificate_issued = 0')
        .bind(eligibilityId),
    );
  }

  try {
    await db.batch(statements);
  } catch {
    // A concurrent request may have won the race. Recover the valid credential rather than
    // surfacing a duplicate/conflict to the learner.
    const racedExisting = await findExistingCertificate(db, eligibilityId);
    if (racedExisting) return existingCertificateResponse(racedExisting, definition.credentialType, eligibilityId);
    return json({ error: 'certificate_issue_conflict' }, 409);
  }

  return json({
    certificateId,
    credentialType: definition.credentialType,
    eligibilityId,
    participantName,
    levelCode: definition.levelCode,
    levelName: definition.levelName,
    issuedAt,
    curriculumVersion: definition.curriculumVersion,
    assessmentScore: eligibility.score,
    status: 'valid',
    verificationUrl: `/verify/${encodeURIComponent(certificateId)}`,
    existing: false,
  }, 201);
}
