import { Link } from 'react-router-dom';

export function StartPage() {
  return (
    <section className="section start-page">
      <div className="container narrow">
        <div className="eyebrow">Tu punto de partida</div>
        <h1>¿Cómo quieres comenzar?</h1>
        <p className="lead small">No necesitas crear una cuenta para estudiar. Puedes seguir la ruta desde cero, retomar tu avance guardado en este navegador o consultar directamente la biblioteca.</p>
        <div className="choice-list">
          <article className="choice-card featured">
            <div><span className="choice-number">01</span><h2>Soy nuevo en Precios de Transferencia</h2><p>Empieza con los fundamentos, el lenguaje técnico y la lógica económica de la disciplina.</p></div>
            <Link className="button primary" to="/courses/j1">Comenzar en Junior</Link>
          </article>
          <article className="choice-card">
            <div><span className="choice-number">02</span><h2>Quiero continuar donde me quedé</h2><p>Mi Ruta muestra tus cursos habilitados, porcentaje de avance y última lección visitada en este navegador.</p></div>
            <Link className="button secondary" to="/path">Abrir Mi Ruta</Link>
          </article>
          <article className="choice-card">
            <div><span className="choice-number">03</span><h2>Busco un tema o material específico</h2><p>Consulta las Directrices OCDE, el libro, las guías de estudio, datasets y la videoteca sin depender de tu avance curricular.</p></div>
            <Link className="button secondary" to="/resources">Explorar Recursos</Link>
          </article>
        </div>
      </div>
    </section>
  );
}
