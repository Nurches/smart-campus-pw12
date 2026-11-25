// Dependency-free test runner. Run: TZ=Asia/Almaty node tests/run-tests.js
'use strict';
const { BOOKINGS } = require('../src/bookings.js');
const { checkAvailability, overlaps } = require('../src/availability.js');
const { validateRequest, parseLocal } = require('../src/validation.js');

// Fixed clock so results are reproducible: 1 Dec 2026, 08:00 local time.
const NOW = new Date(2026, 11, 1, 8, 0);
const snapshot = JSON.stringify(BOOKINGS);

const results = [];
function test(id, title, fn) {
  try { fn(); results.push({ id, title, pass: true }); }
  catch (e) { results.push({ id, title, pass: false, error: e.message }); }
}
function expect(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function run(start, durationMin, blocked = false) {
  return checkAvailability({ start, durationMin, blocked }, BOOKINGS, NOW);
}

// ---- The eight shared acceptance tests (identical for both tracks) ----
const shared = [
  ['T1', 'valid free interval -> Available', () => {
    const r = run('2026-12-15T10:30', 60); expect(r.available, true, 'available'); expect(r.reasonCode, 'AVAILABLE', 'code');
  }],
  ['T2', 'overlap with existing booking -> Unavailable', () => {
    const r = run('2026-12-15T09:30', 60); expect(r.available, false, 'available'); expect(r.reasonCode, 'OVERLAP', 'code');
  }],
  ['T3', 'blocked room -> Unavailable', () => {
    const r = run('2026-12-15T10:30', 60, true); expect(r.available, false, 'available'); expect(r.reasonCode, 'ROOM_BLOCKED', 'code');
  }],
  ['T4', 'duration = 0 -> validation error', () => {
    const r = run('2026-12-15T10:30', 0); expect(r.available, null, 'available'); expect(r.reasonCode, 'DURATION_OUT_OF_RANGE', 'code');
  }],
  ['T5', 'duration = 121 -> validation error', () => {
    const r = run('2026-12-15T10:30', 121); expect(r.available, null, 'available'); expect(r.reasonCode, 'DURATION_OUT_OF_RANGE', 'code');
  }],
  ['T6', 'past start time -> validation error', () => {
    const r = run('2026-11-20T10:00', 60); expect(r.available, null, 'available'); expect(r.reasonCode, 'START_NOT_IN_FUTURE', 'code');
  }],
  ['T7', 'adjacent non-overlapping interval -> Available', () => {
    const r = run('2026-12-15T10:00', 60); expect(r.available, true, 'available'); expect(r.reasonCode, 'AVAILABLE', 'code');
  }],
  ['T8', 'booking data unchanged after checks', () => {
    expect(JSON.stringify(BOOKINGS), snapshot, 'bookings JSON'); expect(BOOKINGS.length, 3, 'count');
  }],
];
shared.forEach(([id, t, fn]) => test(id, t, fn));

// ---- Extra unit tests (code-based track only) ----
test('U1', 'duration 120 is accepted (upper bound)', () => expect(run('2026-12-15T10:30', 120).available, true, 'available'));
test('U2', 'duration 1 is accepted (lower bound)', () => expect(run('2026-12-15T10:30', 1).available, true, 'available'));
test('U3', 'negative duration rejected', () => expect(run('2026-12-15T10:30', -5).reasonCode, 'DURATION_OUT_OF_RANGE', 'code'));
test('U4', 'non-numeric duration rejected', () => expect(run('2026-12-15T10:30', 'abc').reasonCode, 'INVALID_DURATION', 'code'));
test('U5', 'decimal duration rejected', () => expect(run('2026-12-15T10:30', '30.5').reasonCode, 'INVALID_DURATION', 'code'));
test('U6', 'empty start rejected', () => expect(run('', 60).reasonCode, 'INVALID_START', 'code'));
test('U7', 'impossible date rejected', () => expect(run('2026-02-31T10:00', 60).reasonCode, 'INVALID_START', 'code'));
test('U8', 'start equal to now rejected', () => expect(run('2026-12-01T08:00', 30).reasonCode, 'START_NOT_IN_FUTURE', 'code'));
test('U9', 'interval ending exactly at booking start is available', () => expect(run('2026-12-15T12:00', 60).available, true, 'available'));
test('U10', 'interval covering whole booking is unavailable', () => expect(run('2026-12-15T12:50', 120).reasonCode, 'OVERLAP', 'code'));
test('U11', 'blocked check wins over overlap', () => expect(run('2026-12-15T09:30', 60, true).reasonCode, 'ROOM_BLOCKED', 'code'));
test('U12', 'validation wins over blocked', () => expect(run('2026-12-15T10:30', 0, true).reasonCode, 'DURATION_OUT_OF_RANGE', 'code'));
test('U13', 'HTML in input is treated as invalid data', () => expect(run('<script>alert(1)</script>', 60).reasonCode, 'INVALID_START', 'code'));
test('U14', 'overlaps() is half-open', () => { expect(overlaps(0, 10, 10, 20), false, 'touch'); expect(overlaps(0, 11, 10, 20), true, 'cross'); });
test('U15', 'parseLocal rejects 24:00', () => expect(parseLocal('2026-12-15T24:00'), null, 'parse'));
test('U16', 'bookings array is frozen', () => expect(Object.isFrozen(BOOKINGS), true, 'frozen'));
test('U17', 'validateRequest throws on invalid clock', () => {
  let threw = false; try { validateRequest({ start: '2026-12-15T10:30', durationMin: 30 }, new Date('x')); } catch (e) { threw = true; }
  expect(threw, true, 'threw');
});
// T8 again after all extra tests ran
test('T8b', 'booking data still unchanged after all 25 checks', () => expect(JSON.stringify(BOOKINGS), snapshot, 'bookings JSON'));

// ---- Report ----
let pass = 0;
for (const r of results) {
  if (r.pass) pass++;
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.id.padEnd(4)} ${r.title}${r.pass ? '' : '  -> ' + r.error}`);
}
const sharedPass = results.filter(r => /^T[1-8]$/.test(r.id) && r.pass).length;
console.log(`\nShared acceptance tests: ${sharedPass}/8`);
console.log(`All tests: ${pass}/${results.length} passed`);
process.exitCode = pass === results.length ? 0 : 1;
