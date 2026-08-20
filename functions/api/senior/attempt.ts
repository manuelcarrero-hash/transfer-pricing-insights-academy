import { ensureSchema, json, makeId, type Env } from '../../_lib/certificates';
import { buildSeniorAttempt, publicMiniCase, publicQuestion } from '../../_lib/seniorBank';

export async function onRequestPost(context:{env:Env}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);
  await db.prepare(`CREATE TABLE IF NOT EXISTS senior_assessment_attempts (
    attempt_id TEXT PRIMARY KEY,
    objective_ids TEXT NOT NULL,
    mini_case_ids TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    graded_at TEXT,
    score INTEGER,
    passed INTEGER NOT NULL DEFAULT 0,
    result_data TEXT
  )`).run();
  const {questions,cases}=buildSeniorAttempt();
  const attemptId=makeId('TPIA-SK-A');
  const createdAt=new Date();const expiresAt=new Date(createdAt.getTime()+2*60*60*1000);
  await db.prepare(`INSERT INTO senior_assessment_attempts (attempt_id,objective_ids,mini_case_ids,created_at,expires_at) VALUES (?,?,?,?,?)`)
    .bind(attemptId,JSON.stringify(questions.map(q=>q.id)),JSON.stringify(cases.map(q=>q.id)),createdAt.toISOString(),expiresAt.toISOString()).run();
  return json({attemptId,expiresAt:expiresAt.toISOString(),questions:questions.map(publicQuestion),cases:cases.map(publicMiniCase)},201);
}
