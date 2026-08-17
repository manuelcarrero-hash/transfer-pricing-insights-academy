import { ensureSchema, json, makeId, validateTurnstile, type Env } from '../../_lib/certificates';

type AttemptRow = {
  score: number | null;
  passed: number;
  certificate_issued: number;
};

type IssueBody = { attemptId?: string; participantName?: string; turnstileToken?: string };

export async function onRequestPost(context: { env: Env; request: Request }) {
  const db = context.env.CERTIFICATES_DB;
  await ensureSchema(db);

  let body: IssueBody;
  try { body = await context.request.json() as IssueBody; } catch { return json({ error: 'invalid_json' }, 400); }
  const attemptId = body.attemptId?.trim();
  const participantName = body.participantName?.trim().replace(/\s+/g, ' ');
  const turnstileToken = body.turnstileToken?.trim();
  if (!attemptId || !participantName || !turnstileToken) return json({ error: 'missing_fields' }, 400);
  if (participantName.length < 2 || participantName.length > 120) return json({ error: 'invalid_participant_name' }, 400);

  const remoteIp = context.request.headers.get('CF-Connecting-IP') ?? undefined;
  const turnstileOk = await validateTurnstile(context.env.TURNSTILE_SECRET_KEY, turnstileToken, remoteIp);
  if (!turnstileOk) return json({ error: 'turnstile_failed' }, 403);

  const attempt = await db.prepare('SELECT score, passed, certificate_issued FROM junior_assessment_attempts WHERE attempt_id = ?')
    .bind(attemptId).first<AttemptRow>();
  if (!attempt) return json({ error: 'attempt_not_found' }, 404);
  if (attempt.passed !== 1 || typeof attempt.score !== 'number') return json({ error: 'attempt_not_passed' }, 403);
  if (attempt.certificate_issued === 1) return json({ error: 'certificate_already_issued' }, 409);

  const issuedAt = new Date().toISOString();
  const datePart = issuedAt.slice(0, 10).replaceAll('-', '');
  const certificateId = makeId(`TPIA-JF-${datePart}`);

  try {
    await db.batch([
      db.prepare(`INSERT INTO certificates
        (certificate_id, participant_name, level_code, level_name, issued_at, curriculum_version, assessment_score, status, attempt_id, created_at)
        VALUES (?, ?, 'JF', 'Transfer Pricing Junior Foundations', ?, 'v1.0', ?, 'valid', ?, ?)`)
        .bind(certificateId, participantName, issuedAt, attempt.score, attemptId, issuedAt),
      db.prepare('UPDATE junior_assessment_attempts SET certificate_issued = 1 WHERE attempt_id = ? AND certificate_issued = 0').bind(attemptId),
    ]);
  } catch {
    return json({ error: 'certificate_issue_conflict' }, 409);
  }

  return json({
    certificateId,
    participantName,
    levelCode: 'JF',
    levelName: 'Transfer Pricing Junior Foundations',
    issuedAt,
    curriculumVersion: 'v1.0',
    assessmentScore: attempt.score,
    status: 'valid',
    verificationUrl: `/verify/${encodeURIComponent(certificateId)}`,
  }, 201);
}
