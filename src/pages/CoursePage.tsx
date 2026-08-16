import { Link } from 'react-router-dom';
import { j1Course, j1Lessons } from '../content/curriculum/v1/j1';

const oecdUrl = 'https://www.oecd.org/es/publications/2022/01/oecd-transfer-pricing-guidelines-for-multinational-enterprises-and-tax-administrations-2022_57104b3a.html';

export function CoursePage() {
  return (
    <section className="section course-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Inicio</Link><span>/</span><span>Junior</span><span>/</span><span>J1</span></nav>
        <div className="course-hero">
          <div>
            <div className="eyebrow">{j1Course.level} · {j1Course.code}</div>
            <h1>{j1Course.title}</h1>
            <p className="lead small">{j1Course.description}</p>
            <div className="course-meta"><span>{j1Course.lessonCount} lecciones</span><span>≈ {j1Course.estimatedMinutes} min</span><span>Sin prerrequisitos</span></div>
            <Link className="button primary" to="/courses/j1/lesson/1">Comenzar curso</Link>
          </div>
          <aside className="outcome-card"><h2>Al terminar podrás</h2><ul>{j1Course.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        </div>

        <div className="study-materials">
          <div className="eyebrow">Material de estudio</div>
          <h2>Aprende con una ruta, no con una pila de PDFs.</h2>
          <p className="materials-intro">J1 combina las lecciones con una guía de repaso y fuentes para profundizar. La lectura completa de las Directrices no es requisito para comenzar.</p>
          <div className="materials-grid">
            <article className="material-card featured">
              <span className="material-type">Guía del módulo</span>
              <h3>Guía de estudio J1</h3>
              <p>Mapa de las ocho lecciones, preguntas de repaso, glosario mínimo y secuencia sugerida de estudio.</p>
              <Link className="button primary" to="/courses/j1/study-guide">Abrir guía</Link>
            </article>
            <article className="material-card">
              <span className="material-type">Fuente primaria</span>
              <h3>Directrices OCDE 2022</h3>
              <p>Edición oficial en español. La página de la OCDE permite consultar y descargar el PDF.</p>
              <a className="button secondary" href={oecdUrl} target="_blank" rel="noreferrer">Abrir en OCDE</a>
            </article>
            <article className="material-card muted-card">
              <span className="material-type">Lectura complementaria</span>
              <h3>Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica</h3>
              <p>Libro de Manuel Carrero Rojo. La descarga pública se habilitará cuando la copia destinada a la Academy tenga un enlace estable sin permisos privados.</p>
              <span className="availability-note">Descarga en preparación</span>
            </article>
          </div>
        </div>

        <div className="course-index">
          <h2>Contenido del curso</h2>
          <ol>
            {j1Lessons.map((lesson) => (
              <li className="lesson-row active" key={lesson.id}>
                <Link to={`/courses/j1/lesson/${lesson.sequence}`}><span>{lesson.sequence}</span><div><strong>{lesson.title}</strong><small>≈ {lesson.estimatedMinutes} min · Incluye comprobación formativa</small></div></Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
