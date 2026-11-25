// Fictional booking data for the single Smart Campus room (no real personal data).
// Times are local campus time (Asia/Almaty). This list is read-only: the checker never changes it.
(function (root) {
  'use strict';

  var ROOM = Object.freeze({ id: 'A101', name: 'Smart Campus Room A101 (fictional)' });

  var BOOKINGS = Object.freeze([
    Object.freeze({ id: 'B1', start: '2026-12-15T09:00', end: '2026-12-15T10:00', title: 'Study group (fictional)' }),
    Object.freeze({ id: 'B2', start: '2026-12-15T13:00', end: '2026-12-15T14:30', title: 'Club meeting (fictional)' }),
    Object.freeze({ id: 'B3', start: '2026-12-16T11:00', end: '2026-12-16T12:00', title: 'Tutoring (fictional)' })
  ]);

  var api = { ROOM: ROOM, BOOKINGS: BOOKINGS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SC = Object.assign(root.SC || {}, api);
})(this);
