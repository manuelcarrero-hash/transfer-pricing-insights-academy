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

export const j1Lesson1 = {
  id: 'j1-lesson-1',
  courseId: 'course-j1',
  curriculumVersion: 'v1',
  sequence: 1,
  title: '¿Qué son los Precios de Transferencia?',
  estimatedMinutes: 10,
  learningOutcomes: [
    'Distinguir una operación controlada de una operación con un tercero independiente.',
    'Reconocer que Transfer Pricing analiza condiciones económicas, no únicamente precios unitarios.',
  ],
};
