export const c2Course = {
  id: 'course-c2', curriculumVersion: 'v1', level: 'Consultant', code: 'C2',
  title: 'Selección del Método Más Apropiado',
  description: 'Aprende a seleccionar y justificar el método de precios de transferencia que ofrece la evaluación más confiable para una operación correctamente delimitada.',
  prerequisites: ['Junior Foundations', 'C1'], estimatedMinutes: 160, lessonCount: 8, passingScore: 80,
  learningOutcomes: [
    'Distinguir entre un método posible y el método más apropiado.',
    'Evaluar naturaleza de la operación, FAR, disponibilidad de información y comparabilidad relativa.',
    'Reconocer cuándo un comparable interno merece atención prioritaria y seleccionar una tested party cuando procede.',
    'Redactar una justificación técnica básica que compare alternativas y explique la confiabilidad relativa.'
  ],
};
export const c2Lessons = [
  { id:'c2-lesson-1', sequence:1, title:'La pregunta correcta: ¿qué método es más apropiado?', estimatedMinutes:18, learningOutcomes:['Distinguir aplicabilidad de mayor apropiación.','Explicar por qué facilidad de cálculo no determina la selección.']},
  { id:'c2-lesson-2', sequence:2, title:'Naturaleza de la operación y FAR', estimatedMinutes:20, learningOutcomes:['Relacionar operación delimitada y FAR con métodos plausibles.','Evitar reglas automáticas por tipo de operación.']},
  { id:'c2-lesson-3', sequence:3, title:'Disponibilidad y calidad de información', estimatedMinutes:20, learningOutcomes:['Evaluar cómo la calidad de datos afecta la confiabilidad.','Reconocer el valor y límites de un comparable interno.']},
  { id:'c2-lesson-4', sequence:4, title:'Comparabilidad relativa', estimatedMinutes:20, learningOutcomes:['Comparar sensibilidad de métodos a diferencias materiales.','Identificar cuándo un ajuste puede sostener una alternativa metodológica.']},
  { id:'c2-lesson-5', sequence:5, title:'Tested Party / Parte analizada', estimatedMinutes:20, learningOutcomes:['Seleccionar conceptualmente una parte analizada.','Distinguir menor complejidad funcional de tamaño o importancia corporativa.']},
  { id:'c2-lesson-6', sequence:6, title:'Métodos tradicionales vs. métodos basados en resultados', estimatedMinutes:18, learningOutcomes:['Evitar una jerarquía mecánica de métodos.','Reconocer cuándo una comparación más directa puede ofrecer una ventaja analítica.']},
  { id:'c2-lesson-7', sequence:7, title:'Justificación técnica de la selección', estimatedMinutes:20, learningOutcomes:['Estructurar una justificación trazable.','Explicar fortalezas y limitaciones de alternativas relevantes.']},
  { id:'c2-lesson-8', sequence:8, title:'Laboratorio de selección', estimatedMinutes:24, learningOutcomes:['Aplicar la lógica de selección a CUP, Cost Plus, TNMM y Profit Split.','Defender una selección provisional con base en confiabilidad relativa.']},
].map((lesson)=>({...lesson,courseId:'course-c2',curriculumVersion:'v1'}));
