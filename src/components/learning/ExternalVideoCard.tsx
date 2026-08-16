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
    <article className="feature-card external-video-card" aria-label={`Video: ${title}`}>
      <span>{eyebrow.toUpperCase()}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {meta && <p className="microcopy">{meta}</p>}
      <a className="button primary" href={href} target="_blank" rel="noreferrer" onClick={onOpen}>{ctaLabel}</a>
    </article>
  );
}
