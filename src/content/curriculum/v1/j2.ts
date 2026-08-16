export const j2Course = {
  id: 'course-j2',
  curriculumVersion: 'v1',
  level: 'Junior',
  code: 'J2',
  title: 'Principio de Plena Competencia',
  description: 'Comprende cómo el principio de plena competencia exige identificar las condiciones económicamente relevantes, contrastar contrato y conducta, analizar riesgos y delimitar correctamente una operación antes de valorarla.',
  prerequisites: ['J1'],
  estimatedMinutes: 105,
  lessonCount: 8,
  learningOutcomes: [
    'Explicar el principio de plena competencia como un estándar sobre condiciones y no sólo sobre precios.',
    'Distinguir entre términos contractuales, conducta real y conclusiones que requieren análisis.',
    'Reconocer la lógica básica del control del riesgo y la capacidad financiera.',
    'Ordenar la secuencia desde los hechos y la delimitación hasta la valoración de la operación.',
  ],
};

export const j2Lessons = [
  {
    id: 'j2-lesson-1', sequence: 1, title: 'El principio de plena competencia', estimatedMinutes: 12,
    learningOutcomes: ['Explicar qué compara el principio de plena competencia.', 'Reconocer que el análisis comprende condiciones económicas más amplias que un precio unitario.'],
  },
  {
    id: 'j2-lesson-2', sequence: 2, title: 'Las condiciones económicamente relevantes', estimatedMinutes: 13,
    learningOutcomes: ['Identificar las cinco grandes categorías de circunstancias económicamente relevantes.', 'Explicar por qué producto igual no implica operación comparable.'],
  },
  {
    id: 'j2-lesson-3', sequence: 3, title: 'Contratos vs. conducta real', estimatedMinutes: 13,
    learningOutcomes: ['Distinguir la asignación contractual de la conducta observable.', 'Detectar inconsistencias que requieren investigación adicional.'],
  },
  {
    id: 'j2-lesson-4', sequence: 4, title: 'Delimitar la operación', estimatedMinutes: 14,
    learningOutcomes: ['Explicar qué significa delimitar con precisión una operación.', 'Identificar preguntas que deben resolverse antes de seleccionar metodología.'],
  },
  {
    id: 'j2-lesson-5', sequence: 5, title: 'Introducción al riesgo', estimatedMinutes: 14,
    learningOutcomes: ['Reconocer riesgos económicamente relevantes.', 'Explicar a alto nivel control del riesgo y capacidad financiera.'],
  },
  {
    id: 'j2-lesson-6', sequence: 6, title: 'El marco de seis pasos: mapa conceptual', estimatedMinutes: 14,
    learningOutcomes: ['Ordenar la lógica general del marco de análisis de riesgos.', 'Conectar contrato, conducta, control, capacidad, delimitación y valoración.'],
  },
  {
    id: 'j2-lesson-7', sequence: 7, title: 'Opciones realistamente disponibles', estimatedMinutes: 12,
    learningOutcomes: ['Explicar por qué las alternativas reales importan en una negociación entre independientes.', 'Distinguir una opción realista de una alternativa meramente hipotética.'],
  },
  {
    id: 'j2-lesson-8', sequence: 8, title: 'De la delimitación a la valoración', estimatedMinutes: 13,
    learningOutcomes: ['Ordenar la secuencia lógica previa a la selección del método.', 'Evitar el error de escoger metodología antes de comprender los hechos.'],
  },
].map((lesson) => ({ ...lesson, courseId: 'course-j2', curriculumVersion: 'v1' }));
