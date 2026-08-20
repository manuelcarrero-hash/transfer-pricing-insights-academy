import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

const shared = read('functions/_lib/certificates.ts');
const issue = read('functions/api/certificates/issue.ts');
const juniorGrade = read('functions/api/junior/grade.ts');
const practitionerBank = read('functions/_lib/practitionerBank.ts');
const practitionerAttempt = read('functions/api/practitioner/attempt.ts');
const practitionerGrade = read('functions/api/practitioner/grade.ts');
const practitionerCase = read('functions/api/practitioner/case.ts');
const practitionerStatus = read('functions/api/practitioner/status.ts');
const consultantAssessmentPage = read('src/pages/ConsultantAssessmentPage.tsx');
const consultantCasePage = read('src/pages/ConsultantCasePage.tsx');
const practitionerCertificatePage = read('src/pages/PractitionerCertificatePage.tsx');
const consultantClientBank = read('src/content/assessments/consultantCumulative.ts');
const consultantClientCase = read('src/content/assessments/consultantCase.ts');
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
expect(issue.includes('findExistingCertificate'), 'Issuance must recover an existing valid credential idempotently');
expect(issue.includes('validateTurnstile(context.env.TURNSTILE_SECRET_KEY'), 'Turnstile validation must remain mandatory');
expect(!issue.includes('Math.random('), 'Math.random() is forbidden in certificate issuance');

expect(juniorGrade.includes('prepareCredentialEvidenceUpsert'), 'Junior grading must populate common component evidence');
expect(juniorGrade.includes('prepareCredentialEligibilityUpsert'), 'Junior grading must populate common authoritative eligibility');

expect(practitionerBank.includes('correctIndex'), 'Practitioner assessment answer key must exist only in protected server bank');
expect(practitionerBank.includes('correct:number[]'), 'Practitioner case solutions must exist only in protected server bank');
expect(practitionerAttempt.includes('practitioner_assessment_attempts'), 'Practitioner attempts must be persisted server-side');
expect(practitionerAttempt.includes('crypto.getRandomValues'), 'Practitioner question selection must use cryptographic randomness');
expect(practitionerGrade.includes("componentKey:'consultant-assessment'"), 'Practitioner assessment must write authoritative component evidence');
expect(practitionerGrade.includes('prepareCredentialEligibilityUpsert'), 'Practitioner assessment must write common eligibility state');
expect(practitionerCase.includes("componentKey:'consultant-case'"), 'Practitioner case must write authoritative component evidence');
expect(practitionerCase.includes('assessment_not_passed'), 'Practitioner case must require authoritative assessment evidence');
expect(practitionerCase.includes('eligible:passed'), 'Practitioner eligibility must depend on case pass after assessment pass');
expect(practitionerStatus.includes('credential_evidence'), 'Practitioner status must derive from server evidence');

expect(!consultantClientBank.includes('correctIndex'), 'Consultant answer key must not remain in the client bundle');
expect(!consultantClientBank.includes('consultantBank'), 'Consultant master bank must not remain in the client bundle');
expect(!consultantClientCase.includes('correct:'), 'Practitioner case solutions must not remain in the client bundle');
expect(!consultantClientCase.includes('explanation:'), 'Practitioner case master explanations must not remain in the client bundle');
expect(!consultantAssessmentPage.includes('Math.random('), 'Consultant assessment selection must not occur client-side');
expect(consultantAssessmentPage.includes('/api/practitioner/attempt'), 'Consultant assessment UI must request a server attempt');
expect(consultantAssessmentPage.includes('/api/practitioner/grade'), 'Consultant assessment UI must grade on the server');
expect(consultantCasePage.includes('/api/practitioner/case'), 'Practitioner case UI must use the authoritative case API');
expect(consultantCasePage.includes("credentialType:'practitioner'"), 'Practitioner issuance must declare the canonical credential type');
expect(consultantCasePage.includes('TurnstileWidget'), 'Practitioner issuance must require Turnstile');
expect(!consultantCasePage.includes('Math.random('), 'Practitioner certificate IDs must not be generated client-side');
expect(practitionerCertificatePage.includes('/api/certificates/'), 'Practitioner certificate page must consume the central registry');
expect(practitionerCertificatePage.includes('Verificar credencial'), 'Practitioner certificate must expose public verification');
expect(!practitionerCertificatePage.includes('localStorage'), 'Practitioner certificate must not trust localStorage');
expect(!practitionerCertificatePage.includes('Local Certificate ID'), 'Practitioner disclaimer must not describe the credential as local-only');

expect(certificateApi.includes('credentialTypeFromLevelCode'), 'Certificate API must expose canonical credentialType');
const verifyFiles = fs.readdirSync(path.join(root, 'functions/verify')).filter((name) => name.endsWith('.ts')).sort();
expect(verifyFiles.length === 1 && verifyFiles[0] === '[id].ts', 'Public verification must remain a single /verify/:id function');

for (const file of [
  'functions/_lib/certificates.ts','functions/api/certificates/issue.ts','functions/api/certificates/[id].ts','functions/api/junior/grade.ts',
  'functions/api/practitioner/attempt.ts','functions/api/practitioner/grade.ts','functions/api/practitioner/case.ts','functions/api/practitioner/status.ts',
]) {
  expect(!read(file).includes('localStorage'), `${file} must not trust localStorage`);
}

if (errors.length) {
  console.error('Credential infrastructure integrity check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Credential infrastructure integrity check passed through P1-B1 Practitioner.');
