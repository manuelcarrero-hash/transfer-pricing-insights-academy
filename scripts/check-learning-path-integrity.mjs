import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const srcRoot = new URL('../src/', import.meta.url);
const files = [];
function walk(path) {
  for (const name of readdirSync(path)) {
    const full = join(path, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(name)) files.push(full);
  }
}
walk(srcRoot.pathname);
const source = files.map((path) => readFileSync(path, 'utf8')).join('\n');

const keys = [
  'tp-consultant-level-unlocked',
  ...Array.from({ length: 6 }, (_, i) => `tp-c${i + 2}-unlocked`),
  'tp-consultant-foundations-complete',
  'tp-consultant-cumulative-objective-passed',
  'tp-practitioner-unlocked',
  ...Array.from({ length: 7 }, (_, i) => `tp-ss${i + 2}-unlocked`),
  'tp-semi-senior-foundations-complete',
  'tp-semi-senior-cumulative-passed',
  'tp-senior-track-unlocked',
  ...Array.from({ length: 6 }, (_, i) => `tp-s${i + 2}-unlocked`),
  'tp-senior-knowledge-courses-complete',
];

let failed = false;
for (const key of keys) {
  const occurrences = source.split(key).length - 1;
  const hasWriter = source.includes(`setItem('${key}'`) || source.includes(`setItem(\"${key}\"`);
  if (!hasWriter) {
    console.error(`Learning path integrity failed: ${key} has no writer.`);
    failed = true;
  }
  if (occurrences < 2) {
    console.error(`Learning path integrity failed: ${key} is not consumed after being issued.`);
    failed = true;
  }
}

const routeGuards = [
  ['C1CoursePage.tsx', 'tp-consultant-level-unlocked'],
  ['C2CoursePage.tsx', 'tp-c2-unlocked'],
  ['SS1CoursePage.tsx', 'tp-practitioner-unlocked'],
  ['S1CoursePage.tsx', 'tp-senior-track-unlocked'],
];
for (const [fileName, key] of routeGuards) {
  const match = files.find((path) => path.endsWith(fileName));
  const content = match ? readFileSync(match, 'utf8') : '';
  if (!content.includes(key) || !content.includes('<Navigate')) {
    console.error(`Learning path integrity failed: ${fileName} must guard access with ${key}.`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Learning path integrity check passed across ${keys.length} progression keys.`);
