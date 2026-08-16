# Transfer Pricing Insights Academy

Open-access Transfer Pricing learning platform designed to build knowledge and professional judgment from foundational concepts to advanced practice.

**Created by Manuel Carrero Rojo.**

> Conocimiento. Criterio. Impacto.

## Product principles

- Spanish-first learning with contextual English Transfer Pricing terminology.
- OECD Transfer Pricing Guidelines as the academic backbone.
- Public learning content works without an account.
- Accounts are introduced only for persistence, certificable assessments and credentials.
- Credentials evidence assessed knowledge and reasoning; they do not certify professional experience, licensure or employment rank.
- No streaks, XP, rankings, leaderboards or AI tutor in the MVP.
- Static-first architecture with dynamic services only where identity, persistence or credential integrity require them.

## Technical direction

- React + TypeScript + Vite
- React Router
- Version-controlled academic content
- Cloudflare Pages for the static-first frontend
- Supabase Auth + Postgres + RLS + Edge Functions for later authenticated phases

## Current implementation scope

The first vertical slice validates:

`Home → Start → J1 → Lesson 1 → formative check`

Backend integration is deliberately deferred until the public learning path is coherent and tested.

## Security baseline

- No backend API or elevated credential is present in the current client implementation.
- `.env` files are excluded from source control; `.env.example` contains placeholders only.
- `VITE_*` variables are explicitly treated as public browser configuration.
- A CI guard scans source files and the final production bundle for common secret patterns.
- CI also runs a dependency audit, TypeScript validation and a production build.
- CodeQL scans JavaScript/TypeScript using the `security-extended` query suite.
- Cloudflare Pages security headers are version-controlled in `public/_headers`, including CSP, anti-framing, MIME sniffing protection, referrer policy and permissions restrictions.
- Dependabot monitors npm and GitHub Actions dependencies.
- Future Supabase browser code may use only a publishable key. Secret/service-role credentials and certificable answer keys are backend-only.

See [SECURITY.md](./SECURITY.md) for the complete policy.

## Academic integrity

Transfer Pricing Insights Academy teaches the OECD framework as its doctrinal backbone. The OECD Guidelines do not automatically replace local law; jurisdiction-specific application must be verified separately.

© Manuel Carrero Rojo. Transfer Pricing Insights Academy.
