# Security Policy

Transfer Pricing Insights Academy treats assessment integrity, learner data and credential verification as security-sensitive functions.

## Client / browser rules

- Browser-delivered code must contain no backend secrets.
- Every `VITE_*` environment variable is treated as public because Vite includes it in the client bundle.
- When Supabase is introduced, the browser may use only the project URL and a publishable key.
- Supabase secret keys and legacy service-role credentials are backend-only and must never appear in `src/`, `public/`, frontend build configuration, URLs, logs, documentation examples containing real values, or client-side environment variables.
- Certifiable answer keys must never be shipped in the browser bundle.
- Final scoring, demonstrated competencies and credential issuance must execute in trusted server-side code.

## Database and API rules

- Row Level Security is required on every table exposed through the Supabase Data API.
- Policies must follow least privilege and must be tested for unauthenticated users, authenticated users, cross-user access and direct API calls.
- Elevated backend credentials bypass RLS and therefore must be stored only as provider-managed backend secrets.
- Public credential verification must expose only the minimum verification payload and never email addresses, assessment responses, attempt history or private scores.

## Deployment rules

- Production deploys must use HTTPS.
- Cloudflare security headers are version-controlled in `public/_headers`.
- CI must pass the client secret exposure guard, dependency audit, TypeScript validation and production build before merge.
- Environment files are ignored by Git. `.env.example` contains placeholders only.
- Dependencies and GitHub Actions are monitored through Dependabot.

## Secret incident rule

If a secret is ever committed or exposed, removing it from the latest file is not sufficient. Treat it as compromised: rotate/revoke it at the provider, inspect logs and access, then remove the value from repository history as appropriate.

## Scope note

A Supabase publishable key is designed for public clients and is not itself a security boundary. Data protection must come from authentication, Row Level Security, least-privilege grants and trusted server-side operations. Elevated Supabase secret/service-role credentials are security boundaries and are never allowed in client code.

## Reporting

Until a dedicated private reporting channel is established, do not publish suspected vulnerabilities or credentials in a public GitHub issue. Contact the repository owner privately.
