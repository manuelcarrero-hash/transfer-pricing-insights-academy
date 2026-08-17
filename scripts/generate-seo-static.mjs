import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE_URL = 'https://transfer-pricing-insights-academy.pages.dev';
const CURRICULUM_DIR = 'src/content/curriculum/v1';
const DIST_DIR = 'dist';

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function extractString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*['\\\"]([^'\\\"]+)['\\\"]`));
  return match?.[1]?.trim() ?? null;
}

function extractNumber(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*(\\d+)`));
  return match ? Number(match[1]) : null;
}

function levelLabel(code) {
  if (code.startsWith('SS')) return 'Semi Senior';
  if (code.startsWith('S')) return 'Senior';
  if (code.startsWith('C')) return 'Consultant';
  return 'Junior';
}

async function discoverCourses() {
  const files = (await readdir(CURRICULUM_DIR)).filter((file) => file.endsWith('.ts') && !file.toLowerCase().includes('assessment'));
  const courses = [];

  for (const file of files) {
    const source = await readFile(join(CURRICULUM_DIR, file), 'utf8');
    const code = extractString(source, 'code');
    const title = extractString(source, 'title');
    const description = extractString(source, 'description');
    const lessonCount = extractNumber(source, 'lessonCount');

    if (!code || !title || !description || !lessonCount || !/^(J|C|SS|S)\d+$/.test(code)) continue;

    courses.push({
      code,
      title,
      description,
      lessonCount,
      level: levelLabel(code),
      path: `/courses/${code.toLowerCase()}`,
    });
  }

  return courses.sort((a, b) => a.path.localeCompare(b.path, 'es', { numeric: true }));
}

function replaceHead(html, { title, description, canonical, jsonLd }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const social = `\n    <link rel="canonical" href="${canonical}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${safeTitle}" />\n    <meta property="og:description" content="${safeDescription}" />\n    <meta property="og:url" content="${canonical}" />\n    <meta name="twitter:card" content="summary" />\n    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>`;

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/s, `<meta name="description" content="${safeDescription}" />`)
    .replace('</head>', `${social}\n  </head>`);
}

function staticShell({ eyebrow, heading, description, details = [] }) {
  const items = details.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<main class="seo-static" aria-label="Contenido introductorio">\n      <div style="max-width:960px;margin:0 auto;padding:72px 24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18283c">\n        <p style="font-weight:800;letter-spacing:.08em;text-transform:uppercase">${escapeHtml(eyebrow)}</p>\n        <h1 style="font-size:clamp(2rem,5vw,4rem);line-height:1.1">${escapeHtml(heading)}</h1>\n        <p style="font-size:1.15rem;line-height:1.7">${escapeHtml(description)}</p>\n        ${items ? `<ul style="line-height:1.8">${items}</ul>` : ''}\n        <p>Transfer Pricing Insights Academy · Formación abierta en Precios de Transferencia · Manuel Carrero Rojo</p>\n      </div>\n    </main>`;
}

async function writeRoute(baseHtml, route, metadata, shell) {
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  const html = replaceHead(baseHtml, { ...metadata, canonical });
  const hydrated = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  const targetDir = route === '/' ? DIST_DIR : join(DIST_DIR, route.slice(1));
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, 'index.html'), hydrated, 'utf8');
}

const courses = await discoverCourses();
const baseHtml = await readFile(join(DIST_DIR, 'index.html'), 'utf8');

await writeRoute(baseHtml, '/', {
  title: 'Transfer Pricing Insights Academy | Curso gratuito de Precios de Transferencia',
  description: 'Academy gratuita de Precios de Transferencia: ruta estructurada desde fundamentos hasta conocimiento Senior, con enfoque OCDE y aprendizaje a tu ritmo.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Transfer Pricing Insights Academy',
    url: `${SITE_URL}/`,
    inLanguage: 'es',
    creator: { '@type': 'Person', name: 'Manuel Carrero Rojo' },
  },
}, staticShell({
  eyebrow: 'Academy abierta',
  heading: 'Aprende Precios de Transferencia con una ruta estructurada',
  description: 'Formación gratuita basada en principios y metodología de Precios de Transferencia, organizada desde fundamentos Junior hasta conocimiento avanzado Senior.',
  details: ['27 experiencias de curso', 'Materiales de estudio y evaluaciones', 'Ruta progresiva basada en conocimiento demostrado'],
}));

await writeRoute(baseHtml, '/start', {
  title: 'Comenzar | Transfer Pricing Insights Academy',
  description: 'Elige tu punto de entrada y comienza una ruta gratuita y estructurada para aprender Precios de Transferencia.',
  jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Comenzar — Transfer Pricing Insights Academy', url: `${SITE_URL}/start`, inLanguage: 'es' },
}, staticShell({ eyebrow: 'Comenzar', heading: 'Encuentra tu punto de entrada', description: 'Inicia desde fundamentos o ubica el nivel que mejor corresponde a tu conocimiento actual de Precios de Transferencia.' }));

await writeRoute(baseHtml, '/resources', {
  title: 'Recursos de Precios de Transferencia | Transfer Pricing Insights Academy',
  description: 'Biblioteca gratuita de recursos para estudiar Precios de Transferencia: guías, materiales OCDE, videos y recursos complementarios.',
  jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Recursos de Precios de Transferencia', url: `${SITE_URL}/resources`, inLanguage: 'es' },
}, staticShell({ eyebrow: 'Biblioteca', heading: 'Recursos para estudiar Precios de Transferencia', description: 'Consulta materiales de apoyo, guías, videos y referencias utilizadas a lo largo de la Academy.' }));

for (const course of courses) {
  const canonical = `${SITE_URL}${course.path}`;
  const courseName = `${course.code} — ${course.title}`;
  await writeRoute(baseHtml, course.path, {
    title: `${course.title} | Curso de Precios de Transferencia`,
    description: course.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: courseName,
      description: course.description,
      url: canonical,
      inLanguage: 'es',
      isAccessibleForFree: true,
      provider: { '@type': 'Organization', name: 'Transfer Pricing Insights Academy', url: `${SITE_URL}/` },
      creator: { '@type': 'Person', name: 'Manuel Carrero Rojo' },
    },
  }, staticShell({
    eyebrow: `${course.level} · ${course.code}`,
    heading: course.title,
    description: course.description,
    details: [`${course.lessonCount} lecciones`, 'Curso gratuito de Precios de Transferencia', 'Parte de la ruta Transfer Pricing Insights Academy'],
  }));
}

const sitemapRoutes = ['/', '/start', '/resources', ...courses.map((course) => course.path)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${SITE_URL}${route === '/' ? '/' : route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /path\nDisallow: /*/assessment\nDisallow: /*/certificate\nDisallow: /senior/capstone\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`SEO static generation complete: ${sitemapRoutes.length} indexable routes.`);
