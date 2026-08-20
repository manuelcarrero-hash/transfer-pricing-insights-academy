import fs from 'node:fs';

const issue = fs.readFileSync('functions/api/certificates/issue.ts', 'utf8');

const required = [
  'async function findExistingCertificate',
  "FROM certificates WHERE attempt_id = ? AND status = 'valid' LIMIT 1",
  'if (existing) return existingCertificateResponse',
  'if (legacyExisting) return existingCertificateResponse',
  'if (eligibilityExisting) return existingCertificateResponse',
  'if (racedExisting) return existingCertificateResponse',
  'existing: true',
];

for (const token of required) {
  if (!issue.includes(token)) throw new Error(`Missing idempotent issuance guard: ${token}`);
}

if (!issue.includes('validateTurnstile(context.env.TURNSTILE_SECRET_KEY')) {
  throw new Error('Turnstile validation must remain mandatory before credential recovery/issuance.');
}

console.log('P1-B0 idempotent issuance guard passed.');
