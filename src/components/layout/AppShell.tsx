import { useRef, type PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AcademyLogo } from '../brand/AcademyLogo';

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

const podcastUrl = 'https://open.spotify.com/search/Precios%20de%20Transferencia%3A%20The%20VIP%20Access';

type NavigationLinksProps = { onNavigate?: () => void };

function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return <>{activeNavItems.map(([label, to]) => <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>{label}</NavLink>)}</>;
}

export function AppShell({ children }: PropsWithChildren) {
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const closeMobileNav = () => mobileNavRef.current?.removeAttribute('open');

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <header className="site-header polished-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Transfer Pricing Insights Academy — Inicio" onClick={closeMobileNav}>
            <AcademyLogo className="brand-logo" variant="isotype" alt="" />
            <span className="brand-copy"><strong>Transfer Pricing Insights</strong><span>Academy</span></span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal"><NavigationLinks /></nav>
          <details className="mobile-nav" ref={mobileNavRef}>
            <summary aria-label="Abrir navegación">Menú</summary>
            <nav className="mobile-nav-panel" aria-label="Navegación móvil"><NavigationLinks onNavigate={closeMobileNav} /></nav>
          </details>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>{children}</main>

      <footer className="site-footer polished-footer">
        <div className="container footer-grid">
          <section className="footer-brand-block" aria-label="Transfer Pricing Insights Academy">
            <div className="footer-brand-lockup"><AcademyLogo className="footer-isotype" variant="isotype" alt="" /><div><strong>Transfer Pricing Insights</strong><span>Academy</span></div></div>
            <p>Conocimiento. Criterio. Impacto.</p>
            <p className="footer-muted">Formación abierta y estructurada en Precios de Transferencia.</p>
          </section>

          <nav className="footer-column" aria-label="Navegación del sitio">
            <strong>Academy</strong><Link to="/">Inicio</Link><Link to="/path">Mi Ruta</Link><Link to="/start">Comenzar</Link><Link to="/resources">Recursos</Link>
          </nav>

          <section className="footer-column">
            <strong>Proyecto</strong>
            <Link to="/autor">Sobre el autor</Link>
            <a href="https://mx.linkedin.com/in/manuel-carrero-rojo-937118113" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://manuelcarrerorojo.substack.com/" target="_blank" rel="noopener noreferrer">Transfer Pricing Insights</a>
            <a href={podcastUrl} target="_blank" rel="noopener noreferrer">Podcast · The VIP Access</a>
          </section>

          <section className="footer-support footer-column">
            <strong>Apoya la Academy</strong>
            <p className="footer-muted">Si este proyecto te resulta útil, puedes apoyarlo voluntariamente.</p>
            <div className="footer-support-options" aria-label="Opciones de apoyo voluntario">
              {supportOptions.map(({ amount, url }) => <a key={amount} className="footer-support-button" href={url} target="_blank" rel="noopener noreferrer">{amount}</a>)}
            </div>
          </section>
        </div>

        <div className="container footer-bottom">
          <p>Transfer Pricing Insights Academy · Creada por <Link to="/autor">Manuel Carrero Rojo</Link>.</p>
          <p>El apoyo voluntario no compra acceso, beneficios ni certificaciones.</p>
        </div>
      </footer>
    </div>
  );
}
