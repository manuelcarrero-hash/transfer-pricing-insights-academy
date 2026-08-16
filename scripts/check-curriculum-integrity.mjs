import { readFileSync } from 'node:fs';

const fail = (message) => {
  console.error(`Curriculum integrity check failed: ${message}`);
  process.exitCode = 1;
};

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const videoCatalog = read('src/content/media/videoCurriculum.ts');
const app = read('src/app/App.tsx');
const start = read('src/pages/StartPage.tsx');
const shell = read('src/components/layout/AppShell.tsx');
const juniorVideoPages = ['src/pages/J2CoursePage.tsx','src/pages/J3CoursePage.tsx','src/pages/J4CoursePage.tsx','src/pages/J5CoursePage.tsx'].map(read).join('\n');

for (let chapter = 1; chapter <= 10; chapter += 1) {
  const id = `oecd-chapter-${chapter}`;
  const entryPattern = new RegExp(`id:'${id}'[^\\n]*href:'https://drive\\.google\\.com/[^']+'[^\\n]*status:'active'`);
  if (!entryPattern.test(videoCatalog)) fail(`${id} must be active and have a Google Drive href.`);
}

const requiredRoutes = [
  '/', '/start', '/path', '/resources',
  '/junior-foundations/assessment', '/junior-foundations/certificate',
  '/consultant/assessment', '/consultant/case', '/practitioner/certificate',
  '/semi-senior/assessment', '/semi-senior/cases', '/advanced-practitioner/certificate',
  '/senior/assessment', '/senior/capstone', '/senior/certificate',
];
for (const route of requiredRoutes) {
  if (!app.includes(`path=\"${route}\"`)) fail(`Required route ${route} is missing from App.tsx.`);
}

const sequencedCodes = ['c1','c2','c3','c4','c5','c6','c7','ss1','ss2','ss3','ss4','ss5','ss6','ss7','ss8','s1','s2','s3','s4','s5','s6','s7'];
for (const code of sequencedCodes) {
  for (const suffix of ['', '/lesson/:lessonNumber', '/assessment']) {
    const route = `/courses/${code}${suffix}`;
    if (!app.includes(`path=\"${route}\"`)) fail(`Curriculum route ${route} is missing.`);
  }
}

const lessonPagePaths = [
  'src/pages/LessonPage.tsx',
  ...['J2','J3','J4','J5'].map(code => `src/pages/${code}LessonPage.tsx`),
  ...['C1','C2','C3','C4','C5','C6','C7'].map(code => `src/pages/${code}LessonPage.tsx`),
  ...['SS1','SS2','SS3','SS4','SS5','SS6','SS7','SS8'].map(code => `src/pages/${code}LessonPage.tsx`),
  ...['S1','S2','S3','S4','S5','S6','S7'].map(code => `src/pages/${code}LessonPage.tsx`),
];
for (const path of lessonPagePaths) {
  const content = read(path);
  if (!content.includes('FormativeCheck')) fail(`${path} must include a formative check.`);
  if (!/mark(?:Course)?LessonCompleted/.test(content)) fail(`${path} must persist lesson completion after the formative check.`);
}

const staleCopy = ['próxima fase', 'vertical slice', 'Video pendiente de enlace', 'se activará cuando resolvamos el enlace'];
const copySources = `${start}\n${shell}\n${juniorVideoPages}`;
for (const phrase of staleCopy) {
  if (copySources.toLowerCase().includes(phrase.toLowerCase())) fail(`Stale product copy detected: “${phrase}”.`);
}

if (!start.includes('to="/path"') || !start.includes('to="/resources"')) fail('Start page must expose Mi Ruta and Recursos as real choices.');
if (!shell.includes("['Mi Ruta', '/path']") || !shell.includes("['Recursos', '/resources']")) fail('Primary navigation must expose Mi Ruta and Recursos.');

if (!process.exitCode) console.log(`Curriculum integrity check passed across ${lessonPagePaths.length} lesson experiences.`);
