import type { FormativeCheckData } from '../../../components/learning/FormativeCheck';

export const j1Assessments: FormativeCheckData[] = [
  {
    id: 'j1-check-1',
    title: '¿Es una operación controlada?',
    prompt: 'Una empresa compra materia prima a un proveedor totalmente independiente y no existe ninguna relación entre ambos. ¿La compra es una operación controlada por ese solo hecho?',
    correctOptionId: 'b',
    options: [
      { id: 'a', label: 'Sí. Toda compra es una operación controlada.', feedback: 'No toda compra es una operación controlada. Primero identifica quiénes son las partes y si existe una relación entre ellas.' },
      { id: 'b', label: 'No. Con los hechos dados, es una operación entre partes independientes.', feedback: 'Con los hechos proporcionados, comprador y proveedor son partes independientes; por ello, la compra no es una operación controlada por ese solo hecho.' },
      { id: 'c', label: 'Sí, si el monto es material.', feedback: 'La materialidad del monto no determina por sí misma si una operación es controlada. Primero identifica quiénes son las partes y si existe una relación entre ellas.' },
    ],
  },
  {
    id: 'j1-check-2',
    title: 'Relación no es conclusión',
    prompt: 'Dos empresas pertenecen al mismo grupo y realizan una venta entre sí. ¿Qué puedes concluir únicamente con esos hechos?',
    correctOptionId: 'b',
    options: [
      { id: 'a', label: 'Que la operación incumple plena competencia.', feedback: 'La relación entre las partes no demuestra por sí sola que las condiciones incumplan plena competencia.' },
      { id: 'b', label: 'Que existe una operación controlada que debe analizarse.', feedback: 'La relación permite identificar la operación como controlada; el análisis económico posterior determinará si sus condiciones son consistentes con plena competencia.' },
      { id: 'c', label: 'Que debe utilizarse necesariamente el método CUP.', feedback: 'La relación no determina automáticamente el método. La selección depende de los hechos, la información y la confiabilidad de la comparación.' },
    ],
  },
  {
    id: 'j1-check-3',
    title: '¿Qué pregunta hace plena competencia?',
    prompt: '¿Cuál de estas formulaciones refleja mejor el principio de plena competencia?',
    correctOptionId: 'a',
    options: [
      { id: 'a', label: '¿Qué condiciones habrían acordado partes independientes en circunstancias comparables?', feedback: 'Ese es el núcleo del estándar de plena competencia: comparar con lo que habrían acordado independientes en circunstancias comparables.' },
      { id: 'b', label: '¿Cuál es el precio más alto que puede defenderse?', feedback: 'Plena competencia no busca maximizar ni minimizar un resultado, sino aproximar condiciones comparables entre independientes.' },
      { id: 'c', label: '¿Toda operación intragrupo debe tener el mismo margen?', feedback: 'No existe un margen universal. Las condiciones dependen de la operación y de sus circunstancias económicamente relevantes.' },
    ],
  },
  {
    id: 'j1-check-4',
    title: '¿Qué debe ocurrir antes del método?',
    prompt: 'Te piden seleccionar un método para servicios intragrupo, pero aún no sabes qué servicios se prestaron ni quién los ejecutó. ¿Qué haces primero?',
    correctOptionId: 'c',
    options: [
      { id: 'a', label: 'Elegir Cost Plus porque se trata de servicios.', feedback: 'La etiqueta de la operación no basta para elegir un método. Primero debes comprender y delimitar los hechos.' },
      { id: 'b', label: 'Buscar comparables externos de inmediato.', feedback: 'Una búsqueda antes de comprender la operación puede producir comparables irrelevantes y una conclusión débil.' },
      { id: 'c', label: 'Obtener los hechos y delimitar la operación antes de seleccionar la metodología.', feedback: 'La selección del método viene después de comprender quién hizo qué, con qué recursos, bajo qué condiciones y con qué riesgos.' },
    ],
  },
  {
    id: 'j1-check-5',
    title: 'FAR no es una lista',
    prompt: '¿Cuál de estas preguntas aporta más al análisis de riesgos que simplemente leer el contrato?',
    correctOptionId: 'b',
    options: [
      { id: 'a', label: '¿Qué nombre recibe el riesgo en el contrato?', feedback: 'El contrato importa, pero el análisis no termina en la etiqueta contractual.' },
      { id: 'b', label: '¿Quién toma las decisiones relevantes para controlar el riesgo y tiene capacidad para hacerlo?', feedback: 'El análisis económico exige entender la conducta real, la toma de decisiones y la capacidad de las partes, no sólo la asignación escrita.' },
      { id: 'c', label: '¿Cuántas páginas tiene el contrato?', feedback: 'La extensión del contrato no informa quién controla o soporta económicamente el riesgo.' },
    ],
  },
  {
    id: 'j1-check-6',
    title: '¿Son comparables por estar en el mismo sector?',
    prompt: 'Dos distribuidoras venden productos similares, pero una posee intangibles locales valiosos y asume riesgos comerciales importantes. ¿Basta que ambas estén en el mismo sector para tratarlas como comparables?',
    correctOptionId: 'c',
    options: [
      { id: 'a', label: 'Sí, porque el sector económico es el factor decisivo.', feedback: 'El sector es sólo un punto de partida. Las diferencias funcionales y económicas pueden afectar materialmente la comparación.' },
      { id: 'b', label: 'Sí, si ambas tienen ventas positivas.', feedback: 'El nivel de ventas no elimina diferencias en funciones, activos, riesgos u otras circunstancias económicamente relevantes.' },
      { id: 'c', label: 'No necesariamente; hay que evaluar si las diferencias son económicamente relevantes y si pueden ajustarse confiablemente.', feedback: 'Comparabilidad exige analizar diferencias relevantes y su efecto, no sólo semejanzas superficiales.' },
    ],
  },
  {
    id: 'j1-check-7',
    title: 'Seleccionar la herramienta',
    prompt: 'Existe una operación independiente muy comparable a la operación controlada que analizas. ¿Qué principio debe guiar la selección del método?',
    correctOptionId: 'a',
    options: [
      { id: 'a', label: 'Elegir el enfoque que produzca el análisis más confiable dadas las circunstancias y la información disponible.', feedback: 'La confiabilidad del análisis y la calidad de la comparabilidad deben guiar la selección del método.' },
      { id: 'b', label: 'Usar siempre TNMM porque es el método más común.', feedback: 'La frecuencia de uso de un método no sustituye el análisis de cuál resulta más apropiado y confiable para los hechos concretos.' },
      { id: 'c', label: 'Elegir el método que genere el resultado más favorable.', feedback: 'La selección metodológica no debe depender del resultado deseado, sino de la naturaleza de la operación y de la confiabilidad disponible.' },
    ],
  },
  {
    id: 'j1-check-8',
    title: 'La disciplina del consultor',
    prompt: 'Te falta información material para sostener una conclusión sobre una regalía intragrupo. ¿Cuál es la respuesta profesional más sólida?',
    correctOptionId: 'b',
    options: [
      { id: 'a', label: 'Completar los vacíos con supuestos razonables sin documentarlos.', feedback: 'Los supuestos no documentados reducen la trazabilidad y pueden ocultar una limitación material del análisis.' },
      { id: 'b', label: 'Identificar la información faltante, pedirla y condicionar la conclusión si sigue sin estar disponible.', feedback: 'Reconocer límites de información forma parte del juicio profesional y protege la calidad de la conclusión.' },
      { id: 'c', label: 'Buscar una tasa de regalía promedio y usarla como respuesta.', feedback: 'Una tasa aislada no sustituye la comprensión del intangible, los derechos, las funciones, el mercado y la evidencia relevante.' },
    ],
  },
];
