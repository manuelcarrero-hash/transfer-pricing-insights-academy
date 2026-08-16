import { Link } from 'react-router-dom';

const CERTIFICATE_KEY = 'tp-junior-foundations-certificate';

type CertificateRecord = {
  participantName?: string;
  issuedAt?: string;
  certificateId?: string;
};

function getCertificate(): CertificateRecord | null {
  try {
    const raw = localStorage.getItem(CERTIFICATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function JuniorCertificatePage() {
  const certificate = getCertificate();

  if (!certificate) {
    return (
      <section className="section">
        <div className="container narrow certificate-locked">
          <div className="eyebrow">Transfer Pricing Junior Foundations</div>
          <h1>Tu certificado aún no está disponible</h1>
          <p className="lead small">Se habilitará cuando completes los requisitos del nivel Junior y apruebes la evaluación acumulativa.</p>
          <Link className="button primary" to="/path">Volver a Mi Ruta</Link>
        </div>
      </section>
    );
  }

  const participantName = certificate.participantName?.trim() || 'Participante';
  const issuedAt = certificate.issuedAt
    ? new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(certificate.issuedAt))
    : '';
  const certificateId = certificate.certificateId || 'TPIA-JF';

  return (
    <section className="section certificate-page">
      <div className="container">
        <div className="certificate-actions no-print">
          <Link className="button secondary" to="/path">← Mi Ruta</Link>
          <button className="button primary" type="button" onClick={() => window.print()}>Imprimir / guardar PDF</button>
        </div>

        <article className="academic-certificate" aria-label="Certificado Transfer Pricing Junior Foundations">
          <div className="certificate-inner">
            <header className="certificate-header">
              <div className="certificate-monogram" aria-hidden="true">TP</div>
              <div>
                <strong>Transfer Pricing Insights Academy</strong>
                <span>Professional Learning · Transfer Pricing</span>
              </div>
            </header>

            <div className="certificate-rule" />

            <div className="certificate-body">
              <p className="certificate-kicker">Certificate of Completion</p>
              <h1>Transfer Pricing<br />Junior Foundations</h1>
              <p className="certificate-declaration">Se reconoce que</p>
              <p className="certificate-name">{participantName}</p>
              <p className="certificate-copy">ha completado satisfactoriamente la ruta de formación Junior de Transfer Pricing Insights Academy y ha demostrado dominio de los fundamentos de Precios de Transferencia, principio de plena competencia, análisis funcional FAR, métodos y comparabilidad.</p>

              <div className="certificate-seal" aria-hidden="true">
                <span>TP</span>
                <small>FOUNDATIONS</small>
              </div>
            </div>

            <footer className="certificate-footer">
              <div className="certificate-signature">
                <span className="signature-name">Manuel Carrero Rojo</span>
                <span className="signature-line" />
                <strong>Founder & Academic Author</strong>
                <small>Transfer Pricing Insights Academy</small>
              </div>
              <div className="certificate-meta-block">
                <strong>{issuedAt || 'Fecha de emisión'}</strong>
                <small>Certificate ID · {certificateId}</small>
                <small>Completed Successfully</small>
              </div>
            </footer>

            <div className="certificate-disclaimer">Este certificado reconoce la finalización satisfactoria de una ruta de aprendizaje. No representa experiencia profesional, licencia, certificación regulatoria ni acreditación académica oficial.</div>
          </div>
        </article>
      </div>
    </section>
  );
}
