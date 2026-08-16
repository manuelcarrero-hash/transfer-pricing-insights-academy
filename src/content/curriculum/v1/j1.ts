export const j1Course = {
  id: 'course-j1',
  curriculumVersion: 'v1',
  level: 'Junior',
  code: 'J1',
  title: 'Introducción a Precios de Transferencia',
  description: 'Comprende qué problema resuelve la disciplina, qué es una operación controlada y por qué el análisis comienza con los hechos.',
  prerequisites: [] as string[],
  estimatedMinutes: 90,
  lessonCount: 8,
  learningOutcomes: [
    'Identificar una operación entre empresas relacionadas.',
    'Explicar por qué una operación controlada requiere un análisis especial.',
    'Describir a alto nivel el razonamiento de un análisis de Precios de Transferencia.',
  ],
};

export const j1Lessons = [
  {
    id: 'j1-lesson-1', sequence: 1, title: '¿Qué son los Precios de Transferencia?', estimatedMinutes: 10,
    learningOutcomes: ['Distinguir una operación controlada de una operación con un tercero independiente.', 'Reconocer que Transfer Pricing analiza condiciones económicas, no únicamente precios unitarios.'],
  },
  {
    id: 'j1-lesson-2', sequence: 2, title: 'Partes relacionadas y operaciones controladas', estimatedMinutes: 10,
    learningOutcomes: ['Reconocer por qué la relación entre las partes importa para el análisis.', 'Separar la identificación de la relación de la evaluación económica de la operación.'],
  },
  {
    id: 'j1-lesson-3', sequence: 3, title: 'El principio de plena competencia', estimatedMinutes: 12,
    learningOutcomes: ['Explicar el principio de plena competencia en lenguaje sencillo.', 'Distinguir el estándar de plena competencia de una presunción de irregularidad.'],
  },
  {
    id: 'j1-lesson-4', sequence: 4, title: 'Los hechos antes que el método', estimatedMinutes: 10,
    learningOutcomes: ['Identificar los hechos mínimos necesarios antes de seleccionar una metodología.', 'Reconocer por qué una conclusión sin hechos suficientes es débil.'],
  },
  {
    id: 'j1-lesson-5', sequence: 5, title: 'Funciones, activos y riesgos: primera aproximación', estimatedMinutes: 14,
    learningOutcomes: ['Describir a alto nivel qué son funciones, activos y riesgos.', 'Relacionar la realidad económica de las partes con el análisis de la operación.'],
  },
  {
    id: 'j1-lesson-6', sequence: 6, title: 'Comparabilidad: comparar lo comparable', estimatedMinutes: 12,
    learningOutcomes: ['Explicar por qué dos operaciones no son comparables únicamente por parecer similares.', 'Reconocer circunstancias económicamente relevantes que pueden afectar una comparación.'],
  },
  {
    id: 'j1-lesson-7', sequence: 7, title: 'Los métodos: un mapa antes del detalle', estimatedMinutes: 12,
    learningOutcomes: ['Reconocer que existen distintos métodos de Precios de Transferencia.', 'Entender que el método se selecciona en función de los hechos y la confiabilidad del análisis.'],
  },
  {
    id: 'j1-lesson-8', sequence: 8, title: 'Cómo piensa un consultor de Precios de Transferencia', estimatedMinutes: 10,
    learningOutcomes: ['Ordenar el razonamiento básico de un análisis de Precios de Transferencia.', 'Identificar información faltante antes de emitir una conclusión.'],
  },
].map((lesson) => ({ ...lesson, courseId: 'course-j1', curriculumVersion: 'v1' }));

export const j1Lesson1 = j1Lessons[0];
