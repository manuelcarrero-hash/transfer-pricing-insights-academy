import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const welcomeVideoView = 'https://drive.google.com/file/d/1yJEKxVnUAz2VdrCXIPhhNwZ70E0Pb-YB/view?usp=sharing';
const welcomeSeenKey = 'tpia-welcome-video-seen-v1';

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
    rememberWelcome();
    window.open(welcomeVideoView, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {showWelcome && (
        <aside className="welcome-banner" aria-label="Primera visita">
          <div className="container welcome-banner-inner">
            <div className="welcome-banner-copy">
              <span className="eyebrow">Primera visita</span>
              <strong>Bienvenido a Transfer Pricing Insights Academy</strong>
              <span>Conoce en unos minutos qué encontrarás aquí y cómo aprovechar tu ruta de aprendizaje.</span>
            </div>
            <div className="welcome-banner-actions">
              <button className="button primary" type="button" onClick={openWelcomeVideo}>Ver bienvenida ↗</button>
              <button className="welcome-dismiss" type="button" onClick={rememberWelcome} aria-label="Cerrar bienvenida">×</button>
            </div>
          </div>
        </aside>
      )}

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Formación gratuita en Precios de Transferencia</div>
            <h1>Aprende Precios de Transferencia desde cero.</h1>
            <p className="lead">Una ruta estructurada para desarrollar conocimiento técnico y criterio profesional, con las Directrices de la OCDE como columna vertebral académica.</p>
            <div className="button-row"><Link className="button primary" to="/start">Empezar desde cero</Link></div>
            <p className="microcopy">Gratis. Sin tarjeta. Puedes comenzar sin crear una cuenta.</p>
          </div>
          <aside className="hero-panel" aria-label="Ruta académica">
            <div className="route-step current"><span>01</span><div><strong>Junior</strong><small>Fundamentos y lenguaje técnico</small></div></div>
            <div className="route-step"><span>02</span><div><strong>Consultor</strong><small>Aplicación y metodología</small></div></div>
            <div className="route-step"><span>03</span><div><strong>Semi Senior</strong><small>Análisis avanzado</small></div></div>
            <div className="route-step"><span>04</span><div><strong>Senior Knowledge</strong><small>Criterio y juicio profesional</small></div></div>
          </aside>
        </div>
      </section>

      <section className="section welcome-video-section" id="bienvenida">
        <div className="container narrow">
          <div className="eyebrow">Empieza aquí</div>
          <h2>Bienvenido a Transfer Pricing Insights Academy</h2>
          <p>Antes de comenzar, conoce el propósito de la plataforma, la lógica de la ruta y cómo aprovechar sus recursos de aprendizaje.</p>

          <article className="feature-card" aria-label="Video de bienvenida">
            <span>VIDEO DE BIENVENIDA</span>
            <h3>Conoce la Academy antes de empezar</h3>
            <p>Una introducción breve a la plataforma, su propósito y la forma recomendada de recorrer tu ruta de aprendizaje.</p>
            <p className="microcopy">Video complementario · Se abre en Google Drive</p>
            <a className="button primary" href={welcomeVideoView} target="_blank" rel="noreferrer" onClick={rememberWelcome}>Ver video de bienvenida ↗</a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <div className="eyebrow">Cómo funciona</div>
          <h2>Aprender primero. Demostrar después.</h2>
          <p>El contenido académico es abierto y el avance básico puede guardarse localmente sin cuenta. La identidad se reserva para sincronizar progreso entre dispositivos, presentar evaluaciones certificables y emitir credenciales verificables.</p>
          <div className="feature-grid">
            <article className="feature-card"><span>01</span><h3>Comprende</h3><p>Conceptos explicados desde cero y conectados con hechos económicos reales.</p></article>
            <article className="feature-card"><span>02</span><h3>Aplica</h3><p>Ejemplos y ejercicios para desarrollar disciplina de análisis, no sólo memoria.</p></article>
            <article className="feature-card"><span>03</span><h3>Demuestra</h3><p>Las credenciales acreditan conocimiento evaluado; nunca experiencia profesional o rango laboral.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
