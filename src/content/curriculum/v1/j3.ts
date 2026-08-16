export const j3Course = {
  id: 'course-j3',
  curriculumVersion: 'v1',
  level: 'Junior',
  code: 'J3',
  title: 'Análisis Funcional: FAR',
  description: 'Aprende a identificar funciones, activos y riesgos económicamente relevantes, relacionarlos entre las partes y convertir los hechos en una caracterización funcional preliminar.',
  prerequisites: ['J1', 'J2'],
  estimatedMinutes: 115,
  lessonCount: 8,
  learningOutcomes: [
    'Explicar para qué sirve un análisis funcional y por qué es relacional.',
    'Identificar funciones, activos y riesgos económicamente relevantes para una operación.',
    'Reconocer la importancia de las personas que toman decisiones y controlan riesgos.',
    'Construir una caracterización funcional básica de fabricantes, distribuidores y prestadores de servicios.',
  ],
};

export const j3Lessons = [
  { id: 'j3-lesson-1', sequence: 1, title: '¿Qué es un análisis funcional?', estimatedMinutes: 13, learningOutcomes: ['Explicar la finalidad económica de FAR.', 'Reconocer que FAR analiza la relación entre las partes y no una entidad de forma aislada.'] },
  { id: 'j3-lesson-2', sequence: 2, title: 'Functions: ¿qué hace cada parte?', estimatedMinutes: 15, learningOutcomes: ['Identificar funciones económicamente relevantes.', 'Distinguir entre ejecutar una actividad y tomar decisiones relevantes sobre ella.'] },
  { id: 'j3-lesson-3', sequence: 3, title: 'Assets: ¿qué recursos se utilizan?', estimatedMinutes: 14, learningOutcomes: ['Distinguir activos tangibles, intangibles y otros recursos relevantes.', 'Relacionar el uso de un activo con la operación específica.'] },
  { id: 'j3-lesson-4', sequence: 4, title: 'Risks: ¿qué puede salir distinto a lo esperado?', estimatedMinutes: 15, learningOutcomes: ['Identificar riesgos económicamente relevantes.', 'Distinguir exposición al riesgo de asunción y control económico del riesgo.'] },
  { id: 'j3-lesson-5', sequence: 5, title: 'Personas y capacidad de decisión', estimatedMinutes: 14, learningOutcomes: ['Identificar quién toma decisiones relevantes.', 'Detectar señales de que contrato y control real pueden no coincidir.'] },
  { id: 'j3-lesson-6', sequence: 6, title: 'FAR de un fabricante', estimatedMinutes: 15, learningOutcomes: ['Construir un FAR simplificado de manufactura.', 'Distinguir un fabricante relativamente rutinario de uno con mayor complejidad funcional.'] },
  { id: 'j3-lesson-7', sequence: 7, title: 'FAR de un distribuidor y un prestador de servicios', estimatedMinutes: 15, learningOutcomes: ['Construir perfiles FAR básicos de distribución y servicios.', 'Comprender qué significa rutinario en sentido relativo para TP.'] },
  { id: 'j3-lesson-8', sequence: 8, title: 'De FAR a caracterización', estimatedMinutes: 14, learningOutcomes: ['Convertir hechos FAR en una caracterización preliminar.', 'Evitar saltar de una etiqueta funcional directamente a un método.'] },
].map((lesson) => ({ ...lesson, courseId: 'course-j3', curriculumVersion: 'v1' }));
