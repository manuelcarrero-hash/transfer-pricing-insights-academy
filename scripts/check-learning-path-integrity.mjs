import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const srcRoot = new URL('../src/', import.meta.url);
const files = [];
function walk(path) { for (const name of readdirSync(path)) { const full = join(path, name); if (statSync(full).isDirectory()) walk(full); else if (/\.(ts|tsx)$/.test(name)) files.push(full); } }
walk(srcRoot.pathname);
const contents = files.map((path) => ({ path, content: readFileSync(path, 'utf8') }));
const source = contents.map(({ content }) => content).join('\n');

const keys = [
  'tp-consultant-level-unlocked',
  ...Array.from({ length: 6 }, (_, i) => `tp-c${i + 2}-unlocked`),
  'tp-consultant-foundations-complete',
  'tp-practitioner-eligibility-id',
  'tp-practitioner-unlocked',
  ...Array.from({ length: 7 }, (_, i) => `tp-ss${i + 2}-unlocked`),
  'tp-semi-senior-foundations-complete',
  'tp-advanced-practitioner-eligibility-id',
  'tp-senior-track-unlocked',
  ...Array.from({ length: 6 }, (_, i) => `tp-s${i + 2}-unlocked`),
  'tp-senior-knowledge-courses-complete',
];

let failed = false;
for (const key of keys) {
  const occurrences = source.split(key).length - 1;
  const keyFiles = contents.filter(({ content }) => content.includes(key));
  const hasWriter = keyFiles.some(({ content }) => content.includes('setItem('));
  if (!hasWriter) { console.error(`Learning path integrity failed: ${key} has no writer file.`); failed = true; }
  if (occurrences < 2) { console.error(`Learning path integrity failed: ${key} is not consumed after being issued.`); failed = true; }
}

const routeGuards = [
  ['C1CoursePage.tsx', 'tp-consultant-level-unlocked'],
  ['C2CoursePage.tsx', 'tp-c2-unlocked'],
  ['SS1CoursePage.tsx', 'tp-practitioner-unlocked'],
  ['S1CoursePage.tsx', 'tp-senior-track-unlocked'],
];
for (const [fileName, key] of routeGuards) {
  const match = contents.find(({ path }) => path.endsWith(fileName));
  const content = match?.content ?? '';
  if (!content.includes(key) || !content.includes('<Navigate')) { console.error(`Learning path integrity failed: ${fileName} must guard access with ${key}.`); failed = true; }
}

const consultantAssessment = contents.find(({ path }) => path.endsWith('ConsultantAssessmentPage.tsx'))?.content ?? '';
const consultantCase = contents.find(({ path }) => path.endsWith('ConsultantCasePage.tsx'))?.content ?? '';
if (consultantAssessment.includes('tp-consultant-cumulative-objective-passed') || consultantCase.includes('tp-consultant-cumulative-objective-passed')) { console.error('Learning path integrity failed: Practitioner certification must not depend on the legacy client-side objective-pass flag.'); failed = true; }
if (!consultantCase.includes('/api/practitioner/case')) { console.error('Learning path integrity failed: Practitioner case access must validate server-side assessment evidence.'); failed = true; }

const semiAssessment=contents.find(({path})=>path.endsWith('SemiSeniorAssessmentPage.tsx'))?.content??'';
const semiCases=contents.find(({path})=>path.endsWith('SemiSeniorCasesPage.tsx'))?.content??'';
if(semiAssessment.includes('tp-semi-senior-cumulative-passed')||semiCases.includes('tp-semi-senior-cumulative-passed')){console.error('Learning path integrity failed: Advanced Practitioner must not depend on the legacy Semi Senior pass flag.');failed=true;}
if(!semiCases.includes('/api/advanced-practitioner/cases')){console.error('Learning path integrity failed: Advanced Practitioner cases must validate server-side assessment evidence.');failed=true;}

if (failed) process.exit(1);
console.log(`Learning path integrity check passed across ${keys.length} progression/continuity keys.`);
