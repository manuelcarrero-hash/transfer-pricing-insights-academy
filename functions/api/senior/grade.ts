import { ensureSchema, json, prepareCredentialEvidenceUpsert, prepareCredentialEligibilityUpsert, type Env } from '../../_lib/certificates';
import { seniorFinalBank, seniorMiniCases, type SeniorDomain } from '../../../src/content/assessments/seniorFinal';
import { seniorMiniCaseAnswers, seniorObjectiveAnswers } from '../../_lib/seniorBank';

const CREDENTIAL='senior-knowledge' as const;
type Row={objective_ids:string;mini_case_ids:string;expires_at:string;graded_at:string|null;score:number|null;passed:number;result_data:string|null};
type Body={attemptId?:string;answers?:Record<string,number>;caseAnswers?:Record<string,number>};
type Stat={earned:number;possible:number};type Stats=Record<SeniorDomain,Stat>;
const empty=():Stats=>({far:{earned:0,possible:0},method:{earned:0,possible:0},comparability:{earned:0,possible:0},judgment:{earned:0,possible:0},other:{earned:0,possible:0}});

export async function onRequestPost(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);let body:Body;try{body=await context.request.json() as Body;}catch{return json({error:'invalid_json'},400);}
  const attemptId=body.attemptId?.trim();if(!attemptId||!body.answers||!body.caseAnswers)return json({error:'missing_fields'},400);
  await db.prepare(`CREATE TABLE IF NOT EXISTS senior_assessment_attempts (attempt_id TEXT PRIMARY KEY,objective_ids TEXT NOT NULL,mini_case_ids TEXT NOT NULL,created_at TEXT NOT NULL,expires_at TEXT NOT NULL,graded_at TEXT,score INTEGER,passed INTEGER NOT NULL DEFAULT 0,result_data TEXT)`).run();
  const row=await db.prepare(`SELECT objective_ids,mini_case_ids,expires_at,graded_at,score,passed,result_data FROM senior_assessment_attempts WHERE attempt_id=?`).bind(attemptId).first<Row>();
  if(!row)return json({error:'attempt_not_found'},404);if(new Date(row.expires_at).getTime()<Date.now())return json({error:'attempt_expired'},410);
  if(row.graded_at&&row.result_data){return json(JSON.parse(row.result_data));}
  const objectiveIds=JSON.parse(row.objective_ids) as number[],caseIds=JSON.parse(row.mini_case_ids) as string[];
  if(Object.keys(body.answers).length!==objectiveIds.length||Object.keys(body.caseAnswers).length!==caseIds.length)return json({error:'incomplete_attempt'},400);
  const stats=empty();let objectiveCorrect=0,caseCorrect=0;
  for(const id of objectiveIds){const q=seniorFinalBank.find(x=>x.id===id);if(!q||!(String(id) in body.answers))return json({error:'invalid_attempt_questions'},400);const ok=body.answers[String(id)]===seniorObjectiveAnswers[id];if(ok)objectiveCorrect++;stats[q.domain].possible+=1;if(ok)stats[q.domain].earned+=1;}
  for(const id of caseIds){const q=seniorMiniCases.find(x=>x.id===id);if(!q||!(id in body.caseAnswers))return json({error:'invalid_attempt_cases'},400);const ok=body.caseAnswers[id]===seniorMiniCaseAnswers[id];if(ok)caseCorrect++;stats[q.domain].possible+=7.5;if(ok)stats[q.domain].earned+=7.5;}
  const aScore=Math.round(objectiveCorrect/objectiveIds.length*100),bScore=Math.round(caseCorrect/caseIds.length*100),points=objectiveCorrect+caseCorrect*7.5,abScore=Math.round(points/50*100),gradedAt=new Date().toISOString();
  const result={eligibilityId:attemptId,attemptId,aScore,bScore,points,abScore,stats,completed:true,gradedAt};
  await db.batch([
    db.prepare(`UPDATE senior_assessment_attempts SET graded_at=?,score=?,passed=1,result_data=? WHERE attempt_id=? AND graded_at IS NULL`).bind(gradedAt,abScore,JSON.stringify(result),attemptId),
    prepareCredentialEvidenceUpsert(db,{eligibilityId:attemptId,credentialType:CREDENTIAL,componentKey:'senior-components-ab',score:abScore,passed:true,resultData:result,recordedAt:gradedAt}),
    prepareCredentialEligibilityUpsert(db,{eligibilityId:attemptId,credentialType:CREDENTIAL,score:Math.round(points),eligible:false,resultData:{componentsAB:result,awaiting:'senior-capstone'},updatedAt:gradedAt}),
  ]);
  return json(result);
}
