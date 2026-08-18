type AcademyLogoProps = {
  variant?: 'isotype' | 'principal';
  className?: string;
  alt?: string;
};

const LOGO_URLS = {
  isotype: 'https://drive.google.com/thumbnail?id=15ucfM3HyNPTZweCfAcZcOaJdsTbDyml_&sz=w256',
  principal: 'https://drive.google.com/thumbnail?id=1cSIHlR0JkaRZA2AYmvSl2m8kJh1O55GZ&sz=w1200',
} as const;

export function AcademyLogo({ variant = 'isotype', className = '', alt = '' }: AcademyLogoProps) {
  return (
    <img
      className={className}
      src={LOGO_URLS[variant]}
      alt={alt}
      decoding="async"
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
}
