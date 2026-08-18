type AcademyLogoProps = {
  variant?: 'isotype' | 'principal';
  className?: string;
  alt?: string;
};

const LOGO_URLS = {
  // Keep the UI logo self-hosted so header/footer branding does not depend on
  // Google Drive thumbnail permissions, redirects or hot-link behaviour.
  isotype: '/brand/tpia-isotype.svg',
  principal: 'https://drive.google.com/thumbnail?id=1cSIHlR0JkaRZA2AYmvSl2m8kJh1O55GZ&sz=w1200',
} as const;

export function AcademyLogo({ variant = 'isotype', className = '', alt = '' }: AcademyLogoProps) {
  if (variant === 'isotype') {
    return (
      <span className={`academy-logo-crop ${className}`.trim()} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <img className="academy-logo-source" src={LOGO_URLS.isotype} alt="" decoding="async" loading="eager" fetchPriority="high" />
      </span>
    );
  }

  return (
    <img
      className={className}
      src={LOGO_URLS.principal}
      alt={alt}
      decoding="async"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
