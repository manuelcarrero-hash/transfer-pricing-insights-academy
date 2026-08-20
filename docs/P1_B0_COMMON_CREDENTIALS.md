# P1-B0 — Common Credentials Infrastructure

**Project:** Transfer Pricing Insights Academy  
**Workstream:** P1-B — Verifiable Credentials Expansion  
**Phase:** P1-B0  
**Date:** 2026-08-20

## Purpose

P1-B0 generalizes the production-proven Junior Foundations credential architecture so Practitioner, Advanced Practitioner, and Senior Knowledge can migrate without creating separate certificate backends. This phase creates shared infrastructure only; it does not yet make the three upper-level credentials authoritative or publicly verifiable.

## Trust model

The shared architecture preserves the separation between:

1. browser-local learning progress, used only for UX continuity;
2. server-side component evidence, stored in D1;
3. server-side final eligibility, stored in D1;
4. the authoritative credential record, stored in the central `certificates` registry and exposed through the single public `/verify/:id` route.

A client-side `passed=true`, localStorage value, PDF, screenshot, or fabricated URL is never sufficient evidence for issuance.

## Canonical credential types

| credentialType | Level code | Public name | ID prefix | Required authoritative components |
|---|---|---|---|---|
| `junior-foundations` | `JF` | Transfer Pricing Junior Foundations | `TPIA-JF` | `junior-assessment` |
| `practitioner` | `TP` | Transfer Pricing Practitioner | `TPIA-TP` | `consultant-assessment`, `consultant-case` |
| `advanced-practitioner` | `ATP` | Advanced Transfer Pricing Practitioner | `TPIA-ATP` | `semi-senior-assessment`, `advanced-case-a`, `advanced-case-b` |
| `senior-knowledge` | `SK` | Senior-Level Transfer Pricing Knowledge | `TPIA-SK` | `senior-components-ab`, `senior-capstone` |

The first three use an `all-components-pass` eligibility policy. Senior is explicitly tagged `senior-composite` because P1-B3 must preserve its combined score, Capstone threshold, and domain floors rather than reduce eligibility to a generic Boolean conjunction.

## D1 common evidence model

### `credential_evidence`

Stores authoritative results by component. Its primary key is `(eligibility_id, credential_type, component_key)`.

Fields:

- `eligibility_id`
- `credential_type`
- `component_key`
- `score`
- `passed`
- `result_data`
- `recorded_at`

This table lets later phases preserve evidence that every required assessment/case component was completed server-side.

### `credential_eligibility`

Stores the final server-side issuance decision for one credential candidate.

Fields:

- `eligibility_id`
- `credential_type`
- `score`
- `eligible`
- `result_data`
- `certificate_issued`
- `created_at`
- `updated_at`

The issuance endpoint consumes this record. It does not trust browser progress or a client-provided score.

### `certificates`

The existing central registry remains authoritative. Its current physical `attempt_id` column is retained for backwards-compatible production migration and is used as the unique authoritative eligibility-source ID. Renaming that production column is deliberately deferred because it would add migration risk without improving the trust boundary.

## Shared issuance

`POST /api/certificates/issue` now resolves a canonical credential definition from `credentialType` and consumes common server-side eligibility. For backwards compatibility, an omitted `credentialType` continues to mean Junior Foundations and the existing `attemptId` input remains accepted as an alias for `eligibilityId`.

Issuance continues to require Cloudflare Turnstile and cryptographically random IDs via `crypto.getRandomValues`. A successful issuance atomically creates the certificate record and marks the authoritative eligibility record as issued.

## Junior migration pattern

Junior remains the production reference implementation.

New Junior grading writes, in one D1 batch:

1. the existing `junior_assessment_attempts` grading state;
2. `credential_evidence` for `junior-assessment`;
3. final `credential_eligibility`.

For an already-passed Junior attempt created before P1-B0, the issuance endpoint can safely backfill the common evidence/eligibility records from the existing server-side Junior attempt. It never accepts a client-provided pass result for this compatibility path.

## Public verification

There remains exactly one verification route:

`/verify/:id`

The certificate API now additionally returns canonical `credentialType` derived from the registry's level code. Public validity continues to come from D1 status, not from local state.

## What P1-B0 does not do

P1-B0 does **not** migrate the Consultant cumulative assessment, Consultant case, Semi Senior assessment/cases, Senior final assessment, Senior Capstone, or their certificate pages. Until P1-B1/P1-B2/P1-B3 are completed, those upper-level credentials must continue to be described as client-side/local and non-verifiable.

## Regression guard

`scripts/check-credential-infrastructure.mjs` is part of CI and fails when:

- a canonical credential type or required component disappears;
- the common evidence or eligibility tables disappear;
- issuance is hardcoded back to Junior metadata;
- Junior stops writing common evidence/eligibility;
- `Math.random()` appears in credential infrastructure;
- backend credential code references `localStorage`;
- public verification ceases to be a single `/verify/:id` function.

## Exit gate

P1-B0 is eligible for CLOSED / PASS only after:

- credential infrastructure integrity check passes;
- typecheck/build pass;
- existing E2E suite passes;
- CodeQL passes;
- Cloudflare preview deploy succeeds;
- Junior assessment → issuance → PDF/verification regression is functionally validated.

Only then should P1-B1 migrate Transfer Pricing Practitioner onto this common foundation.
