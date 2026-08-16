import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { C1_ATTEMPT_SIZE, C1_PASS_SCORE, C1Question, c1FinalBank } from '../content/assessments/c1Final';
import { c1Lessons } from '../content/curriculum/v1/c1';
import { getCourseProgress } from '../services/courseProgress';

const RESULT_KEY='tp-c1-final-result';
const C2_UNLOCK_KEY='tp-c2-unlocked';
function shuffle<T>(items:T[]){const result=[...items];for(let i=result.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function makeAttempt(){return shuffle(c1FinalBank).slice(0,C1_ATTEMPT_SIZE);}
export function C1AssessmentPage(){
 const eligible=getCourseProgress('C1',c1Lessons.length).completedLessons.length===c1Lessons.length;
 const [questions,setQuestions]=useState<C1Question[]>(()=>makeAttempt());
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [result,setResult]=useState<{score:number;correct:number;passed:boolean}|null>(null);
 const answered=Object.keys(answers).length;
 function grade(event:FormEvent){event.preventDefault();if(answered!==questions.length)return;const correct=questions.filter(q=>answers[q.id]===q.correctIndex).length;const score=Math.round(correct/questions.length*100);const passed=score>=C1_PASS_SCORE;setResult({score,correct,passed});localStorage.setItem(RESULT_KEY,JSON.stringify({score,correct,passed,completedAt:new Date().toISOString()}));if(passed)localStorage.setItem(C2_UNLOCK_KEY,'true');window.scrollTo({top:0,behavior:'smooth'});}
 function retry(){setQuestions(makeAttempt());setAnswers({});setResult(null);window.scrollTo({top:0,behavior:'smooth'});}
 if(!eligible)return <section className="section"><div className="container narrow"><div className="eyebrow">Evaluación final · C1</div><h1>Completa primero las 8 lecciones</h1><p className="lead small">La evaluación final se habilita cuando hayas completado todas las comprobaciones formativas de C1.</p><Link className="button primary" to="/courses/c1">Volver a C1</Link></div></section>;
 if(result)return <section className="section"><div className="container narrow assessment-result"><div className="eyebrow">Consultant · C1</div><h1>{result.passed?'C1 aprobado':'Aún no alcanzas el dominio requerido'}</h1><div className="result-score"><strong>{result.score}%</strong><span>{result.correct} de {questions.length} respuestas correctas</span></div>{result.passed?<><p>Superaste el 80% requerido. Has completado Delimitación Precisa de Operaciones y queda habilitada tu progresión hacia C2.</p><div className="button-row"><Link className="button primary" to="/path">Continuar mi ruta</Link><Link className="button secondary" to="/courses/c1">Revisar C1</Link></div></>:<><p>Revisa especialmente contrato vs. conducta, características económicamente relevantes, control del riesgo y redacción de la operación delimitada. Los intentos son ilimitados.</p><button className="button primary" type="button" onClick={retry}>Intentar de nuevo</button></>}</div></section>;
 return <section className="section assessment-page"><div className="container narrow"><div className="eyebrow">Cierre de C1</div><h1>Evaluación Final — Delimitación Precisa de Operaciones</h1><p className="lead small">15 reactivos aleatorios del banco de 30. Necesitas 80% para aprobar. Los intentos son ilimitados.</p><div className="assessment-progress"><strong>{answered} / {questions.length}</strong><span>respondidas</span></div><form onSubmit={grade}>{questions.map((question,index)=><fieldset className="assessment-question" key={question.id}><legend><span>{index+1}</span>{question.prompt}</legend>{question.options.map((option,optionIndex)=><label className="assessment-option" key={option}><input type="radio" name={`question-${question.id}`} checked={answers[question.id]===optionIndex} onChange={()=>setAnswers(current=>({...current,[question.id]:optionIndex}))}/><span>{option}</span></label>)}</fieldset>)}<button className="button primary assessment-submit" type="submit" disabled={answered!==questions.length}>Calificar evaluación</button></form></div></section>;
}
