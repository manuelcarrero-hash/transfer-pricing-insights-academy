import { useRef, type PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const activeNavItems = [
  ['Inicio', '/'],
  ['Mi Ruta', '/path'],
  ['Comenzar', '/start'],
  ['Recursos', '/resources'],
] as const;

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
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Transfer Pricing Insights Academy</strong>
            <p>Conocimiento. Criterio. Impacto.</p>
          </div>
          <p className="footer-credit">Creada por Manuel Carrero Rojo.</p>
        </div>
      </footer>
    </div>
  );
}
