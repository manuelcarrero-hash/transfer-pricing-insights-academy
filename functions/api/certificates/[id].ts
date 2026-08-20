import {
  credentialTypeFromLevelCode,
  ensureSchema,
  json,
  type CertificateRecord,
  type Env,
} from '../../_lib/certificates';

export async function onRequestGet(context: { env: Env; params: { id?: string } }) {
  const db = context.env.CERTIFICATES_DB;
  await ensureSchema(db);
  const id = context.params.id?.trim();
  if (!id) return json({ error: 'missing_certificate_id' }, 400);

  const record = await db.prepare(`SELECT certificate_id, participant_name, level_code, level_name,
    issued_at, curriculum_version, assessment_score, status, attempt_id
    FROM certificates WHERE certificate_id = ?`)
    .bind(id).first<CertificateRecord>();
  if (!record) return json({ valid: false, error: 'certificate_not_found' }, 404);

  return json({
    valid: record.status === 'valid',
    certificateId: record.certificate_id,
    credentialType: credentialTypeFromLevelCode(record.level_code),
    participantName: record.participant_name,
    levelCode: record.level_code,
    levelName: record.level_name,
    issuedAt: record.issued_at,
    curriculumVersion: record.curriculum_version,
    assessmentScore: record.assessment_score,
    status: record.status,
  });
}
