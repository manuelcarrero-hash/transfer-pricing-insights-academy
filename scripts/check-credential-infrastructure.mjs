import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

const shared = read('functions/_lib/certificates.ts');
const issue = read('functions/api/certificates/issue.ts');
const juniorGrade = read('functions/api/junior/grade.ts');
const certificateApi = read('functions/api/certificates/[id].ts');

for (const credentialType of ['junior-foundations', 'practitioner', 'advanced-practitioner', 'senior-knowledge']) {
  expect(shared.includes(`'${credentialType}'`) || shared.includes(`${credentialType}:`), `Missing canonical credential type: ${credentialType}`);
}

for (const component of ['junior-assessment', 'consultant-assessment', 'consultant-case', 'semi-senior-assessment', 'advanced-case-a', 'advanced-case-b', 'senior-components-ab', 'senior-capstone']) {
  expect(shared.includes(`'${component}'`), `Missing canonical credential component: ${component}`);
}

expect(shared.includes('CREATE TABLE IF NOT EXISTS credential_evidence'), 'Missing common credential_evidence table');
expect(shared.includes('CREATE TABLE IF NOT EXISTS credential_eligibility'), 'Missing common credential_eligibility table');
expect(shared.includes('requiredComponents'), 'Credential definitions must declare required components');
expect(shared.includes('eligibilityPolicy'), 'Credential definitions must declare an eligibility policy');
expect(shared.includes('crypto.getRandomValues'), 'Credential IDs must use cryptographic randomness');
expect(!shared.includes('Math.random('), 'Math.random() is forbidden in shared credential infrastructure');

expect(issue.includes('getCredentialDefinition'), 'Issuance must resolve a shared credential definition');
expect(issue.includes('getCredentialEligibility'), 'Issuance must consume common authoritative eligibility');
expect(issue.includes('prepareCredentialEligibilityIssued'), 'Issuance must mark common eligibility as issued');
expect(issue.includes('JUNIOR_CREDENTIAL_TYPE'), 'Issuance must retain explicit Junior compatibility handling');
expect(issue.includes('findExistingCertificate'), 'Issuance must recover an existing valid credential idempotently');
expect(issue.includes("FROM certificates WHERE attempt_id = ? AND status = 'valid' LIMIT 1"), 'Issuance must look up an existing valid credential by authoritative eligibility');
expect(issue.includes('if (existing) return existingCertificateResponse'), 'Issuance must return an existing valid credential before creating a duplicate');
expect(issue.includes('if (racedExisting) return existingCertificateResponse'), 'Issuance must recover safely from concurrent duplicate issuance races');
expect(issue.includes('validateTurnstile(context.env.TURNSTILE_SECRET_KEY'), 'Turnstile validation must remain mandatory');
expect(!issue.includes("VALUES (?, ?, 'JF'"), 'Issuance must not hardcode Junior certificate metadata');
expect(!issue.includes('Math.random('), 'Math.random() is forbidden in certificate issuance');

expect(juniorGrade.includes('prepareCredentialEvidenceUpsert'), 'Junior grading must populate common component evidence');
expect(juniorGrade.includes('prepareCredentialEligibilityUpsert'), 'Junior grading must populate common authoritative eligibility');
expect(certificateApi.includes('credentialTypeFromLevelCode'), 'Certificate API must expose canonical credentialType');

const verifyFiles = fs.readdirSync(path.join(root, 'functions/verify')).filter((name) => name.endsWith('.ts')).sort();
expect(verifyFiles.length === 1 && verifyFiles[0] === '[id].ts', 'Public verification must remain a single /verify/:id function');

const backendCredentialFiles = [
  'functions/_lib/certificates.ts',
  'functions/api/certificates/issue.ts',
  'functions/api/certificates/[id].ts',
  'functions/api/junior/grade.ts',
];
for (const file of backendCredentialFiles) {
  expect(!read(file).includes('localStorage'), `${file} must not trust localStorage`);
}

if (errors.length) {
  console.error('P1-B0 credential infrastructure integrity check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('P1-B0 credential infrastructure integrity check passed.');
