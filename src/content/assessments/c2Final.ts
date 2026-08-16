export type C2Question={id:number;prompt:string;options:string[];correctIndex:number;feedback:string};
const q=(id:number,prompt:string,options:string[],correctIndex:number,feedback:string):C2Question=>({id,prompt,options,correctIndex,feedback});
export const c2FinalBank:C2Question[]=[
q(1,'La selección del método comienza principalmente con:',['La base de datos disponible','La naturaleza de la operación delimitada','El método usado el año anterior','El resultado deseado'],1,'La delimitación y el FAR preceden a la selección.'),
q(2,'Si un método puede calcularse, necesariamente es el más apropiado.',['Verdadero','Falso'],1,'Aplicabilidad no equivale a mayor apropiación.'),
q(3,'Un comparable interno es automáticamente confiable.',['Verdadero','Falso'],1,'También requiere análisis de comparabilidad.'),
q(4,'¿Qué puede hacer menos confiable un CUP?',['Diferencias materiales no ajustables','Existencia de contrato','Usar moneda','Ser operación de bienes'],0,'CUP es sensible a diferencias materiales.'),
q(5,'La tested party suele ser:',['La matriz','La más grande','La parte a la que el método puede aplicarse con mayor confiabilidad, frecuentemente la menos compleja','Siempre el vendedor'],2,'La selección es funcional y metodológica.'),
q(6,'“Menos compleja” significa menor tamaño.',['Verdadero','Falso'],1,'Menor complejidad es una conclusión funcional.'),
q(7,'Si el margen bruto comparable es inconsistente pero el margen operativo es confiable, ¿qué método puede ganar confiabilidad relativa?',['TNMM','RPM necesariamente','CUP necesariamente','Ninguno'],0,'La calidad de datos operativos puede favorecer TNMM.'),
q(8,'Profit Split puede ser especialmente relevante cuando:',['Sólo una parte es rutinaria','Ambas aportan contribuciones únicas y valiosas y existe integración relevante','Siempre hay pérdidas','No hay contrato'],1,'Las contribuciones únicas y la integración son hechos relevantes.'),
q(9,'¿Debe elegirse TNMM porque es común en la práctica?',['Sí','No'],1,'La frecuencia de uso no sustituye el análisis.'),
q(10,'La disponibilidad de datos afecta principalmente:',['Sólo documentación','La confiabilidad de aplicación del método','La relación entre partes','La existencia de la operación'],1,'Un método necesita información capaz de sostener su aplicación.'),
q(11,'Un método conceptualmente atractivo con datos deficientes puede ser menos confiable que una alternativa.',['Verdadero','Falso'],0,'Concepto y calidad de datos deben evaluarse conjuntamente.'),
q(12,'¿Qué debe analizarse antes de elegir tested party?',['FAR','Logotipo','Número de empleados solamente','Jurisdicción solamente'],0,'La parte analizada se selecciona a partir del perfil funcional.'),
q(13,'Si existe un CUP interno altamente comparable, debe ignorarse porque existen datos TNMM.',['Verdadero','Falso'],1,'Una comparación directa confiable merece atención prioritaria.'),
q(14,'Una diferencia material puede ser aceptable si:',['Se ignora','No afecta comparabilidad o puede ajustarse razonablemente','Beneficia el resultado','Existe contrato'],1,'La diferencia debe no ser material o poder tratarse confiablemente.'),
q(15,'La selección del método y comparabilidad son procesos totalmente independientes.',['Verdadero','Falso'],1,'La confiabilidad del método depende de la comparación que permite.'),
q(16,'Un fabricante rutinario obliga siempre a Cost Plus.',['Verdadero','Falso'],1,'La caracterización orienta, pero no determina automáticamente el método.'),
q(17,'Un distribuidor rutinario obliga siempre a RPM.',['Verdadero','Falso'],1,'Debe compararse la confiabilidad de alternativas y datos.'),
q(18,'¿Cuál es una justificación insuficiente?',['“TNMM es el más usado”','Explicar FAR','Comparar alternativas','Explicar datos'],0,'La popularidad no es argumento técnico.'),
q(19,'¿Cuál es una fortaleza potencial de CUP?',['Comparación directa de la condición de precio','Elimina comparabilidad','No necesita datos','Siempre tolera diferencias'],0,'CUP puede observar directamente la condición examinada.'),
q(20,'¿Qué debe hacerse con métodos alternativos relevantes?',['Ocultarlos','Considerarlos y explicar fortalezas y limitaciones','Calcular todos obligatoriamente','Descartarlos por nombre'],1,'La justificación debe mostrar por qué una alternativa ofrece mayor confiabilidad.'),
q(21,'En métodos unilaterales, la parte analizada debe seleccionarse antes de comprender FAR.',['Verdadero','Falso'],1,'FAR precede a la selección de tested party.'),
q(22,'Dos métodos igualmente calculables son necesariamente igualmente confiables.',['Verdadero','Falso'],1,'La confiabilidad depende de hechos, comparabilidad y datos.'),
q(23,'Puede escogerse retrospectivamente el método que produzca el resultado más favorable.',['Verdadero','Falso'],1,'El resultado no debe dirigir retrospectivamente la metodología.'),
q(24,'La consistencia contable puede ser relevante al comparar márgenes.',['Verdadero','Falso'],0,'Diferencias contables pueden afectar la comparabilidad de márgenes.'),
q(25,'Si ambas partes aportan intangibles únicos, un enfoque unilateral puede requerir mayor escrutinio.',['Verdadero','Falso'],0,'Contribuciones únicas pueden debilitar la lógica unilateral.'),
q(26,'¿Qué sigue después de seleccionar provisionalmente TNMM?',['Terminar el análisis','Seleccionar PLI y desarrollar comparabilidad','Asumir la mediana','Emitir certificado'],1,'C2 conduce a la aplicación concreta de TNMM en C3.'),
q(27,'Misma mercancía, independiente y relacionada, términos casi idénticos y flete cuantificable. Primera alternativa a investigar:',['TNMM','CUP interno','Profit Split','RPM'],1,'El comparable interno directo merece investigación prioritaria.'),
q(28,'Distribuidor rutinario, sin CUP fiable, margen bruto inconsistente y margen operativo comparable fiable. Alternativa razonable:',['CUP','RPM','TNMM','Profit Split'],2,'Los datos netos confiables pueden hacer TNMM relativamente más robusto.'),
q(29,'Dos entidades con intangibles únicos e integración profunda, sin comparables fiables de contribuciones separadas. Método a considerar:',['Cost Plus','RPM','Profit Split','CUP'],2,'Profit Split merece consideración por las contribuciones únicas e integración.'),
q(30,'¿Qué combinación pertenece a una buena justificación de método?',['Operación/FAR, alternativas, información/comparabilidad y razón de confiabilidad','Sólo nombre del método','Resultado deseado y benchmark','Método usado por la firma y tamaño de la entidad'],0,'La justificación debe permitir reconstruir el razonamiento técnico.')
];
export const C2_ATTEMPT_SIZE=12;
export const C2_PASS_SCORE=80;
