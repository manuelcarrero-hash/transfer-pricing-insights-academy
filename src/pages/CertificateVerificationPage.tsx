import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

export function CertificateVerificationPage() {
  const { id = '' } = useParams();
  const [record, setRecord] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setNotFound(false);
    fetch(`/api/certificates/${encodeURIComponent(id)}`, { headers: { accept: 'application/json' } })
      .then(async (response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error('verification_failed');
        return response.json() as Promise<CertificateRecord>;
      })
      .then((data) => { if (!cancelled) { setRecord(data); setNotFound(!data); } })
      .catch(() => { if (!cancelled) setRecord(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <section className="section"><div className="container narrow"><div className="eyebrow">Verificación de credencial</div><h1>Verificando…</h1><p className="lead small">Consultando el registro oficial de Transfer Pricing Insights Academy.</p></div></section>;
  if (!record) return <section className="section"><div className="container narrow"><div className="eyebrow">Verificación de credencial</div><h1>{notFound ? 'Credencial no encontrada' : 'No fue posible verificar ahora'}</h1><p className="lead small">{notFound ? 'El identificador no existe en el registro oficial de la Academy.' : 'Intenta nuevamente más tarde.'}</p><Link className="button secondary" to="/">Ir a la Academy</Link></div></section>;

  const issuedAt = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(record.issuedAt));
  return <section className="section"><div className="container narrow"><div className="eyebrow">Verificación de credencial</div><h1>{record.valid ? 'Credencial válida' : 'Credencial revocada'}</h1><p className="lead small">Este registro proviene directamente de Transfer Pricing Insights Academy.</p><div className="card"><p><strong>Participante:</strong> {record.participantName}</p><p><strong>Credencial:</strong> {record.levelName}</p><p><strong>Fecha de emisión:</strong> {issuedAt}</p><p><strong>ID de verificación:</strong> {record.certificateId}</p><p><strong>Versión curricular:</strong> {record.curriculumVersion}</p><p><strong>Resultado de evaluación:</strong> {record.assessmentScore}%</p><p><strong>Estado:</strong> {record.status === 'valid' ? 'Válida' : 'Revocada'}</p></div><p className="lead small">La credencial reconoce conocimiento y desempeño demostrado dentro del entorno de aprendizaje de la Academy. No acredita experiencia profesional, licencia profesional ni acreditación académica oficial.</p><Link className="button secondary" to="/">Ir a la Academy</Link></div></section>;
}
