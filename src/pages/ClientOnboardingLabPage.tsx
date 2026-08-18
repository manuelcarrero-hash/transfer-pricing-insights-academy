import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tp-client-onboarding-lab-v1';

const phases = [
  {
    id: 'request',
    title: '1. Preparación de la solicitud de información',
    prompt: 'Prioriza la información que puede modificar la delimitación, caracterización, selección de método o confiabilidad del análisis. Pedir “todo” no es el objetivo.',
    checks: [
      'Estructura corporativa y control',
      'Partes relacionadas y jurisdicciones',
      'Modelo de negocio y líneas de producto',
      'Cadena de suministro y cadena de valor',
      'Clientes, canales y mercados',
      'Proveedores y compras',
      'Contratos y acuerdos intercompañía',
      'Detalle de operaciones por contraparte y naturaleza',
      'Funciones por entidad',
      'Activos tangibles e intangibles utilizados',
      'Riesgos relevantes y evidencia de control',
      'Estados financieros, balanza y auxiliares',
      'Segmentación financiera por operación o línea relevante',
      'Conciliación entre contabilidad, estados financieros y operaciones relacionadas',
      'Comparables internos potenciales',
    ],
  },
  {
    id: 'interview',
    title: '2. Entrevista simulada',
    prompt: 'Convierte respuestas generales del Controller en hechos verificables. Formula preguntas sobre quién decide, ejecuta, controla y soporta las consecuencias económicas.',
    checks: [
      'Quién desarrolla especificaciones técnicas y mejoras de proceso',
      'Quién decide precios y condiciones con terceros y relacionadas',
      'Quién controla inventarios, capacidad y compras extraordinarias',
      'Quién negocia con proveedores y clientes clave',
      'Quién procesa y soporta garantías, defectos y obsolescencia',
      'Cómo se determinan regalías, servicios y condiciones del préstamo intragrupo',
    ],
  },
  {
    id: 'evidence',
    title: '3. Matriz de hechos y evidencia',
    prompt: 'Clasifica cada afirmación antes de usarla en el análisis. Una declaración del entrevistado no equivale automáticamente a un hecho probado.',
    checks: [
      'A. Hecho confirmado con evidencia',
      'B. Declaración del entrevistado pendiente de soporte',
      'C. Inferencia razonable que requiere validación',
      'D. Información faltante',
    ],
  },
  {
    id: 'operations',
    title: '4. Mapa de operaciones',
    prompt: 'Separa las familias de operaciones de Nortek Industrial México antes de seleccionar métodos o agregar resultados.',
    checks: [
      'Venta de producto terminado a relacionada',
      'Compra de materias primas a relacionada',
      'Regalías por marca y know-how',
      'Servicios intragrupo',
      'Financiamiento intragrupo',
    ],
  },
  {
    id: 'far',
    title: '5. Entrevista de profundización FAR',
    prompt: 'Investiga control del riesgo y capacidad real de decisión. No concluyas por etiquetas contractuales o por quién registra el efecto contable.',
    checks: [
      'Quién puede detener producción ante problemas de calidad',
      'Quién decide niveles de inventario y compras extraordinarias',
      'Quién aprueba proveedores nuevos',
      'Quién fija o negocia precios con terceros y relacionadas',
      'Qué ocurre económicamente cuando un producto queda obsoleto',
      'Quién decide aceptar reclamaciones de garantía y quién absorbe el costo',
      'Qué mejoras de proceso desarrolla NIM y quién decide explotarlas',
    ],
  },
  {
    id: 'financial',
    title: '6. Trazabilidad financiera',
    prompt: 'Reconcilia la ruta Estados financieros → balanza → auxiliares → contraparte → tipo de operación → base utilizada en el análisis.',
    checks: [
      'Conciliar la base contable de regalías con el 2.5% contractual aplicable',
      'Separar categorías y drivers dentro de la factura de servicios',
      'Distinguir saldo promedio y saldo de cierre del préstamo',
      'Resolver la segmentación de costo de ventas entre terceros y relacionadas',
    ],
  },
  {
    id: 'redflags',
    title: '7. Red flags',
    prompt: 'Identifica dónde la evidencia disponible todavía impide una conclusión confiable.',
    checks: [
      'Contrato y conducta potencialmente inconsistentes',
      'Posible mejora de proceso o intangible desarrollado localmente',
      'Riesgos descritos sin evidencia suficiente de control',
      'Base de regalía que requiere conciliación',
      'Benefit test y allocation keys insuficientemente documentados',
      'Falta de análisis de creditworthiness contemporáneo',
      'Segmentación financiera insuficiente para ciertas pruebas',
      'Comparables internos potenciales que deben investigarse antes de externos',
    ],
  },
  {
    id: 'memo',
    title: '8. Client Technical Intake Memo',
    prompt: 'Prepara el expediente para revisión sin adelantar una conclusión arm’s length ni elegir definitivamente un método.',
    checks: [
      'Descripción preliminar del negocio y mapa de partes relacionadas',
      'Inventario separado de operaciones',
      'FAR preliminar sustentado en evidencia',
      'Hechos confirmados vs. pendientes e inferencias',
      'Información financiera disponible, faltante y próximos pasos priorizados',
    ],
  },
] as const;

type LabState = { completed: string[]; notes: Record<string, string> };
const emptyState: LabState = { completed: [], notes: {} };

export function ClientOnboardingLabPage() {
  const [state, setState] = useState<LabState>(() => {
    if (typeof window === 'undefined') return emptyState;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : emptyState;
    } catch {
      return emptyState;
    }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const total = phases.reduce((sum, phase) => sum + phase.checks.length, 0);
  const progress = Math.round((state.completed.length / total) * 100);
  const done = state.completed.length === total;
  const completedSet = useMemo(() => new Set(state.completed), [state.completed]);

  function toggle(key: string) {
    setState(current => ({
      ...current,
      completed: current.completed.includes(key)
        ? current.completed.filter(item => item !== key)
        : [...current.completed, key],
    }));
  }

  function setNotes(phaseId: string, value: string) {
    setState(current => ({ ...current, notes: { ...current.notes, [phaseId]: value } }));
  }

  function reset() {
    setState(emptyState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="section assessment-page">
      <div className="container narrow">
        <div className="eyebrow">Laboratorio transversal · Levantamiento de información</div>
        <h1>Client Onboarding Case Lab</h1>
        <p className="lead small">Entrena cómo convertir una solicitud de información y una entrevista con cliente en un expediente técnico de precios de transferencia: hechos, operaciones, FAR, evidencia, información financiera, inconsistencias, vacíos y preguntas de seguimiento.</p>

        <div className="concept-callout">
          <strong>Caso · Nortek Industrial México, S.A. de C.V. (“NIM”)</strong>
          <p>NIM pertenece a un grupo multinacional de componentes industriales. La administración solicita apoyo para preparar su análisis de precios de transferencia. Sólo tienes organigrama legal simplificado, estados financieros, balanza, relación preliminar de partes relacionadas, tres contratos intercompañía, listado contable preliminar y una presentación corporativa. El expediente todavía no explica suficientemente quién toma varias decisiones clave ni si las cifras permiten segmentar las operaciones.</p>
        </div>

        <div className="concept-callout">
          <strong>Regla del laboratorio</strong>
          <p>No inventes hechos, no confundas contrato con conducta y no selecciones un método sobre cifras no reconciliadas. El objetivo es demostrar que sabes reconocer cuándo todavía no existe información suficiente para concluir.</p>
        </div>

        <div className="assessment-progress"><strong>{progress}%</strong><span>{state.completed.length} de {total} verificaciones completadas</span></div>

        {phases.map(phase => (
          <section className="section-block" key={phase.id}>
            <h2>{phase.title}</h2>
            <p>{phase.prompt}</p>
            <div className="concept-callout">
              {phase.checks.map((item, index) => {
                const key = `${phase.id}-${index}`;
                return <label className="assessment-option" key={key}><input type="checkbox" checked={completedSet.has(key)} onChange={() => toggle(key)} /><span>{item}</span></label>;
              })}
            </div>
            <label className="certificate-name-form"><span>Notas de trabajo</span><textarea rows={5} value={state.notes[phase.id] ?? ''} onChange={event => setNotes(phase.id, event.target.value)} placeholder="Registra hechos, evidencia, contradicciones, inferencias y preguntas pendientes…" /></label>
          </section>
        ))}

        <section className="section-block">
          <h2>Criterio de cierre</h2>
          {done ? <div className="concept-callout"><strong>Expediente listo para revisión.</strong><p>Completaste las ocho fases del caso. La solución sobresaliente no es la que formula más preguntas, sino la que reduce incertidumbre relevante, mantiene separadas las operaciones y deja trazabilidad clara entre cada afirmación y su evidencia.</p></div> : <p>Completa las verificaciones pendientes. El criterio sugerido del caso fuente es 80/100; esta versión interactiva funciona como práctica guiada y no sustituye una evaluación formal del memo.</p>}
          <div className="course-actions"><a className="button secondary" href="https://docs.google.com/document/d/1d6VWPIL67U92uiLNnqqPxUVeA1HHTD3LcChla6u_Syc/edit" target="_blank" rel="noreferrer">Abrir toolkit de entrevista</a><button className="button secondary" type="button" onClick={reset}>Reiniciar laboratorio</button></div>
        </section>
      </div>
    </section>
  );
}
