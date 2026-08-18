import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoCurriculum } from '../content/media/videoCurriculum';

const welcomeSeenKey = 'tpia-welcome-video-seen-v1';
const welcomeVideo = videoCurriculum.find((video) => video.id === 'welcome-academy');

const authoritySignals = [
  ['27', 'cursos'],
  ['4', 'niveles'],
  ['4', 'evaluaciones acumulativas'],
  ['OCDE', 'como columna vertebral'],
] as const;

export function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      setShowWelcome(localStorage.getItem(welcomeSeenKey) !== '1');
    } catch {
      setShowWelcome(false);
    }
  }, []);

  const rememberWelcome = () => {
    try { localStorage.setItem(welcomeSeenKey, '1'); } catch { /* local storage is optional */ }
    setShowWelcome(false);
  };

  const openWelcomeVideo = () => {
    if (!welcomeVideo?.href) return;
    rememberWelcome();
    window.open(welcomeVideo.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {showWelcome && (
        <aside className="welcome-banner" aria-label="Primera visita">
          <div className="container welcome-banner-inner">
            <div className="welcome-banner-copy">
              <span className="eyebrow">Primera visita</span>
              <strong>Conoce la Academy en unos minutos</strong>
              <span>Una breve bienvenida para entender la ruta, el progreso y cómo aprovechar los recursos.</span>
            </div>
            <div className="welcome-banner-actions">
              <button className="button primary" type="button" onClick={openWelcomeVideo}>Ver bienvenida ↗</button>
              <button className="welcome-dismiss" type="button" onClick={rememberWelcome} aria-label="Cerrar bienvenida">×</button>
            </div>
          </div>
        </aside>
      )}

      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Academia abierta de Precios de Transferencia</div>
            <h1>Aprende Precios de Transferencia desde cero.</h1>
            <p className="lead">Una ruta estructurada para desarrollar conocimiento técnico y criterio profesional, con las Directrices de la OCDE como columna vertebral académica.</p>
            <div className="button-row">
              <Link className="button primary" to="/start">Comenzar mi ruta</Link>
              <a className="button secondary" href="#programa">Explorar el programa</a>
            </div>
            <p className="hero-trustline">Acceso abierto · Ruta estructurada · Evaluaciones por nivel · Sin cuenta obligatoria</p>
          </div>

          <aside className="hero-panel route-map" aria-label="Ruta académica" id="programa">
            <div className="route-map-heading">
              <span>Ruta académica</span>
              <strong>De fundamentos a criterio profesional</strong>
            </div>
            <div className="route-step current"><span>01</span><div><strong>Junior</strong><small>Fundamentos y lenguaje técnico</small></div></div>
            <div className="route-step"><span>02</span><div><strong>Consultant</strong><small>Aplicación y metodología</small></div></div>
            <div className="route-step"><span>03</span><div><strong>Semi Senior</strong><small>Análisis avanzado</small></div></div>
            <div className="route-step"><span>04</span><div><strong>Senior Knowledge</strong><small>Criterio y juicio profesional</small></div></div>
          </aside>
        </div>
      </section>

      <section className="authority-strip" aria-label="Alcance de la Academy">
        <div className="container authority-grid">
          {authoritySignals.map(([value, label]) => (
            <div className="authority-item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section home-method-section">
        <div className="container narrow">
          <div className="eyebrow">Cómo funciona</div>
          <h2>Aprender primero. Demostrar después.</h2>
          <p className="home-section-lead">El contenido académico es abierto y el avance se guarda localmente en este navegador, sin necesidad de cuenta. Las evaluaciones y certificados forman parte de la misma ruta de aprendizaje y están diseñados para acreditar conocimiento evaluado, no experiencia profesional.</p>
          <div className="feature-grid home-feature-grid">
            <article className="feature-card"><span>01</span><h3>Comprende</h3><p>Conceptos explicados desde cero y conectados con hechos económicos reales.</p></article>
            <article className="feature-card"><span>02</span><h3>Aplica</h3><p>Ejemplos y ejercicios para desarrollar disciplina de análisis, no sólo memoria.</p></article>
            <article className="feature-card"><span>03</span><h3>Demuestra</h3><p>Evaluaciones acumulativas y certificados que acreditan conocimiento dentro de la Academy.</p></article>
          </div>
        </div>
      </section>

      <section className="home-closing-section">
        <div className="container home-closing-inner">
          <div>
            <span className="eyebrow">Empieza a tu ritmo</span>
            <h2>Una ruta seria, abierta y diseñada para avanzar con criterio.</h2>
          </div>
          <Link className="button primary" to="/start">Elegir punto de entrada</Link>
        </div>
      </section>
    </>
  );
}
