type ExternalVideoCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  durationLabel?: string;
  sourceLabel?: string;
  ctaLabel?: string;
  onOpen?: () => void;
};

export function ExternalVideoCard({
  eyebrow = 'Video recomendado',
  title,
  description,
  href,
  durationLabel,
  sourceLabel = 'Se abre en Google Drive',
  ctaLabel = 'Ver video ↗',
  onOpen,
}: ExternalVideoCardProps) {
  const meta = [durationLabel, sourceLabel].filter(Boolean).join(' · ');

  return (
    <article className="external-video-card" aria-label={`Video: ${title}`}>
      <div className="external-video-icon" aria-hidden="true">▶</div>
      <div className="external-video-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        {meta && <p className="external-video-meta">{meta}</p>}
        <a className="button primary" href={href} target="_blank" rel="noreferrer" onClick={onOpen}>{ctaLabel}</a>
      </div>
    </article>
  );
}
