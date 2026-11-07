/* أذكاري — loc.js (v2.0): مصدر واحد للموقع.
   المخزَّن الوحيد: azkar_loc = {lat,lng,name,tz,cc,src,...} (خاصية الطول lng فقط).
   S.loc={lat,lon} القديم يُرحَّل مرة واحدة ثم يُحذف من الحالة (النسخ الاحتياطية القديمة تُستعاد وتُرحَّل عند الإقلاع). */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  var KEY = 'azkar_loc';
  var ok = function (o) { return !!o && isFinite(o.lat) && isFinite(o.lng) && o.lat !== null && o.lng !== null && Math.abs(o.lat) <= 90 && Math.abs(o.lng) <= 180; };
  var tzn = function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } };
  function get() { try { var v = JSON.parse(AZ.data.get(KEY) || 'null'); return ok(v) ? v : null; } catch (e) { return null; } }
  function notify() {
    try { AZ.day && AZ.day.invalidate && AZ.day.invalidate(); } catch (e) {}
    try { w.dispatchEvent(new w.Event('azkar:times')); } catch (e) {}
  }
  /* c: {lat,lng[,name,tz,cc,src,...]} — يدمج مع المخزَّن؛ إن تغيّر المكان فعليًا (>0.2°) لا يُبقي اسمًا/دولة قديمين */
  function set(c, quiet) {
    if (!c || !isFinite(c.lat) || !isFinite(c.lng)) return null;
    var old = get(), o = Object.assign({}, old || {}, c);
    var moved = old && (Math.abs(old.lat - c.lat) > 0.2 || Math.abs(old.lng - c.lng) > 0.2);
    if (moved) { if (!('name' in c)) o.name = 'موقعي الحالي'; if (!('cc' in c)) delete o.cc; if (!('tz' in c)) o.tz = tzn(); }
    if (!o.tz) o.tz = tzn();
    if (!o.name) o.name = 'موقعي الحالي';
    try { AZ.data.set(KEY, JSON.stringify(o)); } catch (e) { return null; }
    if (!quiet && (!old || old.lat !== o.lat || old.lng !== o.lng)) notify();
    return o;
  }
  /* ترحيل S.loc {lat,lon} القديم → azkar_loc ثم حذفه. يرجع true إن غيّر الحالة S */
  function migrate(S) {
    try {
      if (!S || !('loc' in S)) return false;
      var l = S.loc;
      if (l && isFinite(l.lat) && isFinite(l.lon) && !get()) set({ lat: +l.lat, lng: +l.lon, src: 'legacy' }, true);
      delete S.loc; return true;
    } catch (e) { return false; }
  }
  /* كشف السفر: منطقة الجهاز الزمنية ≠ منطقة الموقع المحفوظ (بفرق إزاحة فعلي الآن؛ الأسماء المستعارة لنفس المنطقة لا تُعدّ سفرًا).
     الرفض يُحفظ لزوج المناطق (azkar_travel_no) فلا نسأل ثانية حتى تتغير المنطقة. */
  function offs(tz) { try { var p = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(new Date()); for (var i = 0; i < p.length; i++) if (p[i].type === 'timeZoneName') return p[i].value; } catch (e) {} return null; }
  function travel(dev) {
    dev = dev || tzn(); var l = get();
    if (!l || !l.tz || !dev || l.tz === dev) return null;
    var a = offs(l.tz), b = offs(dev); if (a && b && a === b) return null;
    var no = ''; try { no = AZ.data.get('azkar_travel_no') || ''; } catch (e) {}
    if (no === dev + '|' + l.tz) return null;
    return { from: l.tz, to: dev, name: l.name || '' };
  }
  function dismissTravel(dev) { var l = get(); if (!l) return; try { AZ.data.set('azkar_travel_no', (dev || tzn()) + '|' + l.tz); } catch (e) {} }
  AZ.loc = { get: get, set: set, migrate: migrate, has: function () { return !!get(); }, travel: travel, dismissTravel: dismissTravel };
})(window);
