import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tp-client-onboarding-lab-v1';

const phases = [
  {
    id: 'request',
    title: '1. Solicitud priorizada de información',
    prompt: 'Antes de entrevistar al cliente, identifica qué necesitas pedir para entender negocio, operaciones y evidencia disponible.',
    checks: [
      'Estructura corporativa y partes relacionadas relevantes',
      'Descripción del negocio y líneas de producto o servicio',
      'Cadena de suministro y cadena de valor',
      'Clientes, canales, mercados y proveedores principales',
      'Contratos y acuerdos intercompañía relevantes',
      'Estados financieros, balanza e integraciones de operaciones relacionadas',
      'Organigramas, headcount y responsables de decisiones clave',
    ],
  },
  {
    id: 'interview',
    title: '2. Entrevista orientada a hechos',
    prompt: 'Convierte etiquetas y respuestas generales en hechos verificables sobre funciones, activos, riesgos y toma de decisiones.',
    checks: [
      'Quién decide precios, descuentos y condiciones comerciales',
      'Quién controla inventarios y capacidad productiva',
      'Quién negocia con clientes clave y proveedores relevantes',
      'Qué entidad soporta obsolescencia, defectos, garantías y devoluciones',
      'Quién autoriza inversiones y decisiones operativas relevantes',
      'Qué personal tiene capacidad real para controlar los riesgos descritos',
    ],
  },
  {
    id: 'reconcile',
    title: '3. Reconciliación documental',
    prompt: 'Contrasta lo dicho en entrevista con contratos, contabilidad, organigramas y evidencia de ejecución.',
    checks: [
      'Contrato vs. conducta observada',
      'Organigrama vs. personas que realmente deciden',
      'Facturación vs. naturaleza económica de las operaciones',
      'Estados financieros vs. integraciones y segmentación disponibles',
      'Políticas internas vs. procesos efectivamente ejecutados',
    ],
  },
  {
    id: 'record',
    title: '4. Case record técnico',
    prompt: 'Cierra el levantamiento separando hechos confirmados, vacíos, inconsistencias y preguntas de seguimiento.',
    checks: [
      'Mapa de partes y operaciones controladas',
      'FAR preliminar sustentado en evidencia',
      'Riesgos significativos y quién los controla',
      'Información financiera disponible y brechas de segmentación',
      'Inconsistencias que requieren aclaración',
      'Preguntas de seguimiento priorizadas antes de concluir',
    ],
  },
] as const;

type LabState = {
  completed: string[];
  notes: Record<string, string>;
};

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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
        <p className="lead small">
          Practica cómo convertir una solicitud genérica de información y una entrevista con cliente en un expediente técnico de precios de transferencia. El laboratorio evalúa levantamiento técnico, escucha, reconciliación y disciplina de evidencia; no habilidades comerciales.
        </p>

        <div className="concept-callout">
          <strong>Escenario</strong>
          <p>
            Una entidad manufacturera mexicana compra insumos y presta servicios intragrupo, vende parte de su producción a una relacionada y reporta que opera con riesgos limitados. El contrato asigna varias decisiones a la matriz, pero la información inicial es incompleta sobre inventarios, precios, garantías, personal y segmentación financiera. Tu trabajo es construir el expediente antes de emitir conclusiones de TP.
          </p>
        </div>

        <div className="assessment-progress">
          <strong>{progress}%</strong>
          <span>{state.completed.length} de {total} verificaciones completadas</span>
        </div>

        {phases.map(phase => (
          <section className="section-block" key={phase.id}>
            <h2>{phase.title}</h2>
            <p>{phase.prompt}</p>
            <div className="concept-callout">
              {phase.checks.map((item, index) => {
                const key = `${phase.id}-${index}`;
                return (
                  <label className="assessment-option" key={key}>
                    <input type="checkbox" checked={completedSet.has(key)} onChange={() => toggle(key)} />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
            <label className="certificate-name-form">
              <span>Notas de trabajo</span>
              <textarea
                rows={5}
                value={state.notes[phase.id] ?? ''}
                onChange={event => setNotes(phase.id, event.target.value)}
                placeholder="Registra hechos, evidencia, contradicciones y preguntas pendientes…"
              />
            </label>
          </section>
        ))}

        <section className="section-block">
          <h2>Criterio de cierre</h2>
          {done ? (
            <div className="concept-callout">
              <strong>Expediente listo para revisión.</strong>
              <p>
                Completaste las cuatro capas del levantamiento. Antes de concluir una posición de precios de transferencia, revisa tus notas y confirma que cada afirmación material pueda rastrearse a evidencia o quede identificada expresamente como información pendiente.
              </p>
            </div>
          ) : (
            <p>Completa las verificaciones pendientes. El objetivo no es llenar casillas: es evitar que una conclusión técnica descanse en hechos no corroborados.</p>
          )}
          <div className="course-actions">
            <a className="button secondary" href="https://docs.google.com/document/d/1d6VWPIL67U92uiLNnqqPxUVeA1HHTD3LcChla6u_Syc/edit" target="_blank" rel="noreferrer">Abrir toolkit de entrevista</a>
            <button className="button secondary" type="button" onClick={reset}>Reiniciar laboratorio</button>
          </div>
        </section>
      </div>
    </section>
  );
}
