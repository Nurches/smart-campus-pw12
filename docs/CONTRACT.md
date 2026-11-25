# Shared requirement / acceptance-criteria sheet — PW #12

Used unchanged by **both** the code-based and the low-code solution.

## User story
As a student, I want to choose a future start time and a duration for the Smart Campus room,
so that I can see immediately whether the room is available and, if not, why.

## Acceptance criteria
| ID  | Criterion |
|-----|-----------|
| AC1 | Start time must be in the future (start equal to "now" is rejected). |
| AC2 | Duration must be greater than zero and at most 120 minutes (whole minutes). |
| AC3 | A request that overlaps an existing booking is Unavailable. Intervals are half-open `[start, end)`, so touching endpoints do not overlap. |
| AC4 | If the room is blocked, every valid request is Unavailable. |
| AC5 | The system displays a clear decision (Available / Unavailable + reason) and never changes the existing bookings. |
| AC6 | Invalid input (empty, non-numeric, impossible date, out of range) receives an understandable message and no availability decision. |

Rule order: validation (AC1, AC2, AC6) → blocked (AC4) → overlap (AC3) → available.

## Inputs
| Input | Type | Example |
|-------|------|---------|
| start | local date-time `YYYY-MM-DDTHH:MM` (Asia/Almaty) | `2026-12-15T10:30` |
| durationMin | whole number of minutes | `60` |
| blocked | boolean (room status) | `false` |
| bookings | fixed fictional list (below) | — |

Fictional bookings for room A101:

| ID | Start | End |
|----|-------|-----|
| B1 | 2026-12-15 09:00 | 10:00 |
| B2 | 2026-12-15 13:00 | 14:30 |
| B3 | 2026-12-16 11:00 | 12:00 |

## Outputs
| Output | Values |
|--------|--------|
| available | `true` / `false` / `null` (null = rejected by validation, no decision) |
| reasonCode | `AVAILABLE`, `OVERLAP`, `ROOM_BLOCKED`, `START_NOT_IN_FUTURE`, `DURATION_OUT_OF_RANGE`, `INVALID_DURATION`, `INVALID_START` |
| message | human-readable sentence shown on screen |

## Common test inputs (prepared before implementation)
| Test | start | duration | blocked | Expected |
|------|-------|----------|---------|----------|
| T1 | 2026-12-15 10:30 | 60 | no | Available / AVAILABLE |
| T2 | 2026-12-15 09:30 | 60 | no | Unavailable / OVERLAP (B1) |
| T3 | 2026-12-15 10:30 | 60 | yes | Unavailable / ROOM_BLOCKED |
| T4 | 2026-12-15 10:30 | 0 | no | validation error / DURATION_OUT_OF_RANGE |
| T5 | 2026-12-15 10:30 | 121 | no | validation error / DURATION_OUT_OF_RANGE |
| T6 | 2026-11-20 10:00 (past) | 60 | no | validation error / START_NOT_IN_FUTURE |
| T7 | 2026-12-15 10:00 (starts when B1 ends) | 60 | no | Available / AVAILABLE |
| T8 | after T1–T7 | — | — | bookings list still B1, B2, B3 unchanged |
