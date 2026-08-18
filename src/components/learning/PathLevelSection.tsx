import type { ReactNode } from 'react';

type PathLevelSectionProps = {
  number: string;
  title: string;
  subtitle: string;
  status: 'complete' | 'current' | 'locked' | 'available';
  summary: string;
  children?: ReactNode;
  defaultOpen?: boolean;
};

const statusLabels = {
  complete: 'Completado',
  current: 'En progreso',
  locked: 'Bloqueado',
  available: 'Disponible',
} as const;

export function PathLevelSection({ number, title, subtitle, status, summary, children, defaultOpen = false }: PathLevelSectionProps) {
  const locked = status === 'locked';

  return (
    <details className={`path-level path-level-${status}`} open={defaultOpen && !locked}>
      <summary className="path-level-summary" aria-disabled={locked || undefined}>
        <span className="path-level-number" aria-hidden="true">{number}</span>
        <span className="path-level-heading">
          <span className="path-level-kicker">{subtitle}</span>
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
        <span className={`path-level-status path-level-status-${status}`}>{statusLabels[status]}</span>
      </summary>
      {!locked && children && <div className="path-level-body">{children}</div>}
    </details>
  );
}
