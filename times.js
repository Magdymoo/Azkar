/* أذكاري — times.js (v2.0): «مرساة الأوقات» — المصدر الوحيد للمواقيت المرجعية ومواعيد التذكير.
   المراسي: fajr · sunrise · dhuhr · asr · maghrib · isha · midnight · lastThird (كلها من __pt: الموقع + المنطقة + الطريقة الفعلية).
   نموذج التذكير (يُحفظ داخل S.rem[k] فيدخل النسخ الاحتياطي): { mode:'anchor'|'fixed', anchor, offset(د), t:'HH:MM' }.
   كل جزء (الإشعارات، رسالة الرئيسية، الإعدادات) يقرأ من هنا، وتغيّر الموقع/الطريقة (azkar:times) يعيد إطلاق times:changed. */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  var MIN = 6e4, getS = function () { return null; }, persist = function () {};
  var ANCH = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'midnight', 'lastThird'];

  /* الخيارات المتاحة للمستخدم (الفقهاء يختلفون في بداية المساء، فالاختيار له) */
  var PRESETS = {
    e: [
      { id: 'asr', a: 'asr', o: 0, l: 'بعد العصر' },
      { id: 'mag-30', a: 'maghrib', o: -30, l: 'قبل المغرب بـ ٣٠ دقيقة' },
      { id: 'mag', a: 'maghrib', o: 0, l: 'عند المغرب' },
      { id: 'mag+15', a: 'maghrib', o: 15, l: 'بعد المغرب بـ ١٥ دقيقة' },
      { id: 'fixed', a: null, o: 0, l: 'وقت ثابت' }
    ],
    m: [
      { id: 'fajr+30', a: 'fajr', o: 30, l: 'بعد الفجر بـ ٣٠ دقيقة' },
      { id: 'fajr', a: 'fajr', o: 0, l: 'عند الفجر' },
      { id: 'sun-30', a: 'sunrise', o: -30, l: 'قبل الشروق بـ ٣٠ دقيقة' },
      { id: 'fixed', a: null, o: 0, l: 'وقت ثابت' }
    ]
  };
  var DEFAULT = { m: { mode: 'anchor', anchor: 'fajr', offset: 30 }, e: { mode: 'anchor', anchor: 'maghrib', offset: 0 }, ql: { mode: 'fixed' } };

  function bind(getter, saver) { getS = getter; if (saver) persist = saver; }
  function pt() { return w.__pt; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- المراسي ---------- */
  var cache = {};
  function get(off) {
    off = off || 0;
    if (cache[off] && cache[off].exp > Date.now()) return cache[off].v;
    var P = null;
    try { P = pt() && pt().computeFor ? pt().computeFor(off) : null; } catch (e) {}
    if (!P || !P.T) return null;
    var T = P.T, v = { date: P.date, tz: P.L && P.L.tz, fajr: T.fajr, sunrise: T.sunrise, dhuhr: T.dhuhr, asr: T.asr, maghrib: T.maghrib, isha: T.isha, midnight: null, lastThird: P.third || null };
    try {
      var N = pt().computeFor(off + 1);
      if (T.maghrib && N && N.T && N.T.fajr) v.midnight = new Date((+T.maghrib + +N.T.fajr) / 2);   // منتصف الليل الشرعي: بين المغرب وفجر الغد
    } catch (e) {}
    cache[off] = { v: v, exp: Date.now() + 30 * MIN };
    return v;
  }
  function at(anchor, offsetMin, off) {
    var v = get(off), d = v && v[anchor];
    return d && isFinite(+d) ? new Date(+d + (offsetMin || 0) * MIN) : null;
  }

  /* ---------- نموذج التذكير + الترحيل ---------- */
  function model(k) {
    var S = getS(); if (!S || !S.rem || !S.rem[k]) return DEFAULT[k] ? Object.assign({ t: '' }, DEFAULT[k]) : { mode: 'fixed', t: '' };
    var r = S.rem[k];
    if (r.mode) return r;
    var ch = false;
    if (k === 'm') {
      if (r.sun) { r.mode = 'anchor'; r.anchor = 'sunrise'; r.offset = -30; r.mig = 'sun'; }
      else if (!r.t || r.t === '05:00') { r.mode = 'anchor'; r.anchor = 'fajr'; r.offset = 30; r.mig = 'default'; }
      else r.mode = 'fixed';
      ch = true;
    } else if (k === 'e') {
      if (r.sun) { r.mode = 'anchor'; r.anchor = 'maghrib'; r.offset = -60; r.mig = 'sun'; }
      else if (!r.t || r.t === '17:00') { r.mode = 'anchor'; r.anchor = 'maghrib'; r.offset = 0; r.mig = 'default'; }
      else r.mode = 'fixed';
      ch = true;
    } else if (k === 'ql') {
      r.mode = r.sun ? 'anchor' : 'fixed'; if (r.sun) { r.anchor = 'lastThird'; r.offset = 0; } ch = true;
    }
    if (ch) { try { persist(); } catch (e) {} }
    return r;
  }
  function fixedAt(r, off) {
    var m = /^(\d{1,2}):(\d{2})/.exec(String(r.t || '')); if (!m) return null;
    var v = get(off), p = v && /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.date), d;
    if (p) d = new Date(+p[1], +p[2] - 1, +p[3], +m[1], +m[2], 0, 0);
    else { d = new Date(); d.setDate(d.getDate() + (off || 0)); d.setHours(+m[1], +m[2], 0, 0); }
    return d;
  }
  /* الوقت الفعلي لتذكير kind في اليوم off (0 = اليوم، 1 = غدًا…) — أو null */
  function resolve(k, off) {
    var r = model(k), d = null;
    if (r.mode === 'anchor') {
      d = at(r.anchor, r.offset, off);
      if (d && k === 'm' && r.anchor === 'fajr') { var sr = at('sunrise', -5, off); if (sr && d > sr) d = sr; }   // لا يتجاوز الشروق
      if (!d) d = fixedAt(r, off);                                                                                  // مرساة غير متاحة (خطوط عرض عالية) ← بديل ثابت
      if (!d) { var fb = { m: '05:00', e: '17:00', ql: '03:30' }[k]; if (fb) d = fixedAt({ t: fb }, off); }
    } else d = fixedAt(r, off);
    return d;
  }

  /* ---------- نص الوقت الحيّ ---------- */
  function fmt(d, tz) {
    if (!d) return '--';
    var s;
    try { s = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz || undefined }).format(d); }
    catch (e) { s = pad(d.getHours()) + ':' + pad(d.getMinutes()); }
    if (typeof LANG === 'undefined' || LANG === 'ar') s = s.replace('AM', 'ص').replace('PM', 'م');
    return typeof w.ar === 'function' ? w.ar(s) : s;
  }
  function presetId(k) {
    var r = model(k), L = PRESETS[k] || [];
    if (r.mode !== 'anchor') return 'fixed';
    for (var i = 0; i < L.length; i++) if (L[i].a === r.anchor && L[i].o === r.offset) return L[i].id;
    return 'custom';
  }
  function setPreset(k, id) {
    var S = getS(); if (!S || !S.rem || !S.rem[k]) return false;
    var L = PRESETS[k] || [], p = null; for (var i = 0; i < L.length; i++) if (L[i].id === id) p = L[i];
    if (!p) return false;
    var r = S.rem[k];
    if (p.a) { r.mode = 'anchor'; r.anchor = p.a; r.offset = p.o; } else r.mode = 'fixed';
    delete r.mig; r.sun = 0; try { persist(); } catch (e) {}
    invalidate('reminder:' + k);
    return true;
  }
  function describe(k) {
    var r = model(k), d = resolve(k, 0), v = get(0), tz = v && v.tz, id = presetId(k), L = PRESETS[k] || [], lab = '';
    for (var i = 0; i < L.length; i++) if (L[i].id === id) lab = L[i].l;
    return { mode: r.mode, preset: id, label: lab, at: d, text: fmt(d, tz), anchored: r.mode === 'anchor' && !!(v && v[r.anchor]) };
  }

  /* ---------- نوافذ الواجهة ---------- */
  /* هل بدأ وقت أذكار المساء المختار؟ (قبله لا تظهر رسالة «حان وقت أذكار المساء») */
  function eveningStarted(ts) {
    var d = resolve('e', 0); if (!d) return true;
    return (ts === undefined ? Date.now() : +ts) >= +d;
  }
  function eveningText() { var d = describe('e'); return (d.preset === 'fixed' || !d.label ? 'الساعة' : d.label) + ' ' + d.text; }

  /* ---------- حدث التغيّر ---------- */
  function invalidate(reason) {
    cache = {};
    try { if (AZ.day && AZ.day.invalidate) AZ.day.invalidate(); } catch (e) {}
    try { w.dispatchEvent(new CustomEvent('times:changed', { detail: { reason: reason || '' } })); } catch (e) {}
  }
  var guard = 0;
  try { w.addEventListener('azkar:times', function () { cache = {}; if (guard) return; guard = 1; setTimeout(function () { guard = 0; invalidate('azkar:times'); }, 0); }); } catch (e) {}

  /* ---------- تشخيص ---------- */
  function snapshot() {
    var v = get(0), o = { anchors: {}, reminders: {} };
    ANCH.forEach(function (a) { o.anchors[a] = v && v[a] ? new Date(v[a]).toISOString() : null; });
    ['m', 'e', 'ql'].forEach(function (k) { try { var d = describe(k), r = model(k); o.reminders[k] = { mode: r.mode, anchor: r.anchor || null, offset: r.offset == null ? null : r.offset, at: d.at ? d.at.toISOString() : null }; } catch (e) {} });
    o.tz = v ? v.tz : null; return o;
  }

  AZ.times = { ANCH: ANCH, PRESETS: PRESETS, bind: bind, get: get, at: at, model: model, resolve: resolve, describe: describe, presetId: presetId, setPreset: setPreset, eveningStarted: eveningStarted, eveningText: eveningText, invalidate: invalidate, snapshot: snapshot, fmt: fmt };
})(window);
