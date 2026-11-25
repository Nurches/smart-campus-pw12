// Presentation layer: reads the form, calls the rule engine, renders the result.
// Uses textContent only (no innerHTML with user data) to avoid XSS.
(function (root) {
  'use strict';
  var SC = root.SC;

  function $(id) { return document.getElementById(id); }

  function renderBookings() {
    $('room-name').textContent = SC.ROOM.name;
    var tbody = $('bookings-body');
    tbody.textContent = '';
    SC.BOOKINGS.forEach(function (b) {
      var tr = document.createElement('tr');
      [b.id, b.start.replace('T', ' '), b.end.slice(11), b.title].forEach(function (v) {
        var td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    $('bookings-count').textContent = String(SC.BOOKINGS.length);
  }

  function showResult(res) {
    var box = $('result');
    box.className = 'result ' + (res.available === true ? 'ok' : res.available === false ? 'no' : 'err');
    $('result-title').textContent =
      res.available === true ? 'Available' : res.available === false ? 'Unavailable' : 'Please fix the input';
    $('result-message').textContent = res.message;
    $('result-code').textContent = 'reason code: ' + res.reasonCode;
    box.hidden = false;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var input = {
      start: $('start').value,
      durationMin: $('duration').value,
      blocked: $('blocked').checked
    };
    var res = SC.checkAvailability(input, SC.BOOKINGS, new Date());
    showResult(res);
    $('bookings-count').textContent = String(SC.BOOKINGS.length);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderBookings();
    $('check-form').addEventListener('submit', onSubmit);
  });
})(this);
