import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SITE_URL = 'https://transfer-pricing-insights-academy.pages.dev';
const failures = [];

async function checkFile(path, checks) {
  try {
    const content = await readFile(path, 'utf8');
    for (const [label, predicate] of checks) {
      if (!predicate(content)) failures.push(`${path}: ${label}`);
    }
  } catch {
    failures.push(`${path}: missing`);
  }
}

await checkFile('dist/index.html', [
  ['missing canonical', (html) => html.includes(`<link rel="canonical" href="${SITE_URL}/"`)],
  ['missing JSON-LD', (html) => html.includes('application/ld+json')],
  ['root remains empty', (html) => !html.includes('<div id="root"></div>')],
  ['missing indexable heading', (html) => html.includes('<h1')],
]);

await checkFile('dist/resources/index.html', [
  ['missing resources canonical', (html) => html.includes(`${SITE_URL}/resources`)],
  ['missing resources static text', (html) => html.includes('Recursos para estudiar Precios de Transferencia')],
]);

await checkFile('dist/courses/c1/index.html', [
  ['missing course canonical', (html) => html.includes(`${SITE_URL}/courses/c1`)],
  ['missing Course structured data', (html) => html.includes('"@type":"Course"')],
  ['missing static course content', (html) => html.includes('C1') && html.includes('<h1')],
]);

await checkFile('dist/robots.txt', [
  ['missing sitemap reference', (txt) => txt.includes(`${SITE_URL}/sitemap.xml`)],
  ['missing private path exclusion', (txt) => txt.includes('Disallow: /path')],
]);

await checkFile('dist/sitemap.xml', [
  ['missing home URL', (xml) => xml.includes(`<loc>${SITE_URL}/</loc>`) ],
  ['missing C1 URL', (xml) => xml.includes(`<loc>${SITE_URL}/courses/c1</loc>`) ],
  ['contains assessment URL', (xml) => !xml.includes('/assessment')],
  ['contains certificate URL', (xml) => !xml.includes('/certificate')],
]);

try {
  const courseDirs = await readdir('dist/courses', { withFileTypes: true });
  const htmlCourses = courseDirs.filter((entry) => entry.isDirectory()).length;
  if (htmlCourses < 20) failures.push(`dist/courses: expected at least 20 prerendered course directories, found ${htmlCourses}`);
} catch {
  failures.push('dist/courses: missing prerendered courses directory');
}

try { await access('dist/sitemap.xml'); } catch { failures.push('dist/sitemap.xml unavailable'); }

if (failures.length) {
  console.error('SEO output integrity failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('SEO output integrity passed.');
