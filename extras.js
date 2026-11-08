/* أذكاري — extras.js (2.0): الجزء الأساسي الصغير للميزات الجديدة.
   (1) AZ.hijri: التاريخ الهجري (أم القرى عبر Intl) على «اليوم الأذكاري» AZ.day.key، مع تعديل ±1 يوم يختاره المستخدم.
   (2) المناسبات بأدلتها (OCC) والأيام البيض. (3) AZ.trk: نموذج تتبّع الصلوات (تعرضه tracker.js).
   (4) ثلاث بطاقات في اليوم فقط، بالـslots المحجوزة: progress (دائمًا) · ramadan (في رمضان) · friday (يوم الجمعة).
   (5) تذكيرات المناسبات ورمضان عبر __nf.extra (تُجدوَل مع بقية التذكيرات، بلا جدولة ثانية).
   (6) AZ.openTool(id): فتح صفحة في «الأدوات». لا حساب مواقيت هنا: __pt.compute() فقط. */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  if (AZ.hijri) return;
  var D = w.document;
  var MN = ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'];
  var FM = null;
  try { FM = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }); if (FM.resolvedOptions().calendar !== 'islamic-umalqura') FM = null; } catch (e) { FM = null; }
  var EPOCH = (function () { var d = new Date(0); d.setUTCFullYear(622, 6, 19); return d.getTime(); })();
  var p2 = function (n) { return n < 10 ? '0' + n : '' + n; };
  var pk = function (k) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(k || ''); return m ? [+m[1], +m[2], +m[3]] : null; };
  var fk = function (t) { var d = new Date(t); return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()); };
  function addD(k, n) { var a = pk(k); return a ? fk(Date.UTC(a[0], a[1] - 1, a[2] + n, 12)) : k; }
  function diff(a, b) { var x = pk(a), y = pk(b); return x && y ? Math.round((Date.UTC(y[0], y[1] - 1, y[2]) - Date.UTC(x[0], x[1] - 1, x[2])) / 864e5) : 0; }
  function wday(k) { var a = pk(k); return a ? new Date(Date.UTC(a[0], a[1] - 1, a[2], 12)).getUTCDay() : 0; }
  function adj() { var v; try { v = +AZ.data.get('azkari_hj_adj'); } catch (e) {} return v === -1 || v === 1 ? v : 0; }
  function raw(k) { var a = pk(k); if (!a || !FM) return null; var o = {}; FM.formatToParts(Date.UTC(a[0], a[1] - 1, a[2], 12)).forEach(function (x) { if (x.type === 'day' || x.type === 'month' || x.type === 'year') o[x.type] = +x.value; }); return o.year ? { y: o.year, m: o.month, d: o.day } : null; }
  function of(k, noAdj) { return raw(noAdj ? k : addD(k, adj())); }
  function findRaw(hy, hm, hd) {
    var g = EPOCH + ((hy - 1) * 354.36707 + (hm - 1) * 29.530588 + hd - 1) * 864e5, c = fk(g), i, r;
    for (i = 0; i <= 8; i++) { var s = i % 2 ? -((i + 1) >> 1) : (i >> 1); var k = addD(c, s); r = raw(k); if (r && r.y === hy && r.m === hm && r.d === hd) return k; }
    return null;
  }
  function keyOf(hy, hm, hd) { var k = findRaw(hy, hm, hd); if (!k && hd === 30) k = findRaw(hy, hm, 29); return k ? addD(k, -adj()) : null; }
  function daysIn(hy, hm) { var a = findRaw(hy, hm, 1), b = hm === 12 ? findRaw(hy + 1, 1, 1) : findRaw(hy, hm + 1, 1); return a && b ? diff(a, b) : 30; }
  function todayK() { try { return AZ.day.key(); } catch (e) { return fk(Date.now()); } }
  function today() { return of(todayK()); }
  function whiteDays(hm) { return hm === 9 ? [] : hm === 12 ? [14, 15] : [13, 14, 15]; }

  /* المناسبات: f = rec (يُستحب صيامه) · forbid (نُهي عن صيامه) · oblig · 0؛ nf = تذكير عشية اليوم الأول؛ nt عنوان التذكير */
  var OCC = [
    { id: 'newyear', m: 1, a: 1, b: 1, t: 'رأس السنة الهجرية', d: 'بداية العام الهجري. لم يثبت في الشرع عبادة مخصوصة بهذا اليوم.', f: 0 },
    { id: 'tasua', m: 1, a: 9, b: 9, t: 'تاسوعاء', d: 'يُستحب صيام التاسع مع العاشر مخالفةً لأهل الكتاب.', q: '«لَئِنْ بَقِيتُ إِلَى قَابِلٍ لَأَصُومَنَّ التَّاسِعَ»', s: 'رواه مسلم', f: 'rec', nf: 1, nt: 'غدًا تاسوعاء' },
    { id: 'ashura', m: 1, a: 10, b: 10, t: 'عاشوراء', d: 'يُستحب صيام عاشوراء، والأكمل صيام التاسع معه.', q: '«صِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ»', s: 'رواه مسلم', f: 'rec', nf: 1, nt: 'غدًا عاشوراء' },
    { id: 'ramadan', m: 9, a: 1, b: 30, t: 'شهر رمضان', d: 'صيام رمضان فريضة، ويُعرف دخوله بالرؤية أو إكمال شعبان ثلاثين يومًا.', q: '﴿شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ﴾', s: 'البقرة ١٨٥', f: 'oblig', nf: 1, nt: 'غدًا أول أيام رمضان بحسب التقويم', nbeg: 1 },
    { id: 'qadr', m: 9, a: 21, b: 29, t: 'العشر الأواخر', d: 'تُطلب ليلة القدر في الليالي الوترية من العشر الأواخر.', q: '«تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الْأَوَاخِرِ مِنْ رَمَضَانَ»', s: 'رواه البخاري', f: 'oblig' },
    { id: 'fitr', m: 10, a: 1, b: 1, t: 'عيد الفطر', d: 'ثبت النهي عن صيام يومَي العيدين.', s: 'متفق عليه', f: 'forbid' },
    { id: 'shawwal', m: 10, a: 2, b: 30, t: 'ستّ من شوّال', d: 'يُستحب صيام ستة أيام من شوال بعد رمضان، متتابعة أو متفرقة.', q: '«مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ»', s: 'رواه مسلم', f: 'rec', nf: 1, nt: 'غدًا تبدأ ستّ شوّال', nbeg: 1 },
    { id: 'arafa', m: 12, a: 9, b: 9, t: 'يوم عرفة', d: 'يُستحب صيامه لغير الحاج. أما الحاج بعرفة فلا يُسنّ له صومه.', q: '«صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالسَّنَةَ الَّتِي بَعْدَهُ»', s: 'رواه مسلم', f: 'rec', nf: 1, nt: 'غدًا يوم عرفة' },
    { id: 'ten', m: 12, a: 1, b: 9, t: 'عشر ذي الحجة', d: 'أيام يُستحب فيها الإكثار من العمل الصالح والذكر، ويُستحب صيام التسع لغير الحاج.', q: '«مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهِنَّ أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ» يَعْنِي أَيَّامَ الْعَشْرِ', s: 'رواه أبو داود والترمذي', f: 'rec', nf: 1, nt: 'غدًا أول عشر ذي الحجة', nbeg: 1 },
    { id: 'adha', m: 12, a: 10, b: 10, t: 'عيد الأضحى', d: 'ثبت النهي عن صيام يومَي العيدين.', s: 'متفق عليه', f: 'forbid' },
    { id: 'tashreeq', m: 12, a: 11, b: 13, t: 'أيام التشريق', d: 'أيام أكل وشرب وذكر، ونُهي عن صيامها إلا لمن لم يجد الهدي في الحج.', q: '«أَيَّامُ التَّشْرِيقِ أَيَّامُ أَكْلٍ وَشُرْبٍ وَذِكْرٍ لِلَّهِ»', s: 'رواه مسلم', f: 'forbid' }
  ];
  function occOn(h) { return h ? OCC.filter(function (o) { return o.m === h.m && h.d >= o.a && h.d <= o.b; }) : []; }
  /* الأقرب أولًا: [{o,start,end,days,running}] من تاريخ from (اليوم الأذكاري) خلال سنة */
  function upcoming(n, from) {
    from = from || todayK(); var h = of(from), out = []; if (!h) return out;
    [h.y, h.y + 1].forEach(function (y) {
      OCC.forEach(function (o) {
        var s = keyOf(y, o.m, o.a), e = keyOf(y, o.m, o.b); if (!s || !e || e < from) return;
        out.push({ o: o, start: s, end: e, days: Math.max(0, diff(from, s)), running: s <= from });
      });
    });
    out.sort(function (a, b) { return (a.running ? from : a.start) < (b.running ? from : b.start) ? -1 : (a.running ? from : a.start) > (b.running ? from : b.start) ? 1 : 0; });
    return out.slice(0, n || 6);
  }
  AZ.hijri = { ok: function () { return !!FM; }, of: of, raw: raw, keyOf: keyOf, daysIn: daysIn, adj: adj, today: today, MN: MN, OCC: OCC, occOn: occOn, upcoming: upcoming, whiteDays: whiteDays, addD: addD, diff: diff, wday: wday, todayK: todayK,
    setAdj: function (v) { try { AZ.data.set('azkari_hj_adj', String(v === -1 || v === 1 ? v : 0)); } catch (e) {} try { AZ.day.invalidate(); } catch (e) {} refresh(); } };

  /* ---------- تتبّع الصلوات: نموذج مشترك (الواجهة في tracker.js) ---------- */
  var TK = 'azkari_trk', PRK = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  function tget() { try { var o = JSON.parse(AZ.data.get(TK) || 'null'); if (o && o.v === 1 && o.d && typeof o.d === 'object') { o.fr = o.fr || {}; return o; } } catch (e) {} return { v: 1, d: {}, fr: {} }; }
  function tset(o) {
    try {
      var cut = addD(todayK(), -800); Object.keys(o.d).forEach(function (k) { if (k < cut) delete o.d[k]; }); Object.keys(o.fr).forEach(function (k) { if (k < cut) delete o.fr[k]; });
      AZ.data.set(TK, JSON.stringify(o)); return true;
    } catch (e) { return false; }
  }
  function rec(o, k) { var r = o.d[k]; if (!r || typeof r !== 'object') r = o.d[k] = {}; if (typeof r.p !== 'string' || r.p.length !== 5) r.p = '-----'; if (typeof r.s !== 'string' || r.s.length !== 3) r.s = '---'; if (typeof r.a !== 'string') r.a = ''; return r; }
  function setP(k, i, v) { var o = tget(), r = rec(o, k); if (i < 0 || i > 4 || 'ox-'.indexOf(v) < 0) return null; r.p = r.p.slice(0, i) + v + r.p.slice(i + 1); tset(o); refresh(); return r; }
  function setS(k, i, v) { var o = tget(), r = rec(o, k); if (i < 0 || i > 2 || 'o-'.indexOf(v) < 0) return null; r.s = r.s.slice(0, i) + v + r.s.slice(i + 1); tset(o); return r; }
  function markAdded(k, i) { var o = tget(), r = rec(o, k), c = PRK[i][0] === 'f' ? 'f' : String(i); if (r.a.indexOf(c) < 0) r.a += c; tset(o); return r; }
  function pDone(k) { var r = tget().d[k]; if (!r || typeof r.p !== 'string') return 0; return r.p.split('o').length - 1; }
  AZ.trk = { get: tget, set: tset, rec: rec, setP: setP, setS: setS, markAdded: markAdded, pDone: pDone, PR: PRK };

  /* ---------- أدوات صغيرة ---------- */
  var A = function (n) { try { return typeof w.ar === 'function' ? w.ar(n) : String(n); } catch (e) { return String(n); } };
  var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $ = function (s, r) { return (r || D).querySelector(s); };
  function S() { try { return AZ.state() || {}; } catch (e) { return {}; } }
  function fmtT(ms, tz) { try { var s = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).format(ms); if (typeof w.LANG === 'undefined' || w.LANG === 'ar') s = s.replace('AM', 'ص').replace('PM', 'م'); return A(s); } catch (e) { return ''; } }
  function ptc() { try { return w.__pt && w.__pt.compute && w.__pt.compute(); } catch (e) { return null; } }
  var RMK = 'azkari_ramadan';
  function rget() { try { var o = JSON.parse(AZ.data.get(RMK) || 'null'); if (o && o.v === 1 && o.y) return o; } catch (e) {} return { v: 1, y: {}, nf: 1 }; }
  function rset(o) { try { AZ.data.set(RMK, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function ry(o, y) { var r = o.y[y] || (o.y[y] = {}); ['f', 't', 'q'].forEach(function (k) { if (!Array.isArray(r[k])) r[k] = []; }); return r; }
  function rtoggle(kind, d) { var o = rget(), h = today(), r = h ? ry(o, h.y) : null; if (!r) return; var a = r[kind], i = a.indexOf(d); if (i < 0) a.push(d); else a.splice(i, 1); rset(o); refresh(); }
  AZ.ramadan = { get: rget, set: rset, y: ry, toggle: rtoggle };

  /* ---------- البطاقات الثلاث ---------- */
  var cache = { p: '', r: '', f: '' };
  function card(id, slot) { var c = $('#' + id); if (c) return c; var hm = $('#v-home'); if (!hm) return null; c = D.createElement('div'); c.className = 'card xcd'; c.id = id; c.dataset.slot = slot; hm.appendChild(c); return c; }
  function put(c, key, html) { if (!c) return; if (cache[key] === html && c.firstChild) return; cache[key] = html; c.innerHTML = html; try { if (typeof w.layoutHome === 'function') w.layoutHome(); } catch (e) {} }
  function chip(on, label, extra) { return '<span class="xch' + (on ? ' on' : '') + '"><span>' + label + '</span>' + (extra || '') + '</span>'; }
  function progress() {
    var k = todayK(), s = S(), t; try { t = typeof w.st === 'function' ? w.st(k) : null; } catch (e) { t = null; } if (!t) return;
    var n = pDone(k), tot = 0; try { tot = (s.days && s.days[k] ? 1 : 0); } catch (e) {}
    var h = '<h2>تقدّمي اليوم</h2><div class="xrw">' + chip(t.mD, 'الصباح') + chip(t.eD, 'المساء') + chip(t.q, 'الورد') + chip(n >= 5, 'الصلوات', ' <b>' + A(n) + '</b>/<b>' + A(5) + '</b>') + '</div><button class="btn" data-x="trk">سجّل صلواتك</button>';
    put(card('xPrg', 'progress'), 'p', h);
  }
  function ramadan() {
    var c = $('#xRam'), h = AZ.hijri.ok() ? today() : null;
    if (!h || h.m !== 9) { if (c) { c.remove(); cache.r = ''; } return; }
    var o = rget(), r = ry(o, h.y), P = ptc(), T = P && P.T, tz = P && P.L && P.L.tz, s = S(), left = Math.max(1, daysIn(h.y, 9) - h.d + 1), pg = s.page || 1, rem = 604 - (pg - 1), per = Math.ceil(rem / left);
    var html = '<h2>رمضان <span class="xn">' + A(h.d) + '</span></h2>';
    if (T && T.maghrib) html += '<div class="xln"><span>الإفطار</span> <b>' + fmtT(+T.maghrib, tz) + '</b>' + (T.fajr ? ' · <span>الإمساك (الفجر)</span> <b>' + fmtT(+T.fajr, tz) + '</b>' : '') + '</div>';
    if (rem > 0) html += '<div class="xln"><span>ورد اليوم لختمة في رمضان:</span> <b>' + A(per) + '</b> <span>صفحة</span></div>';
    if (h.d >= 21) html += '<div class="xln xdu">«اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي»</div>';
    html += '<div class="xrw">' + '<button class="xch xb' + (r.f.indexOf(h.d) >= 0 ? ' on' : '') + '" data-x="rmf" aria-pressed="' + (r.f.indexOf(h.d) >= 0) + '"><span>صمتُ اليوم</span></button>' + '<button class="xch xb' + (r.t.indexOf(h.d) >= 0 ? ' on' : '') + '" data-x="rmt" aria-pressed="' + (r.t.indexOf(h.d) >= 0) + '"><span>صلّيت التراويح</span></button></div><button class="btn" data-x="rmo">صفحة رمضان</button>';
    put(card('xRam', 'ramadan'), 'r', html);
  }
  function friday() {
    var k = todayK(), c = $('#xFri');
    if (wday(k) !== 5) { if (c) { c.remove(); cache.f = ''; } return; }
    var f = (tget().fr[k]) || {};
    var row = function (id, label, on) { return '<button class="xch xb' + (on ? ' on' : '') + '" data-x="' + id + '" aria-pressed="' + (!!on) + '"><span>' + label + '</span></button>'; };
    var html = '<h2>يوم الجمعة</h2><div class="xrw">' + row('frk', 'قرأت سورة الكهف', f.k) + row('frs', 'أكثرت من الصلاة على النبي ﷺ', f.s) + '</div>' +
      '<p class="xq">«إِنَّ مِنْ أَفْضَلِ أَيَّامِكُمْ يَوْمَ الْجُمُعَةِ… فَأَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ فِيهِ»<small>رواه أبو داود (صححه الألباني)</small></p>' +
      '<div class="xln"><span>في الجمعة ساعة إجابة؛ قيل بين جلوس الخطيب وانتهاء الصلاة، وقيل آخر ساعة بعد العصر.</span></div><button class="btn" data-x="frq">فتح المصحف</button>';
    put(card('xFri', 'friday'), 'f', html);
  }
  function refresh() { if (!D || !D.body) return; try { progress(); } catch (e) { console.warn('[extras]', e); } try { ramadan(); } catch (e) { console.warn('[extras]', e); } try { friday(); } catch (e) { console.warn('[extras]', e); } }
  function frToggle(f) { var o = tget(), k = todayK(); o.fr[k] = o.fr[k] || {}; o.fr[k][f] = o.fr[k][f] ? 0 : 1; tset(o); refresh(); }
  function onClick(e) {
    var b = e.target.closest && e.target.closest('[data-x]'); if (!b) return; var a = b.dataset.x, h = today();
    if (a === 'trk') openTool('tracker'); else if (a === 'rmo') openTool('ramadan');
    else if (a === 'rmf' && h) rtoggle('f', h.d); else if (a === 'rmt' && h) rtoggle('t', h.d);
    else if (a === 'frk') frToggle('k'); else if (a === 'frs') frToggle('s');
    else if (a === 'frq') { try { var n = $('nav button[data-v="q"]'); if (n) n.click(); } catch (x) {} }
  }

  /* ---------- فتح صفحة في «الأدوات» ---------- */
  function openTool(id) { try { if (w.__tl && w.__tl.openPage) w.__tl.openPage(id); } catch (e) {} }
  AZ.openTool = openTool;
  var TOOLGO = { tracker: 1, cal: 1, ramadan: 1, learn: 1, zakat: 1, kids: 1, loved: 1, salah: 1 };
  function wrapGo() { var o = AZ.openGo; AZ.openGo = function (k) { if (TOOLGO[k]) return openTool(k); return o ? o.apply(this, arguments) : undefined; }; }

  /* ---------- التذكيرات (عبر __nf.extra) ---------- */
  function nfcfg() { var o = {}; try { o = JSON.parse(AZ.data.get('azkari_sawm') || '{}').nf || {}; } catch (e) {} return { occ: o.occ !== 0, w: o.w === 1, mt: o.mt === 1 }; }
  function nfX(T, now, c, ctx) {
    var out = []; if (!FM || !T || !T.dhuhr || !T.maghrib) return out;
    var cf = nfcfg(), rm = rget(), M = 6e4, key = AZ.day.key(+T.dhuhr), h = of(key), nk = addD(key, 1), nh = of(nk), base = T.isha ? +T.isha + 20 * M : +T.maghrib + 90 * M;
    if (!h || !nh) return out;
    if (cf.occ) {
      OCC.forEach(function (o) { if (o.nf && nh.m === o.m && nh.d === o.a) out.push({ id: 'occ-' + o.id, at: base, title: o.nt, body: o.d, go: 'cal', kind: 'occ' }); });
      if (h.m === 9 && [20, 22, 24, 26, 28].indexOf(h.d) >= 0) out.push({ id: 'occ-qadr', at: base, title: 'الليلة من ليالي ليلة القدر المرجوّة', body: '«اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي»', go: 'ramadan', kind: 'occ' });
    }
    if (rm.nf !== 0 && h.m === 9) {
      if (T.fajr) out.push({ id: 'rm-suh', at: +T.fajr - 40 * M, title: 'السحور', body: '«تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً» — متفق عليه', go: 'ramadan', kind: 'occ' });
      out.push({ id: 'rm-ift', at: +T.maghrib - 10 * M, title: 'اقترب الإفطار', body: '«لَا يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ» — متفق عليه', go: 'ramadan', kind: 'occ' });
    }
    if (!out.length || (out.length === 1 && out[0].id.indexOf('rm-') === 0)) {
      if (cf.w && nh.m !== 9 && whiteDays(nh.m).indexOf(nh.d) >= 0) out.push({ id: 'occ-white', at: base, title: 'غدًا من الأيام البيض', body: 'يُستحب صيام ثلاثة أيام من كل شهر، والأيام البيض ١٣ و١٤ و١٥ بتقويم أم القرى.', go: 'cal', kind: 'occ' });
      else if (cf.mt && h.m !== 9 && nh.m !== 9) { var nw = wday(nk); if (nw === 1) out.push({ id: 'occ-mon', at: base, title: 'غدًا الاثنين', body: '«تُعْرَضُ الْأَعْمَالُ يَوْمَ الِاثْنَيْنِ وَالْخَمِيسِ، فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»', go: 'cal', kind: 'occ' }); else if (nw === 4) out.push({ id: 'occ-thu', at: base, title: 'غدًا الخميس', body: '«تُعْرَضُ الْأَعْمَالُ يَوْمَ الِاثْنَيْنِ وَالْخَمِيسِ، فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»', go: 'cal', kind: 'occ' }); }
    }
    return out;
  }
  AZ.hijri.nfX = nfX;

  function css() {
    var s = D.createElement('style'); s.id = 'x-css';
    s.textContent = '.xcd h2{margin:0 0 6px}.xrw{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.xch{display:inline-flex;align-items:center;gap:4px;min-height:36px;padding:4px 12px;border-radius:18px;border:1px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;font-size:.92rem}.xch.xb{min-height:44px;cursor:pointer}.xch.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b);font-weight:700}.xln{line-height:2;color:var(--mut);margin:2px 0}.xln b{color:var(--tx);font-variant-numeric:tabular-nums}.xdu{font-family:Amiri,serif;font-size:1.15rem;color:var(--gold);text-align:center}.xq{font-family:Amiri,serif;font-size:1.1rem;line-height:2;margin:8px 0 2px}.xq small{display:block;font-family:inherit;font-size:.78rem;color:var(--mut)}.xn{color:var(--gold)}.xcd .btn{min-height:44px;margin-top:6px}.xch:focus-visible,.xcd .btn:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
    D.head.appendChild(s);
  }
  function init() {
    try {
      css(); wrapGo();
      var hm = $('#v-home'); if (hm) hm.addEventListener('click', onClick);
      if (typeof w.renderHome === 'function') { var o = w.renderHome; w.renderHome = function () { var r = o.apply(this, arguments); refresh(); return r; }; }
      if (w.__nf && w.__nf.extra) w.__nf.extra.push(nfX);
      w.addEventListener('azkar:times', function () { try { refresh(); } catch (e) {} });
      refresh();
    } catch (e) { console.warn('[extras]', e); }
  }
  if (D && D.body) init();
})(window);
