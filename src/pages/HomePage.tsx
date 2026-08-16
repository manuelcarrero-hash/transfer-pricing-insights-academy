import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const welcomeVideoId = '1yJEKxVnUAz2VdrCXIPhhNwZ70E0Pb-YB';
const welcomePreviewUrl = `https://drive.google.com/file/d/${welcomeVideoId}/preview`;
const welcomeViewUrl = `https://drive.google.com/file/d/${welcomeVideoId}/view`;
const welcomeSeenKey = 'tpia-welcome-video-seen-v1';

export function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      setShowWelcome(window.localStorage.getItem(welcomeSeenKey) !== 'true');
    } catch {
      setShowWelcome(false);
    }
  }, []);

  const dismissWelcome = () => {
    try { window.localStorage.setItem(welcomeSeenKey, 'true'); } catch { /* local storage may be unavailable */ }
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && (
        <aside className="welcome-invite" aria-label="Video de bienvenida">
          <div>
            <span className="eyebrow">Primera visita</span>
            <strong>Bienvenido a Transfer Pricing Insights Academy</strong>
            <p>Conoce en unos minutos qué encontrarás aquí y cómo aprovechar tu ruta de aprendizaje.</p>
          </div>
          <a className="button primary" href="#welcome-video" onClick={dismissWelcome}>Ver bienvenida</a>
          <button className="welcome-dismiss" type="button" onClick={dismissWelcome} aria-label="Cerrar invitación">×</button>
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

      <section className="section welcome-video-section" id="welcome-video">
        <div className="container narrow">
          <div className="eyebrow">Conoce la Academy</div>
          <h2>Bienvenido a Transfer Pricing Insights Academy</h2>
          <p>Antes de comenzar, conoce el propósito de la plataforma, la lógica de la ruta y cómo aprovechar sus recursos de aprendizaje.</p>
          <div className="video-frame">
            <iframe src={welcomePreviewUrl} title="Bienvenida a Transfer Pricing Insights Academy" allow="autoplay; fullscreen" allowFullScreen loading="lazy" />
          </div>
          <p className="video-fallback">Si el reproductor no funciona en tu navegador, <a href={welcomeViewUrl} target="_blank" rel="noreferrer">abre el video en Google Drive</a>.</p>
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
