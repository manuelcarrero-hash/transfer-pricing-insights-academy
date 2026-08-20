import { ensureSchema, getCredentialEligibility, json, type Env } from '../../_lib/certificates';
const CREDENTIAL='senior-knowledge' as const;
type EvidenceRow={component_key:string;score:number|null;passed:number;result_data:string|null};
export async function onRequestGet(context:{env:Env;request:Request}){
 const db=context.env.CERTIFICATES_DB;await ensureSchema(db);const eligibilityId=new URL(context.request.url).searchParams.get('eligibilityId')?.trim();if(!eligibilityId)return json({error:'missing_eligibility_id'},400);
 const ab=await db.prepare(`SELECT component_key,score,passed,result_data FROM credential_evidence WHERE eligibility_id=? AND credential_type=? AND component_key='senior-components-ab'`).bind(eligibilityId,CREDENTIAL).first<EvidenceRow>();
 const cap=await db.prepare(`SELECT component_key,score,passed,result_data FROM credential_evidence WHERE eligibility_id=? AND credential_type=? AND component_key='senior-capstone'`).bind(eligibilityId,CREDENTIAL).first<EvidenceRow>();
 const eligibility=await getCredentialEligibility(db,CREDENTIAL,eligibilityId);if(!ab&&!cap&&!eligibility)return json({error:'eligibility_not_found'},404);
 const data=eligibility?.result_data?JSON.parse(eligibility.result_data):null;
 return json({eligibilityId,componentsAB:ab?{score:ab.score,passed:ab.passed===1,result:ab.result_data?JSON.parse(ab.result_data):null}:null,capstone:cap?{score:cap.score,passed:cap.passed===1,result:cap.result_data?JSON.parse(cap.result_data):null}:null,eligible:eligibility?.eligible===1,finalScore:eligibility?.score??null,capstoneScore:data?.capstoneScore??cap?.score??null,domainScores:data?.domainScores??null,certificateIssued:eligibility?.certificate_issued===1});
}
