import { ensureSchema, getCredentialEligibility, json, prepareCredentialEligibilityUpsert, prepareCredentialEvidenceUpsert, type Env } from '../../_lib/certificates';
import { seniorCapstoneDecisions } from '../../../src/content/assessments/seniorCapstone';
import type { SeniorDomain } from '../../../src/content/assessments/seniorFinal';
import { CAPSTONE_PASS_SCORE, SENIOR_DOMAIN_FLOOR, SENIOR_PASS_SCORE, publicCapstoneDecision, seniorCapstoneAnswers } from '../../_lib/seniorBank';

const CREDENTIAL='senior-knowledge' as const;
type EvidenceRow={score:number|null;passed:number;result_data:string|null};
type Body={eligibilityId?:string;answers?:Record<string,number>};
type Stat={earned:number;possible:number};type Stats=Record<SeniorDomain,Stat>;
const empty=():Stats=>({far:{earned:0,possible:0},method:{earned:0,possible:0},comparability:{earned:0,possible:0},judgment:{earned:0,possible:0},other:{earned:0,possible:0}});
async function evidence(db:Env['CERTIFICATES_DB'],id:string,key:string){return db.prepare(`SELECT score,passed,result_data FROM credential_evidence WHERE eligibility_id=? AND credential_type=? AND component_key=?`).bind(id,CREDENTIAL,key).first<EvidenceRow>();}

export async function onRequestGet(context:{env:Env;request:Request}){
 const db=context.env.CERTIFICATES_DB;await ensureSchema(db);const eligibilityId=new URL(context.request.url).searchParams.get('eligibilityId')?.trim();if(!eligibilityId)return json({error:'missing_eligibility_id'},400);
 const ab=await evidence(db,eligibilityId,'senior-components-ab');if(!ab||ab.passed!==1||!ab.result_data)return json({error:'components_ab_not_completed'},403);
 const cap=await evidence(db,eligibilityId,'senior-capstone');const eligibility=await getCredentialEligibility(db,CREDENTIAL,eligibilityId);
 return json({eligibilityId,passScore:CAPSTONE_PASS_SCORE,globalPassScore:SENIOR_PASS_SCORE,domainFloor:SENIOR_DOMAIN_FLOOR,decisions:seniorCapstoneDecisions.map(publicCapstoneDecision),alreadyPassed:cap?.passed===1&&eligibility?.eligible===1,priorResult:cap?.result_data?JSON.parse(cap.result_data):null});
}

export async function onRequestPost(context:{env:Env;request:Request}){
 const db=context.env.CERTIFICATES_DB;await ensureSchema(db);let body:Body;try{body=await context.request.json() as Body;}catch{return json({error:'invalid_json'},400);}const eligibilityId=body.eligibilityId?.trim();if(!eligibilityId||!body.answers)return json({error:'missing_fields'},400);
 const existingEligibility=await getCredentialEligibility(db,CREDENTIAL,eligibilityId);const existingCap=await evidence(db,eligibilityId,'senior-capstone');
 if(existingEligibility?.eligible===1&&existingCap?.passed===1&&existingCap.result_data)return json(JSON.parse(existingCap.result_data));
 const ab=await evidence(db,eligibilityId,'senior-components-ab');if(!ab||ab.passed!==1||!ab.result_data)return json({error:'components_ab_not_completed'},403);const abResult=JSON.parse(ab.result_data) as{points:number;stats:Stats};
 if(Object.keys(body.answers).length!==seniorCapstoneDecisions.length)return json({error:'incomplete_capstone'},400);
 let capEarned=0;const domains=empty();let correct=0;
 for(const d of seniorCapstoneDecisions){if(!(d.id in body.answers))return json({error:'incomplete_capstone'},400);const ok=body.answers[d.id]===seniorCapstoneAnswers[d.id];if(ok){capEarned+=d.weight;correct++;}const finalPointWeight=d.weight*.5;domains[d.domain].possible+=finalPointWeight;if(ok)domains[d.domain].earned+=finalPointWeight;}
 for(const k of Object.keys(domains) as SeniorDomain[]){domains[k].possible+=abResult.stats[k]?.possible??0;domains[k].earned+=abResult.stats[k]?.earned??0;}
 const capstone=Math.round(capEarned);const global=Math.round((abResult.points+capstone*.5)*10)/10;const domainScores=Object.fromEntries((['far','method','comparability','judgment'] as SeniorDomain[]).map(k=>[k,domains[k].possible?Math.round(domains[k].earned/domains[k].possible*100):0])) as Record<string,number>;
 const passed=global>=SENIOR_PASS_SCORE&&capstone>=CAPSTONE_PASS_SCORE&&Object.values(domainScores).every(x=>x>=SENIOR_DOMAIN_FLOOR);const gradedAt=new Date().toISOString();
 const result={eligibilityId,capstone,global,finalScore:global,domains,domainScores,passed,credentialEligible:passed,correct,total:seniorCapstoneDecisions.length,gradedAt};
 await db.batch([
  prepareCredentialEvidenceUpsert(db,{eligibilityId,credentialType:CREDENTIAL,componentKey:'senior-capstone',score:capstone,passed,resultData:result,recordedAt:gradedAt}),
  prepareCredentialEligibilityUpsert(db,{eligibilityId,credentialType:CREDENTIAL,score:global,eligible:passed,resultData:{componentsAB:abResult,capstone:result,finalScore:global,capstoneScore:capstone,domainScores},updatedAt:gradedAt}),
 ]);
 return json(result);
}
