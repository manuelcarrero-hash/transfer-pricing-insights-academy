import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url);
const sourceRoot = new URL('../src/', import.meta.url);
const allowedExtensions = new Set(['.ts', '.tsx', '.css', '.html']);
const bannedUiFragments = [
  'Curriculum v1',
  'Abrir / descargar',
  'Open / download',
  'Abrir / descargar guía',
  'Abrir / descargar libro',
];

async function walk(dirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dirUrl);
    if (entry.isDirectory()) files.push(...await walk(child));
    else if (allowedExtensions.has(extname(entry.name))) files.push(child);
  }
  return files;
}

const failures = [];
for (const file of await walk(sourceRoot)) {
  const text = await readFile(file, 'utf8');
  const relative = file.pathname.replace(root.pathname, '');

  for (const fragment of bannedUiFragments) {
    if (text.includes(fragment)) failures.push(`${relative}: contiene copy no normalizado: “${fragment}”`);
  }

  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|@import\s+url\([^)]*font/i.test(text)) {
    failures.push(`${relative}: introduce una fuente externa; P0-H exige fuentes de sistema.`);
  }
}

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const runtimeDeps = Object.keys(packageJson.dependencies ?? {});
const allowedRuntimeDeps = new Set(['react', 'react-dom', 'react-router-dom']);
for (const dependency of runtimeDeps) {
  if (!allowedRuntimeDeps.has(dependency)) failures.push(`package.json: dependencia runtime no autorizada para P0-H: ${dependency}`);
}

if (failures.length) {
  console.error('Frontend Polish P0-H integrity check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Frontend Polish P0-H integrity check passed.');
console.log(`Runtime dependencies: ${runtimeDeps.join(', ')}`);
