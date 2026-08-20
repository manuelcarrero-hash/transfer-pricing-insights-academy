import { ensureSchema, json, prepareCredentialEligibilityUpsert, prepareCredentialEvidenceUpsert, type Env } from '../../_lib/certificates';
import { ADVANCED_CASE_PASS_SCORE, caseA, caseB } from '../../../src/content/assessments/semiSeniorCases';

const CREDENTIAL='advanced-practitioner' as const;
type EvidenceRow={score:number|null;passed:number;result_data:string|null};
type CaseBody={eligibilityId?:string;answers?:Record<string,number[]>};
function same(a:number[]|undefined,b:number[]){if(!a)return false;const aa=[...a].sort((x,y)=>x-y),bb=[...b].sort((x,y)=>x-y);return aa.length===bb.length&&aa.every((v,i)=>v===bb[i]);}
async function evidence(db:Env['CERTIFICATES_DB'],eligibilityId:string,componentKey:string){return db.prepare(`SELECT score,passed,result_data FROM credential_evidence WHERE eligibility_id=? AND credential_type=? AND component_key=?`).bind(eligibilityId,CREDENTIAL,componentKey).first<EvidenceRow>();}
function publicCase(input:typeof caseA){return {title:input.title,facts:input.facts,questions:input.questions.map(({id,domain,prompt,options,correct})=>({id,domain,prompt,options,multiple:correct.length>1}))};}
function priorCase(row:EvidenceRow){if(row.result_data){try{return JSON.parse(row.result_data) as {score:number;correct:number;total:number;passed:boolean;gradedAt:string};}catch{/* fall through */}}return{score:row.score??100,correct:0,total:0,passed:true,gradedAt:null};}

export async function onRequestGet(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);const eligibilityId=new URL(context.request.url).searchParams.get('eligibilityId')?.trim();if(!eligibilityId)return json({error:'missing_eligibility_id'},400);
  const assessment=await evidence(db,eligibilityId,'semi-senior-assessment');if(!assessment||assessment.passed!==1)return json({error:'assessment_not_passed'},403);
  const a=await evidence(db,eligibilityId,'advanced-case-a'),b=await evidence(db,eligibilityId,'advanced-case-b');
  return json({eligibilityId,passScore:ADVANCED_CASE_PASS_SCORE,caseA:publicCase(caseA),caseB:publicCase(caseB),alreadyPassed:a?.passed===1&&b?.passed===1,priorResult:{a:a?{score:a.score,passed:a.passed===1}:null,b:b?{score:b.score,passed:b.passed===1}:null}});
}

export async function onRequestPost(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);let body:CaseBody;try{body=await context.request.json() as CaseBody;}catch{return json({error:'invalid_json'},400);}
  const eligibilityId=body.eligibilityId?.trim();if(!eligibilityId||!body.answers)return json({error:'missing_eligibility_or_answers'},400);
  const assessment=await evidence(db,eligibilityId,'semi-senior-assessment');if(!assessment||assessment.passed!==1||typeof assessment.score!=='number')return json({error:'assessment_not_passed'},403);
  const existingA=await evidence(db,eligibilityId,'advanced-case-a'),existingB=await evidence(db,eligibilityId,'advanced-case-b');
  if(existingA?.passed===1&&existingB?.passed===1){
    return json({eligibilityId,a:priorCase(existingA),b:priorCase(existingB),passed:true,credentialEligible:true,alreadyPassed:true});
  }
  const all=[...caseA.questions,...caseB.questions];if(Object.keys(body.answers).length!==all.length)return json({error:'incomplete_cases'},400);
  const scoreCase=(questions:typeof caseA.questions)=>{const correct=questions.filter(q=>same(body.answers?.[q.id],q.correct)).length;const score=Math.round(correct/questions.length*100);return {score,correct,total:questions.length,passed:score>=ADVANCED_CASE_PASS_SCORE};};
  const a=scoreCase(caseA.questions),b=scoreCase(caseB.questions),gradedAt=new Date().toISOString();const eligible=a.passed&&b.passed;
  const feedback=all.map(q=>({id:q.id,domain:q.domain,correct:same(body.answers?.[q.id],q.correct),explanation:q.explanation}));
  await db.batch([
    prepareCredentialEvidenceUpsert(db,{eligibilityId,credentialType:CREDENTIAL,componentKey:'advanced-case-a',score:a.score,passed:a.passed,resultData:{...a,gradedAt},recordedAt:gradedAt}),
    prepareCredentialEvidenceUpsert(db,{eligibilityId,credentialType:CREDENTIAL,componentKey:'advanced-case-b',score:b.score,passed:b.passed,resultData:{...b,gradedAt},recordedAt:gradedAt}),
    prepareCredentialEligibilityUpsert(db,{eligibilityId,credentialType:CREDENTIAL,score:assessment.score,eligible,resultData:{assessment:assessment.result_data?JSON.parse(assessment.result_data):{score:assessment.score},caseA:{...a,gradedAt},caseB:{...b,gradedAt}},updatedAt:gradedAt}),
  ]);
  return json({eligibilityId,a,b,passed:eligible,credentialEligible:eligible,gradedAt,feedback});
}
