type AcademyLogoProps = {
  variant?: 'isotype' | 'principal';
  className?: string;
  alt?: string;
};

const PRINCIPAL_LOGO_URL = 'https://drive.google.com/thumbnail?id=1cSIHlR0JkaRZA2AYmvSl2m8kJh1O55GZ&sz=w1200';

export function AcademyLogo({ variant = 'isotype', className = '', alt = '' }: AcademyLogoProps) {
  if (variant === 'isotype') {
    const labelled = Boolean(alt);

    return (
      <svg
        className={className}
        viewBox="0 0 64 64"
        role={labelled ? 'img' : undefined}
        aria-label={labelled ? alt : undefined}
        aria-hidden={labelled ? undefined : true}
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{labelled ? alt : 'Transfer Pricing Insights Academy'}</title>
        <path className="academy-logo-navy" d="M8 10h31v8H27v36h-8V18H8z" />
        <path className="academy-logo-gold" d="M36 18h7.5C52.6 18 58 23.2 58 31s-5.4 13-14.5 13H40v10h-8V18zm4 8v10h3.3c4.3 0 6.7-1.7 6.7-5s-2.4-5-6.7-5z" />
        <circle className="academy-logo-gold" cx="46" cy="13" r="3" />
      </svg>
    );
  }

  return (
    <img
      className={className}
      src={PRINCIPAL_LOGO_URL}
      alt={alt}
      decoding="async"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
