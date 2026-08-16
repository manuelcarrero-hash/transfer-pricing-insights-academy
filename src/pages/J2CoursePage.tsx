import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { j2Course, j2Lessons } from '../content/curriculum/v1/j2';
import { videoCurriculum } from '../content/media/videoCurriculum';
import { courseProgressEventName, getCourseProgress } from '../services/courseProgress';

const oecdUrl = 'https://www.oecd.org/es/publications/2022/01/oecd-transfer-pricing-guidelines-for-multinational-enterprises-and-tax-administrations-2022_57104b3a.html';
const bookUrl = 'https://drive.google.com/file/d/1v1looWIL4AKXPPpExQOv5EOc1EOgxR6Q/view?usp=sharing';

export function J2CoursePage() {
  const [progress, setProgress] = useState(() => getCourseProgress('J2', j2Lessons.length));

  useEffect(() => {
    const sync = () => setProgress(getCourseProgress('J2', j2Lessons.length));
    window.addEventListener(courseProgressEventName, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(courseProgressEventName, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const completed = progress.completedLessons.length;
  const percent = Math.round((completed / j2Lessons.length) * 100);
  const resumeLesson = progress.lastLesson ?? 1;
  const chapterVideo = videoCurriculum.find((video) => video.id === 'oecd-chapter-1');

  return (
    <section className="section course-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Inicio</Link><span>/</span><span>Junior</span><span>/</span><span>J2</span></nav>
        <div className="course-hero">
          <div>
            <div className="eyebrow">{j2Course.level} · {j2Course.code}</div>
            <h1>{j2Course.title}</h1>
            <p className="lead small">{j2Course.description}</p>
            <div className="course-meta"><span>{j2Course.lessonCount} lecciones</span><span>≈ {j2Course.estimatedMinutes} min</span><span>Prerrequisito recomendado: J1</span></div>
            <Link className="button primary" to={`/courses/j2/lesson/${resumeLesson}`}>{progress.lastLesson ? 'Continuar curso' : 'Comenzar curso'}</Link>
          </div>
          <aside className="outcome-card"><h2>Al terminar podrás</h2><ul>{j2Course.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        </div>

        <section className="course-progress-card" aria-label="Progreso de J2">
          <div><strong>Tu avance en J2</strong><span>{completed} de {j2Lessons.length} lecciones completadas</span></div>
          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
        </section>

        <div className="study-materials">
          <div className="eyebrow">Material de estudio</div>
          <h2>Profundiza el principio antes de aplicar metodología.</h2>
          <p className="materials-intro">J2 conecta el contenido de la Academy con la fuente primaria, una explicación práctica y el video doctrinal del Capítulo I.</p>
          <div className="materials-grid">
            <article className="material-card">
              <span className="material-type">Fuente primaria</span>
              <h3>Directrices OCDE 2022 · Capítulo I</h3>
              <p>Consulta el marco internacional sobre plena competencia, delimitación precisa y análisis de riesgos.</p>
              <a className="button secondary" href={oecdUrl} target="_blank" rel="noreferrer">Abrir en OCDE</a>
            </article>
            <article className="material-card">
              <span className="material-type">Lectura complementaria</span>
              <h3>Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica</h3>
              <p>Usa el Capítulo I del libro de Manuel Carrero Rojo como explicación accesible, con ejemplos y lenguaje práctico.</p>
              <a className="button secondary" href={bookUrl} target="_blank" rel="noreferrer">Abrir / descargar libro</a>
            </article>
            <article className="material-card muted-card">
              <span className="material-type">Video doctrinal</span>
              <h3>{chapterVideo?.title ?? 'Directrices OCDE 2022 · Capítulo I'}</h3>
              <p>El espacio curricular ya está reservado. El enlace se activará cuando podamos resolver el archivo individual de Google Drive.</p>
              <span className="availability-note">Video pendiente de enlace</span>
            </article>
          </div>
        </div>

        <div className="course-index">
          <h2>Contenido del curso</h2>
          <ol>
            {j2Lessons.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.sequence);
              return (
                <li className="lesson-row active" key={lesson.id}>
                  <Link to={`/courses/j2/lesson/${lesson.sequence}`}><span>{done ? '✓' : lesson.sequence}</span><div><strong>{lesson.title}</strong><small>{done ? 'Completada' : `≈ ${lesson.estimatedMinutes} min · Incluye comprobación formativa`}</small></div></Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="study-materials">
          <div className="eyebrow">Siguiente curso</div>
          <h2>J3 · Análisis Funcional: FAR</h2>
          <p className="materials-intro">Convierte la lógica de J2 en una herramienta práctica para identificar funciones, activos, riesgos y construir una caracterización funcional.</p>
          <Link className="button primary" to="/courses/j3">Ir a J3 →</Link>
        </div>
      </div>
    </section>
  );
}
