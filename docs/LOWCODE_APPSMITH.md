# Low-code track — Appsmith (free cloud plan)

Goal: the same checker, same contract (`docs/CONTRACT.md`), built in a visual builder.
**Start a stopwatch before each phase** and write the minutes into the table at the end.

## Phase 1 — Setup (measure)
1. Go to https://app.appsmith.com and sign up / sign in with Google (free plan, no card).
2. Create a new workspace if asked → **Create new → Application**.
3. Rename the app: `Smart Campus Checker — PW12 (low-code)`.
4. Screenshot: empty editor with the app name. → `low_setup.png`

## Phase 2 — Implementation (measure)
Drag these widgets onto the canvas (Widgets tab on the left). Set the **name** exactly as written (click the widget name at the top of its property pane).

| Widget | Name | Properties |
|--------|------|-----------|
| Text | `TitleText` | Text: `Smart Campus Room Availability Checker (low-code)` |
| Datetime Picker | `StartPicker` | Label `Start time`; Date format `YYYY-MM-DD HH:mm`; Time precision `Minute`; **leave Min/Max date empty** |
| Input | `DurationInput` | Label `Duration (minutes)`; Data type **Text**; leave Required / Min / Max **off** (validation stays in one place, same as code track) |
| Switch | `BlockedSwitch` | Label `Room is blocked`; Default state off |
| Button | `CheckBtn` | Label `Check availability`; onClick → see below |
| Text | `ResultText` | see below |
| Table | `BookingsTable` | Table data: `{{Checker.bookings}}`; turn off "Allow adding a row", inline editing off |

### JS Object (the "small script")
Left panel → **Queries/JS → + New JS Object**, rename it to `Checker`, replace the content with:

```javascript
export default {
  bookings: [
    { id: 'B1', start: '2026-12-15T09:00:00', end: '2026-12-15T10:00:00', title: 'Study group (fictional)' },
    { id: 'B2', start: '2026-12-15T13:00:00', end: '2026-12-15T14:30:00', title: 'Club meeting (fictional)' },
    { id: 'B3', start: '2026-12-16T11:00:00', end: '2026-12-16T12:00:00', title: 'Tutoring (fictional)' }
  ],

  check () {
    const now = new Date();
    const res = (available, reasonCode, message) => {
      const r = { available, reasonCode, message };
      storeValue('result', r);
      return r;
    };
    // AC6 / AC1: start
    if (!StartPicker.selectedDate) return res(null, 'INVALID_START', 'Please choose a start date and time.');
    const start = new Date(StartPicker.selectedDate);
    if (isNaN(start.getTime())) return res(null, 'INVALID_START', 'Start time is not a valid date and time.');
    // AC6 / AC2: duration
    const d = String(DurationInput.text ?? '').trim();
    if (d === '') return res(null, 'INVALID_DURATION', 'Please enter a duration in minutes.');
    if (!/^-?\d+$/.test(d)) return res(null, 'INVALID_DURATION', 'Duration must be a whole number of minutes.');
    const dur = parseInt(d, 10);
    if (dur <= 0 || dur > 120) return res(null, 'DURATION_OUT_OF_RANGE', 'Duration must be greater than 0 and at most 120 minutes (you entered ' + dur + ').');
    if (start.getTime() <= now.getTime()) return res(null, 'START_NOT_IN_FUTURE', 'Start time must be in the future.');
    // AC4
    if (BlockedSwitch.isSwitchedOn) return res(false, 'ROOM_BLOCKED', 'Unavailable: the room is blocked and cannot be booked.');
    // AC3 — half-open intervals
    const s = start.getTime(), e = s + dur * 60000;
    for (const b of this.bookings) {
      const bs = new Date(b.start).getTime(), be = new Date(b.end).getTime();
      if (s < be && bs < e) return res(false, 'OVERLAP', 'Unavailable: overlaps existing booking ' + b.id + ' (' + b.start.slice(11, 16) + '–' + b.end.slice(11, 16) + ').');
    }
    return res(true, 'AVAILABLE', 'Available: the room is free.');
  }
}
```

Note: `check()` never writes to `this.bookings` (AC5).

### Wire the widgets
- `CheckBtn` → onClick → switch to JS (`JS` toggle) → `{{Checker.check()}}`
- `ResultText` → Text:
  ```
  {{appsmith.store.result ? ((appsmith.store.result.available === true ? 'Available' : appsmith.store.result.available === false ? 'Unavailable' : 'Please fix the input') + ' — ' + appsmith.store.result.message + ' [code: ' + appsmith.store.result.reasonCode + ']') : 'No check yet.'}}
  ```
- `ResultText` → Style → Text color (JS):
  `{{appsmith.store.result?.available === true ? '#1f7a45' : appsmith.store.result?.available === false ? '#a12a2a' : '#8a5a00'}}`
- Add a small Text under the table: `Bookings: {{Checker.bookings.length}} rows (read-only)`.

Screenshot: editor with widgets + JS object. → `low_editor.png`, `low_js.png`

## Phase 3 — Debugging (measure)
Click **Preview** (top right). If something fails, fix it and write down every defect:
what happened, why, how fixed, minutes spent. Typical traps:
- `selectedDate` timezone: if T7 (10:00) returns OVERLAP, the picker gives UTC — note it as a defect.
- Input widget with Data type **Number** may hide `0` or block typing letters — that is why Data type Text is used.

## Phase 4 — Testing (measure)
In **Preview / deployed** mode run T1–T8 from `docs/CONTRACT.md` exactly. After each test take a screenshot
(`low_T1.png` … `low_T7.png`), and for T8 screenshot the table still showing B1, B2, B3 with "3 rows".
Fill in the observed result (copy the text from ResultText).

Narrow screen check: in Chrome DevTools toggle device toolbar (iPhone 12) → `low_mobile.png`.

## Phase 5 — Publish, export, versioning
1. **Deploy** (top right) → open the deployed URL.
2. **Share** → toggle "Make application public" → copy the link (needed for the email).
   Security note: this makes the app visible to anyone with the link — acceptable only because data is fictional.
3. Export: app menu (⋯ / app name) → **Export** → downloads a `.json` file. Commit it to the repo as
   `lowcode/appsmith-export.json` (it is not a ZIP, so it is allowed).
4. Git: Appsmith free plan offers "Connect Git" for a limited number of repos — try it and write down whether it worked.

## Record (paste into the report)
| Phase | Minutes |
|-------|---------|
| Setup | |
| Implementation | |
| Debugging | |
| Testing | |
| Defects found / fixed / unresolved | |
| Requirements the platform could not implement (or needed JS for) | |
