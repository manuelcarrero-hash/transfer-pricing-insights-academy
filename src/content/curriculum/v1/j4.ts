export const j4Course = {
  id: 'course-j4',
  curriculumVersion: 'v1',
  level: 'Junior',
  code: 'J4',
  title: 'Métodos de Precios de Transferencia',
  description: 'Construye un mapa conceptual de los cinco métodos principales de Precios de Transferencia, qué compara cada uno, qué información requiere y por qué la selección depende de la operación, FAR y confiabilidad de la información.',
  prerequisites: ['J1', 'J2', 'J3'],
  estimatedMinutes: 120,
  lessonCount: 8,
  learningOutcomes: [
    'Explicar por qué se necesitan métodos de Precios de Transferencia.',
    'Distinguir la lógica de CUP, RPM, Cost Plus, TNMM y Profit Split.',
    'Identificar qué dato económico compara cada método.',
    'Relacionar naturaleza de la operación, FAR, disponibilidad de información y confiabilidad con la selección inicial del método.',
  ],
};

export const j4Lessons = [
  { id: 'j4-lesson-1', sequence: 1, title: '¿Para qué necesitamos un método?', estimatedMinutes: 13, learningOutcomes: ['Explicar la función de un método de TP.', 'Relacionar selección de método con operación, FAR e información disponible.'] },
  { id: 'j4-lesson-2', sequence: 2, title: 'Método del Precio Comparable No Controlado / CUP', estimatedMinutes: 15, learningOutcomes: ['Explicar qué compara CUP.', 'Distinguir CUP interno y externo y reconocer la importancia de la comparabilidad.'] },
  { id: 'j4-lesson-3', sequence: 3, title: 'Método del Precio de Reventa / RPM', estimatedMinutes: 14, learningOutcomes: ['Explicar la lógica del margen bruto de reventa.', 'Reconocer contextos y limitaciones conceptuales del RPM.'] },
  { id: 'j4-lesson-4', sequence: 4, title: 'Método de Costo Adicionado / Cost Plus', estimatedMinutes: 14, learningOutcomes: ['Explicar la lógica de costos más mark-up.', 'Reconocer por qué la base de costos y la comparabilidad contable son críticas.'] },
  { id: 'j4-lesson-5', sequence: 5, title: 'Método del Margen Neto Operacional / TNMM', estimatedMinutes: 17, learningOutcomes: ['Explicar qué compara TNMM a nivel Junior.', 'Reconocer que el indicador depende de la actividad y del análisis funcional.'] },
  { id: 'j4-lesson-6', sequence: 6, title: 'Método de Partición de Utilidades / Profit Split', estimatedMinutes: 16, learningOutcomes: ['Explicar la lógica de utilidad combinada y contribuciones.', 'Reconocer cuándo contribuciones únicas, valiosas o altamente integradas pueden hacerlo relevante.'] },
  { id: 'j4-lesson-7', sequence: 7, title: 'Métodos tradicionales vs. métodos basados en resultados', estimatedMinutes: 14, learningOutcomes: ['Clasificar los cinco métodos en sus grandes familias.', 'Evitar convertir la clasificación en una jerarquía automática.'] },
  { id: 'j4-lesson-8', sequence: 8, title: '¿Cómo empezar a pensar en la elección de método?', estimatedMinutes: 17, learningOutcomes: ['Formular preguntas iniciales para una selección de método.', 'Utilizar un árbol mental didáctico sin convertirlo en una regla mecánica.'] },
].map((lesson) => ({ ...lesson, courseId: 'course-j4', curriculumVersion: 'v1' }));
