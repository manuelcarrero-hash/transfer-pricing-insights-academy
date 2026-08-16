import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { c1Course, c1Lessons } from '../content/curriculum/v1/c1';
import { j1Course, j1Lessons } from '../content/curriculum/v1/j1';
import { j2Course, j2Lessons } from '../content/curriculum/v1/j2';
import { j3Course, j3Lessons } from '../content/curriculum/v1/j3';
import { j4Course, j4Lessons } from '../content/curriculum/v1/j4';
import { j5Course, j5Lessons } from '../content/curriculum/v1/j5';
import { useProgress } from '../hooks/useProgress';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';

export function MyPathPage() {
  const j1Progress = useProgress();
  const [j2Progress, setJ2Progress] = useState(() => getCourseProgress('J2', j2Lessons.length));
  const [j3Progress, setJ3Progress] = useState(() => getCourseProgress('J3', j3Lessons.length));
  const [j4Progress, setJ4Progress] = useState(() => getCourseProgress('J4', j4Lessons.length));
  const [j5Progress, setJ5Progress] = useState(() => getCourseProgress('J5', j5Lessons.length));
  const [c1Progress, setC1Progress] = useState(() => getCourseProgress('C1', c1Lessons.length));
  useEffect(() => { const sync = () => { setJ2Progress(getCourseProgress('J2', j2Lessons.length)); setJ3Progress(getCourseProgress('J3', j3Lessons.length)); setJ4Progress(getCourseProgress('J4', j4Lessons.length)); setJ5Progress(getCourseProgress('J5', j5Lessons.length)); setC1Progress(getCourseProgress('C1', c1Lessons.length)); }; window.addEventListener(courseProgressEventName, sync); window.addEventListener('storage', sync); return () => { window.removeEventListener(courseProgressEventName, sync); window.removeEventListener('storage', sync); }; }, []);
  const juniorCourses = [
    { code: 'J1', course: j1Course, lessons: j1Lessons, progress: j1Progress, href: '/courses/j1' },
    { code: 'J2', course: j2Course, lessons: j2Lessons, progress: j2Progress, href: '/courses/j2' },
    { code: 'J3', course: j3Course, lessons: j3Lessons, progress: j3Progress, href: '/courses/j3' },
    { code: 'J4', course: j4Course, lessons: j4Lessons, progress: j4Progress, href: '/courses/j4' },
    { code: 'J5', course: j5Course, lessons: j5Lessons, progress: j5Progress, href: '/courses/j5' },
  ];
  const allJuniorComplete = juniorCourses.every(({ lessons, progress }) => progress.completedLessons.length === lessons.length);
  const certificateIssued = typeof window !== 'undefined' && Boolean(window.localStorage.getItem('tp-junior-foundations-certificate'));
  const consultantUnlocked = typeof window !== 'undefined' && window.localStorage.getItem('tp-consultant-level-unlocked') === 'true';
  const c1Completed = c1Progress.completedLessons.length;
  const c1Percent = Math.round((c1Completed / c1Lessons.length) * 100);
  const c1ResumeLesson = c1Progress.lastLesson ?? 1;
  const c1ResumeTitle = c1Lessons[c1ResumeLesson - 1]?.title ?? c1Lessons[0].title;
  return <section className="section my-path-page"><div className="container narrow"><div className="eyebrow">Mi Ruta</div><h1>Tu progreso, claro y sin ruido.</h1><p className="lead small">Puedes estudiar sin cuenta. Mientras uses este dispositivo y navegador, la Academy recuerda dónde te quedaste y qué lecciones has demostrado comprender mediante sus comprobaciones formativas.</p>{juniorCourses.map(({ code, course, lessons, progress, href }) => { const completed = progress.completedLessons.length; const percent = Math.round((completed / lessons.length) * 100); const resumeLesson = progress.lastLesson ?? 1; const resumeTitle = lessons[resumeLesson - 1]?.title ?? lessons[0].title; return <section className="progress-card" aria-labelledby={`${code.toLowerCase()}-progress-title`} key={code}><div className="progress-card-top"><div><span className="progress-kicker">Junior · {code}</span><h2 id={`${code.toLowerCase()}-progress-title`}>{course.title}</h2></div><strong className="progress-percent">{percent}%</strong></div><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Progreso de ${code}: ${percent}%`}><span style={{ width: `${percent}%` }} /></div><p className="progress-summary">{completed} de {lessons.length} lecciones completadas.</p><div className="progress-actions"><Link className="button primary" to={`${href}/lesson/${resumeLesson}`}>{progress.lastLesson ? 'Continuar donde me quedé' : `Comenzar ${code}`}</Link><Link className="button secondary" to={href}>Ver curso</Link></div>{progress.lastLesson && <p className="resume-note">Última lección visitada: <strong>{resumeLesson}. {resumeTitle}</strong></p>}</section>; })}
  <section className={`progress-card junior-foundations-card ${consultantUnlocked ? 'completed-level' : ''}`}><div className="progress-card-top"><div><span className="progress-kicker">Cierre de nivel</span><h2>Transfer Pricing Junior Foundations</h2></div><strong className="progress-percent">{consultantUnlocked ? '✓' : allJuniorComplete ? 'Ready' : '—'}</strong></div><p className="progress-summary">{consultantUnlocked ? 'Nivel Junior aprobado. Consultant desbloqueado.' : allJuniorComplete ? 'J1–J5 completos. Ya puedes presentar la evaluación acumulativa.' : 'Completa J1–J5 para habilitar la evaluación acumulativa.'}</p><div className="progress-actions">{consultantUnlocked ? <><Link className="button secondary" to="/junior-foundations/certificate">{certificateIssued ? 'Ver certificado' : 'Emitir certificado'}</Link><Link className="button primary" to="/courses/c1">Comenzar C1</Link></> : <Link className={`button primary ${!allJuniorComplete ? 'disabled-button' : ''}`} aria-disabled={!allJuniorComplete} to={allJuniorComplete ? '/junior-foundations/assessment' : '/path'}>Presentar evaluación</Link>}</div></section>
  {consultantUnlocked && <section className="progress-card" aria-labelledby="c1-progress-title"><div className="progress-card-top"><div><span className="progress-kicker">Consultant · C1</span><h2 id="c1-progress-title">{c1Course.title}</h2></div><strong className="progress-percent">{c1Percent}%</strong></div><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={c1Percent} aria-label={`Progreso de C1: ${c1Percent}%`}><span style={{ width: `${c1Percent}%` }} /></div><p className="progress-summary">{c1Completed} de {c1Lessons.length} lecciones completadas.</p><div className="progress-actions"><Link className="button primary" to={`/courses/c1/lesson/${c1ResumeLesson}`}>{c1Progress.lastLesson ? 'Continuar donde me quedé' : 'Comenzar C1'}</Link><Link className="button secondary" to="/courses/c1">Ver curso</Link></div>{c1Progress.lastLesson && <p className="resume-note">Última lección visitada: <strong>{c1ResumeLesson}. {c1ResumeTitle}</strong></p>}</section>}
  <aside className="local-progress-note"><strong>Sobre este progreso</strong><p>Por ahora se guarda sólo en este navegador mediante almacenamiento local. No contiene correo ni otra identidad. El nombre sólo se solicita si decides emitir tu certificado.</p></aside></div></section>;
}
