export const c1Course = {
  id: 'course-c1',
  curriculumVersion: 'v1',
  level: 'Consultant',
  code: 'C1',
  title: 'Delimitación Precisa de Operaciones',
  description: 'Aprende a reconstruir la operación realmente realizada a partir de hechos, términos contractuales, FAR, conducta efectiva y condiciones económicamente relevantes antes de seleccionar un método.',
  prerequisites: ['Junior Foundations'],
  estimatedMinutes: 150,
  lessonCount: 8,
  passingScore: 80,
  learningOutcomes: [
    'Identificar las condiciones económicamente relevantes de una operación controlada.',
    'Distinguir entre descripción contractual y conducta real.',
    'Reconstruir una operación a partir de hechos coherentes y detectar inconsistencias.',
    'Identificar quién controla los riesgos relevantes y redactar una delimitación técnica breve.',
  ],
};

export const c1Lessons = [
  { id: 'c1-lesson-1', sequence: 1, title: 'Reconstruir la operación', estimatedMinutes: 18, learningOutcomes: ['Describir una operación sin depender de su etiqueta jurídica.', 'Identificar hechos, FAR, términos y circunstancias relevantes.'] },
  { id: 'c1-lesson-2', sequence: 2, title: 'Contrato y conducta', estimatedMinutes: 18, learningOutcomes: ['Contrastar términos contractuales con conducta efectiva.', 'Reconocer cuándo el contrato no demuestra por sí solo la operación económica.'] },
  { id: 'c1-lesson-3', sequence: 3, title: 'Condiciones económicamente relevantes', estimatedMinutes: 18, learningOutcomes: ['Identificar las cinco categorías principales de características económicamente relevantes.', 'Priorizar los factores según el tipo de operación.'] },
  { id: 'c1-lesson-4', sequence: 4, title: 'Control del riesgo en la delimitación', estimatedMinutes: 20, learningOutcomes: ['Identificar quién toma decisiones relevantes sobre un riesgo.', 'Distinguir asignación contractual de control real y capacidad financiera.'] },
  { id: 'c1-lesson-5', sequence: 5, title: 'Naturaleza económica de la operación', estimatedMinutes: 18, learningOutcomes: ['Redactar una descripción económica útil.', 'Evitar descripciones genéricas que oculten FAR y condiciones relevantes.'] },
  { id: 'c1-lesson-6', sequence: 6, title: 'Cuándo los hechos cambian la caracterización', estimatedMinutes: 18, learningOutcomes: ['Relacionar cambios en hechos con cambios de caracterización económica.', 'Distinguir una etiqueta estable de un perfil económico distinto.'] },
  { id: 'c1-lesson-7', sequence: 7, title: 'Redactar una delimitación precisa', estimatedMinutes: 20, learningOutcomes: ['Aplicar una plantilla conceptual de delimitación.', 'Producir una conclusión breve, clara y verificable.'] },
  { id: 'c1-lesson-8', sequence: 8, title: 'De la delimitación al método', estimatedMinutes: 20, learningOutcomes: ['Explicar la secuencia hechos → delimitación → caracterización → método.', 'Evitar seleccionar metodología antes de entender la operación.'] },
].map((lesson) => ({ ...lesson, courseId: 'course-c1', curriculumVersion: 'v1' }));
