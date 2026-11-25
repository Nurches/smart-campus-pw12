# Security checklist — PW #12 (Lecture #12)

Legend: ✅ checked and OK · ⚠️ risk noted · ⏳ to be checked by the student in the low-code platform.

| # | Check | Code-based | Low-code (Appsmith) |
|---|-------|-----------|---------------------|
| S1 | Input validation on every field (type, range, format) | ✅ `validation.js`, tests U3–U7, U13, U15 | ⏳ same rules in `Checker.check()`; run T4–T6 + `abc`, `30.5` |
| S2 | Injection: no SQL / no query built from input | ✅ no database, no queries | ⏳ confirm no datasource / query was created |
| S3 | XSS: user input rendered as text, not HTML | ✅ only `textContent`; manual DAST: `<img src=x onerror=alert(1)>` → validation message, no dialog | ⏳ type the same payload into Duration; Text widget must show it as text / reject it |
| S4 | Data not modified by checks (integrity) | ✅ `Object.freeze`, T8 + T8b | ⏳ T8 (table still 3 rows) |
| S5 | Secrets / API keys | ✅ none exist; nothing in client code | ⏳ no datasource credentials, no keys in JS Object or screenshots |
| S6 | Authentication / permissions | ✅ static page, no accounts | ⚠️ workspace account = admin; app made public for demo — fictional data only; least privilege: do not invite others as Developer |
| S7 | Public sharing | ⚠️ artifact link private until shared | ⚠️ public view link; edit access stays private |
| S8 | Connectors / integrations | ✅ none | ⏳ no Google Sheets / API connectors added |
| S9 | Dependencies (SCA) | ✅ zero npm dependencies; only Node for tests | ⚠️ platform code owned by Appsmith — updates are the vendor's responsibility, we cannot audit or pin them |
| S10 | Runtime checks (DAST, manual, safe) | ✅ Playwright run of T1–T7 + XSS payload, desktop 1280px and mobile 390px, no dialogs fired | ⏳ same manual inputs in deployed app only |
| S11 | Third-party scanning | ✅ no scanning of third-party services was done | ✅ do NOT run scanners against appsmith.com (not authorised) |
| S12 | AI agent least privilege | ✅ AI worked only in a sandbox workspace; changes reviewed through tests | ⏳ if Appsmith AI is used, note it |
| S13 | Untrusted content (templates, prompts) | ✅ no imported templates | ⏳ start from blank app, not a marketplace template |
