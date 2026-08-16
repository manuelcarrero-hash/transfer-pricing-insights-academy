import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Formación gratuita en Precios de Transferencia</div>
            <h1>Aprende Precios de Transferencia desde cero.</h1>
            <p className="lead">Una ruta estructurada para desarrollar conocimiento técnico y criterio profesional, con las Directrices de la OCDE como columna vertebral académica.</p>
            <div className="button-row">
              <Link className="button primary" to="/start">Empezar desde cero</Link>
              <button className="button secondary" type="button" disabled title="Disponible en una fase posterior">Hacer diagnóstico</button>
            </div>
            <p className="microcopy">Gratis. Sin tarjeta. Puedes comenzar sin crear una cuenta.</p>
          </div>
          <aside className="hero-panel" aria-label="Ruta académica">
            <div className="route-step current"><span>01</span><div><strong>Junior</strong><small>Fundamentos y lenguaje técnico</small></div></div>
            <div className="route-step"><span>02</span><div><strong>Consultor</strong><small>Aplicación y metodología</small></div></div>
            <div className="route-step"><span>03</span><div><strong>Semi Senior</strong><small>Análisis avanzado</small></div></div>
            <div className="route-step"><span>04</span><div><strong>Senior Knowledge</strong><small>Criterio y juicio profesional</small></div></div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <div className="eyebrow">Cómo funciona</div>
          <h2>Aprender primero. Demostrar después.</h2>
          <p>El contenido académico es abierto. Las cuentas se reservan para funciones que realmente necesitan identidad: guardar progreso, presentar evaluaciones certificables y emitir credenciales verificables.</p>
          <div className="feature-grid">
            <article className="feature-card"><span>01</span><h3>Comprende</h3><p>Conceptos explicados desde cero y conectados con hechos económicos reales.</p></article>
            <article className="feature-card"><span>02</span><h3>Aplica</h3><p>Ejemplos y ejercicios para desarrollar disciplina de análisis, no sólo memoria.</p></article>
            <article className="feature-card"><span>03</span><h3>Demuestra</h3><p>Las credenciales acreditan conocimiento evaluado; nunca experiencia profesional o rango laboral.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
