import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CourseProgressCard } from '../components/learning/CourseProgressCard';
import { PathLevelSection } from '../components/learning/PathLevelSection';
import { j1Course,j1Lessons } from '../content/curriculum/v1/j1';import { j2Course,j2Lessons } from '../content/curriculum/v1/j2';import { j3Course,j3Lessons } from '../content/curriculum/v1/j3';import { j4Course,j4Lessons } from '../content/curriculum/v1/j4';import { j5Course,j5Lessons } from '../content/curriculum/v1/j5';
import { c1Course,c1Lessons } from '../content/curriculum/v1/c1';import { c2Course,c2Lessons } from '../content/curriculum/v1/c2';import { c3Course,c3Lessons } from '../content/curriculum/v1/c3';import { c4Course,c4Lessons } from '../content/curriculum/v1/c4';import { c5Course,c5Lessons } from '../content/curriculum/v1/c5';import { c6Course,c6Lessons } from '../content/curriculum/v1/c6';import { c7Course,c7Lessons } from '../content/curriculum/v1/c7';
import { ss1Course,ss1Lessons } from '../content/curriculum/v1/ss1';import { ss2Course,ss2Lessons } from '../content/curriculum/v1/ss2';import { ss3Course,ss3Lessons } from '../content/curriculum/v1/ss3';import { ss4Course,ss4Lessons } from '../content/curriculum/v1/ss4';import { ss5Course,ss5Lessons } from '../content/curriculum/v1/ss5';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';
import { getProgress, progressEventName } from '../services/progress';

const juniorGuideUrl='https://drive.google.com/file/d/1Ql2l3w-6GRXRe2MMH_zKuqqW5qpXMB0N/view';

type MyPathPageProps={showLocalNote?:boolean;semiSeniorExtension?:ReactNode;seniorExtension?:ReactNode};

type ProgressLike={lastLesson:number|null;completedLessons:number[]};
type JourneyCourse={code:string;title:string;lessons:{sequence:number;title:string}[];progress:ProgressLike;href:string};

export function LocalProgressNote(){return <aside className="local-progress-note"><strong>Sobre este progreso</strong><p>Por ahora se guarda sólo en este navegador mediante almacenamiento local. No contiene correo ni otra identidad. El nombre sólo se solicita si decides emitir tu certificado.</p></aside>}

export function MyPathPage({showLocalNote=true,semiSeniorExtension,seniorExtension}:MyPathPageProps){
 const[version,setVersion]=useState(0);
 useEffect(()=>{const sync=()=>setVersion(v=>v+1);window.addEventListener(progressEventName,sync);window.addEventListener(courseProgressEventName,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(progressEventName,sync);window.removeEventListener(courseProgressEventName,sync);window.removeEventListener('storage',sync)}},[]);
 void version;
 const unlocked=(key:string)=>typeof window!=='undefined'&&localStorage.getItem(key)==='true';
 const progress={J1:getProgress(),J2:getCourseProgress('J2',j2Lessons.length),J3:getCourseProgress('J3',j3Lessons.length),J4:getCourseProgress('J4',j4Lessons.length),J5:getCourseProgress('J5',j5Lessons.length),C1:getCourseProgress('C1',c1Lessons.length),C2:getCourseProgress('C2',c2Lessons.length),C3:getCourseProgress('C3',c3Lessons.length),C4:getCourseProgress('C4',c4Lessons.length),C5:getCourseProgress('C5',c5Lessons.length),C6:getCourseProgress('C6',c6Lessons.length),C7:getCourseProgress('C7',c7Lessons.length),SS1:getCourseProgress('SS1',ss1Lessons.length),SS2:getCourseProgress('SS2',ss2Lessons.length),SS3:getCourseProgress('SS3',ss3Lessons.length),SS4:getCourseProgress('SS4',ss4Lessons.length),SS5:getCourseProgress('SS5',ss5Lessons.length)};
 const juniorCourses=[['J1',j1Course,j1Lessons,progress.J1],['J2',j2Course,j2Lessons,progress.J2],['J3',j3Course,j3Lessons,progress.J3],['J4',j4Course,j4Lessons,progress.J4],['J5',j5Course,j5Lessons,progress.J5]] as const;
 const allJuniorComplete=juniorCourses.every(([, ,lessons,p])=>p.completedLessons.length===lessons.length);
 const certificateIssued=Boolean(typeof window!=='undefined'&&localStorage.getItem('tp-junior-foundations-certificate'));
 const consultantUnlocked=unlocked('tp-consultant-level-unlocked');const consultantComplete=unlocked('tp-consultant-foundations-complete');const objectivePassed=unlocked('tp-consultant-cumulative-objective-passed');const practitionerUnlocked=unlocked('tp-practitioner-unlocked');const practitionerCertificate=Boolean(typeof window!=='undefined'&&localStorage.getItem('tp-practitioner-certificate'));
 const seniorUnlocked=unlocked('tp-senior-track-unlocked');

 const consultantCourses=[
  {code:'C1',course:c1Course,lessons:c1Lessons,p:progress.C1,visible:consultantUnlocked},
  {code:'C2',course:c2Course,lessons:c2Lessons,p:progress.C2,visible:unlocked('tp-c2-unlocked')},
  {code:'C3',course:c3Course,lessons:c3Lessons,p:progress.C3,visible:unlocked('tp-c3-unlocked')},
  {code:'C4',course:c4Course,lessons:c4Lessons,p:progress.C4,visible:unlocked('tp-c4-unlocked')},
  {code:'C5',course:c5Course,lessons:c5Lessons,p:progress.C5,visible:unlocked('tp-c5-unlocked')},
  {code:'C6',course:c6Course,lessons:c6Lessons,p:progress.C6,visible:unlocked('tp-c6-unlocked')},
  {code:'C7',course:c7Course,lessons:c7Lessons,p:progress.C7,visible:unlocked('tp-c7-unlocked')},
 ] as const;
 const semiCourses=[
  {code:'SS1',course:ss1Course,lessons:ss1Lessons,p:progress.SS1,visible:practitionerUnlocked},
  {code:'SS2',course:ss2Course,lessons:ss2Lessons,p:progress.SS2,visible:unlocked('tp-ss2-unlocked')},
  {code:'SS3',course:ss3Course,lessons:ss3Lessons,p:progress.SS3,visible:unlocked('tp-ss3-unlocked')},
  {code:'SS4',course:ss4Course,lessons:ss4Lessons,p:progress.SS4,visible:unlocked('tp-ss4-unlocked')},
  {code:'SS5',course:ss5Course,lessons:ss5Lessons,p:progress.SS5,visible:unlocked('tp-ss5-unlocked')},
 ] as const;

 const visibleJourney:JourneyCourse[]=[
  ...juniorCourses.map(([code,course,lessons,p])=>({code,title:course.title,lessons,progress:p,href:`/courses/${code.toLowerCase()}`})),
  ...consultantCourses.filter(c=>c.visible).map(({code,course,lessons,p})=>({code,title:course.title,lessons,progress:p,href:`/courses/${code.toLowerCase()}`})),
  ...semiCourses.filter(c=>c.visible).map(({code,course,lessons,p})=>({code,title:course.title,lessons,progress:p,href:`/courses/${code.toLowerCase()}`})),
 ];
 const completedLessons=visibleJourney.reduce((sum,item)=>sum+item.progress.completedLessons.length,0);
 const availableLessons=visibleJourney.reduce((sum,item)=>sum+item.lessons.length,0);
 const journeyPercent=availableLessons?Math.round((completedLessons/availableLessons)*100):0;
 const summaryComplete=availableLessons>0&&completedLessons===availableLessons;
 const active=summaryComplete?undefined:visibleJourney.find(item=>item.progress.completedLessons.length<item.lessons.length);
 const activeLesson=active?.progress.lastLesson??1;
 const activeHref=active?`${active.href}/lesson/${activeLesson}`:'/courses/j1';
 const currentLevel=seniorUnlocked?'Senior Knowledge':practitionerUnlocked?'Semi Senior':consultantUnlocked?'Consultant':'Junior';

 return <section className="section my-path-page"><div className="container path-container">
  <header className="path-overview">
   <div className="path-overview-copy"><div className="eyebrow">Mi Ruta</div><h1>Tu trayectoria de aprendizaje.</h1><p className="lead small">Ve qué has completado, dónde estás y cuál es el siguiente paso. Tu progreso permanece en este navegador mientras realizas el piloto.</p></div>
   <aside className={`path-summary-card ${summaryComplete?'path-summary-complete':''}`} aria-label="Resumen de progreso">
    <span className="path-summary-label">{summaryComplete?'Estado de la ruta':'Nivel actual'}</span><strong className="path-summary-level">{summaryComplete?'Ruta disponible completada':currentLevel}</strong>
    <div className="path-summary-progress"><span>{journeyPercent}%</span><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={journeyPercent} aria-label="Progreso de la ruta disponible"><span style={{width:`${journeyPercent}%`}}/></div></div>
    <p>{completedLessons} de {availableLessons} lecciones disponibles completadas.</p>
    {summaryComplete?<><Link className="button secondary" to="/resources">Explorar recursos</Link><small>Has completado todas las lecciones actualmente reflejadas en este resumen.</small></>:<><Link className="button primary" to={activeHref}>{active?.progress.lastLesson?'Continuar donde me quedé':'Continuar mi ruta'}</Link>{active&&<small>Siguiente foco: <strong>{active.code} · {active.title}</strong></small>}</>}
   </aside>
  </header>

  <div className="path-journey" aria-label="Niveles de la Academy">
   <PathLevelSection number="01" title="Junior" subtitle="Fundamentos" status={consultantUnlocked?'complete':'current'} summary={consultantUnlocked?'5 cursos completados · nivel acreditado':`${juniorCourses.filter(([, ,lessons,p])=>p.completedLessons.length===lessons.length).length} de 5 cursos completados`} defaultOpen={!consultantUnlocked}>
    <div className="path-course-list">{juniorCourses.map(([code,course,lessons,p])=><CourseProgressCard key={code} level="Junior" code={code} course={course} lessons={lessons} progress={p}/>)}</div>
    <section className={`progress-card level-closure-card ${consultantUnlocked?'completed-level':''}`}><div className="progress-card-top"><div><span className="progress-kicker">Cierre de nivel</span><h2>Transfer Pricing Junior Foundations</h2></div><strong className="progress-percent">{consultantUnlocked?'✓':allJuniorComplete?'Ready':'—'}</strong></div><p className="progress-summary">{consultantUnlocked?'Nivel Junior aprobado. Consultant desbloqueado.':allJuniorComplete?'J1–J5 completos. Ya puedes presentar la evaluación acumulativa.':'Completa J1–J5 para habilitar la evaluación acumulativa.'}</p><div className="progress-actions"><a className="button secondary" href={juniorGuideUrl} target="_blank" rel="noreferrer">Guía integral Junior</a>{consultantUnlocked?<><Link className="button secondary" to="/junior-foundations/certificate">{certificateIssued?'Ver certificado':'Emitir certificado'}</Link><Link className="button primary" to="/courses/c1">Comenzar C1</Link></>:<Link className={`button primary ${!allJuniorComplete?'disabled-button':''}`} aria-disabled={!allJuniorComplete} to={allJuniorComplete?'/junior-foundations/assessment':'/path'}>Presentar evaluación</Link>}</div></section>
   </PathLevelSection>

   <PathLevelSection number="02" title="Consultant" subtitle="Aplicación y metodología" status={!consultantUnlocked?'locked':practitionerUnlocked?'complete':'current'} summary={!consultantUnlocked?'Completa Junior para desbloquear':practitionerUnlocked?'7 cursos completados · nivel acreditado':`${consultantCourses.filter(c=>c.visible&&c.p.completedLessons.length===c.lessons.length).length} de 7 cursos completados`} defaultOpen={consultantUnlocked&&!practitionerUnlocked}>
    <div className="path-course-list">{consultantCourses.filter(c=>c.visible).map(({code,course,lessons,p})=><CourseProgressCard key={code} level="Consultant" code={code} course={course} lessons={lessons} progress={p}/>)}</div>
    {consultantComplete&&<section className={`progress-card level-closure-card ${practitionerUnlocked?'completed-level':''}`}><div className="progress-card-top"><div><span className="progress-kicker">Cierre de nivel</span><h2>Transfer Pricing Practitioner</h2></div><strong className="progress-percent">{practitionerUnlocked?'✓':objectivePassed?'Case':'Ready'}</strong></div><p className="progress-summary">{practitionerUnlocked?'Nivel Practitioner aprobado. Semi Senior desbloqueado.':objectivePassed?'Componente objetivo aprobado. Falta el caso integrador obligatorio.':'C1–C7 completados. Presenta la evaluación acumulativa: ≥80% global y ningún dominio crítico debajo de 60%.'}</p><div className="progress-actions">{practitionerUnlocked?<><Link className="button secondary" to="/practitioner/certificate">{practitionerCertificate?'Ver certificado':'Emitir certificado'}</Link><Link className="button primary" to="/courses/ss1">Comenzar SS1</Link></>:<Link className="button primary" to={objectivePassed?'/consultant/case':'/consultant/assessment'}>{objectivePassed?'Resolver caso integrador':'Presentar evaluación acumulativa'}</Link>}</div></section>}
   </PathLevelSection>

   <PathLevelSection number="03" title="Semi Senior" subtitle="Análisis avanzado" status={!practitionerUnlocked?'locked':seniorUnlocked?'complete':'current'} summary={!practitionerUnlocked?'Completa Consultant para desbloquear':seniorUnlocked?'Nivel acreditado · Senior Knowledge habilitado':`${semiCourses.filter(c=>c.visible&&c.p.completedLessons.length===c.lessons.length).length} cursos base completados`} defaultOpen={practitionerUnlocked&&!seniorUnlocked}>
    <div className="path-course-list">{semiCourses.filter(c=>c.visible).map(({code,course,lessons,p})=><CourseProgressCard key={code} level="Semi Senior" code={code} course={course} lessons={lessons} progress={p}/>)}</div>
    {semiSeniorExtension}
   </PathLevelSection>

   <PathLevelSection number="04" title="Senior Knowledge" subtitle="Criterio y juicio profesional" status={!seniorUnlocked?'locked':'current'} summary={!seniorUnlocked?'Completa Semi Senior para desbloquear':'Track avanzado disponible'} defaultOpen={seniorUnlocked}>
    {seniorExtension}
   </PathLevelSection>
  </div>
  {showLocalNote&&<LocalProgressNote/>}
 </div></section>
}
