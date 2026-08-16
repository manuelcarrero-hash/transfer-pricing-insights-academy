import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const welcomeVideoDirect = 'https://drive.usercontent.google.com/download?id=1yJEKxVnUAz2VdrCXIPhhNwZ70E0Pb-YB&export=download&confirm=t';
const welcomeVideoView = 'https://drive.google.com/file/d/1yJEKxVnUAz2VdrCXIPhhNwZ70E0Pb-YB/view?usp=sharing';
const welcomeSeenKey = 'tpia-welcome-video-seen-v1';

export function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    try {
      setShowWelcome(localStorage.getItem(welcomeSeenKey) !== '1');
    } catch {
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (!showVideoModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowVideoModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showVideoModal]);

  const rememberWelcome = () => {
    try { localStorage.setItem(welcomeSeenKey, '1'); } catch { /* local storage is optional */ }
    setShowWelcome(false);
  };

  const openWelcomeVideo = () => {
    rememberWelcome();
    setShowVideoModal(true);
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
              <button className="button primary" type="button" onClick={openWelcomeVideo}>Ver bienvenida</button>
              <button className="welcome-dismiss" type="button" onClick={rememberWelcome} aria-label="Cerrar bienvenida">×</button>
            </div>
          </div>
        </aside>
      )}

      {showVideoModal && (
        <div className="video-modal-backdrop" role="presentation" onMouseDown={() => setShowVideoModal(false)}>
          <section className="video-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-video-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="video-modal-header">
              <div>
                <span className="eyebrow">Empieza aquí</span>
                <h2 id="welcome-video-title">Bienvenido a Transfer Pricing Insights Academy</h2>
              </div>
              <button className="video-modal-close" type="button" onClick={() => setShowVideoModal(false)} aria-label="Cerrar video">×</button>
            </div>
            <WelcomeVideo />
          </section>
        </div>
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
          <WelcomeVideo />
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

function WelcomeVideo() {
  return (
    <div className="welcome-video-player">
      <video controls playsInline preload="metadata" aria-label="Video de bienvenida a Transfer Pricing Insights Academy">
        <source src={welcomeVideoDirect} type="video/mp4" />
        Tu navegador no puede reproducir este video.
      </video>
      <p className="video-fallback">Si el reproductor no funciona en tu navegador, <a href={welcomeVideoView} target="_blank" rel="noreferrer">abre el video en Google Drive</a>.</p>
    </div>
  );
}
