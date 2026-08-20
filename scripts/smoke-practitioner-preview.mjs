const baseUrl = (process.env.PRACTITIONER_PREVIEW_URL || '').replace(/\/$/, '');
if (!baseUrl) throw new Error('PRACTITIONER_PREVIEW_URL is required');

const objectiveAnswers = {
  1:2,2:1,3:0,4:0,5:1,6:0,7:1,
  8:1,9:0,10:0,11:1,12:0,13:1,14:2,
  15:0,16:0,17:1,18:0,19:0,20:0,21:1,22:1,23:2,24:1,
  25:1,26:0,27:1,28:0,29:0,30:0,31:1,
  32:1,33:0,34:0,35:1,36:0,37:0,38:0,
  39:0,40:1,41:0,42:1,43:0,
  44:1,45:0,46:1,47:0,48:1,
};

const caseAnswers = {
  'case-1':[1], 'case-2':[1], 'case-3':[2], 'case-4':[0,1],
  'case-5':[1], 'case-6':[1], 'case-7':[2], 'case-8':[0,1,3],
  'case-9':[1], 'case-10':[1], 'case-11':[0,1,2,3], 'case-12':[1],
};

async function request(path, init = {}, expectedStatuses = [200]) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'content-type':'application/json', ...(init.headers || {}) },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!expectedStatuses.includes(response.status)) {
    throw new Error(`${path} returned ${response.status}: ${text.slice(0, 1000)}`);
  }
  return { status: response.status, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log(`P1-B1 authoritative preview smoke: ${baseUrl}`);

// 1) Create a real server-side attempt. Retry only for preview warm-up/deployment propagation.
let attempt;
for (let i = 1; i <= 12; i += 1) {
  try {
    attempt = await request('/api/practitioner/attempt', { method:'POST', body:'{}' }, [201]);
    break;
  } catch (error) {
    if (i === 12) throw error;
    console.log(`Attempt API not ready (${i}/12); retrying in 10s...`);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
}

const { attemptId, questions } = attempt.body;
assert(typeof attemptId === 'string' && attemptId.startsWith('TPIA-PA-'), 'Invalid practitioner attemptId');
assert(Array.isArray(questions) && questions.length === 24, 'Attempt must contain exactly 24 questions');
assert(questions.every(q => !('correctIndex' in q) && !('feedback' in q)), 'Attempt leaked answer key or feedback');
assert(new Set(questions.map(q => q.id)).size === 24, 'Attempt contains duplicate question IDs');
console.log(`✓ attempt created: ${attemptId}`);

// 2) Grade the exact server-selected questions with the protected answer map.
const selectedAnswers = {};
for (const q of questions) {
  const answer = objectiveAnswers[q.id];
  assert(Number.isInteger(answer), `No protected smoke answer for question ${q.id}`);
  selectedAnswers[String(q.id)] = answer;
}
const grade = await request('/api/practitioner/grade', {
  method:'POST', body:JSON.stringify({ attemptId, answers:selectedAnswers }),
}, [200]);
assert(grade.body.eligibilityId === attemptId, 'Eligibility ID must equal authoritative attempt ID');
assert(grade.body.score === 100 && grade.body.passed === true, `Objective grading failed: ${JSON.stringify(grade.body)}`);
assert(grade.body.passedGlobal === true && grade.body.passedDomains === true, 'Global/domain gates did not pass');
for (const domain of ['C1','C2','C3','C4','C5','C6','C7']) assert(grade.body.domains?.[domain] === 100, `${domain} expected 100`);
console.log('✓ objective assessment graded server-side at 100%');

// 3) Ensure the case is unlocked by authoritative evidence and does not leak solutions.
const caseGet = await request(`/api/practitioner/case?eligibilityId=${encodeURIComponent(attemptId)}`, {}, [200]);
assert(Array.isArray(caseGet.body.questions) && caseGet.body.questions.length === 12, 'Case must expose 12 questions');
assert(caseGet.body.questions.every(q => !('correct' in q) && !('explanation' in q)), 'Case GET leaked solutions');
console.log('✓ case unlocked from server evidence; no solutions leaked');

// 4) Grade the real integrative case.
const caseGrade = await request('/api/practitioner/case', {
  method:'POST', body:JSON.stringify({ eligibilityId:attemptId, answers:caseAnswers }),
}, [200]);
assert(caseGrade.body.score === 100 && caseGrade.body.passed === true, `Case grading failed: ${JSON.stringify(caseGrade.body)}`);
assert(caseGrade.body.credentialEligible === true, 'Case pass did not produce credential eligibility');
console.log('✓ integrative case graded server-side at 100%');

// 5) Read authoritative status from D1.
const status = await request(`/api/practitioner/status?eligibilityId=${encodeURIComponent(attemptId)}`, {}, [200]);
assert(status.body.assessment?.passed === true && status.body.assessment?.score === 100, 'Assessment evidence missing from status');
assert(status.body.case?.passed === true && status.body.case?.score === 100, 'Case evidence missing from status');
assert(status.body.eligible === true, 'Credential eligibility is not authoritative/true');
assert(status.body.certificateIssued === false, 'Smoke must not issue a certificate');
console.log('✓ D1 evidence and eligibility are authoritative');

// 6) Turnstile negative-path smoke: invalid token must fail before issuance.
const issue = await request('/api/certificates/issue', {
  method:'POST',
  body:JSON.stringify({
    credentialType:'practitioner', eligibilityId:attemptId,
    participantName:'P1-B1 Automated Smoke', turnstileToken:'invalid-p1-b1-smoke-token',
  }),
}, [403]);
assert(issue.body?.error === 'turnstile_failed', `Expected turnstile_failed, got ${JSON.stringify(issue.body)}`);

const finalStatus = await request(`/api/practitioner/status?eligibilityId=${encodeURIComponent(attemptId)}`, {}, [200]);
assert(finalStatus.body.eligible === true && finalStatus.body.certificateIssued === false, 'Invalid Turnstile altered eligibility or issued a credential');
console.log('✓ invalid Turnstile rejected; no certificate emitted');

console.log(`P1-B1 AUTHORITATIVE PREVIEW SMOKE PASS — eligibilityId=${attemptId}`);
