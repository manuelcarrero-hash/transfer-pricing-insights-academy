import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { j3Course, j3Lessons } from '../content/curriculum/v1/j3';
import { videoCurriculum } from '../content/media/videoCurriculum';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';

const oecdUrl = 'https://www.oecd.org/es/publications/2022/01/oecd-transfer-pricing-guidelines-for-multinational-enterprises-and-tax-administrations-2022_57104b3a.html';
const bookUrl = 'https://drive.google.com/file/d/1v1looWIL4AKXPPpExQOv5EOc1EOgxR6Q/view?usp=sharing';

export function J3CoursePage() {
  const [progress, setProgress] = useState(() => getCourseProgress('J3', j3Lessons.length));

  useEffect(() => {
    const sync = () => setProgress(getCourseProgress('J3', j3Lessons.length));
    window.addEventListener(courseProgressEventName, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(courseProgressEventName, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const completed = progress.completedLessons.length;
  const percent = Math.round((completed / j3Lessons.length) * 100);
  const resumeLesson = progress.lastLesson ?? 1;
  const chapterVideo = videoCurriculum.find((video) => video.id === 'oecd-chapter-1');

  return (
    <section className="section course-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Inicio</Link><span>/</span><span>Junior</span><span>/</span><span>J3</span></nav>
        <div className="course-hero">
          <div>
            <div className="eyebrow">{j3Course.level} · {j3Course.code}</div>
            <h1>{j3Course.title}</h1>
            <p className="lead small">{j3Course.description}</p>
            <div className="course-meta"><span>{j3Course.lessonCount} lecciones</span><span>≈ {j3Course.estimatedMinutes} min</span><span>Prerrequisitos: J1 y J2</span></div>
            <Link className="button primary" to={`/courses/j3/lesson/${resumeLesson}`}>{progress.lastLesson ? 'Continuar curso' : 'Comenzar curso'}</Link>
          </div>
          <aside className="outcome-card"><h2>Al terminar podrás</h2><ul>{j3Course.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        </div>

        <section className="course-progress-card" aria-label="Progreso de J3">
          <div><strong>Tu avance en J3</strong><span>{completed} de {j3Lessons.length} lecciones completadas</span></div>
          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
        </section>

        <div className="study-materials">
          <div className="eyebrow">Material de estudio</div>
          <h2>Aprende FAR desde los hechos, no desde una plantilla.</h2>
          <p className="materials-intro">J3 profundiza la lógica del Capítulo I de las Directrices y la convierte en una herramienta práctica para entrevistar, analizar y caracterizar.</p>
          <div className="materials-grid">
            <article className="material-card">
              <span className="material-type">Fuente primaria</span>
              <h3>Directrices OCDE 2022 · Capítulo I</h3>
              <p>Consulta las secciones sobre análisis funcional, circunstancias económicamente relevantes y análisis de riesgos.</p>
              <a className="button secondary" href={oecdUrl} target="_blank" rel="noreferrer">Abrir en OCDE</a>
            </article>
            <article className="material-card">
              <span className="material-type">Lectura complementaria</span>
              <h3>Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica</h3>
              <p>Refuerza el análisis funcional con explicaciones y ejemplos prácticos del libro de Manuel Carrero Rojo.</p>
              <a className="button secondary" href={bookUrl} target="_blank" rel="noreferrer">Abrir / descargar libro</a>
            </article>
            <article className="material-card muted-card">
              <span className="material-type">Video relacionado</span>
              <h3>{chapterVideo?.title ?? 'Directrices OCDE 2022 · Capítulo I'}</h3>
              <p>El video del Capítulo I también complementa FAR. Se activará aquí cuando resolvamos su enlace individual de Google Drive.</p>
              <span className="availability-note">Video pendiente de enlace</span>
            </article>
          </div>
        </div>

        <div className="course-index">
          <h2>Contenido del curso</h2>
          <ol>
            {j3Lessons.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.sequence);
              return (
                <li className="lesson-row active" key={lesson.id}>
                  <Link to={`/courses/j3/lesson/${lesson.sequence}`}><span>{done ? '✓' : lesson.sequence}</span><div><strong>{lesson.title}</strong><small>{done ? 'Completada' : `≈ ${lesson.estimatedMinutes} min · Incluye comprobación formativa`}</small></div></Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
