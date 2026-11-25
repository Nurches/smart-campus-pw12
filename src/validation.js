// Input validation layer (AC1, AC2, AC6). Pure functions, no DOM access.
(function (root) {
  'use strict';

  var MAX_DURATION_MIN = 120;
  var LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

  // Parses "YYYY-MM-DDTHH:MM" as local time. Returns Date or null.
  function parseLocal(value) {
    if (typeof value !== 'string') return null;
    var m = LOCAL_DT.exec(value.trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], h = +m[4], mi = +m[5];
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
    var dt = new Date(y, mo - 1, d, h, mi, 0, 0);
    // Reject roll-over dates such as 2026-02-31.
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  // Returns { ok: true, start: Date, durationMin: number } or
  //         { ok: false, reasonCode: string, message: string }.
  function validateRequest(input, now) {
    var startRaw = input && input.start;
    var durRaw = input && input.durationMin;

    if (startRaw === undefined || startRaw === null || String(startRaw).trim() === '') {
      return fail('INVALID_START', 'Please choose a start date and time.');
    }
    var start = parseLocal(String(startRaw));
    if (!start) {
      return fail('INVALID_START', 'Start time is not a valid date and time (use YYYY-MM-DD HH:MM).');
    }
    if (durRaw === undefined || durRaw === null || String(durRaw).trim() === '') {
      return fail('INVALID_DURATION', 'Please enter a duration in minutes.');
    }
    var durStr = String(durRaw).trim();
    if (!/^-?\d+$/.test(durStr)) {
      return fail('INVALID_DURATION', 'Duration must be a whole number of minutes.');
    }
    var duration = parseInt(durStr, 10);
    if (duration <= 0 || duration > MAX_DURATION_MIN) {
      return fail('DURATION_OUT_OF_RANGE',
        'Duration must be greater than 0 and at most ' + MAX_DURATION_MIN + ' minutes (you entered ' + duration + ').');
    }
    if (!(now instanceof Date) || isNaN(now.getTime())) {
      throw new Error('validateRequest: "now" must be a valid Date');
    }
    if (start.getTime() <= now.getTime()) {
      return fail('START_NOT_IN_FUTURE', 'Start time must be in the future.');
    }
    return { ok: true, start: start, durationMin: duration };
  }

  function fail(code, message) {
    return { ok: false, reasonCode: code, message: message };
  }

  var api = { MAX_DURATION_MIN: MAX_DURATION_MIN, parseLocal: parseLocal, validateRequest: validateRequest };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SC = Object.assign(root.SC || {}, api);
})(this);
