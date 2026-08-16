import { useRef, type PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const activeNavItems = [
  ['Inicio', '/'],
  ['Mi Ruta', '/path'],
  ['Comenzar', '/start'],
  ['Recursos', '/resources'],
] as const;

const PILOT_FEEDBACK_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScPILOT_PLACEHOLDER/viewform';

type NavigationLinksProps = { onNavigate?: () => void };

function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <>
      {activeNavItems.map(([label, to]) => (
        <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          {label}
        </NavLink>
      ))}
    </>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const closeMobileNav = () => mobileNavRef.current?.removeAttribute('open');

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Transfer Pricing Insights Academy — Inicio" onClick={closeMobileNav}>
            <span className="brand-mark" aria-hidden="true">TP</span>
            <span className="brand-copy">
              <strong>Transfer Pricing Insights</strong>
              <span>Academy</span>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Navegación principal">
            <NavigationLinks />
          </nav>

          <details className="mobile-nav" ref={mobileNavRef}>
            <summary aria-label="Abrir navegación">Menú</summary>
            <nav className="mobile-nav-panel" aria-label="Navegación móvil">
              <NavigationLinks onNavigate={closeMobileNav} />
            </nav>
          </details>
        </div>
      </header>
      <aside className="pilot-notice" aria-label="Aviso sobre el progreso">
        <div className="container pilot-notice-inner">
          <span><strong>Piloto RC1.</strong> Tu progreso se guarda únicamente en este navegador. Usa preferentemente el mismo dispositivo y evita borrar los datos del sitio durante la prueba.</span>
        </div>
      </aside>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Transfer Pricing Insights Academy</strong>
            <p>Conocimiento. Criterio. Impacto.</p>
          </div>
          <div className="footer-pilot-actions">
            <a className="footer-feedback" href={PILOT_FEEDBACK_URL} target="_blank" rel="noreferrer">Enviar comentarios del piloto</a>
            <p className="footer-credit">Creada por Manuel Carrero Rojo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
