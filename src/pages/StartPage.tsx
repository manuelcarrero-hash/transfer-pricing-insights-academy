import { Link } from 'react-router-dom';

export function StartPage() {
  return (
    <section className="section start-page">
      <div className="container narrow">
        <div className="eyebrow">Tu punto de partida</div>
        <h1>¿Cómo quieres comenzar?</h1>
        <p className="lead small">No necesitas crear una cuenta para estudiar. Elige la ruta que mejor describe lo que buscas hoy.</p>
        <div className="choice-list">
          <article className="choice-card featured">
            <div><span className="choice-number">01</span><h2>Soy nuevo en Precios de Transferencia</h2><p>Empieza con los fundamentos, el lenguaje técnico y la lógica económica de la disciplina.</p></div>
            <Link className="button primary" to="/courses/j1">Comenzar en Junior</Link>
          </article>
          <article className="choice-card muted">
            <div><span className="choice-number">02</span><h2>Ya tengo experiencia o conocimientos</h2><p>El diagnóstico recomendará un punto de partida sin bloquear el contenido.</p></div>
            <button className="button secondary" disabled type="button">Diagnóstico — próxima fase</button>
          </article>
          <article className="choice-card muted">
            <div><span className="choice-number">03</span><h2>Busco un tema específico</h2><p>La exploración completa del catálogo se habilitará después del vertical slice.</p></div>
            <button className="button secondary" disabled type="button">Explorar — próxima fase</button>
          </article>
        </div>
      </div>
    </section>
  );
}
