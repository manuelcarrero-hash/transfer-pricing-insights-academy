import { useRef, type PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const activeNavItems = [
  ['Inicio', '/'],
  ['Mi Ruta', '/path'],
  ['Comenzar', '/start'],
  ['Recursos', '/resources'],
] as const;

const supportOptions = [
  { amount: '$100 MXN', url: 'https://buy.stripe.com/aFabIT6gKaPa0TNdMq18c09' },
  { amount: '$200 MXN', url: 'https://buy.stripe.com/bJe9ALdJc4qMcCv0ZE18c0a' },
  { amount: '$500 MXN', url: 'https://buy.stripe.com/cNi4grdJccXi9qj4bQ18c0b' },
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
      <aside aria-label="Aviso sobre el progreso" style={{ background: '#f7f1e6', borderBottom: '1px solid #dbc9a7' }}>
        <div className="container" style={{ paddingBlock: '10px', color: '#26384d', fontSize: '.88rem', lineHeight: 1.45 }}>
          <strong>Piloto RC1.</strong> Tu progreso se guarda únicamente en este navegador. Usa preferentemente el mismo dispositivo y evita borrar los datos del sitio durante la prueba.
        </div>
      </aside>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Transfer Pricing Insights Academy</strong>
            <p>Conocimiento. Criterio. Impacto.</p>
            <p><a href="/autor">Sobre el autor — Manuel Carrero Rojo</a></p>
            <div className="footer-support">
              <strong>Apoya voluntariamente la Academy</strong>
              <div className="footer-support-options" aria-label="Opciones de apoyo voluntario">
                {supportOptions.map(({ amount, url }) => (
                  <a key={amount} className="footer-support-button" href={url} target="_blank" rel="noopener noreferrer">
                    {amount}
                  </a>
                ))}
              </div>
              <p className="footer-support-note">
                El apoyo es completamente voluntario. No constituye la compra de un producto o servicio, no otorga beneficios adicionales y no es una donación deducible para efectos fiscales.
              </p>
            </div>
          </div>
          <p className="footer-credit">Creada por <a href="/autor">Manuel Carrero Rojo</a>.</p>
        </div>
      </footer>
    </div>
  );
}
