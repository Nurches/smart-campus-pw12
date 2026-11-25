# Security checklist — PW #12 (Lecture #12)

Results observed on 2026-11-25. Legend: OK = checked and fine · RISK = accepted / noted · FIXED = defect found and repaired.

| # | Check | Code-based | Low-code (Appsmith) |
|---|-------|-----------|---------------------|
| S1 | Input validation on every field | OK — `validation.js`, unit tests U3–U7, U13, U15 | OK — same rules in `Checker.check()`; T4–T6 and a non-numeric payload rejected |
| S2 | SQL / query injection | OK — no database, no queries | OK — datasource step skipped; no datasource or query exists |
| S3 | XSS / output handling | OK — `textContent` only; `<img src=x onerror=alert(1)>` → validation message, no dialog | OK — `<img src=x onerror=console.log('xss')>` → "must be a whole number"; input never echoed into the result |
| S4 | Data integrity | OK — `Object.freeze`, T8 + T8b | OK — T8; `check()` never writes to `bookings` |
| S5 | Secrets / API keys | OK — none exist | OK — none in JS Object, bindings, export JSON or screenshots |
| S6 | Permissions, least privilege | OK — static page, no accounts | RISK — single workspace Administrator; nobody else invited |
| S7 | Public sharing | RISK (low) — demo link private until shared | RISK — "Make application public" on (view only); acceptable only with fictional data |
| S8 | Connectors / integrations | OK — none | OK — none |
| S9 | Dependencies (SCA) | OK — zero npm dependencies | RISK — platform code and updates owned by Appsmith; cannot audit or pin |
| S10 | Runtime checks (DAST, manual, safe) | OK — Playwright T1–T7 + XSS, 1280 px and 390 px | OK — same inputs in preview; T2, T7 rechecked in deployed app |
| S11 | No unauthorised scanning | OK | OK — no scanners against appsmith.com |
| S12 | AI agent least privilege | OK — AI worked in a sandbox; output checked by tests | RISK (controlled) — AI agent acted in the signed-in browser; sign-in by the student, publish/export approved separately |
| S13 | Untrusted templates / prompts | OK — no templates | OK — blank application |
| S14 | Data left in the browser | OK — nothing stored | FIXED (D1) — `storeValue` persisted results to localStorage by default; now `storeValue('result', r, false)` |
