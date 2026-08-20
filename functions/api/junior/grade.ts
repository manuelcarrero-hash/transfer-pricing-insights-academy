import {
  ensureSchema,
  json,
  prepareCredentialEligibilityUpsert,
  prepareCredentialEvidenceUpsert,
  JUNIOR_CREDENTIAL_TYPE,
  type Env,
} from '../../_lib/certificates';
import { bank, JUNIOR_DOMAIN_FLOOR, JUNIOR_PASS_SCORE, juniorDomains, type JuniorDomain } from '../../_lib/juniorBank';

type AttemptRow = {
  question_ids: string;
  expires_at: string;
  graded_at: string | null;
};

type GradeBody = { attemptId?: string; answers?: Record<string, number> };

export async function onRequestPost(context: { env: Env; request: Request }) {
  const db = context.env.CERTIFICATES_DB;
  await ensureSchema(db);

  let body: GradeBody;
  try { body = await context.request.json() as GradeBody; } catch { return json({ error: 'invalid_json' }, 400); }
  const attemptId = body.attemptId?.trim();
  if (!attemptId || !body.answers) return json({ error: 'missing_attempt_or_answers' }, 400);

  const attempt = await db.prepare('SELECT question_ids, expires_at, graded_at FROM junior_assessment_attempts WHERE attempt_id = ?')
    .bind(attemptId).first<AttemptRow>();
  if (!attempt) return json({ error: 'attempt_not_found' }, 404);
  if (attempt.graded_at) return json({ error: 'attempt_already_graded' }, 409);
  if (Date.parse(attempt.expires_at) < Date.now()) return json({ error: 'attempt_expired' }, 410);

  const ids = JSON.parse(attempt.question_ids) as number[];
  if (!Array.isArray(ids) || ids.length !== 20) return json({ error: 'invalid_attempt' }, 500);
  const questions = ids.map((id) => bank.find((question) => question.id === id)).filter(Boolean);
  if (questions.length !== ids.length) return json({ error: 'invalid_attempt' }, 500);

  const correct = questions.filter((question) => body.answers?.[String(question!.id)] === question!.correctIndex).length;
  const score = Math.round((correct / questions.length) * 100);
  const domainScores = Object.fromEntries(juniorDomains.map((domain) => {
    const domainQuestions = questions.filter((question) => question!.domain === domain);
    const domainCorrect = domainQuestions.filter((question) => body.answers?.[String(question!.id)] === question!.correctIndex).length;
    return [domain, Math.round((domainCorrect / domainQuestions.length) * 100)];
  })) as Record<JuniorDomain, number>;
  const passed = score >= JUNIOR_PASS_SCORE && juniorDomains.every((domain) => domainScores[domain] >= JUNIOR_DOMAIN_FLOOR);
  const gradedAt = new Date().toISOString();
  const resultData = { domainScores, correct, total: questions.length, gradedAt };

  await db.batch([
    db.prepare(`UPDATE junior_assessment_attempts
      SET graded_at = ?, score = ?, passed = ?, domain_scores = ?
      WHERE attempt_id = ?`)
      .bind(gradedAt, score, passed ? 1 : 0, JSON.stringify(domainScores), attemptId),
    prepareCredentialEvidenceUpsert(db, {
      eligibilityId: attemptId,
      credentialType: JUNIOR_CREDENTIAL_TYPE,
      componentKey: 'junior-assessment',
      score,
      passed,
      resultData,
      recordedAt: gradedAt,
    }),
    prepareCredentialEligibilityUpsert(db, {
      eligibilityId: attemptId,
      credentialType: JUNIOR_CREDENTIAL_TYPE,
      score,
      eligible: passed,
      resultData,
      updatedAt: gradedAt,
    }),
  ]);

  return json({ attemptId, score, passed, domainScores, correct, total: questions.length, gradedAt });
}
