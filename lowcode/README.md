# Low-code track — Appsmith results (2026-11-25)

- Live app (public, view only): https://app.appsmith.com/app/smart-campus-checker-pw12-low-code/page1-6b068c64e2a483c41012b921
- Built from a blank app in Appsmith Cloud (free plan) following `docs/LOWCODE_APPSMITH.md`.
- Shared tests: **8 / 8** passed (screenshots `evidence/low_T*.jpg`, composite `evidence/fig8_low_tests.png`).
- Defect D1 (fixed): `storeValue` persisted the last result in localStorage, so a reload showed a stale decision. Fix: `storeValue('result', r, false)`.
- Open issue: the fixed-layout canvas does not stack on narrow screens (`evidence/low_narrow_T7.jpg`).
- Export: `appsmith-export.json` (Appsmith → Export application). Contains no datasource or credentials.
