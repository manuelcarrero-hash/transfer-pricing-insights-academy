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
  return (
    <img
      className={className}
      src={LOGO_URLS[variant]}
      alt={alt}
      decoding="async"
      loading={variant === 'isotype' ? 'eager' : 'lazy'}
      fetchPriority={variant === 'isotype' ? 'high' : 'auto'}
      referrerPolicy={variant === 'principal' ? 'no-referrer' : undefined}
    />
  );
}
