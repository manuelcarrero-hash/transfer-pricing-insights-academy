import { useMemo, useState } from 'react';
import { ExternalVideoCard } from '../components/learning/ExternalVideoCard';
import { getAllActiveVideos } from '../content/media/videoCurriculum';

type ResourceCategory = 'OCDE' | 'Guías' | 'Libro' | 'Datasets' | 'Labs' | 'Toolkits' | 'Videos';
type ResourceLevel = 'Todos' | 'Junior' | 'Consultant' | 'Semi Senior' | 'Senior';

type LibraryResource = {
  id: string;
  category: Exclude<ResourceCategory, 'Videos'>;
  level: ResourceLevel;
  type: string;
  title: string;
  description: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  featured?: boolean;
};

const resources: LibraryResource[] = [
  { id:'oecd-es', category:'OCDE', level:'Todos', type:'Fuente primaria', title:'Directrices OCDE 2022 · Español', description:'Versión de referencia para el estudio doctrinal y la consulta durante los cursos.', href:'https://drive.google.com/file/d/1JuCWOxPq6EGJ8Ig9EwkWLGhrflk038dY/view', featured:true },
  { id:'oecd-en', category:'OCDE', level:'Todos', type:'Fuente primaria', title:'OECD Transfer Pricing Guidelines 2022 · English', description:'Versión en inglés para terminología técnica y contraste de conceptos.', href:'https://drive.google.com/file/d/1h7eGKum0AUO9b4s0ik0IV3QaIF4SO12K/view' },
  { id:'book', category:'Libro', level:'Todos', type:'Lectura complementaria', title:'Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica', description:'Libro de Manuel Carrero Rojo como apoyo conceptual y práctico a lo largo de la ruta.', href:'https://drive.google.com/file/d/1v1looWIL4AKXPPpExQOv5EOc1EOgxR6Q/view', featured:true },
  { id:'junior-integral', category:'Guías', level:'Junior', type:'Guía de nivel', title:'Junior Foundations — Guía de Estudio Integral', description:'Repaso consolidado de J1–J5 con respuestas razonadas para preparar la evaluación acumulativa.', href:'https://drive.google.com/file/d/1Ql2l3w-6GRXRe2MMH_zKuqqW5qpXMB0N/view', featured:true },
  { id:'consultant-integral', category:'Guías', level:'Consultant', type:'Guía de nivel', title:'Transfer Pricing Practitioner — Guía de Estudio Integral', description:'Repaso acumulativo C1–C7, reglas críticas, preguntas razonadas y caso Manufacturas del Bajío.', href:'https://drive.google.com/file/d/1FO80dvP1i5fK6Js84Af7L2SQ8rVPkH0Z/view', featured:true },
  { id:'c1', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C1 — Guía de Estudio y Delimitación Precisa', description:'Checklist, matrices, laboratorios, caso integrador y respuestas razonadas.', href:'https://drive.google.com/file/d/1tFw3e-JdF5-DjoZ-KObypnP_RcFB__H0/view' },
  { id:'c2', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C2 — Guía de Selección del Método Más Apropiado', description:'Matriz de decisión, tested party, laboratorios, Manufacturas del Bajío y respuestas razonadas.', href:'https://drive.google.com/file/d/1qb92K3YLjRv59VOBWqPMwequnU9zK8zs/view' },
  { id:'c3', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C3 — Guía de Estudio TNMM / MTUO', description:'Fórmulas, tested party, PLI, segmentación, ejercicios resueltos y respuestas razonadas.', href:'https://drive.google.com/file/d/11dUq4UqLOWaorKhtmSOluu4POr_7qvyG/view' },
  { id:'c4', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C4 — Guía de Comparabilidad y Búsqueda de Comparables', description:'Nueve pasos, criterios, filtros, Accept/Reject/Review y checklist reproducible.', href:'https://drive.google.com/file/d/1vKY_WKRww62pn4FCJoqfcVNysWHYSKkb/view' },
  { id:'c5', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C5 — Guía de Ajustes de Comparabilidad', description:'Materialidad, capital de trabajo, PP&E, volumen, cuándo no ajustar y respuestas razonadas.', href:'https://drive.google.com/file/d/1baUjdizfdfCC0YhVvmLmqGE0oRpbC9-n/view' },
  { id:'c6', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C6 — Guía del Rango de Plena Competencia', description:'Rango completo, cuartiles, mediana, outliers, laboratorios y respuestas razonadas.', href:'https://drive.google.com/file/d/1q1G4zUnNCPBvTdCqmAPppb6gQAH3v2pb/view' },
  { id:'c7', category:'Guías', level:'Consultant', type:'Guía de curso', title:'C7 — Guía de Documentación de Precios de Transferencia', description:'EPT, Local File, Master File, CbC Report, Fase 11 y respuestas razonadas.', href:'https://drive.google.com/file/d/1yyzN_emA2ebR5LMsnlcD4ARJgO02sekM/view' },
  { id:'c3-dataset', category:'Datasets', level:'Consultant', type:'Dataset didáctico', title:'C3 — Dataset TNMM / MTUO v1.0', description:'Datos de práctica para Operating Margin, Mark-up on Costs, Berry Ratio, ROA y segmentación.', href:'https://docs.google.com/spreadsheets/d/1_1KV_MMz3Ia-3E9KVM7gJS9KhaRod90pXsgjMceL_OY/export?format=xlsx' },
  { id:'c4-dataset', category:'Datasets', level:'Consultant', type:'Dataset didáctico', title:'C4 — Dataset Accept / Reject Comparables v1.0', description:'Comparables ficticios para practicar filtros, análisis funcional y decisiones Accept/Reject con documentación de motivos.', href:'https://docs.google.com/spreadsheets/d/1IKMvH2vzzhecVmnH3vmx3JndqEM_r3ZogomE8Iq9pAw/export?format=xlsx' },
  { id:'transaction-labs', category:'Labs', level:'Todos', type:'Biblioteca práctica', title:'Transaction Labs Library v1.1', description:'Quince escenarios de operaciones controladas para practicar delimitación, FAR, selección de método y razonamiento antes de calcular.', href:'https://docs.google.com/document/d/1G7JHrbk88ZHc-5bM_gGJn2bIj6uMkC21SRrsJzXBZ6A/export?format=pdf' },
  { id:'client-toolkit', category:'Toolkits', level:'Todos', type:'Herramienta de trabajo', title:'Client Information Gathering & Interview Toolkit v1.0', description:'Guía transversal para solicitar información, entrevistar al cliente, documentar sustancia económica y reconciliar evidencia.', href:'https://docs.google.com/document/d/1d6VWPIL67U92uiLNnqqPxUVeA1HHTD3LcChla6u_Syc/export?format=pdf', featured:true },
  { id:'client-onboarding-lab', category:'Labs', level:'Todos', type:'Laboratorio interactivo', title:'Client Onboarding Case Lab v1.0', description:'Experiencia guiada para convertir solicitud, entrevista y evidencia en un expediente técnico con hechos, FAR, vacíos e inconsistencias. Incluye una versión PDF de distribución y conserva la experiencia interactiva dentro de la Academy.', href:'https://docs.google.com/document/d/1qEyC8XFGlwBZCy-k4M4Qye5oOiM3VMgp9r5DrSrlpVw/export?format=pdf', secondaryHref:'/labs/client-onboarding', secondaryLabel:'Abrir versión interactiva', featured:true },
  { id:'ss1', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS1 — Guía de Estudio Servicios Intragrupo', description:'Benefit test, shareholder activities, duplicidad, allocation keys, cost base, low-value services y respuestas razonadas.', href:'https://drive.google.com/file/d/1TZCCsv4Nt9haMgH-rvzu6w-s203DudI1/view' },
  { id:'ss2', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS2 — Guía de Estudio Activos Intangibles', description:'Propiedad legal vs. retornos, DEMPE conceptual, licencia/transferencia, métodos, HTVI, laboratorios y Fase 13.', href:'https://drive.google.com/file/d/1tqga90WpxOiFECau4AMGmww1Qb5PSPcc/view' },
  { id:'ss3', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS3 — Guía de Estudio DEMPE', description:'Development, Enhancement, Maintenance, Protection, Exploitation, control del riesgo, financiamiento, laboratorios y Fase 14.', href:'https://drive.google.com/file/d/1EejgsPK4CFUjmMFnPOQYkX6VhDWnkUiE/view' },
  { id:'ss4', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS4 — Guía de Estudio Operaciones Financieras I: Préstamos', description:'Delimitación financiera, borrower/lender, creditworthiness, CUP financiero, spread, garantías y Fase 15.', href:'https://drive.google.com/file/d/1XmvD9eqAWhdsB644k8q5cbjIXa_TQ1Cs/view' },
  { id:'ss5', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS5 — Guía de Estudio Operaciones Financieras II', description:'Garantías, implicit support, cash pooling, hedging, captive insurance, laboratorios y Fase 16.', href:'https://drive.google.com/file/d/1eb5GpkeacZeqC69mEThR9paDRWGIxSBE/view' },
  { id:'ss6', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS6 — Guía de Estudio Reestructuraciones Empresariales', description:'FAR antes/después, transferencias de valor, profit potential, opciones realistamente disponibles, compensación, laboratorios y Fase 17.', href:'https://drive.google.com/file/d/1pQf96x6HyeWavQW1nCpuc9tKDM6yaEMo/view' },
  { id:'ss7', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS7 — Guía de Estudio Cost Contribution Arrangements', description:'Participantes, expected benefits, contribuciones, balancing payments, buy-in/buy-out, laboratorios y Fase 18.', href:'https://drive.google.com/file/d/1q_RXNQQQiQx25ud3mDCfVbv4gFE22fyJ/view' },
  { id:'ss8', category:'Guías', level:'Semi Senior', type:'Guía de curso', title:'SS8 — Guía de Estudio Introducción a Controversias de TP', description:'Primary/corresponding adjustments, doble imposición, MAP, APA, auditoría, documentación, laboratorios y Fase 19.', href:'https://drive.google.com/file/d/1k3Zb3TO-2pRfcgtDkbOKzVQoK5uDE4h6/view' },
  { id:'ss-integral', category:'Guías', level:'Semi Senior', type:'Guía de nivel', title:'Advanced Transfer Pricing Practitioner — Guía Integral', description:'Repaso SS1–SS8, cadena integrada para casos, autoevaluación con respuestas razonadas y checklist para el cierre acumulativo.', href:'https://drive.google.com/file/d/1piYwILWyWDkMYswmPdrNd0ZPuFB06x_A/view', featured:true },
  { id:'senior-integral', category:'Guías', level:'Senior', type:'Guía de nivel', title:'Senior-Level Transfer Pricing Knowledge — Guía Integral', description:'Repaso S1–S7, review profesional, juicio, checklist del Capstone, autoevaluación razonada y matriz de triage.', href:'https://drive.google.com/file/d/1nbfKjsZqBpNznzWLBNsjmcVUvdD_7W_0/view', featured:true },
  { id:'s1', category:'Guías', level:'Senior', type:'Guía de curso', title:'S1 — Advanced Functional Analysis', description:'Review FAR, control del riesgo, contradicciones, consistencia vertical/horizontal, laboratorios y Fase 19.', href:'https://drive.google.com/file/d/1zq9yAMCqrjbhQqhJG81XqLOLVpjhpM9x/view' },
  { id:'s2', category:'Guías', level:'Senior', type:'Guía de curso', title:'S2 — Advanced Method Selection', description:'Confiabilidad relativa, calidad de datos, tested party, PLI, matriz de decisión, casos plausibles y Fase 20.', href:'https://drive.google.com/file/d/1OlWfu1UjqU4oiwWflXJYIfDtdAJXmag8/view' },
  { id:'s3', category:'Guías', level:'Senior', type:'Guía de curso', title:'S3 — Advanced Comparability', description:'Comparables imperfectos, pérdidas, información multianual, ajustes, criterios de rechazo y Fase 21.', href:'https://drive.google.com/file/d/1wia-mDtrxSotg-Ruyfrdr2X4UEs2baew/view' },
  { id:'s4', category:'Guías', level:'Senior', type:'Guía de curso', title:'S4 — Integrated Transfer Pricing Analysis', description:'Arquitectura integrada, evidencia, FAR, método, tested party/PLI, comparabilidad, rango, laboratorios y Fase 22.', href:'https://drive.google.com/file/d/10Ud1hWiQV7VaN_4OnhtLdIzGgwext1wo/view' },
  { id:'s5', category:'Guías', level:'Senior', type:'Guía de curso', title:'S5 — Case Law & Transfer Pricing Reasoning', description:'Lectura jurisprudencial, controversia, posiciones, reasoning, valor persuasivo, estado procesal, laboratorios y Fase 23.', href:'https://drive.google.com/file/d/1R9JYRBhFJXKcwf9zCfKLmPQeb8jKtmiB/view' },
  { id:'s6', category:'Guías', level:'Senior', type:'Guía de curso', title:'S6 — Challenging a Transfer Pricing Position', description:'Red flags, FAR/delimitación, método, PLI, comparables, ajustes, triage, remediación y Fase 24.', href:'https://drive.google.com/file/d/1Zgv7UgPnlg0CN6KOARN1pOLIf-u73fqy/view' },
  { id:'s7', category:'Guías', level:'Senior', type:'Guía de curso', title:'S7 — Professional Judgment', description:'Hechos, supuestos, inferencias, límites, certeza, consistencia narrativa, documentación de juicio y Fase 25.', href:'https://drive.google.com/file/d/12d6lNSo-r6i7zrBNZxh_xuB7Rj-1hrsS/view' },
];

const categories: Array<'Todos' | ResourceCategory> = ['Todos', 'OCDE', 'Guías', 'Libro', 'Datasets', 'Labs', 'Toolkits', 'Videos'];
const levels: ResourceLevel[] = ['Todos', 'Junior', 'Consultant', 'Semi Senior', 'Senior'];

function resourceActionLabel(resource: LibraryResource) {
  if (resource.category === 'Guías') return 'Descargar guía';
  if (resource.category === 'Libro') return 'Abrir libro';
  if (resource.category === 'Datasets') return 'Descargar dataset';
  if (resource.category === 'Labs') return 'Descargar laboratorio';
  if (resource.category === 'Toolkits') return 'Descargar toolkit';
  return 'Abrir recurso';
}

function ResourceActions({ resource }: { resource: LibraryResource }) {
  return <div className="library-resource-actions">
    <a className="button secondary" href={resource.href} target="_blank" rel="noreferrer">{resourceActionLabel(resource)}</a>
    {resource.secondaryHref && resource.secondaryLabel ? <a className="button secondary" href={resource.secondaryHref}>{resource.secondaryLabel}</a> : null}
  </div>;
}

export function ResourcesExtendedPage(){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<(typeof categories)[number]>('Todos');
  const [level,setLevel]=useState<ResourceLevel>('Todos');
  const videos=getAllActiveVideos().filter(video=>video.category==='oecd' && video.href);
  const normalized=query.trim().toLocaleLowerCase('es');
  const visibleResources=useMemo(()=>resources.filter(resource=>{
    const matchesCategory=category==='Todos'||resource.category===category;
    const matchesLevel=level==='Todos'||resource.level==='Todos'||resource.level===level;
    const haystack=`${resource.type} ${resource.title} ${resource.description} ${resource.level}`.toLocaleLowerCase('es');
    return matchesCategory&&matchesLevel&&(!normalized||haystack.includes(normalized));
  }),[category,level,normalized]);
  const showVideos=(category==='Todos'||category==='Videos')&&level==='Todos'&&(!normalized||videos.some(video=>`${video.title} ${video.description}`.toLocaleLowerCase('es').includes(normalized)));
  const featured=resources.filter(resource=>resource.featured).slice(0,3);
  const totalVisible=visibleResources.length+(showVideos?videos.filter(video=>!normalized||`${video.title} ${video.description}`.toLocaleLowerCase('es').includes(normalized)).length:0);

  return <section className="section resources-page library-page"><div className="container library-container">
    <header className="library-hero"><div className="eyebrow">Biblioteca</div><h1>Recursos para estudiar con criterio.</h1><p className="lead small">Fuentes primarias, guías de estudio, datasets, laboratorios, toolkits y videos doctrinales organizados para encontrar rápido lo que necesitas en cada etapa de la ruta.</p></header>

    <section className="library-featured" aria-labelledby="featured-resources-title"><div className="library-section-heading"><div><span className="eyebrow">Selección esencial</span><h2 id="featured-resources-title">Empieza por aquí.</h2></div><p>Las referencias que acompañan toda la ruta académica.</p></div><div className="library-featured-grid">{featured.map(resource=><article className="library-featured-card" key={resource.id}><span className="material-type">{resource.type}</span><h3>{resource.title}</h3><p>{resource.description}</p><ResourceActions resource={resource} /></article>)}</div></section>

    <section className="library-browser" aria-labelledby="library-browser-title"><div className="library-section-heading"><div><span className="eyebrow">Explorar biblioteca</span><h2 id="library-browser-title">Encuentra un recurso.</h2></div><p><strong>{totalVisible}</strong> recursos visibles</p></div>
      <div className="library-controls">
        <label className="library-search"><span>Buscar</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar por tema, curso o concepto…" /></label>
        <div className="library-filter-group" aria-label="Filtrar por tipo"><span>Tipo</span><div className="library-filter-row">{categories.map(item=><button type="button" className={category===item?'library-filter active':'library-filter'} aria-pressed={category===item} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div></div>
        <div className="library-filter-group" aria-label="Filtrar por nivel"><span>Nivel</span><div className="library-filter-row">{levels.map(item=><button type="button" className={level===item?'library-filter active':'library-filter'} aria-pressed={level===item} onClick={()=>setLevel(item)} key={item}>{item}</button>)}</div></div>
      </div>

      {totalVisible===0?<div className="library-empty"><h3>No encontramos coincidencias.</h3><p>Prueba otro término o restablece los filtros.</p><button className="button secondary" type="button" onClick={()=>{setQuery('');setCategory('Todos');setLevel('Todos')}}>Ver todos los recursos</button></div>:<>
        <div className="library-list">{visibleResources.map(resource=><article className="library-row" key={resource.id}><div className="library-row-meta"><span>{resource.category}</span><small>{resource.level}</small></div><div className="library-row-copy"><span className="material-type">{resource.type}</span><h3>{resource.title}</h3><p>{resource.description}</p></div><ResourceActions resource={resource} /></article>)}</div>
        {showVideos&&<section className="library-video-section"><div className="library-section-heading compact"><div><span className="eyebrow">Videoteca OCDE</span><h2>Los diez capítulos, disponibles en cualquier momento.</h2></div></div><div className="resource-video-grid">{videos.filter(video=>!normalized||`${video.title} ${video.description}`.toLocaleLowerCase('es').includes(normalized)).map(video=><ExternalVideoCard key={video.id} eyebrow="Video doctrinal" title={video.title} description={video.description} href={video.href!} sourceLabel="Google Drive"/>)}</div></section>}
      </>}
    </section>
  </div></section>;
}