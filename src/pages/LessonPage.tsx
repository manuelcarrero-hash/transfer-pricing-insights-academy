import { Link } from 'react-router-dom';
import { FormativeCheck } from '../components/learning/FormativeCheck';
import { j1Lesson1 } from '../content/curriculum/v1/j1';

export function LessonPage() {
  return (
    <section className="lesson-page">
      <div className="lesson-topbar">
        <div className="container"><Link to="/courses/j1">← J1 · Introducción a Precios de Transferencia</Link><span>Lección 1 de 8</span></div>
      </div>
      <article className="lesson-content">
        <div className="eyebrow">Lección 1</div>
        <h1>{j1Lesson1.title}</h1>
        <p className="lesson-meta">≈ {j1Lesson1.estimatedMinutes} min · Curriculum v1</p>

        <section className="learning-outcomes">
          <h2>Qué vas a aprender</h2>
          <ul>{j1Lesson1.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <h2>El punto de partida</h2>
        <p>Una empresa puede pertenecer a un grupo junto con muchas otras entidades. Aunque todas formen parte del mismo grupo económico, jurídicamente pueden ser compañías distintas: una fabrica, otra distribuye, otra presta servicios, otra posee una marca y otra financia operaciones.</p>
        <p>Cuando esas entidades realizan operaciones entre sí, aparecen los <strong>Precios de Transferencia</strong>.</p>
        <p>En términos sencillos, los Precios de Transferencia estudian las condiciones bajo las cuales se realizan operaciones entre empresas relacionadas y evalúan si esas condiciones son consistentes con el principio de plena competencia.</p>

        <div className="concept-callout">
          <span className="eyebrow">Concepto clave</span>
          <p><strong>No reduzcas Transfer Pricing a la palabra “precio”.</strong> Una operación puede analizarse mediante un precio unitario, pero también a través de una tasa de interés, una regalía, un margen, una comisión, un mark-up, una garantía u otra condición económicamente relevante.</p>
        </div>

        <h2>Un ejemplo sencillo</h2>
        <p>Manufacturas del Bajío fabrica componentes industriales y vende una parte de su producción a una distribuidora perteneciente al mismo grupo. Esa venta es una operación entre empresas relacionadas y puede ser objeto de análisis de Precios de Transferencia.</p>
        <p>La existencia de la relación no significa que la operación sea incorrecta, evasiva o abusiva. Significa que sus condiciones deben analizarse con una metodología que permita contrastarlas con aquellas que habrían acordado partes independientes en circunstancias comparables.</p>

        <div className="consultant-card">
          <span className="eyebrow">La Silla del Consultor</span>
          <h2>Empieza con hechos, no con sospechas.</h2>
          <p>La primera disciplina profesional consiste en identificar quiénes son las partes, qué operación ocurrió y qué información falta antes de formular una conclusión.</p>
        </div>

        <FormativeCheck />

        <section className="remember-card">
          <div className="eyebrow">Lo que no debemos olvidar</div>
          <p>Transfer Pricing no estudia únicamente precios. Estudia las condiciones económicas de operaciones entre partes relacionadas.</p>
        </section>

        <div className="lesson-nav"><Link className="button secondary" to="/courses/j1">Volver al curso</Link><button className="button primary" disabled type="button">Siguiente lección — próxima fase</button></div>
      </article>
    </section>
  );
}
