import { ensureSchema, json, makeId, type Env } from '../../_lib/certificates';
import { makeAttempt, publicQuestion } from '../../_lib/juniorBank';

export async function onRequestPost(context: { env: Env }) {
  const db = context.env.CERTIFICATES_DB;
  if (!db || typeof db.prepare !== 'function' || typeof db.batch !== 'function') {
    return json({ error: 'certificates_db_binding_missing' }, 503);
  }

  try {
    await ensureSchema(db);

    const questions = makeAttempt();
    const attemptId = makeId('TPIA-JA');
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);

    await db.prepare(`INSERT INTO junior_assessment_attempts
      (attempt_id, question_ids, created_at, expires_at)
      VALUES (?, ?, ?, ?)`)
      .bind(attemptId, JSON.stringify(questions.map((question) => question.id)), createdAt.toISOString(), expiresAt.toISOString())
      .run();

    return json({ attemptId, expiresAt: expiresAt.toISOString(), questions: questions.map(publicQuestion) });
  } catch (cause) {
    console.error('junior_attempt_failed', cause);
    return json({ error: 'junior_attempt_backend_failed' }, 500);
  }
}
