# Smart Campus Room Availability Checker — Practice Work #12

Code-based vs low-code comparison. AI-Driven Software Engineering, KBTU.
Author: Nurassyl Turarbek, 24B032077.

## Code-based solution (this repository)
Plain HTML + JavaScript, no dependencies, no build tools required.

| File | Responsibility |
|------|----------------|
| `src/bookings.js` | fixed fictional room and bookings (frozen, read-only) |
| `src/validation.js` | input validation — AC1, AC2, AC6 |
| `src/availability.js` | availability calculation — AC3, AC4, AC5 (pure, never mutates bookings) |
| `src/ui.js` | DOM layer — reads form, renders result with `textContent` only |
| `index.html` | page and responsive styles (desktop + narrow screens) |
| `tests/run-tests.js` | shared tests T1–T8 + 17 extra unit tests, fixed clock |
| `scripts/build.js` | inlines the scripts into `dist/index.html` (single-file live demo) |

### Run
```bash
# open the app
open index.html            # or double-click it

# run tests (Node 18+)
TZ=Asia/Almaty node tests/run-tests.js

# build single-file demo
node scripts/build.js
```

Result on 2026-11-25: shared acceptance tests 8/8, all tests 26/26.

## Documents
- `docs/CONTRACT.md` — shared user story, AC1–AC6, inputs/outputs, test inputs
- `docs/LOWCODE_APPSMITH.md` — how the low-code version was built in Appsmith
- `docs/SECURITY.md` — security checklist for both tracks
- `evidence/` — test output and screenshots

Fictional data only: no login, no personal data, no payment, no database.
