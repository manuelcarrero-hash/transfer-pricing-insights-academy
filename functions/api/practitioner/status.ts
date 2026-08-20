import { ensureSchema, getCredentialEligibility, json, type Env } from '../../_lib/certificates';

type EvidenceRow={score:number|null;passed:number;result_data:string|null;recorded_at:string};
const PRACTITIONER='practitioner' as const;

export async function onRequestGet(context:{env:Env;request:Request}){
  const db=context.env.CERTIFICATES_DB;await ensureSchema(db);
  const eligibilityId=new URL(context.request.url).searchParams.get('eligibilityId')?.trim();
  if(!eligibilityId)return json({error:'missing_eligibility_id'},400);
  const assessment=await db.prepare(`SELECT score, passed, result_data, recorded_at FROM credential_evidence
    WHERE eligibility_id = ? AND credential_type = ? AND component_key = 'consultant-assessment'`)
    .bind(eligibilityId,PRACTITIONER).first<EvidenceRow>();
  const caseEvidence=await db.prepare(`SELECT score, passed, result_data, recorded_at FROM credential_evidence
    WHERE eligibility_id = ? AND credential_type = ? AND component_key = 'consultant-case'`)
    .bind(eligibilityId,PRACTITIONER).first<EvidenceRow>();
  const eligibility=await getCredentialEligibility(db,PRACTITIONER,eligibilityId);
  if(!assessment&&!caseEvidence&&!eligibility)return json({error:'eligibility_not_found'},404);
  return json({
    eligibilityId,
    assessment:assessment?{score:assessment.score,passed:assessment.passed===1,recordedAt:assessment.recorded_at}:null,
    case:caseEvidence?{score:caseEvidence.score,passed:caseEvidence.passed===1,recordedAt:caseEvidence.recorded_at}:null,
    eligible:eligibility?.eligible===1,
    certificateIssued:eligibility?.certificate_issued===1,
  });
}
