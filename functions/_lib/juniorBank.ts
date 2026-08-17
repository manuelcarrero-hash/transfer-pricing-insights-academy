export type JuniorDomain = 'Fundamentos' | "Arm's Length / delimitación" | 'FAR' | 'Métodos' | 'Comparabilidad';
export type JuniorQuestion = { id: number; domain: JuniorDomain; prompt: string; options: string[]; correctIndex: number };
const q=(id:number,domain:JuniorDomain,prompt:string,options:string[],correctIndex:number):JuniorQuestion=>({id,domain,prompt,options,correctIndex});
export const juniorDomains: JuniorDomain[] = ['Fundamentos',"Arm's Length / delimitación",'FAR','Métodos','Comparabilidad'];
export const JUNIOR_PASS_SCORE = 80;
export const JUNIOR_DOMAIN_FLOOR = 60;
export const distribution: Record<JuniorDomain, number> = {'Fundamentos':5,"Arm's Length / delimitación":4,'FAR':4,'Métodos':4,'Comparabilidad':3};
export const bank: JuniorQuestion[] = [
q(1,'Fundamentos','Una operación entre empresas relacionadas:',['Es automáticamente incorrecta','Puede requerir análisis bajo el principio de plena competencia','Siempre debe eliminarse','Sólo importa si existe pérdida fiscal'],1),
q(2,'Fundamentos','Transfer Pricing analiza exclusivamente precios unitarios.',['Verdadero','Falso'],1),
q(3,'Fundamentos','Antes de ejecutar un benchmark, el consultor debe primero:',['Elegir TNMM','Entender la operación','Calcular el rango','Descargar comparables'],1),
q(4,"Arm's Length / delimitación",'El principio de plena competencia evalúa si las condiciones entre relacionadas son consistentes con las que habrían acordado independientes en circunstancias comparables.',['Verdadero','Falso'],0),
q(5,"Arm's Length / delimitación",'Si contrato y conducta real difieren materialmente, el análisis debe considerar:',['Sólo el contrato','Sólo la factura','La conducta real y los hechos económicamente relevantes','El documento más antiguo'],2),
q(6,'FAR','FAR significa:',['Finance, Accounting, Revenue','Functions, Assets and Risks','Fiscal Allocation Rules','Functional Adjustment Range'],1),
q(7,'FAR','¿Cuál es una función?',['Ejecutar manufactura','Poseer una marca','Asumir riesgo cambiario','Tener inventario'],0),
q(8,'FAR','¿Cuál es un activo?',['Política de descuentos','Maquinaria','Riesgo de inventario','Negociación con clientes'],1),
q(9,'FAR','¿Cuál es un riesgo?',['Obsolescencia de inventario','Prestar servicio','Utilizar oficina','Tener empleados'],0),
q(10,'FAR','Dos empresas con funciones diferentes pueden requerir remuneraciones diferentes aunque vendan el mismo producto.',['Verdadero','Falso'],0),
q(11,'Métodos','CUP compara principalmente:',['Precios o contraprestaciones de operaciones comparables','Margen neto','Retorno sobre activos únicamente','Utilidad residual'],0),
q(12,'Métodos','RPM suele ser conceptualmente relevante cuando:',['Un distribuidor revende bienes sin agregar valor sustancial','Se analiza un préstamo','Ambas partes poseen intangibles únicos','Se valora una garantía financiera'],0),
q(13,'Métodos','Cost Plus parte de:',['Costo más margen','Precio de reventa menos margen','Utilidad residual','Tasa libre de riesgo'],0),
q(14,'Métodos','TNMM analiza:',['Exclusivamente el precio unitario','Margen neto respecto de una base apropiada','Únicamente contratos','Sólo intangibles'],1),
q(15,'Métodos','Profit Split puede ser relevante cuando:',['Ambas partes realizan contribuciones únicas y valiosas','Existe una transacción simple con CUP confiable','No hay información de ninguna clase','Siempre que haya pérdidas'],0),
q(16,'Métodos','El método más apropiado se selecciona automáticamente por tipo de operación.',['Verdadero','Falso'],1),
q(17,'Comparabilidad','Un comparable interno es:',['Una empresa del mismo grupo','Una operación similar entre una de las partes y un tercero independiente','Cualquier competidor','Un contrato histórico interno'],1),
q(18,'Comparabilidad','Un comparable externo proviene de:',['Operaciones o empresas independientes externas a las partes','Únicamente una subsidiaria hermana','Información interna confidencial','Cualquier sociedad del grupo'],0),
q(19,'Comparabilidad','El mismo código de industria garantiza comparabilidad.',['Verdadero','Falso'],1),
q(20,'Comparabilidad','¿Cuál NO es un factor de comparabilidad?',['Características del bien o servicio','FAR','Términos contractuales','Color corporativo'],3),
q(21,'FAR','Una distribuidora relacionada no posee intangibles, realiza funciones rutinarias y asume riesgos limitados. ¿Qué caracterización parece inicialmente coherente?',['Distribuidor rutinario o de riesgo limitado, sujeto a confirmar hechos','Emprendedor principal','Propietario de intangibles únicos','Prestamista'],0),
q(22,"Arm's Length / delimitación",'El contrato asigna riesgo de inventario a A, pero B decide volúmenes, controla compras y absorbe pérdidas por obsolescencia. ¿Qué debe revisarse?',['Sólo la firma del contrato','Quién controla y soporta económicamente el riesgo','El tamaño de A','La antigüedad del contrato'],1),
q(23,'Comparabilidad','Mismo producto se vende a relacionada y a tercero en el mismo mercado, pero el tercero compra 50% más volumen. ¿Qué debe analizarse?',['Nada: el producto es idéntico','Impacto del volumen y otras diferencias comerciales','Sólo el país','Sólo la moneda'],1),
q(24,'Comparabilidad','Una venta a tercero del mismo producto siempre es un CUP perfecto.',['Verdadero','Falso'],1),
q(25,'Métodos','Una empresa de servicios administrativos rutinarios podría analizarse conceptualmente mediante:',['Cost Plus o TNMM, dependiendo de hechos y comparabilidad','Profit Split necesariamente','Sólo CUP','Ningún método'],0),
q(26,'Fundamentos','¿Qué afirmación es correcta sobre las Directrices OCDE?',['Sustituyen la legislación local','Son un marco internacional de referencia cuya aplicación debe contrastarse con la norma local','Son una plantilla de estudio','Sólo sirven para empresas europeas'],1),
q(27,'Comparabilidad','La comparabilidad exige identidad absoluta.',['Verdadero','Falso'],1),
q(28,'Comparabilidad','Un ajuste de comparabilidad puede ser apropiado cuando:',['Una diferencia material puede ajustarse de forma confiable','Queremos aumentar artificialmente la muestra','Existe cualquier diferencia','Faltan hechos'],0),
q(29,'Comparabilidad','Si un ajuste depende de supuestos muy débiles:',['Siempre debe aplicarse','Puede reducir la confiabilidad','Mejora necesariamente el análisis','Sustituye FAR'],1),
q(30,'FAR','Un distribuidor que desarrolla marca propia puede no ser comparable con uno rutinario principalmente por diferencias en:',['FAR','Únicamente tamaño','Sólo país','Nada relevante'],0),
q(31,"Arm's Length / delimitación",'Manufacturas del Bajío: el contrato asigna inventario a la relacionada, pero Manufacturas decide niveles, recompras y absorbe obsolescencia; además hay una venta a tercero con plazos y volúmenes distintos. ¿Qué dos áreas revisar primero?',['Control del riesgo y comparabilidad de la venta a tercero','Sólo el método y la mediana','Únicamente el contrato','Sólo el tamaño del grupo'],0),
q(32,'FAR','¿Qué debe producir un buen FAR?',['Una lista larga de funciones','Una explicación económica de cómo las partes contribuyen a la operación','Un rango intercuartil','Una tasa de impuesto'],1),
q(33,'FAR','El hecho de que una entidad tenga activos en su balance significa automáticamente que todos son económicamente relevantes para la transacción.',['Verdadero','Falso'],1),
q(34,'FAR','¿Cuál es la mejor pregunta al revisar un riesgo?',['¿Quién aparece en el organigrama?','¿Quién controla decisiones y tiene capacidad financiera relacionada con el riesgo?','¿Qué entidad es más grande?','¿Qué contrato es más reciente?'],1),
q(35,'Métodos','La selección de método debe considerar:',['Naturaleza de la operación','Disponibilidad de información','Comparabilidad','Todas las anteriores'],3),
q(36,'FAR','Una empresa con intangibles únicos y valiosos puede requerir un análisis distinto de una entidad rutinaria.',['Verdadero','Falso'],0),
q(37,'Comparabilidad','Dos operaciones idénticas en producto pero distintas en mercado pueden no ser comparables directamente.',['Verdadero','Falso'],0),
q(38,'Fundamentos','Si no existen hechos suficientes, la respuesta profesional correcta puede ser:',['Inventar un supuesto','Pedir información adicional','Elegir TNMM','Aceptar el contrato sin revisión'],1),
q(39,'Fundamentos','El objetivo del nivel Junior es:',['Formar un Senior completo','Dominar fundamentos y lenguaje técnico suficiente para avanzar a aplicación','Enseñar legislación de todos los países','Enseñar gestión de equipos'],1),
q(40,"Arm's Length / delimitación",'Una entidad relacionada presta servicios contables rutinarios usando personal propio y sin intangibles únicos. ¿Qué debe hacer primero antes de pensar en método?',['Confirmar operación, funciones, activos, riesgos, términos y condiciones relevantes','Elegir Cost Plus automáticamente','Calcular el rango','Buscar empresas'],0),
];
export function publicQuestion(question: JuniorQuestion) { return { id: question.id, domain: question.domain, prompt: question.prompt, options: question.options }; }
export function shuffle<T>(items: T[]) { const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; }
export function makeAttempt() { return shuffle(juniorDomains.flatMap((domain)=>shuffle(bank.filter((q)=>q.domain===domain)).slice(0,distribution[domain]))); }
