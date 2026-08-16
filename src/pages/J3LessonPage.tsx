import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FormativeCheck } from '../components/learning/FormativeCheck';
import { j3Lessons } from '../content/curriculum/v1/j3';
import { j3Assessments } from '../content/curriculum/v1/j3Assessments';
import { markCourseLessonCompleted, markCourseLessonVisited } from '../services/courseProgress';

const lessonBodies = [
  {
    heading: 'FAR explica la realidad económica',
    paragraphs: [
      'El análisis funcional identifica qué hace realmente cada parte, qué recursos utiliza y qué riesgos económicamente relevantes enfrenta o controla. Su propósito es comprender cómo se distribuyen las contribuciones económicas dentro de la operación.',
      'FAR significa Functions, Assets and Risks. Es relacional: describir a una sola entidad sin entender a la contraparte puede ocultar quién decide, aporta recursos o controla riesgos relevantes.',
    ],
    example: 'Un fabricante puede operar maquinaria y personal, mientras otra entidad decide qué productos desarrollar, controla estrategia de mercado y asume riesgos comerciales. Analizar sólo al fabricante deja incompleta la operación.',
    chair: 'No conviertas FAR en tres columnas. Úsalo para explicar quién aporta qué y por qué importa económicamente.',
    remember: 'Un FAR conecta funciones, activos y riesgos entre las partes de una operación.',
  },
  {
    heading: 'La profundidad importa más que la etiqueta',
    paragraphs: [
      'Una función es una actividad realizada dentro de la cadena de valor o de una operación. Producción, compras, logística, ventas, marketing, investigación y desarrollo, cobranza y planeación son ejemplos frecuentes.',
      'La pregunta útil no es sólo si una entidad realiza una función, sino qué decisiones toma, qué recursos compromete y qué consecuencias económicas enfrenta.',
    ],
    example: 'Dos entidades realizan marketing. Una adapta materiales y ejecuta campañas aprobadas; otra diseña estrategia, define presupuesto, selecciona canales y puede cancelar campañas. La etiqueta es la misma, la profundidad funcional no.',
    chair: 'Pregunta quién decide, quién aprueba, quién paga y quién puede modificar el curso de acción.',
    remember: 'Funciones con el mismo nombre pueden tener importancia económica muy distinta.',
  },
  {
    heading: 'Los recursos deben conectarse con la operación',
    paragraphs: [
      'En FAR pueden ser relevantes activos tangibles, intangibles y otros recursos económicamente significativos como personal especializado, sistemas, capacidad financiera o redes comerciales.',
      'No todo activo contable es relevante para toda operación y no todo recurso importante aparece necesariamente en el balance. Uso, decisiones y relación con la operación importan tanto como la propiedad.',
    ],
    example: 'Una empresa de ingeniería puede tener pocos activos físicos, pero su personal altamente especializado puede ser central para comprender su contribución económica.',
    chair: 'No empieces por el balance. Empieza por la operación y pregunta qué recursos permiten realizar las funciones relevantes.',
    remember: 'La relevancia de un activo depende de cómo contribuye a la operación analizada.',
  },
  {
    heading: 'Exposición no equivale a control del riesgo',
    paragraphs: [
      'Los riesgos son incertidumbres que pueden generar resultados distintos a los esperados: mercado, inventario, crédito, producto, tipo de cambio, capacidad instalada o investigación y desarrollo, entre otros.',
      'Que una entidad pueda sufrir una pérdida o aparezca como responsable en un contrato no basta para concluir que asume económicamente el riesgo. Deben analizarse decisiones relevantes y capacidad financiera.',
    ],
    example: 'Una distribuidora figura como responsable del inventario, pero la matriz decide cuánto comprar, cuándo liquidar y absorbe las pérdidas por obsolescencia. Contrato y conducta requieren contraste.',
    chair: 'Sigue las decisiones: quién acepta, gestiona o mitiga el riesgo y quién soporta sus consecuencias económicas.',
    remember: 'Riesgo contractual, exposición y control económico no son sinónimos.',
  },
  {
    heading: 'Las empresas deciden mediante personas',
    paragraphs: [
      'Para comprender funciones y riesgos es necesario identificar dónde están las personas que realmente toman decisiones relevantes. Organigramas y contratos ayudan, pero no sustituyen la evidencia de conducta.',
      'Preguntas útiles incluyen quién cuenta con información para decidir, quién puede aprobar o rechazar alternativas, quién supervisa resultados y quién puede cambiar el curso de acción.',
    ],
    example: 'Una filial aparece como responsable del riesgo de crédito, pero un comité de otra entidad fija todos los límites y aprueba excepciones. Existe una señal de que la asignación contractual y el control real pueden diferir.',
    chair: 'Cuando la etiqueta y las decisiones apuntan a lugares distintos, no cierres el análisis: abre más preguntas.',
    remember: 'La localización de la capacidad real de decisión es evidencia importante para FAR.',
  },
  {
    heading: 'No todos los fabricantes son iguales',
    paragraphs: [
      'Un fabricante relativamente rutinario puede recibir especificaciones y pronósticos, operar maquinaria, realizar compras operativas y control de calidad estándar sin desarrollar tecnología propia ni decidir estrategia de mercado.',
      'Otro fabricante puede diseñar procesos, desarrollar tecnología, decidir inversiones, gestionar proveedores críticos y soportar riesgos importantes de desarrollo o capacidad. La caracterización debe reflejar esa diferencia.',
    ],
    example: 'Manufactura Alfa ejecuta producción bajo parámetros definidos. Manufactura Beta desarrolla tecnología y decide capacidad productiva. El nombre “fabricante” no justifica tratarlas como funcionalmente equivalentes.',
    chair: 'No caracterices por el nombre legal. Caracteriza por funciones, activos, riesgos y decisiones.',
    remember: 'La manufactura puede abarcar perfiles funcionales muy distintos.',
  },
  {
    heading: 'Distribución y servicios también exigen hechos',
    paragraphs: [
      'Un distribuidor relativamente rutinario puede ejecutar ventas locales, mantener inventario limitado y seguir parámetros comerciales definidos sin desarrollar intangibles únicos ni determinar estrategia global.',
      'Un prestador de servicios rutinario puede procesar actividades estandarizadas siguiendo procedimientos establecidos, utilizando personal y sistemas operativos sin asumir decisiones estratégicas del grupo.',
    ],
    example: 'Servicios Omega procesa conciliaciones y reportes estandarizados, pero no diseña sistemas ni decide política financiera. Su FAR es distinto al de una entidad que diseña y controla la función financiera global.',
    chair: '“Rutinario” es relativo a la complejidad de las contribuciones, no un juicio sobre la importancia del trabajo.',
    remember: 'Distribuidores y prestadores de servicios deben caracterizarse desde sus hechos, no desde una plantilla.',
  },
  {
    heading: 'FAR culmina en una caracterización defendible',
    paragraphs: [
      'La secuencia correcta es hechos → funciones → activos → riesgos → relación entre las partes → caracterización preliminar. La caracterización resume la posición funcional de una entidad dentro de la operación.',
      'Esa caracterización influirá posteriormente en la selección del método, tested party cuando corresponda, comparables e interpretación de resultados. Pero no debe utilizarse como atajo para escoger metodología.',
    ],
    example: 'Decir “es distribuidor, por lo tanto TNMM” invierte el razonamiento. Primero debe determinarse qué tipo de distribuidor es y qué FAR sostiene esa caracterización.',
    chair: 'Una buena etiqueta resume hechos ya analizados; una mala etiqueta intenta sustituirlos.',
    remember: 'Caracterización primero desde FAR; metodología después desde la operación correctamente comprendida.',
  },
];

export function J3LessonPage() {
  const { lessonNumber } = useParams();
  const sequence = Number(lessonNumber);
  const lesson = j3Lessons.find((item) => item.sequence === sequence);

  useEffect(() => {
    if (lesson) markCourseLessonVisited('J3', lesson.sequence, j3Lessons.length);
  }, [lesson]);

  if (!lesson || !Number.isInteger(sequence)) return <Navigate to="/courses/j3" replace />;

  const body = lessonBodies[sequence - 1];
  const assessment = j3Assessments.find((item) => item.lesson === sequence);
  const previous = sequence > 1 ? sequence - 1 : null;
  const next = sequence < j3Lessons.length ? sequence + 1 : null;
  const check = assessment ? {
    id: `j3-check-${sequence}`,
    title: `Lección ${sequence} · Comprobación`,
    prompt: assessment.prompt,
    correctOptionId: `option-${assessment.correctIndex}`,
    options: assessment.options.map((label, index) => ({ id: `option-${index}`, label, feedback: index === assessment.correctIndex ? assessment.feedback : 'Revisa el razonamiento de la lección y vuelve a intentarlo.' })),
  } : null;

  return (
    <>
      <div className="lesson-topbar"><div className="container"><Link to="/courses/j3">← J3 · Análisis Funcional: FAR</Link><span>Lección {sequence} de {j3Lessons.length}</span></div></div>
      <article className="lesson-content">
        <div className="eyebrow">Junior · J3</div>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">≈ {lesson.estimatedMinutes} min</p>
        <section className="learning-outcomes"><h2>Al terminar esta lección podrás</h2><ul>{lesson.learningOutcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <h2>{body.heading}</h2>
        {body.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="concept-callout"><strong>Ejemplo</strong><p>{body.example}</p></div>
        <section className="consultant-card"><div className="eyebrow">La Silla del Consultor</div><h2>Criterio profesional</h2><p>{body.chair}</p></section>
        {check && <FormativeCheck check={check} onCorrect={() => markCourseLessonCompleted('J3', sequence, j3Lessons.length)} />}
        <section className="remember-card"><strong>Lo que no debes olvidar</strong><p>{body.remember}</p></section>
        <nav className="lesson-nav" aria-label="Navegación entre lecciones">
          {previous ? <Link className="button secondary" to={`/courses/j3/lesson/${previous}`}>← Lección anterior</Link> : <span />}
          {next ? <Link className="button primary" to={`/courses/j3/lesson/${next}`}>Siguiente lección →</Link> : <Link className="button primary" to="/courses/j3">Volver al curso</Link>}
        </nav>
      </article>
    </>
  );
}
