/* أذكاري — tracker.js (2.0 · C1): تتبّع الصلوات والسنن على «اليوم الأذكاري» (AZ.day.key).
   النموذج في extras.js (AZ.trk). هنا الواجهة فقط: صلوات اليوم الخمس (صلّيت / فاتت)، والرواتب والضحى والوتر،
   «فاتت ← أضفها للفوائت» عبر __qd.addMissed (مرة واحدة لكل صلاة ويوم)، وخريطة حرارية شهرية.
   وضع السفر (azkari_travel) يغيّر تسمية الرباعيات إلى «قصر» فقط. */
(function () {
  'use strict';
  if (window.__x_tracker) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); };
  var PN = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' }, SN = ['الرواتب (١٢ ركعة)', 'الضحى', 'الوتر'];
  var st = { y: 0, m: 0, sel: null };
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function toast(m) { try { if (typeof window.toast === 'function') window.toast(m); } catch (e) {} }
  function p2(n) { return n < 10 ? '0' + n : '' + n; }
  function today() { return AZ.day.key(); }
  function travel() { try { var o = JSON.parse(AZ.data.get('azkari_travel') || 'null'); return !!(o && o.on); } catch (e) { return false; } }
  function monthGrid(y, m) {   // m: 1..12 ميلادي؛ الأسبوع يبدأ بالسبت كبقية التطبيق
    var first = new Date(Date.UTC(y, m - 1, 1)), n = new Date(Date.UTC(y, m, 0)).getUTCDate(), off = (first.getUTCDay() + 1) % 7, cells = [], i;
    for (i = 0; i < off; i++) cells.push(null);
    for (i = 1; i <= n; i++) cells.push(y + '-' + p2(m) + '-' + p2(i));
    return cells;
  }
  function level(k, o) { var r = o.d[k]; if (!r || typeof r.p !== 'string') return -1; var n = r.p.split('o').length - 1, x = r.p.split('x').length - 1; return n === 0 && x === 0 ? -1 : n; }
  function heat(o) {
    var td = today(), mm = /^(\d{4})-(\d{2})/.exec(td), cells = monthGrid(st.y, st.m), names = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
    var t = st.y + '-' + p2(st.m), tot = 0, days = 0;
    var h = '<div class="tkh" role="group" aria-label="خريطة الشهر"><div class="tkhd"><button class="btn" data-tk="pm" aria-label="الشهر السابق">→</button><b><span>' + MON[st.m - 1] + '</span> <b>' + A(st.y) + '</b></b><button class="btn" data-tk="nm" aria-label="الشهر التالي">←</button></div><div class="tkg">' + names.map(function (d) { return '<i class="tkw"><span>' + d + '</span></i>'; }).join('');
    cells.forEach(function (k) {
      if (!k) { h += '<i></i>'; return; }
      var l = level(k, o), r = o.d[k], miss = r && r.p.indexOf('x') >= 0; if (l >= 0) { tot += l; days++; }
      h += '<button class="tkc l' + (l < 0 ? 'n' : l) + (k === td ? ' now' : '') + (k === st.sel ? ' sel' : '') + '" data-tk="day" data-k="' + k + '" aria-label="' + k + ': ' + (l < 0 ? '—' : l + '/5') + '">' + A(+k.slice(8)) + (miss ? '<u></u>' : '') + '</button>';
    });
    return h + '</div><div class="tkl"><span>الألوان تدل على عدد الصلوات المؤدّاة من ٥، والنقطة تعني صلاة فاتت.</span></div>' + (days ? '<div class="tkm"><span>متوسط هذا الشهر:</span> <b>' + A(Math.round(tot / days * 10) / 10) + '</b>/<b>' + A(5) + '</b></div>' : '') + '</div>';
  }
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function dayCard(o, k) {
    var r = o.d[k] || {}, p = typeof r.p === 'string' && r.p.length === 5 ? r.p : '-----', s = typeof r.s === 'string' && r.s.length === 3 ? r.s : '---', a = r.a || '', tv = travel(), isT = k === today();
    var rows = AZ.trk.PR.map(function (n, i) {
      var c = p[i], added = a.indexOf(i === 0 ? 'f' : String(i)) >= 0, q = tv && (n === 'dhuhr' || n === 'asr' || n === 'isha');
      return '<div class="tkr"><b class="tkn">' + PN[n] + (q ? ' <small><span>قصر</span></small>' : '') + '</b><span class="tkb"><button class="tkp' + (c === 'o' ? ' on' : '') + '" data-tk="p" data-i="' + i + '" data-v="o" aria-pressed="' + (c === 'o') + '"><span>صلّيت</span></button><button class="tkp x' + (c === 'x' ? ' on' : '') + '" data-tk="p" data-i="' + i + '" data-v="x" aria-pressed="' + (c === 'x') + '"><span>فاتت</span></button></span>' +
        (c === 'x' ? (added ? '<span class="tka">✓ <span>أُضيفت للفوائت</span></span>' : '<button class="btn tkq" data-tk="q" data-i="' + i + '"><span>أضفها للفوائت</span></button>') : '') + '</div>';
    }).join('');
    var sun = SN.map(function (n, i) { return '<button class="tkp' + (s[i] === 'o' ? ' on' : '') + '" data-tk="s" data-i="' + i + '" aria-pressed="' + (s[i] === 'o') + '"><span>' + n + '</span></button>'; }).join('');
    return '<div class="card"><h2>' + (isT ? '<span>اليوم</span>' : '<span>يوم</span> <b>' + esc(k) + '</b>') + '</h2>' + rows + '<h4><span>السنن</span></h4><div class="tkb tkw2">' + sun + '</div><div class="tkm"><span>الرواتب اثنتا عشرة ركعة: ٤ قبل الظهر و٢ بعده و٢ بعد المغرب و٢ بعد العشاء و٢ قبل الفجر. رواه مسلم.</span></div></div>';
  }
  function view(R) {
    var o = AZ.trk.get(), k = st.sel || today(), b = $('.tkbody', R.root); if (!b) return;
    b.innerHTML = dayCard(o, k) + '<div class="card">' + heat(o) + '</div>';
  }
  function addQada(i) {
    var k = st.sel || today(), n = AZ.trk.PR[i], q = window.__qd, plan = null;
    try { plan = q && q.load && q.load(); } catch (e) {}
    if (!q || !q.addMissed || !plan) { toast('فعّل خطة الفوائت أولًا من «الفوائت»'); try { AZ.data.set('azkar_pt_sub', 'q'); } catch (e) {} return; }
    var r = AZ.trk.get().d[k] || {}, c = i === 0 ? 'f' : String(i); if ((r.a || '').indexOf(c) >= 0) return;
    if (q.addMissed(n, 1)) { AZ.trk.markAdded(k, i); toast('أُضيفت إلى الفوائت'); } else toast('تعذّرت الإضافة');
  }
  function wire(R) {
    R.root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tk]'); if (!b) return; var a = b.dataset.tk, k = st.sel || today();
      if (a === 'p') { var i = +b.dataset.i, cur = (AZ.trk.get().d[k] || {}).p, c = cur && cur[i], v = b.dataset.v; AZ.trk.setP(k, i, c === v ? '-' : v); }
      else if (a === 's') { var j = +b.dataset.i, r = (AZ.trk.get().d[k] || {}).s, cc = r && r[j]; AZ.trk.setS(k, j, cc === 'o' ? '-' : 'o'); }
      else if (a === 'q') addQada(+b.dataset.i);
      else if (a === 'day') { st.sel = b.dataset.k === today() ? null : b.dataset.k; }
      else if (a === 'pm') { st.m--; if (st.m < 1) { st.m = 12; st.y--; } } else if (a === 'nm') { st.m++; if (st.m > 12) { st.m = 1; st.y++; } }
      view(R);
    });
  }
  var CSS = '.tkr{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line,#ddd)}.tkr:last-of-type{border-bottom:0}.tkn{min-width:4.5em}.tkb{display:flex;gap:6px;flex-wrap:wrap}.tkp{min-height:44px;padding:6px 14px;border-radius:22px;border:1px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;font-size:.92rem;cursor:pointer}.tkp.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b);font-weight:700}.tkp.x.on{background:#c0392b;border-color:#c0392b;color:#fff}.tkq{min-height:44px}.tka{color:#2e9b5a;font-size:.88rem}.tkm{color:var(--mut);line-height:1.9;margin-top:6px}.tkm b{color:var(--tx);font-variant-numeric:tabular-nums}.tkhd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}.tkg{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.tkw{text-align:center;font-size:.7rem;color:var(--mut);font-style:normal}.tkc{position:relative;min-height:44px;border-radius:10px;border:1px solid transparent;background:var(--cell,#eee);color:var(--tx);font:inherit;font-size:.9rem;cursor:pointer}.tkc.l1{background:#c9a24b33}.tkc.l2{background:#c9a24b55}.tkc.l3{background:#c9a24b88}.tkc.l4{background:#c9a24bbb}.tkc.l5{background:#c9a24b;color:#1d1a10;font-weight:700}.tkc.now{border-color:var(--tx)}.tkc.sel{outline:2px solid var(--gold,#c9a24b)}.tkc u{position:absolute;bottom:4px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#c0392b}.tkl{color:var(--mut);font-size:.8rem;margin-top:6px}.tkp:focus-visible,.tkc:focus-visible,.tkq:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#tk-css')) return; var s = D.createElement('style'); s.id = 'tk-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) { css(); var m = /^(\d{4})-(\d{2})/.exec(today()); st = { y: +m[1], m: +m[2], sel: null }; root.innerHTML = '<div class="tkbody"></div>'; cur = { root: root }; wire(cur); view(cur); }
  function unmount() { cur = null; }
  window.__x_tracker = { mount: mount, unmount: unmount, _t: { monthGrid: monthGrid, level: level } };
})();
