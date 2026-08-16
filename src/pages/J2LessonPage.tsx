import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FormativeCheck } from '../components/learning/FormativeCheck';
import { j2Lessons } from '../content/curriculum/v1/j2';
import { j2Assessments } from '../content/curriculum/v1/j2Assessments';
import { markCourseLessonCompleted, markCourseLessonVisited } from '../services/courseProgress';

const lessonBodies = [
  {
    heading: 'El estándar que organiza el análisis',
    paragraphs: [
      'El principio de plena competencia evalúa si las condiciones de una operación entre empresas relacionadas son consistentes con las que habrían acordado empresas independientes en circunstancias comparables.',
      'La palabra clave es condiciones. Transfer Pricing puede analizar precios, márgenes, tasas de interés, regalías, garantías, términos de pago, responsabilidades, riesgos y otras características económicamente relevantes.',
    ],
    example: 'Dos distribuidoras venden el mismo producto. Una sólo recibe y revende; la otra mantiene inventario, financia clientes, desarrolla mercado y asume riesgo de obsolescencia. La actividad parece similar, pero las condiciones económicas no son iguales.',
    chair: 'No preguntes primero si el precio parece alto o bajo. Pregunta qué condiciones habrían importado a partes independientes.',
    remember: 'Plena competencia compara condiciones, no únicamente precios.',
  },
  {
    heading: 'Qué hace comparable a una operación',
    paragraphs: [
      'Las Directrices OCDE agrupan las circunstancias económicamente relevantes en cinco grandes categorías: características de bienes, servicios o derechos; funciones, activos y riesgos; términos contractuales; circunstancias económicas; y estrategias empresariales.',
      'Estos factores no son una lista decorativa. Explican por qué operaciones aparentemente semejantes pueden requerir condiciones distintas.',
    ],
    example: 'Una venta de 1,000 unidades con pago a 30 días no es necesariamente comparable con una venta de 100,000 unidades con pago a 180 días, aun si el producto es idéntico.',
    chair: 'Producto igual no significa automáticamente operación comparable.',
    remember: 'La comparabilidad depende de las características económicamente relevantes.',
  },
  {
    heading: 'El contrato es evidencia, no la conclusión',
    paragraphs: [
      'Los contratos muestran cómo las partes dicen haber estructurado su relación, pero el análisis también debe observar la conducta real.',
      'Si un contrato asigna una responsabilidad o riesgo a una entidad, pero otra toma las decisiones relevantes y absorbe sus consecuencias, existe una inconsistencia que debe investigarse.',
    ],
    example: 'El contrato dice que la distribuidora asume riesgo de inventario, pero la matriz decide niveles, autoriza liquidaciones y absorbe pérdidas por obsolescencia. Repetir la etiqueta contractual no resuelve el análisis.',
    chair: 'Separa siempre tres capas: qué dice el contrato, qué hacen las partes y qué conclusión económica puede sostenerse.',
    remember: 'La conducta real debe contrastarse con la asignación contractual.',
  },
  {
    heading: 'Comprender qué ocurrió realmente',
    paragraphs: [
      'Delimitar una operación significa identificar con precisión qué ocurrió económicamente entre las partes antes de valorarlo.',
      'Debemos entender qué aporta y recibe cada parte, qué funciones realiza, qué activos utiliza, qué riesgos existen y quién los controla, además de revisar contratos, conducta y circunstancias económicas.',
    ],
    example: 'Una factura que dice “servicios administrativos” no delimita la operación. Hay que saber qué servicios se prestaron, quién los realizó, quién recibió el beneficio, qué recursos se utilizaron y bajo qué condiciones.',
    chair: 'Una descripción contable o contractual no sustituye la delimitación económica.',
    remember: 'Primero delimita; después selecciona método y comparables.',
  },
  {
    heading: 'Riesgo no es sólo una palabra contractual',
    paragraphs: [
      'Un riesgo representa incertidumbre que puede afectar los resultados económicos de una operación. Inventario, crédito, mercado, producto, tipo de cambio e investigación y desarrollo son ejemplos frecuentes.',
      'Para comprender quién asume económicamente un riesgo, el análisis presta especial atención al control del riesgo y a la capacidad financiera para soportar sus consecuencias.',
    ],
    example: 'Una entidad puede almacenar físicamente inventario sin controlar el riesgo de inventario si otra decide cuánto mantener, cuándo liquidarlo y quién absorbe la pérdida.',
    chair: 'Pregunta quién toma las decisiones relevantes respecto del riesgo y quién puede soportar económicamente que se materialice.',
    remember: 'Asignación contractual, control y capacidad financiera son preguntas distintas.',
  },
  {
    heading: 'Una secuencia para no saltar a conclusiones',
    paragraphs: [
      'El marco de seis pasos de la OCDE organiza el análisis de riesgos: identificar riesgos significativos, revisar la asignación contractual, analizar la conducta, comparar contrato y realidad, determinar la asignación económica cuando corresponda y valorar la operación correctamente delimitada.',
      'No necesitas memorizar la redacción. Lo importante es comprender la lógica de la secuencia.',
    ],
    example: 'Identificar riesgo → revisar contrato → observar conducta → validar control y capacidad → delimitar → valorar.',
    chair: 'El marco evita que una etiqueta contractual se convierta automáticamente en una conclusión económica.',
    remember: 'La valoración viene después de entender cómo funciona realmente el riesgo.',
  },
  {
    heading: 'Qué alternativas tenía realmente cada parte',
    paragraphs: [
      'Las empresas independientes suelen comparar alternativas antes de aceptar una operación. Las opciones realistamente disponibles ayudan a evaluar si una parte habría aceptado determinadas condiciones teniendo una alternativa claramente mejor y realmente accesible.',
      'La alternativa debe ser realista. Una posibilidad meramente imaginada por el analista no basta.',
    ],
    example: 'Si una empresa puede vender un activo a una relacionada por 100 pero tiene una oferta firme y comparable de un tercero por 150, esa alternativa puede ser económicamente relevante.',
    chair: 'No confundas “puedo imaginar una alternativa” con “la empresa tenía esa alternativa disponible”.',
    remember: 'Las opciones relevantes deben ser económicamente reales y disponibles.',
  },
  {
    heading: 'De los hechos a la metodología',
    paragraphs: [
      'La secuencia correcta es comprender hechos, identificar condiciones relevantes, analizar FAR, revisar contratos y conducta, analizar riesgos y delimitar la operación. Sólo entonces tiene sentido seleccionar metodología y comparables.',
      'El error inverso consiste en escoger un método primero e intentar acomodar después los hechos para justificarlo.',
    ],
    example: 'En el caso Manufacturas del Bajío, almacenar inventario no equivale por sí solo a controlar el riesgo si las decisiones de niveles, obsolescencia y pérdidas permanecen en la manufacturera.',
    chair: 'Un método técnicamente correcto aplicado a una operación mal entendida puede producir una conclusión equivocada.',
    remember: 'Delimitación antes de valoración. Hechos antes que método.',
  },
];

export function J2LessonPage() {
  const { lessonNumber } = useParams();
  const sequence = Number(lessonNumber);
  const lesson = j2Lessons.find((item) => item.sequence === sequence);

  useEffect(() => {
    if (lesson) markCourseLessonVisited('J2', lesson.sequence, j2Lessons.length);
  }, [lesson]);

  if (!lesson || !Number.isInteger(sequence)) return <Navigate to="/courses/j2" replace />;

  const body = lessonBodies[sequence - 1];
  const assessment = j2Assessments.find((item) => item.lesson === sequence);
  const previous = sequence > 1 ? sequence - 1 : null;
  const next = sequence < j2Lessons.length ? sequence + 1 : null;

  const check = assessment ? {
    id: `j2-check-${sequence}`,
    title: `Lección ${sequence} · Comprobación`,
    prompt: assessment.prompt,
    correctOptionId: `option-${assessment.correctIndex}`,
    options: assessment.options.map((label, index) => ({
      id: `option-${index}`,
      label,
      feedback: index === assessment.correctIndex ? assessment.feedback : 'Revisa el razonamiento de la lección y vuelve a intentarlo.',
    })),
  } : null;

  return (
    <>
      <div className="lesson-topbar"><div className="container"><Link to="/courses/j2">← J2 · Principio de Plena Competencia</Link><span>Lección {sequence} de {j2Lessons.length}</span></div></div>
      <article className="lesson-content">
        <div className="eyebrow">Junior · J2</div>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">≈ {lesson.estimatedMinutes} min</p>

        <section className="learning-outcomes"><h2>Al terminar esta lección podrás</h2><ul>{lesson.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>

        <h2>{body.heading}</h2>
        {body.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

        <div className="concept-callout"><strong>Ejemplo</strong><p>{body.example}</p></div>
        <section className="consultant-card"><div className="eyebrow">La Silla del Consultor</div><h2>Criterio profesional</h2><p>{body.chair}</p></section>

        {check && <FormativeCheck check={check} onCorrect={() => markCourseLessonCompleted('J2', sequence, j2Lessons.length)} />}

        <section className="remember-card"><strong>Lo que no debes olvidar</strong><p>{body.remember}</p></section>

        <nav className="lesson-nav" aria-label="Navegación entre lecciones">
          {previous ? <Link className="button secondary" to={`/courses/j2/lesson/${previous}`}>← Lección anterior</Link> : <span />}
          {next ? <Link className="button primary" to={`/courses/j2/lesson/${next}`}>Siguiente lección →</Link> : <Link className="button primary" to="/courses/j2">Volver al curso</Link>}
        </nav>
      </article>
    </>
  );
}
