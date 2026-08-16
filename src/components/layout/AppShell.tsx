import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  ['Inicio', '/'],
  ['Mi Ruta', '/start'],
  ['Cursos', '/courses/j1'],
] as const;

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
            {navItems.map(([label, to]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                {label}
              </NavLink>
            ))}
            <span className="nav-link nav-disabled" aria-disabled="true">Practicar</span>
            <span className="nav-link nav-disabled" aria-disabled="true">Recursos</span>
            <span className="nav-link nav-disabled" aria-disabled="true">Certificaciones</span>
          </nav>
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
