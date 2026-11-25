// Availability calculation layer (AC3, AC4, AC5). Pure, deterministic, never mutates bookings.
(function (root) {
  'use strict';

  var V = (typeof module !== 'undefined' && module.exports) ? require('./validation.js') : root.SC;

  // Half-open intervals [start, end): touching endpoints do not overlap.
  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  function fmtTime(d) {
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  // input: { start: "YYYY-MM-DDTHH:MM", durationMin: number|string, blocked: boolean }
  // returns { available: boolean|null, reasonCode: string, message: string }
  //   available === null means the request was rejected by validation (no decision made).
  function checkAvailability(input, bookings, now) {
    var v = V.validateRequest(input, now);
    if (!v.ok) return { available: null, reasonCode: v.reasonCode, message: v.message };

    if (input.blocked === true) {
      return { available: false, reasonCode: 'ROOM_BLOCKED', message: 'Unavailable: the room is blocked and cannot be booked.' };
    }

    var reqStart = v.start.getTime();
    var reqEnd = reqStart + v.durationMin * 60000;

    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      var bs = V.parseLocal(b.start), be = V.parseLocal(b.end);
      if (!bs || !be) continue; // malformed fixture rows are ignored, never "fixed"
      if (overlaps(reqStart, reqEnd, bs.getTime(), be.getTime())) {
        return {
          available: false,
          reasonCode: 'OVERLAP',
          message: 'Unavailable: overlaps existing booking ' + b.id + ' (' + fmtTime(bs) + '–' + fmtTime(be) + ').'
        };
      }
    }
    var endDate = new Date(reqEnd);
    return {
      available: true,
      reasonCode: 'AVAILABLE',
      message: 'Available: the room is free from ' + fmtTime(v.start) + ' to ' + fmtTime(endDate) + '.'
    };
  }

  var api = { overlaps: overlaps, checkAvailability: checkAvailability };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SC = Object.assign(root.SC || {}, api);
})(this);
