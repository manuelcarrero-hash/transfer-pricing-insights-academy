import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type CertificateRecord = {
  valid: boolean;
  certificateId: string;
  participantName: string;
  levelName: string;
  issuedAt: string;
  curriculumVersion: string;
  assessmentScore: number;
  status: string;
};

const PUBLIC_ORIGIN = 'https://transfer-pricing-insights-academy.pages.dev';

export function JuniorCertificatePage() {
  const [searchParams] = useSearchParams();
  const certificateId = searchParams.get('id')?.trim() ?? '';
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(certificateId));

  useEffect(() => {
    if (!certificateId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/certificates/${encodeURIComponent(certificateId)}`, { headers: { accept: 'application/json' } })
      .then(async (response) => response.ok ? response.json() as Promise<CertificateRecord> : null)
      .then((record) => { if (!cancelled) setCertificate(record); })
      .catch(() => { if (!cancelled) setCertificate(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [certificateId]);

  if (loading) return <section className="section"><div className="container narrow"><h1>Validando certificado…</h1><p className="lead small">Consultando el registro oficial de Transfer Pricing Insights Academy.</p></div></section>;
  if (!certificateId || !certificate?.valid) return <section className="section"><div className="container narrow certificate-locked"><div className="eyebrow">Transfer Pricing Junior Foundations</div><h1>Certificado no disponible o no verificable</h1><p className="lead small">Los certificados válidos deben existir en el registro central de la Academy.</p><Link className="button primary" to="/path">Volver a Mi Ruta</Link></div></section>;

  const issuedAt = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(certificate.issuedAt));
  const verificationPath = `/verify/${encodeURIComponent(certificate.certificateId)}`;
  const verificationUrl = `${PUBLIC_ORIGIN}${verificationPath}`;

  return <section className="section certificate-page"><div className="container"><div className="certificate-actions no-print"><Link className="button secondary" to="/path">← Mi Ruta</Link><a className="button secondary" href={verificationUrl}>Verificar credencial</a><button className="button primary" type="button" onClick={() => window.print()}>Imprimir / guardar PDF</button></div><article className="academic-certificate" aria-label="Certificado Transfer Pricing Junior Foundations"><div className="certificate-inner"><header className="certificate-header"><div className="certificate-monogram" aria-hidden="true">TP</div><div><strong>Transfer Pricing Insights Academy</strong><span>Professional Learning · Transfer Pricing</span></div></header><div className="certificate-rule"/><div className="certificate-body"><p className="certificate-kicker">Certificate of Achievement</p><h1>Transfer Pricing<br/>Junior Foundations</h1><p className="certificate-declaration">Se reconoce que</p><p className="certificate-name">{certificate.participantName}</p><p className="certificate-copy">ha aprobado satisfactoriamente la evaluación acumulativa de Transfer Pricing Junior Foundations y ha demostrado dominio de fundamentos de Precios de Transferencia, principio de plena competencia, análisis funcional FAR, métodos y comparabilidad.</p><div className="certificate-seal" aria-hidden="true"><span>TP</span><small>FOUNDATIONS</small></div></div><footer className="certificate-footer"><div className="certificate-signature"><span className="signature-name">Manuel Carrero Rojo</span><span className="signature-line"/><strong>Founder & Academic Author</strong><small>Transfer Pricing Insights Academy</small></div><div className="certificate-meta-block"><strong>{issuedAt}</strong><small>Verification ID · {certificate.certificateId}</small><small>Curriculum {certificate.curriculumVersion} · Score {certificate.assessmentScore}%</small></div></footer><div className="certificate-disclaimer">Este certificado acredita desempeño dentro del entorno de aprendizaje de Transfer Pricing Insights Academy. No representa experiencia profesional, licencia profesional, certificación regulatoria ni acreditación académica oficial. Verificación pública: {verificationUrl}</div></div></article></div></section>;
}
