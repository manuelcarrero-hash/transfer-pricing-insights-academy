import { FormEvent,useCallback,useEffect,useMemo,useState } from 'react';
import { Link,useSearchParams } from 'react-router-dom';
import { TurnstileWidget } from '../components/security/TurnstileWidget';
import { CONSULTANT_CASE_PASS_SCORE,CaseFeedback,CaseQuestion } from '../content/assessments/consultantCase';

const ELIGIBILITY_KEY='tp-practitioner-eligibility-id';
const PRACTITIONER_KEY='tp-practitioner-unlocked';
type CasePayload={eligibilityId:string;facts:string;passScore:number;alreadyPassed:boolean;priorResult:{score:number|null;passed:boolean}|null;questions:Array<CaseQuestion&{multiple:boolean}>};
type CaseResult={eligibilityId:string;score:number;correct?:number;total?:number;passed:boolean;gradedAt?:string;feedback?:CaseFeedback[];credentialEligible:boolean;alreadyPassed?:boolean};
type CertificateResponse={certificateId:string;participantName:string;issuedAt:string;verificationUrl:string};

export function ConsultantCasePage(){
  const[searchParams]=useSearchParams();
  const queryId=searchParams.get('eligibilityId')?.trim()??'';
  const storedId=typeof window!=='undefined'?localStorage.getItem(ELIGIBILITY_KEY)?.trim()??'':'';
  const eligibilityId=queryId||storedId;
  const[payload,setPayload]=useState<CasePayload|null>(null);
  const[answers,setAnswers]=useState<Record<string,number[]>>({});
  const[result,setResult]=useState<CaseResult|null>(null);
  const[participantName,setParticipantName]=useState('');
  const[turnstileToken,setTurnstileToken]=useState('');
  const[loading,setLoading]=useState(Boolean(eligibilityId));
  const[submitting,setSubmitting]=useState(false);
  const[issuing,setIssuing]=useState(false);
  const[error,setError]=useState('');
  const handleTurnstileToken=useCallback((token:string)=>setTurnstileToken(token),[]);
  const questions=payload?.questions??[];
  const answered=useMemo(()=>questions.filter(q=>(answers[q.id]?.length??0)>0).length,[answers,questions]);

  useEffect(()=>{
    if(!eligibilityId){setLoading(false);return;}
    localStorage.setItem(ELIGIBILITY_KEY,eligibilityId);
    let cancelled=false;setLoading(true);setError('');
    fetch(`/api/practitioner/case?eligibilityId=${encodeURIComponent(eligibilityId)}`,{headers:{accept:'application/json'}})
      .then(async response=>{if(!response.ok)throw new Error(response.status===403?'Primero debes aprobar la evaluación acumulativa Consultant.':'No fue posible cargar el caso integrador.');return response.json() as Promise<CasePayload>;})
      .then(data=>{if(cancelled)return;setPayload(data);if(data.alreadyPassed){setResult({eligibilityId:data.eligibilityId,score:data.priorResult?.score??100,passed:true,credentialEligible:true,alreadyPassed:true});localStorage.setItem(PRACTITIONER_KEY,'true');}})
      .catch(cause=>{if(!cancelled)setError(cause instanceof Error?cause.message:'No fue posible cargar el caso integrador.');})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[eligibilityId]);

  function toggle(id:string,index:number,multiple:boolean){setAnswers(current=>{const existing=current[id]??[];return{...current,[id]:multiple?(existing.includes(index)?existing.filter(x=>x!==index):[...existing,index]):[index]};});}
  async function grade(e:FormEvent){
    e.preventDefault();if(!eligibilityId||answered!==questions.length||submitting)return;
    setSubmitting(true);setError('');
    try{
      const response=await fetch('/api/practitioner/case',{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify({eligibilityId,answers})});
      if(!response.ok)throw new Error('No fue posible calificar el caso integrador.');
      const next=await response.json() as CaseResult;setResult(next);
      if(next.passed)localStorage.setItem(PRACTITIONER_KEY,'true');
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(cause){setError(cause instanceof Error?cause.message:'No fue posible calificar el caso integrador.');}
    finally{setSubmitting(false);}
  }
  async function issueCertificate(){
    const name=participantName.trim();if(!name||!result?.passed||!eligibilityId||!turnstileToken||issuing)return;
    setIssuing(true);setError('');
    try{
      const response=await fetch('/api/certificates/issue',{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify({credentialType:'practitioner',eligibilityId,participantName:name,turnstileToken})});
      if(!response.ok){const detail=await response.json().catch(()=>({})) as {error?:string};throw new Error(detail.error==='turnstile_failed'?'La verificación de seguridad expiró. Vuelve a completarla.':'No fue posible emitir el certificado.');}
      const certificate=await response.json() as CertificateResponse;
      window.location.href=`/practitioner/certificate?id=${encodeURIComponent(certificate.certificateId)}`;
    }catch(cause){setError(cause instanceof Error?cause.message:'No fue posible emitir el certificado.');setTurnstileToken('');}
    finally{setIssuing(false);}
  }

  if(!eligibilityId)return <section className="section"><div className="container narrow"><h1>Primero completa la evaluación Consultant</h1><p className="lead small">El caso integrador requiere una evaluación acumulativa aprobada y validada por el servidor.</p><Link className="button primary" to="/consultant/assessment">Ir a la evaluación</Link></div></section>;
  if(loading)return <section className="section"><div className="container narrow"><h1>Validando elegibilidad…</h1><p className="lead small">Consultando la evidencia authoritative del componente objetivo.</p></div></section>;
  if(!payload)return <section className="section"><div className="container narrow"><h1>Caso no disponible</h1><p className="lead small">{error||'No encontramos evidencia de una evaluación Consultant aprobada.'}</p><Link className="button primary" to="/consultant/assessment">Volver a la evaluación</Link></div></section>;

  if(result){
    return <section className="section"><div className="container narrow assessment-result"><div className="eyebrow">Caso integrador · Transfer Pricing Practitioner</div><h1>{result.passed?'Caso integrador aprobado':'Caso integrador por reforzar'}</h1><div className="result-score"><strong>{result.score}%</strong><span>{result.correct!==undefined&&result.total!==undefined?`${result.correct} de ${result.total} decisiones correctas`:'resultado registrado en servidor'}</span></div>{result.passed?<><p>La Academy confirmó en servidor que tanto la evaluación acumulativa como el caso integrador están aprobados. La credencial Practitioner ya es elegible para emisión.</p><div className="certificate-name-form"><label htmlFor="practitioner-name">Nombre que aparecerá en el certificado</label><input id="practitioner-name" value={participantName} onChange={e=>setParticipantName(e.target.value)} placeholder="Nombre completo" autoComplete="name" maxLength={120}/><TurnstileWidget onToken={handleTurnstileToken}/>{error&&<p role="alert">{error}</p>}<button className="button primary" type="button" disabled={!participantName.trim()||!turnstileToken||issuing} onClick={()=>void issueCertificate()}>{issuing?'Emitiendo…':'Emitir certificado verificable'}</button></div></>:<><p>El caso exige al menos {CONSULTANT_CASE_PASS_SCORE}%. Revisa la retroalimentación y vuelve a intentarlo.</p>{error&&<p role="alert">{error}</p>}<button className="button primary" type="button" onClick={()=>{setAnswers({});setResult(null);window.scrollTo({top:0,behavior:'smooth'});}}>Intentar de nuevo</button></>}{result.feedback&&<section className="section-block"><h2>Retroalimentación de tus decisiones</h2>{result.feedback.map((item,i)=><article className="concept-callout" key={item.id}><strong>{i+1}. {item.correct?'Correcta':'Revisar'} · {item.domain}</strong><p>{item.explanation}</p></article>)}</section>}</div></section>;
  }

  return <section className="section assessment-page"><div className="container narrow"><div className="eyebrow">Caso integrador · Transfer Pricing Practitioner</div><h1>Manufacturas del Bajío — Decisiones profesionales</h1><p className="lead small">12 decisiones encadenadas sobre el mismo caso. La corrección se realiza en servidor y necesitas {payload.passScore}% para aprobar.</p><div className="concept-callout"><strong>Hechos del caso</strong><p>{payload.facts}</p></div><div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>decisiones respondidas</span></div>{error&&<p role="alert">{error}</p>}<form onSubmit={grade}>{questions.map((q,index)=><fieldset className="assessment-question" key={q.id}><legend><span>{index+1}</span>{q.prompt}</legend>{q.options.map((option,oi)=><label className="assessment-option" key={option}><input type={q.multiple?'checkbox':'radio'} name={q.id} checked={(answers[q.id]??[]).includes(oi)} onChange={()=>toggle(q.id,oi,q.multiple)}/><span>{option}</span></label>)}</fieldset>)}<button className="button primary assessment-submit" type="submit" disabled={answered!==questions.length||submitting}>{submitting?'Calificando…':'Calificar caso integrador'}</button></form></div></section>;
}
