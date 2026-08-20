export type Env = {
  CERTIFICATES_DB: D1DatabaseLike;
  TURNSTILE_SECRET_KEY: string;
};

export type D1PreparedStatementLike = {
  bind: (...values: unknown[]) => D1PreparedStatementLike;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

export type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
  batch: (statements: D1PreparedStatementLike[]) => Promise<unknown>;
};

export const credentialTypes = [
  'junior-foundations',
  'practitioner',
  'advanced-practitioner',
  'senior-knowledge',
] as const;

export type CredentialType = typeof credentialTypes[number];
export type EligibilityPolicy = 'all-components-pass' | 'senior-composite';

export type CredentialDefinition = {
  credentialType: CredentialType;
  levelCode: string;
  levelName: string;
  idPrefix: string;
  curriculumVersion: string;
  requiredComponents: readonly string[];
  eligibilityPolicy: EligibilityPolicy;
};

export const JUNIOR_CREDENTIAL_TYPE: CredentialType = 'junior-foundations';

export const credentialDefinitions: Record<CredentialType, CredentialDefinition> = {
  'junior-foundations': {
    credentialType: 'junior-foundations',
    levelCode: 'JF',
    levelName: 'Transfer Pricing Junior Foundations',
    idPrefix: 'TPIA-JF',
    curriculumVersion: 'v1.0',
    requiredComponents: ['junior-assessment'],
    eligibilityPolicy: 'all-components-pass',
  },
  practitioner: {
    credentialType: 'practitioner',
    levelCode: 'TP',
    levelName: 'Transfer Pricing Practitioner',
    idPrefix: 'TPIA-TP',
    curriculumVersion: 'v1.0',
    requiredComponents: ['consultant-assessment', 'consultant-case'],
    eligibilityPolicy: 'all-components-pass',
  },
  'advanced-practitioner': {
    credentialType: 'advanced-practitioner',
    levelCode: 'ATP',
    levelName: 'Advanced Transfer Pricing Practitioner',
    idPrefix: 'TPIA-ATP',
    curriculumVersion: 'v1.0',
    requiredComponents: ['semi-senior-assessment', 'advanced-case-a', 'advanced-case-b'],
    eligibilityPolicy: 'all-components-pass',
  },
  'senior-knowledge': {
    credentialType: 'senior-knowledge',
    levelCode: 'SK',
    levelName: 'Senior-Level Transfer Pricing Knowledge',
    idPrefix: 'TPIA-SK',
    curriculumVersion: 'v1.0',
    requiredComponents: ['senior-components-ab', 'senior-capstone'],
    eligibilityPolicy: 'senior-composite',
  },
};

export function isCredentialType(value: string): value is CredentialType {
  return credentialTypes.includes(value as CredentialType);
}

export function getCredentialDefinition(value: string | undefined) {
  if (!value || !isCredentialType(value)) return null;
  return credentialDefinitions[value];
}

export function credentialTypeFromLevelCode(levelCode: string): CredentialType | null {
  const entry = Object.values(credentialDefinitions).find((definition) => definition.levelCode === levelCode);
  return entry?.credentialType ?? null;
}

export function hasRequiredPassingComponents(credentialType: CredentialType, passedComponents: Iterable<string>) {
  const passed = new Set(passedComponents);
  return credentialDefinitions[credentialType].requiredComponents.every((component) => passed.has(component));
}

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

export type CredentialEligibilityRecord = {
  eligibility_id: string;
  credential_type: CredentialType;
  score: number;
  eligible: number;
  result_data: string | null;
  certificate_issued: number;
  created_at: string;
  updated_at: string;
};

export type CredentialEligibilityInput = {
  eligibilityId: string;
  credentialType: CredentialType;
  score: number;
  eligible: boolean;
  resultData?: unknown;
  updatedAt?: string;
};

export type CredentialEvidenceInput = {
  eligibilityId: string;
  credentialType: CredentialType;
  componentKey: string;
  score?: number | null;
  passed: boolean;
  resultData?: unknown;
  recordedAt?: string;
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
    db.prepare(`CREATE TABLE IF NOT EXISTS credential_evidence (
      eligibility_id TEXT NOT NULL,
      credential_type TEXT NOT NULL,
      component_key TEXT NOT NULL,
      score INTEGER,
      passed INTEGER NOT NULL DEFAULT 0,
      result_data TEXT,
      recorded_at TEXT NOT NULL,
      PRIMARY KEY (eligibility_id, credential_type, component_key)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS credential_eligibility (
      eligibility_id TEXT PRIMARY KEY,
      credential_type TEXT NOT NULL,
      score INTEGER NOT NULL,
      eligible INTEGER NOT NULL DEFAULT 0,
      result_data TEXT,
      certificate_issued INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
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
    db.prepare('CREATE INDEX IF NOT EXISTS idx_credential_evidence_type ON credential_evidence(credential_type, component_key, passed)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_credential_eligibility_type ON credential_eligibility(credential_type)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_credential_eligibility_status ON credential_eligibility(credential_type, eligible, certificate_issued)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_certificates_level_code ON certificates(level_code)'),
  ]);
}

export function prepareCredentialEvidenceUpsert(db: D1DatabaseLike, input: CredentialEvidenceInput) {
  const recordedAt = input.recordedAt ?? new Date().toISOString();
  return db.prepare(`INSERT INTO credential_evidence
    (eligibility_id, credential_type, component_key, score, passed, result_data, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(eligibility_id, credential_type, component_key) DO UPDATE SET
      score = excluded.score,
      passed = excluded.passed,
      result_data = excluded.result_data,
      recorded_at = excluded.recorded_at`)
    .bind(
      input.eligibilityId,
      input.credentialType,
      input.componentKey,
      input.score ?? null,
      input.passed ? 1 : 0,
      input.resultData === undefined ? null : JSON.stringify(input.resultData),
      recordedAt,
    );
}

export function prepareCredentialEligibilityUpsert(db: D1DatabaseLike, input: CredentialEligibilityInput) {
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  return db.prepare(`INSERT INTO credential_eligibility
    (eligibility_id, credential_type, score, eligible, result_data, certificate_issued, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    ON CONFLICT(eligibility_id) DO UPDATE SET
      credential_type = excluded.credential_type,
      score = excluded.score,
      eligible = excluded.eligible,
      result_data = excluded.result_data,
      updated_at = excluded.updated_at`)
    .bind(
      input.eligibilityId,
      input.credentialType,
      input.score,
      input.eligible ? 1 : 0,
      input.resultData === undefined ? null : JSON.stringify(input.resultData),
      updatedAt,
      updatedAt,
    );
}

export async function upsertCredentialEligibility(db: D1DatabaseLike, input: CredentialEligibilityInput) {
  await prepareCredentialEligibilityUpsert(db, input).run();
}

export async function getCredentialEligibility(
  db: D1DatabaseLike,
  credentialType: CredentialType,
  eligibilityId: string,
) {
  return db.prepare(`SELECT eligibility_id, credential_type, score, eligible, result_data,
    certificate_issued, created_at, updated_at
    FROM credential_eligibility WHERE eligibility_id = ? AND credential_type = ?`)
    .bind(eligibilityId, credentialType)
    .first<CredentialEligibilityRecord>();
}

export function prepareCredentialEligibilityIssued(
  db: D1DatabaseLike,
  credentialType: CredentialType,
  eligibilityId: string,
  updatedAt: string,
) {
  return db.prepare(`UPDATE credential_eligibility
    SET certificate_issued = 1, updated_at = ?
    WHERE eligibility_id = ? AND credential_type = ? AND certificate_issued = 0`)
    .bind(updatedAt, eligibilityId, credentialType);
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

export function makeCertificateId(definition: CredentialDefinition, issuedAt: string) {
  const datePart = issuedAt.slice(0, 10).replaceAll('-', '');
  return makeId(`${definition.idPrefix}-${datePart}`);
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
