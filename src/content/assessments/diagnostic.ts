export type DiagnosticDomain = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type DiagnosticQuestion = {
  id: number;
  domain: DiagnosticDomain;
  prompt: string;
  options: string[];
  correct: number;
};

export const diagnosticDomainLabels: Record<DiagnosticDomain, string> = {
  A: 'Fundamentos y plena competencia',
  B: 'FAR, delimitación y riesgos',
  C: 'Métodos, tested party, PLI e información financiera',
  D: 'Comparabilidad, ajustes y rango',
  E: 'Documentación y levantamiento de información',
  F: 'Servicios, intangibles, financiamiento y temas avanzados',
};

export const diagnosticDomainWeights: Record<DiagnosticDomain, number> = {
  A: 8,
  B: 8,
  C: 8,
  D: 6,
  E: 4,
  F: 6,
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  { id:1, domain:'A', prompt:'¿Cuál describe mejor el principio de plena competencia?', options:['Toda operación relacionada debe tener el mismo precio que cualquier tercero.','Las condiciones de una operación controlada deben analizarse frente a condiciones que habrían acordado partes independientes en circunstancias comparables.','Toda operación relacionada debe generar utilidad.','La autoridad fiscal determina siempre el precio correcto.'], correct:1 },
  { id:2, domain:'A', prompt:'Una operación controlada es:', options:['Una operación autorizada por la autoridad fiscal.','Una transacción entre partes relacionadas.','Cualquier venta internacional.','Toda operación superior a un umbral fiscal.'], correct:1 },
  { id:3, domain:'A', prompt:'¿Qué debe prevalecer si un contrato no refleja la conducta real de las partes?', options:['Siempre el contrato.','Siempre la factura.','La delimitación basada en hechos y conducta real, considerando también el contrato.','El tratamiento contable.'], correct:2 },
  { id:4, domain:'A', prompt:'El objetivo de delimitar precisamente una operación es:', options:['Elegir rápidamente un método.','Reconstruir la verdadera naturaleza económica de la relación controlada.','Calcular un rango intercuartil.','Identificar únicamente el monto contable.'], correct:1 },
  { id:5, domain:'A', prompt:'Las opciones realistamente disponibles sirven principalmente para:', options:['Eliminar la necesidad de comparables.','Evaluar qué alternativas económicamente razonables tenían las partes.','Determinar la tasa impositiva.','Sustituir el FAR.'], correct:1 },
  { id:6, domain:'A', prompt:'La clasificación contable de una operación:', options:['Determina automáticamente su tratamiento de TP.','Es irrelevante.','Es una fuente de información, pero no sustituye la delimitación económica.','Tiene prioridad sobre la conducta.'], correct:2 },
  { id:7, domain:'A', prompt:'¿Cuál es la mejor descripción del papel de las Directrices OCDE en la Academy?', options:['Sustituyen la legislación local.','Son la columna vertebral doctrinal, pero deben contrastarse con la legislación de cada jurisdicción.','Aplican automáticamente en todos los países.','Son sólo material histórico.'], correct:1 },
  { id:8, domain:'A', prompt:'Encontrar un resultado dentro de un rango de mercado:', options:['Corrige cualquier falla del análisis.','Demuestra por sí solo que el FAR es correcto.','No subsana una mala delimitación, segmentación o caracterización.','Elimina la necesidad de documentación.'], correct:2 },
  { id:9, domain:'A', prompt:'¿Cuál es el orden más sólido?', options:['Método → FAR → operación → datos.','Rango → método → FAR.','Negocio → hechos → operación → FAR → método → comparabilidad → conclusión.','Comparable → contrato → negocio.'], correct:2 },
  { id:10, domain:'A', prompt:'Una política de TP escrita:', options:['Es suficiente para probar conducta.','Debe contrastarse con contratos, procesos, decisiones y resultados reales.','Sustituye la documentación.','No tiene utilidad.'], correct:1 },

  { id:11, domain:'B', prompt:'FAR significa:', options:['Finance, Accounting, Reporting.','Functions, Assets, Risks.','Fiscal Analysis Review.','Functional Adjustment Range.'], correct:1 },
  { id:12, domain:'B', prompt:'Para sustentar que una entidad controla un riesgo, resulta especialmente relevante:', options:['Que el contrato lo diga.','Que tenga personal y capacidad para tomar decisiones relevantes respecto del riesgo.','Que tenga más empleados que la contraparte.','Que sea propietaria legal de la entidad.'], correct:1 },
  { id:13, domain:'B', prompt:'¿Cuál pregunta es mejor para investigar riesgo de inventario?', options:['¿Usted asume el riesgo de inventario?','¿Quién decide niveles de inventario y qué sucede con obsolescencia?','¿El inventario aparece en balance?','¿Existe una póliza de seguro?'], correct:1 },
  { id:14, domain:'B', prompt:'Una entidad con título contractual de “distribuidor de riesgo limitado”:', options:['Siempre debe ganar una utilidad estable.','Debe analizarse con base en conducta, decisiones, activos y riesgos reales.','Nunca puede tener pérdidas.','Siempre debe analizarse con TNMM.'], correct:1 },
  { id:15, domain:'B', prompt:'El headcount por área ayuda principalmente a:', options:['Determinar un precio.','Sustentar capacidad operativa y consistencia del FAR.','Calcular un rango.','Seleccionar automáticamente la tested party.'], correct:1 },
  { id:16, domain:'B', prompt:'Si una entidad dice controlar riesgos de mercado pero no cuenta con personal comercial ni autoridad para fijar precios:', options:['No hay problema si el contrato lo establece.','Existe una inconsistencia que debe investigarse.','Debe aplicarse CUP.','Debe eliminarse la operación.'], correct:1 },
  { id:17, domain:'B', prompt:'¿Cuál es la mejor evidencia de sustancia económica?', options:['Únicamente organigrama legal.','Contrato y factura.','Conjunto consistente de personal, procesos, autoridad, activos, decisiones y evidencia de ejecución.','Número total de empleados sin desglose.'], correct:2 },
  { id:18, domain:'B', prompt:'En una reestructuración, el FAR antes/después sirve para:', options:['Medir inflación.','Identificar qué funciones, activos y riesgos cambiaron realmente.','Calcular una regalía.','Sustituir el análisis financiero.'], correct:1 },
  { id:19, domain:'B', prompt:'Si falta información crítica para saber quién controla un riesgo, la mejor respuesta es:', options:['Asumir lo que diga el contrato.','Elegir el tratamiento más conservador.','Solicitar la información antes de concluir.','Usar TNMM.'], correct:2 },
  { id:20, domain:'B', prompt:'¿Qué describe mejor una caracterización?', options:['Una etiqueta contable.','Una síntesis del papel económico de una entidad basada en funciones, activos y riesgos.','La forma jurídica de la compañía.','El método elegido.'], correct:1 },

  { id:21, domain:'C', prompt:'El método más apropiado se selecciona considerando principalmente:', options:['Preferencia de la firma.','Tipo de operación únicamente.','Naturaleza económica, FAR, información disponible y comparabilidad.','El método usado el año anterior.'], correct:2 },
  { id:22, domain:'C', prompt:'Si existe un CUP interno altamente comparable:', options:['Debe ignorarse si TNMM es más fácil.','Puede ser una referencia de alta confiabilidad, sujeto a comparabilidad.','Siempre debe ajustarse al margen neto.','Sólo sirve para commodities.'], correct:1 },
  { id:23, domain:'C', prompt:'Un distribuidor puede parecer candidato para RPM, pero si no existe información confiable de margen bruto:', options:['RPM sigue siendo obligatorio.','Puede ganar confiabilidad otro método, como TNMM, si los datos disponibles lo soportan mejor.','Debe usarse Profit Split.','No puede analizarse.'], correct:1 },
  { id:24, domain:'C', prompt:'La tested party suele ser:', options:['La entidad con mayor utilidad.','La entidad para la cual el método puede aplicarse con mayor confiabilidad por tener funciones menos complejas y comparables adecuados.','Siempre la entidad local.','Siempre la matriz.'], correct:1 },
  { id:25, domain:'C', prompt:'¿Qué información es clave para TNMM?', options:['Únicamente ventas totales.','Información financiera suficientemente segmentada de la operación o segmento analizado.','Sólo estados consolidados.','Únicamente EBITDA.'], correct:1 },
  { id:26, domain:'C', prompt:'Si una cuenta contable mezcla servicios, regalías y reembolsos:', options:['Puede analizarse como una sola operación.','Debe integrarse y separarse según su naturaleza económica.','Basta con usar el total anual.','Debe excluirse.'], correct:1 },
  { id:27, domain:'C', prompt:'El Berry Ratio suele relacionar:', options:['Utilidad bruta con gastos operativos.','Utilidad operativa con activos.','Ventas con inventario.','Utilidad neta con patrimonio.'], correct:0 },
  { id:28, domain:'C', prompt:'Un PLI debe seleccionarse considerando:', options:['Sólo disponibilidad de fórmula.','FAR, naturaleza de la tested party y confiabilidad de los datos.','El indicador que produzca el mejor resultado.','La práctica del competidor.'], correct:1 },
  { id:29, domain:'C', prompt:'La trazabilidad financiera ideal es:', options:['Balanza → resultado.','Estados financieros → balanza → cuenta → integración → operación → segmentación → análisis.','Factura → método.','Contrato → rango.'], correct:1 },
  { id:30, domain:'C', prompt:'Si dos métodos son inicialmente plausibles, un Senior debería:', options:['Elegir el más habitual.','Evaluar ventajas, limitaciones y calidad de información de cada uno antes de decidir.','Elegir el que genere menor ajuste.','Aplicarlos siempre ambos.'], correct:1 },

  { id:31, domain:'D', prompt:'Un comparable interno es:', options:['Una empresa del mismo grupo.','Una operación comparable de la entidad o grupo con un tercero independiente.','Una filial con datos públicos.','Una empresa del mismo país.'], correct:1 },
  { id:32, domain:'D', prompt:'¿Cuál de los siguientes es un factor de comparabilidad?', options:['Circunstancias económicas.','Color del logo.','Número de accionistas.','Firma auditora.'], correct:0 },
  { id:33, domain:'D', prompt:'Un ajuste de comparabilidad debe realizarse cuando:', options:['Siempre aumenta el número de comparables.','Mejora razonablemente la comparabilidad y puede efectuarse con suficiente confiabilidad.','El resultado está fuera de rango.','Lo exige la base de datos.'], correct:1 },
  { id:34, domain:'D', prompt:'Respecto de ajustes de capital de trabajo:', options:['Existe una única fórmula OCDE obligatoria.','Cada firma puede usar metodologías distintas; debe explicarse y aplicarse consistentemente.','Nunca son relevantes.','Deben usarse sólo con CUP.'], correct:1 },
  { id:35, domain:'D', prompt:'Una empresa comparable presenta pérdida en un año. ¿Qué procede?', options:['Rechazarla automáticamente.','Analizar causa, recurrencia y comparabilidad antes de decidir.','Sustituir el año por cero.','Usar únicamente mediana.'], correct:1 },
  { id:36, domain:'D', prompt:'Las pérdidas recurrentes:', options:['Siempre prueban manipulación.','Requieren mayor escrutinio sobre circunstancias, FAR y comparabilidad.','Son irrelevantes.','Obligan a usar Profit Split.'], correct:1 },
  { id:37, domain:'D', prompt:'El análisis multianual sirve principalmente para:', options:['Ocultar pérdidas.','Comprender ciclos, tendencias y circunstancias económicas.','Garantizar que el resultado caiga en rango.','Sustituir información del año analizado.'], correct:1 },
  { id:38, domain:'D', prompt:'El rango intercuartil:', options:['Es la única forma internacionalmente válida de rango.','Es una herramienta estadística que puede utilizarse cuando corresponde; su aplicación legal depende de la jurisdicción.','Sustituye el análisis de comparabilidad.','Siempre contiene cuatro empresas.'], correct:1 },

  { id:39, domain:'E', prompt:'¿Cuál diferencia es correcta?', options:['EPT, Local File y Master File son sinónimos.','Local File se enfoca en entidad local y operaciones materiales; Master File ofrece visión global del grupo.','CbCR sustituye el Local File.','Master File contiene sólo estados financieros.'], correct:1 },
  { id:40, domain:'E', prompt:'El CbC Report:', options:['Prueba automáticamente si existe un ajuste de TP.','Presenta información agregada por jurisdicción y sirve, entre otras cosas, para transparencia y evaluación de riesgos.','Sustituye el FAR.','Es un benchmark.'], correct:1 },
  { id:41, domain:'E', prompt:'Para comenzar un EPT/Local File, además de balanza es razonable solicitar:', options:['Sólo contrato intercompañía.','Estados financieros, segmentación, integraciones, información de partes relacionadas y comparables internos potenciales, según aplique.','Sólo declaraciones fiscales.','Únicamente organigrama.'], correct:1 },
  { id:42, domain:'E', prompt:'¿Qué información ayuda a sustentar sustancia económica?', options:['Layout de áreas, puestos, headcount, procesos, autoridad y activos.','Sólo acta constitutiva.','Sólo facturación.','Únicamente política de TP.'], correct:0 },
  { id:43, domain:'E', prompt:'Una política de financiamiento intragrupo debería revisarse junto con:', options:['Términos reales de préstamos, aprobaciones, integraciones de intereses y conducta.','Sólo el nombre del banco.','Únicamente el balance consolidado.','El organigrama comercial.'], correct:0 },
  { id:44, domain:'E', prompt:'La mejor forma de solicitar información a un cliente es:', options:['Enviar siempre una lista idéntica de 200 preguntas.','Usar un cuestionario modular basado en operaciones y materialidad.','Pedir sólo información contable.','Pedir al cliente que seleccione el método.'], correct:1 },

  { id:45, domain:'F', prompt:'Antes de determinar un mark-up en servicios intragrupo debe evaluarse:', options:['Benefit test y naturaleza de las actividades/costos.','Sólo el margen del proveedor.','El rango intercuartil.','El CbCR.'], correct:0 },
  { id:46, domain:'F', prompt:'Una shareholder activity:', options:['Siempre se cobra a subsidiarias.','Puede no constituir un servicio intragrupo compensable para las subsidiarias beneficiarias aparentes.','Siempre requiere 5% de mark-up.','Es un intangible.'], correct:1 },
  { id:47, domain:'F', prompt:'Propiedad legal de un intangible:', options:['Garantiza por sí sola todos los retornos.','Debe analizarse junto con funciones DEMPE, activos, riesgos y control.','Es irrelevante.','Sustituye contratos de licencia.'], correct:1 },
  { id:48, domain:'F', prompt:'DEMPE significa:', options:['Development, Enhancement, Maintenance, Protection, Exploitation.','Debt, Equity, Margin, Price, Earnings.','Documentation, Evidence, Method, Profit, Evaluation.','Development, Equity, Market, Pricing, Execution.'], correct:0 },
  { id:49, domain:'F', prompt:'Para analizar una regalía debe conocerse, entre otras cosas:', options:['El intangible, derechos, territorio, exclusividad, duración, base de royalty y DEMPE.','Sólo el porcentaje cobrado.','Sólo ventas totales.','Sólo el nombre de la marca.'], correct:0 },
  { id:50, domain:'F', prompt:'En asistencia técnica, una pregunta importante es:', options:['Si el contrato usa la palabra “servicio”.','Si se está prestando soporte o transmitiendo know-how con capacidad de explotación independiente.','Si el pago es mensual.','Si el proveedor es extranjero.'], correct:1 },
  { id:51, domain:'F', prompt:'Un verdadero reembolso/pass-through:', options:['Siempre debe llevar mark-up.','Debe distinguirse de una función o servicio con valor agregado.','Nunca se documenta.','Es una regalía.'], correct:1 },
];

export type DiagnosticLevel = 'Junior' | 'Consultant' | 'Semi Senior' | 'Senior Knowledge';

export const diagnosticReviewRecommendations: Record<DiagnosticDomain, string> = {
  A: 'J1–J2',
  B: 'J3 + C1',
  C: 'J4 + C2–C3',
  D: 'J5 + C4–C6',
  E: 'C7 + Client Information Gathering Toolkit',
  F: 'SS1–SS5',
};

export function selectDiagnosticQuestions(seed = Date.now()): DiagnosticQuestion[] {
  let value = seed >>> 0 || 1;
  const random = () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
  const shuffle = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const domains = Object.keys(diagnosticDomainWeights) as DiagnosticDomain[];
  return shuffle(domains.flatMap(domain => shuffle(diagnosticQuestions.filter(q => q.domain === domain)).slice(0, diagnosticDomainWeights[domain])));
}

export function recommendDiagnosticLevel(overall: number, domainScores: Record<DiagnosticDomain, number>): DiagnosticLevel {
  const critical = (['A','B','C','D'] as DiagnosticDomain[]).map(domain => domainScores[domain]);
  if (overall < 40) return 'Junior';
  if (overall < 60) return 'Consultant';
  if (overall < 80) return critical.some(score => score < 60) ? 'Consultant' : 'Semi Senior';
  return critical.some(score => score < 70) ? 'Semi Senior' : 'Senior Knowledge';
}

export const diagnosticLevelRoutes: Record<DiagnosticLevel, string> = {
  Junior: '/courses/j1',
  Consultant: '/courses/c1',
  'Semi Senior': '/courses/ss1',
  'Senior Knowledge': '/courses/s1',
};
