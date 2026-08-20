# P1-B0 Production Issuance Idempotency Fix

Production validation on 2026-08-20 confirmed a human Turnstile challenge could succeed while an already-issued Junior attempt still surfaced a generic issuance failure in the UI.

The fix makes certificate issuance idempotent: after a valid Turnstile challenge, the API first looks for an existing valid certificate tied to the authoritative eligibility/attempt. If found, it returns that credential instead of returning a duplicate-issuance conflict. The same recovery applies to legacy Junior attempts, common eligibility already marked issued, and concurrent issuance races.

Security boundary remains unchanged: Turnstile is still required before fresh issuance or recovery through the issuance endpoint. No duplicate certificate is created.
