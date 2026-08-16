import { Link } from 'react-router-dom';
import { j1Course } from '../content/curriculum/v1/j1';

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
            <Link className="button primary" to="/courses/j1/lesson-1">Comenzar curso</Link>
          </div>
          <aside className="outcome-card">
            <h2>Al terminar podrás</h2>
            <ul>{j1Course.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
        </div>
        <div className="course-index">
          <h2>Contenido del curso</h2>
          <ol>
            <li className="lesson-row active"><Link to="/courses/j1/lesson-1"><span>1</span><div><strong>¿Qué son los Precios de Transferencia?</strong><small>Disponible ahora</small></div></Link></li>
            {['¿Por qué existen los Precios de Transferencia?','Empresas relacionadas y operaciones controladas','El problema económico detrás de una operación','El principio de plena competencia','El ciclo general de un análisis','El papel del consultor','OCDE vs. legislación local'].map((title, index) => (
              <li className="lesson-row locked" key={title}><div><span>{index + 2}</span><div><strong>{title}</strong><small>Se integrará después de validar la lección patrón</small></div></div></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
