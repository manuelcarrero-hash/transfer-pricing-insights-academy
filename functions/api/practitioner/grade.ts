import { ensureSchema, json, prepareCredentialEligibilityUpsert, prepareCredentialEvidenceUpsert, type Env } from '../../_lib/certificates';
import { CONSULTANT_DOMAIN_FLOOR, CONSULTANT_PASS_SCORE, consultantBank, type ConsultantDomain } from '../../_lib/practitionerBank';

type AttemptRow={question_ids:string;expires_at:string;graded_at:string|null};
type GradeBody={attemptId?:string;answers?:Record<string,number>};
const PRACTITIONER='practitioner' as const;

export async function onRequestPost(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;
  await ensureSchema(db);
  await db.prepare(`CREATE TABLE IF NOT EXISTS practitioner_assessment_attempts (
    attempt_id TEXT PRIMARY KEY, question_ids TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
    graded_at TEXT, score INTEGER, passed INTEGER NOT NULL DEFAULT 0, domain_scores TEXT
  )`).run();

  let body:GradeBody;try{body=await context.request.json() as GradeBody;}catch{return json({error:'invalid_json'},400);}
  const attemptId=body.attemptId?.trim();
  if(!attemptId||!body.answers)return json({error:'missing_attempt_or_answers'},400);
  const attempt=await db.prepare('SELECT question_ids, expires_at, graded_at FROM practitioner_assessment_attempts WHERE attempt_id = ?').bind(attemptId).first<AttemptRow>();
  if(!attempt)return json({error:'attempt_not_found'},404);
  if(attempt.graded_at)return json({error:'attempt_already_graded'},409);
  if(Date.parse(attempt.expires_at)<Date.now())return json({error:'attempt_expired'},410);

  const ids=JSON.parse(attempt.question_ids) as number[];
  if(!Array.isArray(ids)||ids.length!==24)return json({error:'invalid_attempt'},500);
  const questions=ids.map(id=>consultantBank.find(question=>question.id===id)).filter(Boolean);
  if(questions.length!==ids.length)return json({error:'invalid_attempt'},500);

  const correct=questions.filter(question=>body.answers?.[String(question!.id)]===question!.correctIndex).length;
  const score=Math.round(correct/questions.length*100);
  const domains={} as Record<ConsultantDomain,number>;
  for(const domain of ['C1','C2','C3','C4','C5','C6','C7'] as ConsultantDomain[]){
    const domainQuestions=questions.filter(question=>question!.domain===domain);
    const domainCorrect=domainQuestions.filter(question=>body.answers?.[String(question!.id)]===question!.correctIndex).length;
    domains[domain]=Math.round(domainCorrect/domainQuestions.length*100);
  }
  const passedGlobal=score>=CONSULTANT_PASS_SCORE;
  const passedDomains=Object.values(domains).every(value=>value>=CONSULTANT_DOMAIN_FLOOR);
  const passed=passedGlobal&&passedDomains;
  const gradedAt=new Date().toISOString();
  const resultData={domains,correct,total:questions.length,passedGlobal,passedDomains,gradedAt};

  await db.batch([
    db.prepare(`UPDATE practitioner_assessment_attempts SET graded_at = ?, score = ?, passed = ?, domain_scores = ? WHERE attempt_id = ?`)
      .bind(gradedAt,score,passed?1:0,JSON.stringify(domains),attemptId),
    prepareCredentialEvidenceUpsert(db,{eligibilityId:attemptId,credentialType:PRACTITIONER,componentKey:'consultant-assessment',score,passed,resultData,recordedAt:gradedAt}),
    prepareCredentialEligibilityUpsert(db,{eligibilityId:attemptId,credentialType:PRACTITIONER,score,eligible:false,resultData:{assessment:resultData,case:null},updatedAt:gradedAt}),
  ]);

  return json({eligibilityId:attemptId,attemptId,score,passed,passedGlobal,passedDomains,domains,correct,total:questions.length,gradedAt});
}
