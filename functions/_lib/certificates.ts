export type Env = {
  CERTIFICATES_DB: D1DatabaseLike;
  TURNSTILE_SECRET_KEY: string;
};

type D1PreparedStatementLike = {
  bind: (...values: unknown[]) => D1PreparedStatementLike;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
  batch: (statements: D1PreparedStatementLike[]) => Promise<unknown>;
};

export type CertificateRecord = {
  certificate_id: string;
  participant_name: string;
  level_code: string;
  level_name: string;
  issued_at: string;
  curriculum_version: string;
  assessment_score: number;
  status: 'valid' | 'revoked';
  attempt_id: string;
};

export async function ensureSchema(db: D1DatabaseLike) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS junior_assessment_attempts (
      attempt_id TEXT PRIMARY KEY,
      question_ids TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      graded_at TEXT,
      score INTEGER,
      passed INTEGER NOT NULL DEFAULT 0,
      domain_scores TEXT,
      certificate_issued INTEGER NOT NULL DEFAULT 0
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS certificates (
      certificate_id TEXT PRIMARY KEY,
      participant_name TEXT NOT NULL,
      level_code TEXT NOT NULL,
      level_name TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      curriculum_version TEXT NOT NULL,
      assessment_score INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'valid',
      attempt_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status)'),
  ]);
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export function makeId(prefix: string) {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `${prefix}-${random}`;
}

export async function validateTurnstile(secret: string, token: string, remoteIp?: string) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}
