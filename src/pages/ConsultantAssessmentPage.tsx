import { FormEvent,useCallback,useEffect,useMemo,useState } from 'react';
import { Link,Navigate } from 'react-router-dom';
import { CONSULTANT_DOMAIN_FLOOR,ConsultantDomain,ConsultantQuestion,consultantLabels } from '../content/assessments/consultantCumulative';

const RESULT_KEY='tp-consultant-cumulative-result';
const ELIGIBILITY_KEY='tp-practitioner-eligibility-id';
type AttemptResponse={attemptId:string;expiresAt:string;questions:ConsultantQuestion[]};
type Result={eligibilityId:string;attemptId:string;score:number;passed:boolean;passedGlobal:boolean;passedDomains:boolean;domains:Record<ConsultantDomain,number>;correct:number;total:number;gradedAt:string};

export function ConsultantAssessmentPage(){
  const eligible=typeof window!=='undefined'&&localStorage.getItem('tp-consultant-foundations-complete')==='true';
  const[attemptId,setAttemptId]=useState('');
  const[questions,setQuestions]=useState<ConsultantQuestion[]>([]);
  const[answers,setAnswers]=useState<Record<number,number>>({});
  const[result,setResult]=useState<Result|null>(null);
  const[loading,setLoading]=useState(eligible);
  const[submitting,setSubmitting]=useState(false);
  const[error,setError]=useState('');
  const answered=Object.keys(answers).length;
  const domainCounts=useMemo(()=>Object.fromEntries((Object.keys(consultantLabels) as ConsultantDomain[]).map(d=>[d,questions.filter(q=>q.domain===d).length])) as Record<ConsultantDomain,number>,[questions]);

  const startAttempt=useCallback(async()=>{
    setLoading(true);setError('');setAnswers({});setResult(null);
    try{
      const response=await fetch('/api/practitioner/attempt',{method:'POST',headers:{accept:'application/json'}});
      if(!response.ok)throw new Error('No fue posible iniciar la evaluación.');
      const data=await response.json() as AttemptResponse;
      setAttemptId(data.attemptId);setQuestions(data.questions);
    }catch(cause){setError(cause instanceof Error?cause.message:'No fue posible iniciar la evaluación.');}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{if(eligible)void startAttempt();},[eligible,startAttempt]);
  if(!eligible)return <Navigate to="/path" replace/>;

  async function grade(e:FormEvent){
    e.preventDefault();if(!attemptId||answered!==questions.length||submitting)return;
    setSubmitting(true);setError('');
    try{
      const response=await fetch('/api/practitioner/grade',{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify({attemptId,answers})});
      if(!response.ok)throw new Error('No fue posible calificar la evaluación. Inicia un nuevo intento.');
      const next=await response.json() as Result;
      setResult(next);localStorage.setItem(RESULT_KEY,JSON.stringify(next));
      if(next.passed)localStorage.setItem(ELIGIBILITY_KEY,next.eligibilityId);
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(cause){setError(cause instanceof Error?cause.message:'No fue posible calificar la evaluación.');}
    finally{setSubmitting(false);}
  }

  if(loading)return <section className="section"><div className="container narrow"><h1>Preparando tu intento…</h1><p className="lead small">La selección y las respuestas maestras permanecen protegidas en servidor.</p></div></section>;
  if(result){
    const passed=result.passed;
    return <section className="section"><div className="container narrow assessment-result"><div className="eyebrow">Transfer Pricing Practitioner</div><h1>{passed?'Componente objetivo aprobado':'Necesitas reforzar uno o más dominios'}</h1><div className="result-score"><strong>{result.score}%</strong><span>calificación global</span></div><div className="materials-grid">{(Object.keys(consultantLabels) as ConsultantDomain[]).map(d=><article className="material-card" key={d}><span className="material-type">{d}</span><h3>{consultantLabels[d]}</h3><p><strong>{result.domains[d]}%</strong> · {domainCounts[d]} reactivos</p><small>{result.domains[d]>=CONSULTANT_DOMAIN_FLOOR?'Dominio acreditado':`Repasa ${d}: requiere ≥${CONSULTANT_DOMAIN_FLOOR}%`}</small></article>)}</div>{passed?<><p>La Academy validó este resultado en servidor. Falta completar el caso integrador obligatorio.</p><Link className="button primary" to={`/consultant/case?eligibilityId=${encodeURIComponent(result.eligibilityId)}`}>Resolver caso integrador</Link></>:<><p>La evaluación exige simultáneamente ≥80% global y ≥60% en cada dominio crítico.</p><button className="button primary" type="button" onClick={()=>void startAttempt()}>Intentar de nuevo</button></>}{error&&<p role="alert">{error}</p>}</div></section>;
  }

  if(!questions.length)return <section className="section"><div className="container narrow"><h1>No pudimos iniciar la evaluación</h1><p className="lead small">{error||'Intenta nuevamente.'}</p><button className="button primary" type="button" onClick={()=>void startAttempt()}>Reintentar</button></div></section>;
  return <section className="section assessment-page"><div className="container narrow"><div className="eyebrow">Evaluación acumulativa · Consultant</div><h1>Transfer Pricing Practitioner</h1><p className="lead small">24 reactivos con cobertura estratificada de C1–C7. La selección y calificación se realizan en servidor. Necesitas 80% global y ningún dominio crítico debajo de 60%.</p><div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>respondidas</span></div>{error&&<p role="alert">{error}</p>}<form onSubmit={grade}>{questions.map((q,index)=><fieldset className="assessment-question" key={q.id}><legend><span>{index+1}</span><small>{q.domain} · {consultantLabels[q.domain]}</small>{q.prompt}</legend>{q.options.map((option,oi)=><label className="assessment-option" key={option}><input type="radio" name={`q-${q.id}`} checked={answers[q.id]===oi} onChange={()=>setAnswers(c=>({...c,[q.id]:oi}))}/><span>{option}</span></label>)}</fieldset>)}<button className="button primary assessment-submit" type="submit" disabled={answered!==questions.length||submitting}>{submitting?'Calificando…':'Calificar evaluación'}</button></form></div></section>;
}
