import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const activeNavItems = [
  ['Inicio', '/'],
  ['Mi Ruta', '/path'],
  ['Cursos', '/courses/j1'],
  ['Recursos', '/resources'],
] as const;

const futureNavItems = ['Practicar', 'Certificaciones'] as const;

function NavigationLinks() {
  return (
    <>
      {activeNavItems.map(([label, to]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          {label}
        </NavLink>
      ))}
      {futureNavItems.map((label) => (
        <span key={label} className="nav-link nav-disabled" aria-disabled="true" title="Disponible en una fase posterior">
          {label}
        </span>
      ))}
    </>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Transfer Pricing Insights Academy — Inicio">
            <span className="brand-mark" aria-hidden="true">TP</span>
            <span className="brand-copy">
              <strong>Transfer Pricing Insights</strong>
              <span>Academy</span>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Navegación principal">
            <NavigationLinks />
          </nav>

          <details className="mobile-nav">
            <summary aria-label="Abrir navegación">Menú</summary>
            <nav className="mobile-nav-panel" aria-label="Navegación móvil">
              <NavigationLinks />
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
