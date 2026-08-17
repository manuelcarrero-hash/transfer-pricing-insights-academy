import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE_URL = 'https://transfer-pricing-insights-academy.pages.dev';
const CURRICULUM_DIR = 'src/content/curriculum/v1';
const DIST_DIR = 'dist';

const LINKEDIN_URL = 'https://mx.linkedin.com/in/manuel-carrero-rojo-937118113';
const SUBSTACK_URL = 'https://manuelcarrerorojo.substack.com/';
const PODCAST_URL = 'https://open.spotify.com/search/Precios%20de%20Transferencia%3A%20The%20VIP%20Access';
const BOOK_URL = 'https://books.google.com/books?q=%22Precios+de+Transferencia%3A+Fundamentos+Doctrinales+y+Aplicaci%C3%B3n+Pr%C3%A1ctica%22+%22Manuel+Carrero+Rojo%22';

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

function authorShell() {
  return `<main aria-label="Sobre el autor" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18283c;background:#f7f8fa;min-height:100vh">\n    <header style="background:#102238;color:white;border-bottom:4px solid #c8a45d">\n      <div style="max-width:1060px;margin:0 auto;padding:24px">\n        <a href="/" style="color:white;text-decoration:none;font-weight:800">TP · Transfer Pricing Insights Academy</a>\n      </div>\n    </header>\n    <article style="max-width:1060px;margin:0 auto;padding:64px 24px 80px">\n      <p style="font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#7b6333">Fundador y autor académico</p>\n      <h1 style="font-size:clamp(2.6rem,7vw,5.2rem);line-height:1.02;margin:.3em 0">Manuel Carrero Rojo</h1>\n      <p style="font-size:1.25rem;line-height:1.7;max-width:820px">Especialista en Precios de Transferencia con más de 18 años de experiencia profesional. Es creador de Transfer Pricing Insights Academy, una iniciativa abierta de formación estructurada para desarrollar conocimiento y criterio técnico en Precios de Transferencia.</p>\n\n      <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:40px 0">\n        <div style="background:white;border:1px solid #dbe1e8;border-radius:16px;padding:24px"><strong>Trayectoria profesional</strong><p style="line-height:1.65">Gerente Senior de Precios de Transferencia en Élan Zaak. Su trayectoria incluye nueve años en Deloitte y experiencia en consultoría, documentación, análisis económico y estrategia de Precios de Transferencia.</p></div>\n        <div style="background:white;border:1px solid #dbe1e8;border-radius:16px;padding:24px"><strong>Formación</strong><p style="line-height:1.65">Licenciado en Administración. Maestro en Valuación de Tangibles y con estudios de Maestría en Valuación de Intangibles, actualmente en proceso de titulación.</p></div>\n      </section>\n\n      <section style="margin:48px 0">\n        <h2 style="font-size:2rem">Publicaciones y proyectos</h2>\n        <p style="line-height:1.75;max-width:850px">Además de la Academy, Manuel desarrolla contenidos técnicos y ejecutivos sobre Precios de Transferencia para profesionales, responsables fiscales, CFOs y estudiantes.</p>\n        <ul style="line-height:2;max-width:900px">\n          <li><strong>Transfer Pricing Insights</strong> — newsletter y análisis en Substack. <a href="${SUBSTACK_URL}" rel="me noopener" style="color:#194f7a">Leer en Substack</a>.</li>\n          <li><strong>Precios de Transferencia: The VIP Access</strong> — podcast especializado. <a href="${PODCAST_URL}" rel="noopener" style="color:#194f7a">Escuchar en Spotify</a>.</li>\n          <li><strong>Precios de Transferencia: Fundamentos Doctrinales y Aplicación Práctica</strong> — libro de referencia del autor. <a href="${BOOK_URL}" rel="noopener" style="color:#194f7a">Consultar en Google Books</a>.</li>\n        </ul>\n      </section>\n\n      <section style="background:#102238;color:white;border-radius:18px;padding:32px;margin-top:48px">\n        <h2 style="margin-top:0">Conecta con el autor</h2>\n        <p style="line-height:1.7;max-width:760px">Sigue su trabajo, publicaciones y análisis sobre Precios de Transferencia, fiscalidad internacional y aplicación profesional de inteligencia artificial.</p>\n        <p><a href="${LINKEDIN_URL}" rel="me noopener" style="display:inline-block;background:#c8a45d;color:#102238;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:800">LinkedIn de Manuel Carrero Rojo</a></p>\n      </section>\n    </article>\n    <footer style="border-top:1px solid #dbe1e8;background:white">\n      <div style="max-width:1060px;margin:0 auto;padding:28px 24px;line-height:1.7">Transfer Pricing Insights Academy · Conocimiento. Criterio. Impacto. · <a href="/" style="color:#194f7a">Volver a la Academy</a></div>\n    </footer>\n  </main>`;
}

async function writeRoute(baseHtml, route, metadata, shell) {
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  const html = replaceHead(baseHtml, { ...metadata, canonical });
  const hydrated = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  const targetDir = route === '/' ? DIST_DIR : join(DIST_DIR, route.slice(1));
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, 'index.html'), hydrated, 'utf8');
}

async function writeStandaloneRoute(baseHtml, route, metadata, shell) {
  const canonical = `${SITE_URL}${route}`;
  const html = replaceHead(baseHtml, { ...metadata, canonical });
  let withoutAppScript = html;
  let previousHtml;
  do {
    previousHtml = withoutAppScript;
    withoutAppScript = withoutAppScript.replace(/<script[^>]+type="module"[^>]*><\/script>/g, '');
  } while (withoutAppScript !== previousHtml);
  const hydrated = withoutAppScript.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  const targetDir = join(DIST_DIR, route.slice(1));
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
    creator: { '@type': 'Person', name: 'Manuel Carrero Rojo', url: `${SITE_URL}/autor` },
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

await writeStandaloneRoute(baseHtml, '/autor', {
  title: 'Manuel Carrero Rojo | Autor de Transfer Pricing Insights Academy',
  description: 'Conoce a Manuel Carrero Rojo, especialista en Precios de Transferencia con más de 18 años de experiencia, autor, podcaster y fundador de Transfer Pricing Insights Academy.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Manuel Carrero Rojo',
    url: `${SITE_URL}/autor`,
    jobTitle: 'Gerente Senior de Precios de Transferencia',
    worksFor: { '@type': 'Organization', name: 'Élan Zaak' },
    description: 'Especialista en Precios de Transferencia con más de 18 años de experiencia profesional y fundador de Transfer Pricing Insights Academy.',
    knowsAbout: ['Precios de Transferencia', 'Transfer Pricing', 'Valuación', 'Fiscalidad internacional', 'OCDE'],
    sameAs: [LINKEDIN_URL, SUBSTACK_URL],
  },
}, authorShell());

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
      creator: { '@type': 'Person', name: 'Manuel Carrero Rojo', url: `${SITE_URL}/autor` },
    },
  }, staticShell({
    eyebrow: `${course.level} · ${course.code}`,
    heading: course.title,
    description: course.description,
    details: [`${course.lessonCount} lecciones`, 'Curso gratuito de Precios de Transferencia', 'Parte de la ruta Transfer Pricing Insights Academy'],
  }));
}

const sitemapRoutes = ['/', '/start', '/resources', '/autor', ...courses.map((course) => course.path)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${SITE_URL}${route === '/' ? '/' : route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /path\nDisallow: /*/assessment\nDisallow: /*/certificate\nDisallow: /senior/capstone\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`SEO static generation complete: ${sitemapRoutes.length} indexable routes.`);
