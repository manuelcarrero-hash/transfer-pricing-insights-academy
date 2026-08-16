import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FormativeCheck } from '../components/learning/FormativeCheck';
import { j4Lessons } from '../content/curriculum/v1/j4';
import { j4Assessments } from '../content/curriculum/v1/j4Assessments';
import { markCourseLessonCompleted, markCourseLessonVisited } from '../services/courseProgress';

const lessonBodies = [
  {
    heading: 'Un método responde una pregunta económica',
    paragraphs: [
      'En Transfer Pricing no basta afirmar que una operación parece de mercado. Necesitamos una metodología que permita contrastar sus condiciones con información relevante de operaciones independientes o con resultados económicos comparables.',
      'La elección del método depende de la naturaleza de la operación, del análisis funcional, de la información disponible y de la confiabilidad de la comparación. Ningún método debe seleccionarse únicamente porque fue usado antes.',
    ],
    example: 'Una venta puede analizarse preguntando por un precio comparable; una distribución, por un margen bruto; un servicio, por un mark-up; una entidad rutinaria, por un margen neto; y una operación altamente integrada, por cómo dividir una utilidad combinada.',
    chair: 'Empieza por la pregunta económica de la operación, no por el método que ya conoces.',
    remember: 'El método es una herramienta para responder una pregunta concreta de plena competencia.',
  },
  {
    heading: 'CUP compara directamente precios o condiciones',
    paragraphs: [
      'El Comparable Uncontrolled Price Method compara el precio o condición de una operación controlada con el observado en una operación entre independientes suficientemente comparable.',
      'Puede existir un CUP interno cuando una de las partes también opera con un tercero independiente, o un CUP externo cuando la referencia proviene de operaciones entre terceros. En ambos casos la comparabilidad es crítica.',
    ],
    example: 'Una empresa vende el mismo grado de commodity a una relacionada y a un tercero independiente durante el mismo periodo, con volumen, geografía y términos muy similares. Esa operación independiente puede ser una referencia muy directa.',
    chair: 'Mismo nombre de producto no significa CUP confiable. Revisa volumen, geografía, fecha, términos, nivel de mercado y demás condiciones relevantes.',
    remember: 'CUP puede ser muy directo, pero exige comparabilidad suficientemente alta.',
  },
  {
    heading: 'RPM observa el margen bruto de distribución',
    paragraphs: [
      'El Resale Price Method parte del precio al que un producto adquirido de una relacionada se revende a un independiente y resta un margen bruto apropiado para la actividad de distribución.',
      'Puede ser conceptualmente natural cuando el distribuidor revende sin transformación sustancial y existen referencias confiables de margen bruto. Diferencias funcionales y de clasificación contable pueden reducir su confiabilidad.',
    ],
    example: 'Una distribuidora compra producto terminado, lo revende sin modificarlo y no posee intangibles relevantes. Si existen distribuidores independientes comparables con márgenes brutos confiables, RPM puede ser una alternativa natural.',
    chair: 'No confundas margen bruto de reventa con margen operativo neto: responden preguntas distintas.',
    remember: 'RPM se concentra en el margen bruto asociado a funciones de distribución comparables.',
  },
  {
    heading: 'Cost Plus conecta funciones con una base de costos',
    paragraphs: [
      'Cost Plus parte de los costos relevantes incurridos por el proveedor de bienes o servicios y añade un mark-up apropiado de plena competencia.',
      'Su lógica puede ser intuitiva para ciertos servicios o manufactura rutinaria, pero la definición de la base de costos es crítica. Diferencias contables o costos que no guardan relación con la creación de valor pueden distorsionar la comparación.',
    ],
    example: 'Una entidad presta soporte administrativo rutinario, tiene sus costos claramente identificados y existen mark-ups comparables confiables de prestadores independientes.',
    chair: '“Costos + porcentaje” no es un análisis. Primero confirma qué costos pertenecen a la actividad y qué mark-up es comparable.',
    remember: 'Cost Plus depende tanto de una base de costos confiable como de un mark-up comparable.',
  },
  {
    heading: 'TNMM analiza rentabilidad neta relativa a una base',
    paragraphs: [
      'El Transactional Net Margin Method analiza un indicador de rentabilidad neta en relación con una base apropiada, por ejemplo ventas, costos o activos cuando corresponda.',
      'En la práctica puede existir mayor disponibilidad de datos netos que de precios o márgenes brutos perfectamente comparables. Pero esa disponibilidad no convierte TNMM en una respuesta automática ni elimina la necesidad de un FAR sólido.',
    ],
    example: 'Una distribuidora relativamente rutinaria no tiene CUP confiables ni información homogénea de margen bruto, pero existen empresas independientes funcionalmente comparables con información de margen operativo.',
    chair: 'En J4 entiende la pregunta que responde TNMM. Tested Party, PLI y segmentación requieren un nivel posterior de análisis.',
    remember: 'TNMM compara rentabilidad neta, pero su confiabilidad sigue dependiendo de funciones, riesgos y comparabilidad.',
  },
  {
    heading: 'Profit Split mira contribuciones dentro de una utilidad combinada',
    paragraphs: [
      'El Transactional Profit Split Method identifica la utilidad relevante de una operación, analiza las contribuciones de las partes y la divide utilizando criterios económicamente justificables.',
      'Puede cobrar relevancia cuando varias partes realizan contribuciones únicas y valiosas, aportan intangibles importantes o desarrollan actividades altamente integradas que no pueden analizarse confiablemente de forma separada.',
    ],
    example: 'Dos entidades desarrollan conjuntamente tecnología, ambas tienen equipos especializados de I+D y realizan contribuciones únicas y valiosas. Un método unilateral puede no capturar adecuadamente la economía conjunta.',
    chair: 'Profit Split no significa repartir 50/50. Los factores de reparto deben reflejar contribuciones económicas.',
    remember: 'La utilidad combinada se divide conforme a contribuciones, no por simetría matemática.',
  },
  {
    heading: 'La clasificación ayuda, pero no decide por ti',
    paragraphs: [
      'CUP, RPM y Cost Plus se consideran métodos tradicionales basados en operaciones. TNMM y Profit Split se agrupan entre los métodos basados en resultados de operaciones.',
      'La clasificación permite recordar qué compara cada enfoque: precio, margen bruto, mark-up, margen neto o utilidad combinada. No debe convertirse en una jerarquía automática ni en una regla de preferencia sin analizar los hechos.',
    ],
    example: 'Que TNMM sea frecuente en la práctica no significa que deba usarse si existe un CUP interno altamente confiable para la operación analizada.',
    chair: 'Frecuencia de uso no equivale a mayor confiabilidad.',
    remember: 'La confiabilidad relativa de la comparación importa más que la costumbre.',
  },
  {
    heading: 'La selección empieza con preguntas, no con etiquetas',
    paragraphs: [
      'Un Junior debe comenzar preguntando qué operación analiza, cuál es su naturaleza económica, qué FAR presenta cada parte y qué tipo de información independiente está disponible de forma confiable.',
      'Como mapa didáctico: una operación altamente comparable puede sugerir CUP; distribución rutinaria con margen bruto confiable, RPM; servicios o manufactura rutinaria con costos claros, Cost Plus; una parte menos compleja con comparables de rentabilidad, TNMM; y contribuciones únicas de múltiples partes, Profit Split.',
    ],
    example: 'Un archivo histórico usa TNMM. Antes de copiarlo, el consultor confirma si la operación, FAR, datos disponibles y condiciones relevantes siguen justificando esa selección.',
    chair: 'Empieza por la operación, no por el método que usaste el año pasado.',
    remember: 'El árbol mental es una guía de aprendizaje, no una regla mecánica de selección.',
  },
];

export function J4LessonPage() {
  const { lessonNumber } = useParams();
  const sequence = Number(lessonNumber);
  const lesson = j4Lessons.find((item) => item.sequence === sequence);

  useEffect(() => {
    if (lesson) markCourseLessonVisited('J4', lesson.sequence, j4Lessons.length);
  }, [lesson]);

  if (!lesson || !Number.isInteger(sequence)) return <Navigate to="/courses/j4" replace />;

  const body = lessonBodies[sequence - 1];
  const assessment = j4Assessments.find((item) => item.lesson === sequence);
  const previous = sequence > 1 ? sequence - 1 : null;
  const next = sequence < j4Lessons.length ? sequence + 1 : null;
  const check = assessment ? {
    id: `j4-check-${sequence}`,
    title: `Lección ${sequence} · Comprobación`,
    prompt: assessment.prompt,
    correctOptionId: `option-${assessment.correctIndex}`,
    options: assessment.options.map((label, index) => ({ id: `option-${index}`, label, feedback: index === assessment.correctIndex ? assessment.feedback : 'Revisa el razonamiento de la lección y vuelve a intentarlo.' })),
  } : null;

  return (
    <>
      <div className="lesson-topbar"><div className="container"><Link to="/courses/j4">← J4 · Métodos de Precios de Transferencia</Link><span>Lección {sequence} de {j4Lessons.length}</span></div></div>
      <article className="lesson-content">
        <div className="eyebrow">Junior · J4</div>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">≈ {lesson.estimatedMinutes} min</p>
        <section className="learning-outcomes"><h2>Al terminar esta lección podrás</h2><ul>{lesson.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <h2>{body.heading}</h2>
        {body.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="concept-callout"><strong>Ejemplo</strong><p>{body.example}</p></div>
        <section className="consultant-card"><div className="eyebrow">La Silla del Consultor</div><h2>Criterio profesional</h2><p>{body.chair}</p></section>
        {check && <FormativeCheck check={check} onCorrect={() => markCourseLessonCompleted('J4', sequence, j4Lessons.length)} />}
        <section className="remember-card"><strong>Lo que no debes olvidar</strong><p>{body.remember}</p></section>
        <nav className="lesson-nav" aria-label="Navegación entre lecciones">
          {previous ? <Link className="button secondary" to={`/courses/j4/lesson/${previous}`}>← Lección anterior</Link> : <span />}
          {next ? <Link className="button primary" to={`/courses/j4/lesson/${next}`}>Siguiente lección →</Link> : <Link className="button primary" to="/courses/j4">Volver al curso</Link>}
        </nav>
      </article>
    </>
  );
}
