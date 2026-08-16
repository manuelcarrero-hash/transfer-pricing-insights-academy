import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const roots = ['src', 'public'];
const standaloneFiles = ['index.html', 'vite.config.ts'];
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.html', '.css', '.txt']);

const forbidden = [
  { label: 'Supabase secret key', pattern: /sb_secret_[A-Za-z0-9_-]+/g },
  { label: 'Supabase service role environment access', pattern: /SUPABASE_SERVICE_ROLE_KEY/g },
  { label: 'Supabase secret environment access', pattern: /SUPABASE_SECRET_KEYS/g },
  { label: 'OpenAI-style secret key', pattern: /sk-[A-Za-z0-9_-]{20,}/g },
  { label: 'AWS access key', pattern: /AKIA[0-9A-Z]{16}/g },
  { label: 'Private key material', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (textExtensions.has(extname(entry.name)) || entry.name === '_headers') files.push(path);
  }
  return files;
}

const files = [...standaloneFiles];
for (const root of roots) {
  try { files.push(...await walk(root)); } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const findings = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) findings.push(`${file}: ${rule.label}`);
    rule.pattern.lastIndex = 0;
  }
}

if (findings.length) {
  console.error('Potential secret exposure detected in client-delivered or build configuration files:');
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log(`Client secret exposure check passed across ${files.length} files.`);
