import { ensureSchema, json, prepareCredentialEligibilityUpsert, prepareCredentialEvidenceUpsert, type Env } from '../../_lib/certificates';
import { CONSULTANT_CASE_PASS_SCORE, practitionerCaseFacts, practitionerCaseQuestions } from '../../_lib/practitionerBank';

const PRACTITIONER='practitioner' as const;
type EvidenceRow={score:number|null;passed:number;result_data:string|null};
type CaseBody={eligibilityId?:string;answers?:Record<string,number[]>};
function same(a:number[]|undefined,b:number[]){if(!a)return false;const aa=[...a].sort((x,y)=>x-y);const bb=[...b].sort((x,y)=>x-y);return aa.length===bb.length&&aa.every((v,i)=>v===bb[i]);}
async function evidence(db:Env['CERTIFICATES_DB'],eligibilityId:string,componentKey:string){
  return db.prepare(`SELECT score, passed, result_data FROM credential_evidence
    WHERE eligibility_id = ? AND credential_type = ? AND component_key = ?`)
    .bind(eligibilityId,PRACTITIONER,componentKey).first<EvidenceRow>();
}

export async function onRequestGet(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);
  const eligibilityId=new URL(context.request.url).searchParams.get('eligibilityId')?.trim();
  if(!eligibilityId)return json({error:'missing_eligibility_id'},400);
  const assessment=await evidence(db,eligibilityId,'consultant-assessment');
  if(!assessment||assessment.passed!==1)return json({error:'assessment_not_passed'},403);
  const caseEvidence=await evidence(db,eligibilityId,'consultant-case');
  return json({
    eligibilityId,
    facts:practitionerCaseFacts,
    passScore:CONSULTANT_CASE_PASS_SCORE,
    alreadyPassed:caseEvidence?.passed===1,
    priorResult:caseEvidence?{score:caseEvidence.score,passed:caseEvidence.passed===1}:null,
    questions:practitionerCaseQuestions.map(({id,domain,prompt,options,correct})=>({id,domain,prompt,options,multiple:correct.length>1})),
  });
}

export async function onRequestPost(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);
  let body:CaseBody;try{body=await context.request.json() as CaseBody;}catch{return json({error:'invalid_json'},400);}
  const eligibilityId=body.eligibilityId?.trim();
  if(!eligibilityId||!body.answers)return json({error:'missing_eligibility_or_answers'},400);
  const assessment=await evidence(db,eligibilityId,'consultant-assessment');
  if(!assessment||assessment.passed!==1||typeof assessment.score!=='number')return json({error:'assessment_not_passed'},403);
  const existingCase=await evidence(db,eligibilityId,'consultant-case');
  if(existingCase?.passed===1){
    const prior=existingCase.result_data?JSON.parse(existingCase.result_data):{score:existingCase.score,passed:true};
    return json({eligibilityId,...prior,credentialEligible:true,alreadyPassed:true});
  }
  if(Object.keys(body.answers).length!==practitionerCaseQuestions.length)return json({error:'incomplete_case'},400);

  const correct=practitionerCaseQuestions.filter(question=>same(body.answers?.[question.id],question.correct)).length;
  const score=Math.round(correct/practitionerCaseQuestions.length*100);
  const passed=score>=CONSULTANT_CASE_PASS_SCORE;
  const gradedAt=new Date().toISOString();
  const feedback=practitionerCaseQuestions.map(question=>({id:question.id,domain:question.domain,correct:same(body.answers?.[question.id],question.correct),explanation:question.explanation}));
  const caseResult={score,correct,total:practitionerCaseQuestions.length,passed,gradedAt};
  const assessmentResult=assessment.result_data?JSON.parse(assessment.result_data):{score:assessment.score};

  await db.batch([
    prepareCredentialEvidenceUpsert(db,{eligibilityId,credentialType:PRACTITIONER,componentKey:'consultant-case',score,passed,resultData:caseResult,recordedAt:gradedAt}),
    prepareCredentialEligibilityUpsert(db,{eligibilityId,credentialType:PRACTITIONER,score:assessment.score,eligible:passed,resultData:{assessment:assessmentResult,case:caseResult},updatedAt:gradedAt}),
  ]);

  return json({eligibilityId,score,correct,total:practitionerCaseQuestions.length,passed,gradedAt,feedback,credentialEligible:passed});
}
