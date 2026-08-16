export const j5Course = {
  id: 'course-j5',
  curriculumVersion: 'v1',
  level: 'Junior',
  code: 'J5',
  title: 'Fundamentos de Comparabilidad',
  description: 'Aprende a evaluar cuándo una referencia realmente sirve para comparar: comparables internos y externos, cinco factores de comparabilidad, diferencias materiales y el papel introductorio de los ajustes.',
  prerequisites: ['J1', 'J2', 'J3', 'J4'],
  estimatedMinutes: 135,
  lessonCount: 9,
  learningOutcomes: [
    'Explicar qué significa comparabilidad en Precios de Transferencia.',
    'Distinguir comparables internos y externos.',
    'Identificar y aplicar conceptualmente los cinco factores de comparabilidad.',
    'Reconocer diferencias materiales y entender cuándo un ajuste puede mejorar la confiabilidad.',
  ],
};

export const j5Lessons = [
  { id: 'j5-lesson-1', sequence: 1, title: '¿Qué significa comparable?', estimatedMinutes: 14, learningOutcomes: ['Definir comparabilidad económica.', 'Evitar confundir similitud superficial con comparabilidad.'] },
  { id: 'j5-lesson-2', sequence: 2, title: 'Comparable interno', estimatedMinutes: 14, learningOutcomes: ['Explicar qué es un comparable interno.', 'Reconocer sus ventajas y la necesidad de revisar diferencias relevantes.'] },
  { id: 'j5-lesson-3', sequence: 3, title: 'Comparable externo', estimatedMinutes: 14, learningOutcomes: ['Explicar qué es un comparable externo.', 'Reconocer las limitaciones de códigos de industria e información pública.'] },
  { id: 'j5-lesson-4', sequence: 4, title: 'Factor 1: características del bien, servicio o activo', estimatedMinutes: 15, learningOutcomes: ['Identificar características que pueden afectar valor.', 'Reconocer por qué producto o monto idéntico no garantiza comparabilidad.'] },
  { id: 'j5-lesson-5', sequence: 5, title: 'Factor 2: análisis funcional', estimatedMinutes: 15, learningOutcomes: ['Relacionar FAR con comparabilidad.', 'Distinguir parecido comercial de comparabilidad económica.'] },
  { id: 'j5-lesson-6', sequence: 6, title: 'Factor 3: términos contractuales', estimatedMinutes: 15, learningOutcomes: ['Identificar términos contractuales económicamente relevantes.', 'Explicar cómo pueden afectar precio, margen y riesgo.'] },
  { id: 'j5-lesson-7', sequence: 7, title: 'Factor 4: circunstancias económicas', estimatedMinutes: 15, learningOutcomes: ['Identificar circunstancias de mercado relevantes.', 'Explicar por qué geografía, competencia y ciclo económico pueden alterar la comparación.'] },
  { id: 'j5-lesson-8', sequence: 8, title: 'Factor 5: estrategias empresariales', estimatedMinutes: 15, learningOutcomes: ['Reconocer estrategias que pueden afectar temporalmente resultados.', 'Distinguir una estrategia con sustancia de una justificación no documentada.'] },
  { id: 'j5-lesson-9', sequence: 9, title: 'Introducción a los ajustes de comparabilidad', estimatedMinutes: 18, learningOutcomes: ['Explicar para qué sirve un ajuste de comparabilidad.', 'Reconocer que un ajuste débil puede reducir, en vez de mejorar, la confiabilidad.'] },
].map((lesson) => ({ ...lesson, courseId: 'course-j5', curriculumVersion: 'v1' }));
