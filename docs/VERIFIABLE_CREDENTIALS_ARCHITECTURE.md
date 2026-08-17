# Verifiable Credentials Architecture

**Project:** Transfer Pricing Insights Academy  
**Status:** Production architecture, RC1  
**Initial implementation:** P1-A / Junior Foundations  
**Production baseline:** merge commit `214dbffbcca04388707e6f2acdbb961ba164403d`

## 1. Purpose

This document is the canonical technical reference for the Academy's verifiable-credential architecture. Its purpose is to ensure that credentials are not trusted because a PDF, screenshot, browser state, or local-storage value exists. A credential is valid only when the Academy's server-side registry confirms it.

The architecture was implemented first for **Transfer Pricing Junior Foundations**. It is intentionally reusable for later levels, but those levels should not be described as verifiable until their own assessment and issuance flows are migrated to this pattern.

## 2. Security objective

The architecture separates three concepts:

1. **Learning progress** — currently browser-local and not an authoritative credential source.
2. **Assessment result** — generated and graded server-side for the credentialed level.
3. **Credential** — an authoritative record stored in Cloudflare D1 and publicly verifiable by an Academy-issued ID.

A locally forged certificate, modified PDF, fabricated URL, or edited browser storage must never be sufficient to produce a valid credential.

## 3. Trust boundaries and invariants

The following are architectural invariants:

- The client must never contain the authoritative answer key for a credentialed assessment.
- The client may display questions and submit selected option indexes, but grading is performed by server-side code.
- An assessment attempt has a server-generated ID and a finite validity period.
- A credential can be issued only from a server-recorded passing attempt.
- A passing attempt can issue at most one credential.
- Credential issuance is protected by Cloudflare Turnstile.
- Credential validity is determined from D1, not from `localStorage`, a URL parameter alone, or a PDF.
- Verification IDs are public identifiers, not secrets.
- Public verification must not expose protected assessment answers or secret configuration.
- Production credential URLs must use the stable production origin: `https://transfer-pricing-insights-academy.pages.dev`.
- Preview-only QA shortcuts must never be merged into production.

## 4. Runtime architecture

```text
Browser / React UI
      |
      | POST /api/junior/attempt
      v
Cloudflare Pages Function
      |
      | generate server-side attempt
      | persist attempt metadata
      v
Cloudflare D1: tpia-certificates
      |
      | POST /api/junior/grade
      v
Server-side grading
      |
      | passing result
      v
Turnstile challenge + POST /api/certificates/issue
      |
      | validate challenge + attempt
      | create authoritative certificate record
      v
Cloudflare D1
      |
      +--> GET /api/certificates/:id
      |
      +--> GET /verify/:id
               |
               v
        Public verification page
```

## 5. Cloudflare infrastructure

### D1

Database name:

`tpia-certificates`

Runtime binding:

`CERTIFICATES_DB`

The binding must be configured for every environment in which the full flow will be tested. Production and Preview are separate Cloudflare Pages environments and should be reviewed independently.

### Turnstile

Widget name:

`tpia-certificate-issuance`

Public Site Key is consumed by the frontend Turnstile component. The corresponding secret is stored as a Cloudflare runtime secret named:

`TURNSTILE_SECRET_KEY`

The secret must never be committed to GitHub or copied into client-side code.

Turnstile hostnames must include the production hostname. Temporary preview hostnames may be authorized for QA and should be removed when no longer needed.

### Content Security Policy

Turnstile requires the Academy CSP to permit Cloudflare's challenge origin. The production security headers therefore allow `https://challenges.cloudflare.com` where necessary for Turnstile script, frame, and network access while retaining the rest of the restrictive CSP.

Source: `public/_headers`.

## 6. Server-side components

### Shared credential utilities

`functions/_lib/certificates.ts`

Responsibilities:

- Environment contract for `CERTIFICATES_DB` and `TURNSTILE_SECRET_KEY`.
- D1 schema initialization.
- JSON response helper with `no-store` caching policy.
- Cryptographically random public ID suffix generation using `crypto.getRandomValues`.
- Server-side Turnstile Siteverify call.

### Protected Junior assessment bank

`functions/_lib/juniorBank.ts`

Responsibilities:

- Protected question bank and answer key.
- Assessment-domain definitions.
- Random attempt construction.
- Public-question projection that strips the answer key before returning data to the browser.

Current Junior assessment policy:

- 20 questions per attempt.
- Five domains: Fundamentos; Arm's Length / delimitación; FAR; Métodos; Comparabilidad.
- Overall pass threshold: 80%.
- Minimum per-domain floor: 60%.
- Attempts expire after two hours.

The detailed answer key is deliberately not reproduced in this architecture document.

### Attempt creation

`functions/api/junior/attempt.ts`

`POST /api/junior/attempt`

The server:

1. Ensures the D1 schema exists.
2. Generates the assessment selection on the server.
3. Creates an `attemptId` with prefix `TPIA-JA`.
4. Persists only the selected question IDs and attempt metadata.
5. Returns the public question representation without answer indexes.

### Server-side grading

`functions/api/junior/grade.ts`

`POST /api/junior/grade`

The server:

1. Loads the attempt from D1.
2. Rejects missing, expired, invalid, or already graded attempts.
3. Reconstructs the selected questions from the protected bank.
4. Grades the submitted answer indexes server-side.
5. Computes global and per-domain scores.
6. Persists `graded_at`, `score`, `passed`, and `domain_scores`.
7. Returns only the result needed by the UI.

### Credential issuance

`functions/api/certificates/issue.ts`

`POST /api/certificates/issue`

Required inputs:

- `attemptId`
- `participantName`
- `turnstileToken`

The server:

1. Validates input and participant-name length.
2. Validates Turnstile using `TURNSTILE_SECRET_KEY` and, when available, the Cloudflare connecting IP.
3. Loads the attempt from D1.
4. Requires a server-recorded pass and numeric score.
5. Rejects duplicate issuance from the same attempt.
6. Creates a public credential ID with format `TPIA-JF-YYYYMMDD-<random>`.
7. Inserts the authoritative credential record and marks the attempt as having issued a credential.
8. Returns credential metadata and a verification path.

The D1 `attempt_id` field is unique in `certificates`, providing a second database-level barrier against multiple credentials for one attempt.

### Credential API

`functions/api/certificates/[id].ts`

`GET /api/certificates/:id`

Loads a credential from the central registry and returns the public verification data consumed by the certificate UI. An ID that does not exist in D1 is not a valid Academy credential.

### Public verification route

`functions/verify/[id].ts`

`GET /verify/:id`

Renders the public verification experience directly from the central credential registry. This is the external source of truth for employers, firms, peers, or other third parties checking an Academy credential.

## 7. Frontend components

### Junior assessment page

`src/pages/JuniorAssessmentPage.tsx`

Responsibilities:

- Enforce the normal learning-path prerequisite in production.
- Request a server-generated attempt.
- Submit answer selections for server-side grading.
- Display score and domain results.
- Persist the user's result only for UX continuity; that local value does not authorize credential issuance.
- Render Turnstile after a passing result.
- Submit name, authoritative attempt ID, and Turnstile token for issuance.

A locally modified passing-result object cannot independently create a credential because `/api/certificates/issue` rechecks the attempt in D1.

### Turnstile component

`src/components/security/TurnstileWidget.tsx`

Loads Cloudflare Turnstile in explicit-render mode and reports a token to the assessment page. Expired or failed challenges clear the token, preventing the issuance button from remaining authorized.

### Junior certificate page

`src/pages/JuniorCertificatePage.tsx`

Receives a credential ID, calls the credential API, and renders the certificate only if the central registry confirms it. The displayed public verification URL uses the stable production origin.

The printable/PDF representation is evidence of a credential, not the authority that creates validity.

## 8. D1 schema

The schema is initialized idempotently by `ensureSchema`.

### `junior_assessment_attempts`

| Column | Purpose |
|---|---|
| `attempt_id` | Server-generated primary key |
| `question_ids` | JSON array of server-selected question IDs |
| `created_at` | Attempt creation timestamp |
| `expires_at` | Attempt expiration timestamp |
| `graded_at` | Timestamp when graded |
| `score` | Overall integer score |
| `passed` | Server-derived pass flag |
| `domain_scores` | JSON object of per-domain scores |
| `certificate_issued` | Prevents repeated issuance |

### `certificates`

| Column | Purpose |
|---|---|
| `certificate_id` | Public primary verification ID |
| `participant_name` | Name printed on credential |
| `level_code` | Credential level code, currently `JF` |
| `level_name` | Public level name |
| `issued_at` | Issuance timestamp |
| `curriculum_version` | Curriculum version, currently `v1.0` |
| `assessment_score` | Authoritative score |
| `status` | `valid` or `revoked` |
| `attempt_id` | Unique source attempt |
| `created_at` | Registry creation timestamp |

Index: `idx_certificates_status` on `status`.

## 9. Credential semantics

The Junior certificate is a **Certificate of Achievement** within Transfer Pricing Insights Academy. The certificate text explicitly clarifies that it records performance in the Academy learning environment and is not a professional license, regulatory certification, or official academic accreditation.

This semantic boundary should be preserved for all future credential levels unless the Academy's legal/accreditation status changes.

## 10. Why local storage is not authoritative

The Academy still uses browser storage for portions of the learner experience, such as progress continuity and local level unlocking. That is separate from credential authority.

The architecture intentionally assumes browser storage can be edited by the user. Therefore:

- local progress can control UX, but not registry validity;
- a local result can restore a result screen, but the server rechecks the D1 attempt before issuance;
- a local credential ID alone cannot make an unregistered ID valid;
- public verification always returns to the server-side registry.

Multi-device progress synchronization is a separate problem and is not required for the P1-A security objective.

## 11. Adding another verifiable level

When extending the architecture to Consultant, Senior Consultant, Senior, or another future level, do not copy only the certificate UI. Migrate the entire trust chain.

Minimum implementation checklist:

1. Define the authoritative server-side assessment/capstone evidence for the level.
2. Move any credential-bearing answer key or approval rule out of the client bundle.
3. Create a server-side attempt/submission record with an immutable ID.
4. Define pass policy and any domain/case/capstone floors.
5. Persist the result server-side.
6. Require a server-recorded pass before issuance.
7. Reuse Turnstile for issuance protection.
8. Generate a level-specific public credential ID.
9. Insert into the central `certificates` registry with the appropriate `level_code`, `level_name`, curriculum version, and score/evidence metadata.
10. Render the certificate from the central API, not local browser state.
11. Ensure `/verify/:id` recognizes the new level correctly.
12. Add E2E tests for forged local state, duplicate issuance, invalid IDs, and public verification.
13. Test both Cloudflare Preview and Production bindings/secrets.
14. Run CI and CodeQL before merge.

Prefer parameterizing shared issuance and verification logic over creating divergent implementations for each level.

## 12. Testing and release checklist

Before enabling a credentialed level in production, verify:

- TypeScript/build passes.
- CI and E2E pass.
- CodeQL passes with no new relevant alert.
- Pages Functions are detected and compiled in the Cloudflare build log.
- `CERTIFICATES_DB` exists in the target Cloudflare environment.
- `TURNSTILE_SECRET_KEY` exists as a secret in the target environment.
- Turnstile hostname configuration includes the target hostname.
- CSP permits the Turnstile challenge origin without weakening unrelated directives.
- A real attempt can be created and persisted.
- Server grading returns correct policy outcomes.
- A failed attempt cannot issue a credential.
- A passing attempt can issue exactly one credential.
- An invented local credential cannot be displayed as valid.
- `/verify/<ID>` works from the stable production domain.
- The printed/PDF certificate contains the stable production verification URL.
- A nonexistent ID is rejected.

## 13. Operational notes

### Revocation

The schema already supports `status = 'revoked'`. If revocation administration is added later, it should be a privileged server-side operation with an audit trail. Do not implement revocation through client-side controls alone.

### Schema evolution

Current schema creation is idempotent and embedded in runtime utilities. As the schema becomes more complex, move schema evolution to explicit versioned D1 migrations rather than accumulating nontrivial alterations in `ensureSchema`.

### Auditability

For future institutional or firm use, consider adding issuance/revocation audit metadata, policy version, assessment-version hash, and administrative actor information without exposing protected question content.

### Rate limiting

Turnstile protects issuance from basic automated abuse, but future scale may justify Cloudflare rate limiting for attempt creation, grading, issuance, and public enumeration resistance.

## 14. Current scope

As of RC1, the fully verifiable architecture described here is implemented for **Junior Foundations only**.

Other Academy levels may have completion logic and certificates in the learner experience, but they must not be represented as using this authoritative architecture until their assessment and issuance paths have been migrated and tested against the checklist above.

## 15. Source-of-truth hierarchy

When diagnosing credential questions, use this hierarchy:

1. **Cloudflare D1 credential record** — authority for validity.
2. **Pages Functions server logic** — authority for assessment and issuance rules.
3. **GitHub repository** — authority for versioned implementation and architecture.
4. **Rendered certificate / PDF** — presentation artifact only.
5. **Browser local storage** — convenience state only, never credential authority.

This hierarchy is the core design principle of P1-A and must remain intact as the Academy grows.
