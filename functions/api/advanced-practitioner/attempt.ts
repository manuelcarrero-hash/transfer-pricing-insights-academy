import { ensureSchema, json, makeId, type Env } from '../../_lib/certificates';
import { semiSeniorAttemptPlan, semiSeniorBank, type SemiSeniorDomain } from '../../../src/content/assessments/semiSeniorCumulative';

function randomIndex(maxExclusive:number){const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]%maxExclusive;}
function shuffle<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=randomIndex(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}

export async function onRequestPost(context:{env:Env}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);
  await db.prepare(`CREATE TABLE IF NOT EXISTS advanced_practitioner_assessment_attempts (
    attempt_id TEXT PRIMARY KEY, question_ids TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
    graded_at TEXT, score INTEGER, passed INTEGER NOT NULL DEFAULT 0, domain_scores TEXT
  )`).run();
  const selected=(Object.keys(semiSeniorAttemptPlan) as SemiSeniorDomain[])
    .flatMap(domain=>shuffle(semiSeniorBank.filter(question=>question.domain===domain)).slice(0,semiSeniorAttemptPlan[domain]));
  const questions=shuffle(selected);const attemptId=makeId('TPIA-ATP-A');const createdAt=new Date();const expiresAt=new Date(createdAt.getTime()+2*60*60*1000);
  await db.prepare(`INSERT INTO advanced_practitioner_assessment_attempts (attempt_id,question_ids,created_at,expires_at) VALUES (?,?,?,?)`)
    .bind(attemptId,JSON.stringify(questions.map(question=>question.id)),createdAt.toISOString(),expiresAt.toISOString()).run();
  return json({attemptId,expiresAt:expiresAt.toISOString(),questions:questions.map(({id,domain,prompt,options})=>({id,domain,prompt,options}))},201);
}
