import { Link } from 'react-router-dom';
import { j1Lessons } from '../content/curriculum/v1/j1';

const oecdUrl = 'https://www.oecd.org/es/publications/2022/01/oecd-transfer-pricing-guidelines-for-multinational-enterprises-and-tax-administrations-2022_57104b3a.html';
const bookUrl = 'https://drive.google.com/file/d/1v1looWIL4AKXPPpExQOv5EOc1EOgxR6Q/view?usp=sharing';

const studyQuestions = [
  '¿Qué diferencia existe entre identificar una operación controlada y concluir que cumple plena competencia?',
  '¿Por qué la palabra “precio” no describe por completo lo que analiza Transfer Pricing?',
  '¿Qué hechos necesitas conocer antes de seleccionar un método?',
  '¿Cómo conectan funciones, activos y riesgos con la remuneración de las partes?',
  '¿Por qué dos empresas del mismo sector pueden no ser comparables?',
  '¿Qué hace que una conclusión de Precios de Transferencia sea trazable y defendible?',
];

export function StudyGuidePage() {
  return (
    <section className="section study-guide-page">
      <div className="container narrow">
        <nav className="breadcrumb no-print" aria-label="Breadcrumb"><Link to="/courses/j1">J1</Link><span>/</span><span>Guía de estudio</span></nav>
        <div className="guide-heading">
          <div>
            <div className="eyebrow">J1 · Material de estudio</div>
            <h1>Guía de estudio — Introducción a Precios de Transferencia</h1>
            <p className="lead small">Úsala para repasar el módulo, ordenar tus notas y preparar una segunda lectura de las fuentes. No sustituye las Directrices de la OCDE ni la legislación aplicable.</p>
          </div>
          <button className="button primary no-print" type="button" onClick={() => window.print()}>Imprimir / Guardar como PDF</button>
        </div>

        <section className="guide-section">
          <h2>Cómo estudiar J1</h2>
          <ol className="study-sequence">
            <li><strong>Primera vuelta:</strong> completa las ocho lecciones sin intentar memorizar definiciones.</li>
            <li><strong>Segunda vuelta:</strong> responde nuevamente cada “Ponlo a prueba” y explica en voz alta por qué descartas cada distractor.</li>
            <li><strong>Fuente primaria:</strong> consulta las Directrices OCDE para ubicar los conceptos dentro del marco internacional.</li>
            <li><strong>Repaso:</strong> utiliza las preguntas de esta guía sin mirar las respuestas de las lecciones.</li>
          </ol>
        </section>

        <section className="guide-section">
          <h2>Mapa del módulo</h2>
          <div className="guide-table" role="table" aria-label="Mapa de J1">
            {j1Lessons.map((lesson) => (
              <div className="guide-row" role="row" key={lesson.id}>
                <span className="guide-number" role="cell">{lesson.sequence}</span>
                <div role="cell"><strong>{lesson.title}</strong><small>{lesson.learningOutcomes[0]}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>Seis preguntas que debes poder responder</h2>
          <ol>{studyQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
        </section>

        <section className="guide-section">
          <h2>Glosario mínimo de J1</h2>
          <dl className="mini-glossary">
            <div><dt>Partes relacionadas / empresas asociadas</dt><dd>Entidades cuya relación las coloca dentro del ámbito de análisis correspondiente según el marco aplicable.</dd></div>
            <div><dt>Operación controlada</dt><dd>Operación entre empresas asociadas que se analiza bajo el marco de precios de transferencia.</dd></div>
            <div><dt>Principio de plena competencia</dt><dd>Estándar que contrasta las condiciones de una operación controlada con las que habrían acordado partes independientes en circunstancias comparables.</dd></div>
            <div><dt>FAR</dt><dd>Funciones realizadas, activos utilizados y riesgos asumidos/controlados; estructura básica para comprender el perfil económico de las partes.</dd></div>
            <div><dt>Comparabilidad</dt><dd>Evaluación de semejanzas y diferencias económicamente relevantes entre operaciones o empresas usadas como referencia.</dd></div>
          </dl>
        </section>

        <section className="guide-section source-box">
          <div className="eyebrow">Fuente primaria recomendada</div>
          <h2>Directrices OCDE 2022</h2>
          <p>Para J1 no necesitas leer las 551 páginas completas. Empieza por el glosario y las secciones introductorias del Capítulo I; vuelve después a los capítulos específicos conforme avances en la ruta.</p>
          <a className="button secondary no-print" href={oecdUrl} target="_blank" rel="noreferrer">Abrir edición oficial en español</a>
          <p className="source-note">La página oficial de la OCDE ofrece la descarga en PDF. La Academy enlaza a la fuente oficial en lugar de redistribuir una copia propia.</p>
        </section>

        <section className="guide-section source-box">
          <div className="eyebrow">Lectura complementaria</div>
          <h2>Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica</h2>
          <p><strong>Manuel Carrero Rojo</strong></p>
          <p>Utiliza el libro como lectura complementaria para profundizar los fundamentos doctrinales y conectar los conceptos del módulo con su aplicación práctica.</p>
          <a className="button secondary no-print" href={bookUrl} target="_blank" rel="noreferrer">Abrir libro</a>
          <p className="source-note">El PDF se ofrece desde la copia pública autorizada por el autor en Google Drive.</p>
        </section>
      </div>
    </section>
  );
}
