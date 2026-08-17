import { ensureSchema, type CertificateRecord, type Env } from '../_lib/certificates';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char] ?? char));
}

function page(title: string, body: string, status = 200) {
  return new Response(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} · Transfer Pricing Insights Academy</title><style>body{margin:0;background:#f5f7fa;color:#17324d;font:16px/1.6 system-ui,-apple-system,sans-serif}.wrap{max-width:760px;margin:0 auto;padding:48px 20px}.card{background:#fff;border:1px solid #dbe3ea;border-radius:18px;padding:32px;box-shadow:0 10px 30px #17324d12}.eyebrow{font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;color:#8a6b2d;font-weight:700}h1{font-size:2.2rem;line-height:1.15;margin:.5rem 0 1rem}.valid{color:#176b43}.invalid{color:#9b2c2c}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;margin:24px 0}.grid p{margin:0}.notice{font-size:.9rem;color:#536579;border-top:1px solid #e3e8ed;padding-top:20px}a{color:#17324d;font-weight:700}@media(max-width:620px){.grid{grid-template-columns:1fr}.card{padding:24px}h1{font-size:1.8rem}}</style></head><body><main class="wrap">${body}</main></body></html>`, { status, headers: { 'content-type':'text/html; charset=utf-8', 'cache-control':'no-store' } });
}

export async function onRequestGet(context: { env: Env; params: { id?: string } }) {
  const db = context.env.CERTIFICATES_DB;
  await ensureSchema(db);
  const id = context.params.id?.trim() ?? '';
  if (!id) return page('Credencial no encontrada', '<div class="card"><div class="eyebrow">Verificación de credencial</div><h1 class="invalid">Credencial no encontrada</h1><p>Falta un identificador válido.</p></div>', 404);

  const record = await db.prepare(`SELECT certificate_id, participant_name, level_code, level_name, issued_at, curriculum_version, assessment_score, status, attempt_id FROM certificates WHERE certificate_id = ?`)
    .bind(id).first<CertificateRecord>();
  if (!record) return page('Credencial no encontrada', `<div class="card"><div class="eyebrow">Verificación de credencial</div><h1 class="invalid">Credencial no encontrada</h1><p>El identificador <strong>${escapeHtml(id)}</strong> no existe en el registro oficial de Transfer Pricing Insights Academy.</p><p><a href="/">Ir a la Academy</a></p></div>`, 404);

  const date = new Intl.DateTimeFormat('es-MX', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(record.issued_at));
  const valid = record.status === 'valid';
  return page(valid ? 'Credencial válida' : 'Credencial revocada', `<div class="card"><div class="eyebrow">Transfer Pricing Insights Academy · Verificación</div><h1 class="${valid ? 'valid' : 'invalid'}">${valid ? '✓ Credencial válida' : 'Credencial revocada'}</h1><p>Este registro proviene directamente del registro oficial de la Academy.</p><div class="grid"><p><strong>Participante</strong><br>${escapeHtml(record.participant_name)}</p><p><strong>Credencial</strong><br>${escapeHtml(record.level_name)}</p><p><strong>Fecha de emisión</strong><br>${escapeHtml(date)}</p><p><strong>ID de verificación</strong><br>${escapeHtml(record.certificate_id)}</p><p><strong>Versión curricular</strong><br>${escapeHtml(record.curriculum_version)}</p><p><strong>Resultado de evaluación</strong><br>${record.assessment_score}%</p></div><p class="notice">Esta credencial reconoce conocimiento y desempeño demostrado dentro del entorno de aprendizaje de Transfer Pricing Insights Academy. No acredita experiencia profesional, licencia profesional, certificación regulatoria ni acreditación académica oficial.</p><p><a href="/">Ir a Transfer Pricing Insights Academy</a></p></div>`);
}
