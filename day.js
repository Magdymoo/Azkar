/* أذكاري — day.js (v2.0): «اليوم الأذكاري» — مرجع وحيد لتحديد اليوم والفترة.
   اليوم الأذكاري يبدأ عند فجر موقع المستخدم وينتهي عند فجر اليوم التالي، فمن أتمّ المساء والنوم والورد قبل
   منتصف الليل يبقى مكتملًا حتى الفجر. الصيغة YYYY-MM-DD (نفس مفاتيح S.days، فلا ترحيل).
   مصدر الفجر بالترتيب: __pt.times (الموقع + المنطقة + الطريقة) ← azkar_fajr المخزن ← 04:00. */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  var H36 = 36 * 3600e3, MIN = 60e3;
  var cache = null, last = null, lastInfo = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
  function prev(y, m, d) { var t = new Date(Date.UTC(y, m - 1, d - 1)); return fmt(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); }
  function parts(ts, tz) {
    try {
      var o = {}, f = new Intl.DateTimeFormat('en-CA', { timeZone: tz || undefined, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ts));
      f.forEach(function (x) { if (x.type !== 'literal') o[x.type] = +x.value; });
      if (o.hour === 24) o.hour = 0; return o;
    } catch (e) { var d = new Date(ts); return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours(), minute: d.getMinutes() }; }
  }
  function loc() {
    try { if (w.__pt && w.__pt.loc) { var L = w.__pt.loc(); if (L && isFinite(L.lat) && isFinite(L.lng)) return L; } } catch (e) {}
    try { var v = JSON.parse(AZ.data.get('azkar_loc') || 'null'); return v && isFinite(v.lat) && isFinite(v.lng) ? v : null; } catch (e) { return null; }
  }
  function timesFor(p, L) {
    try { if (L && w.__pt && w.__pt.times && w.__pt.method) return w.__pt.times(p.year, p.month - 1, p.day, L.lat, L.lng, w.__pt.method()); } catch (e) {}
    return null;
  }
  function start() { try { return AZ.data.get('azkar_daystart') === 'midnight' ? 'midnight' : 'fajr'; } catch (e) { return 'fajr'; } }
  function sig() { try { return AZ.data.get('azkar_loc') + '|' + AZ.data.get('azkar_pmethod') + '|' + start(); } catch (e) { return ''; } }

  function calc(ts) {
    var L = loc(), tz = L && L.tz ? L.tz : undefined, p = parts(ts, tz), cal = fmt(p.year, p.month, p.day);
    if (start() === 'midnight') return { key: cal, method: 'midnight', tz: tz || null, exp: ts + MIN };
    var fajrTs = null, method = 'fallback', fajrMin = 240, T = timesFor(p, L);
    if (T && T.fajr && isFinite(T.fajr.getTime())) { fajrTs = T.fajr.getTime(); method = 'fajr'; }
    else {
      var m = /^(\d{1,2}):(\d{2})/.exec(String(AZ.data.get('azkar_fajr') || ''));
      if (m) { fajrMin = +m[1] * 60 + +m[2]; method = 'stored'; }
    }
    var before = fajrTs != null ? ts < fajrTs : (p.hour * 60 + p.minute) < fajrMin;
    return { key: before ? prev(p.year, p.month, p.day) : cal, method: method, tz: tz || null, fajr: fajrTs, exp: before && fajrTs != null ? Math.min(ts + MIN, fajrTs) : ts + MIN };
  }
  function readLast() { if (last) return last; try { last = JSON.parse(AZ.data.get('azkar_lastday') || 'null'); } catch (e) {} return last; }

  function key(ts) {
    var isNow = ts === undefined, t = isNow ? Date.now() : +ts, s;
    if (isNow) { s = sig(); if (cache && cache.sig === s && t < cache.exp && t >= cache.at) return cache.k; }
    var r = calc(t), k = r.key, clamped = false;
    if (isNow) {                                    // حارس الرجوع للخلف: لا مفتاح أقدم إلا إن رجعت الساعة أكثر من 36 ساعة
      var l = readLast();
      if (l && l.k && k < l.k && l.ts - t <= H36) { k = l.k; clamped = true; }
      else if (!l || k !== l.k) { last = { k: k, ts: t }; try { AZ.data.set('azkar_lastday', JSON.stringify(last)); } catch (e) {} }
      cache = { k: k, sig: s, exp: r.exp, at: t };
    }
    lastInfo = { key: k, calendarKey: null, method: r.method, setting: start(), tz: r.tz, fajrUsed: r.fajr ? new Date(r.fajr).toISOString() : null, guardClamped: clamped, at: new Date(t).toISOString() };
    return k;
  }
  /* الفترة: m صباح [فجر، ظهر) · d ظهر [ظهر، عصر) · e مساء [عصر، عشاء) · n ليل [عشاء، فجر اليوم التالي) */
  function phase(ts) {
    var t = ts === undefined ? Date.now() : +ts, L = loc(), p = parts(t, L && L.tz ? L.tz : undefined), T = timesFor(p, L);
    if (T && T.fajr && T.dhuhr && T.asr && T.isha) {
      var f = T.fajr.getTime(), d = T.dhuhr.getTime(), a = T.asr.getTime(), i = T.isha.getTime();
      return t < f ? 'n' : t < d ? 'm' : t < a ? 'd' : t < i ? 'e' : 'n';
    }
    try {                                            // قبل تحميل prayer.js: نستعمل آخر مواقيت محفوظة (تُزاح بمضاعفات 24 ساعة) بدل الساعات الثابتة
      var an = L && JSON.parse(AZ.data.get('azkar_anchors') || 'null');
      if (an && an.fajr && an.dhuhr && an.asr && an.isha) {
        var sh = Math.round((t - an.asr) / 864e5) * 864e5, f2 = an.fajr + sh, d2 = an.dhuhr + sh, a2 = an.asr + sh, i2 = an.isha + sh;
        return t < f2 ? 'n' : t < d2 ? 'm' : t < a2 ? 'd' : t < i2 ? 'e' : 'n';
      }
    } catch (e) {}
    var h = p.hour; return h >= 4 && h < 11 ? 'm' : h >= 11 && h < 15 ? 'd' : h >= 15 && h < 21 ? 'e' : 'n';   // بلا موقع: البديل القديم
  }
  function setStart(mode) { try { AZ.data.set('azkar_daystart', mode === 'midnight' ? 'midnight' : 'fajr'); } catch (e) {} invalidate('daystart'); }
  function invalidate() { cache = null; }
  function info() { key(); return lastInfo; }

  AZ.day = { key: key, phase: phase, start: start, setStart: setStart, invalidate: invalidate, info: info };
})(window);
