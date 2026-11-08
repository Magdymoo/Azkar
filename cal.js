/* أذكاري — cal.js (2.0 · C2): التقويم الهجري (أم القرى) + المناسبات بأدلتها + العدّ التنازلي + سجل الصيام + خيارات التذكير.
   المنطق في extras.js (AZ.hijri). التخزين: azkari_sawm = {d:{YYYY-MM-DD:1}, nf:{occ,w,mt}} ويدخل النسخ الاحتياطي.
   التقدير بتقويم أم القرى وقد يختلف يومًا عن رؤية بلدك، ولذلك يوجد تعديل ±١ يوم. */
(function () {
  'use strict';
  if (window.__x_cal) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, KEY = 'azkari_sawm', H = function () { return AZ.hijri; };
  var st = { y: 0, m: 0, sel: null };
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function get() { try { var o = JSON.parse(AZ.data.get(KEY) || 'null'); if (o && typeof o === 'object') { o.d = o.d || {}; o.nf = o.nf || {}; return o; } } catch (e) {} return { d: {}, nf: {} }; }
  function put(o) { try { var cut = H().addD(H().todayK(), -800); Object.keys(o.d).forEach(function (k) { if (k < cut) delete o.d[k]; }); AZ.data.set(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function toggleFast(k) { var o = get(); if (o.d[k]) delete o.d[k]; else o.d[k] = 1; put(o); }
  function setNf(f, v) { var o = get(); o.nf[f] = v ? 1 : 0; put(o); try { if (window.__nf) window.__nf.schedule(); } catch (e) {} }
  function stats(o, y) {   // عدد أيام الصيام المسجّلة في السنة الهجرية y وفي الشهر الحالي
    var n = 0, k; for (k in o.d) { var h = H().of(k); if (h && h.y === y) n++; } return n;
  }
  function occLine(x) { return '<div class="cvo"><b>' + esc(x.t) + '</b><p>' + esc(x.d) + '</p>' + (x.q ? '<p class="cvq">' + esc(x.q) + '</p>' : '') + (x.s ? '<small>' + esc(x.s) + '</small>' : '') + '</div>'; }
  function grid(o) {
    var hj = H(), td = hj.todayK(), len = hj.daysIn(st.y, st.m), k1 = hj.keyOf(st.y, st.m, 1), off = (hj.wday(k1) + 1) % 7, names = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
    var w = hj.whiteDays(st.m), h = '<div class="cvh"><button class="btn" data-cv="pm" aria-label="الشهر السابق">→</button><b><span>' + hj.MN[st.m - 1] + '</span> <b>' + A(st.y) + '</b></b><button class="btn" data-cv="nm" aria-label="الشهر التالي">←</button></div><div class="cvg">' + names.map(function (d) { return '<i class="cvw"><span>' + d + '</span></i>'; }).join('');
    for (var i = 0; i < off; i++) h += '<i></i>';
    for (var d = 1; d <= len; d++) {
      var k = hj.keyOf(st.y, st.m, d), occ = hj.occOn({ y: st.y, m: st.m, d: d }), cl = 'cvc';
      if (k === td) cl += ' now'; if (k === st.sel) cl += ' sel'; if (o.d[k]) cl += ' fast'; else if (w.indexOf(d) >= 0) cl += ' wh';
      h += '<button class="' + cl + '" data-cv="day" data-k="' + k + '" data-d="' + d + '" aria-label="' + d + ' ' + hj.MN[st.m - 1] + (o.d[k] ? ' ✓' : '') + '">' + A(d) + (occ.length ? '<u></u>' : '') + '</button>';
    }
    return h + '</div><div class="cvl"><span>● مناسبة · الإطار الذهبي: أيام بيض · الأخضر: صمتَ هذا اليوم</span></div>';
  }
  function selPanel(o) {
    var hj = H(), k = st.sel; if (!k) return ''; var h = hj.of(k), occ = hj.occOn(h), wd = hj.wday(k), mt = wd === 1 || wd === 4, wh = hj.whiteDays(h.m).indexOf(h.d) >= 0;
    var forbid = occ.some(function (x) { return x.f === 'forbid'; });
    return '<div class="card"><h4><b>' + A(h.d) + '</b> <span>' + hj.MN[h.m - 1] + '</span> <b>' + A(h.y) + '</b></h4><div class="cvm"><b>' + esc(k) + '</b></div>' + occ.map(occLine).join('') +
      (wh ? '<div class="cvm"><span>من الأيام البيض: يُستحب صيام ثلاثة أيام من كل شهر.</span></div>' : '') + (mt ? '<div class="cvm"><span>يُستحب صيام الاثنين والخميس.</span></div>' : '') +
      (forbid ? '<div class="cvm"><span>لا يُصام هذا اليوم.</span></div>' : '<button class="btn cvw2' + (o.d[k] ? ' main' : '') + '" data-cv="fast">' + (o.d[k] ? '<span>✓ صمتُ هذا اليوم</span>' : '<span>سجّل أني صمتُ هذا اليوم</span>') + '</button>') + '</div>';
  }
  function upc() {
    var L = H().upcoming(6);
    return '<div class="card"><h4><span>المناسبات القادمة</span></h4>' + L.map(function (u) {
      return '<div class="cvu"><div><b>' + esc(u.o.t) + '</b><div class="cvm">' + esc(u.start) + '</div></div><div class="cvd">' + (u.running ? '<span>جارية الآن</span>' : '<b>' + A(u.days) + '</b> <span>يوم</span>') + '</div></div>' + (u.days <= 7 || u.running ? occLine(u.o) : '');
    }).join('') + '</div>';
  }
  function view(R) {
    var hj = H(), b = $('.cvbody', R.root); if (!b) return;
    if (!hj.ok()) { b.innerHTML = '<div class="card"><p class="cvm"><span>متصفحك لا يدعم التقويم الهجري.</span></p></div>'; return; }
    var o = get(), t = hj.today(), nf = { occ: o.nf.occ !== 0, w: o.nf.w === 1, mt: o.nf.mt === 1 }, adj = hj.adj();
    var sw = function (id, l, on) { return '<label class="cvs"><span>' + l + '</span><input type="checkbox" class="ios" data-cv="nf" data-f="' + id + '"' + (on ? ' checked' : '') + ' aria-label="' + l + '"></label>'; };
    b.innerHTML = '<div class="card cvt"><div class="cvbig"><b>' + A(t.d) + '</b> <span>' + hj.MN[t.m - 1] + '</span> <b>' + A(t.y) + '</b></div><div class="cvm"><span>التقدير بتقويم أم القرى وقد يختلف يومًا عن رؤية بلدك.</span></div>' +
      '<label class="cvs"><span>تعديل التاريخ</span><select data-cv="adj" aria-label="تعديل التاريخ"><option value="-1"' + (adj === -1 ? ' selected' : '') + '>−١ يوم</option><option value="0"' + (adj === 0 ? ' selected' : '') + '>بلا تعديل</option><option value="1"' + (adj === 1 ? ' selected' : '') + '>+١ يوم</option></select></label>' +
      '<div class="cvm"><span>أيام الصيام المسجّلة هذا العام:</span> <b>' + A(stats(o, t.y)) + '</b></div></div>' +
      '<div class="card">' + grid(o) + '</div>' + selPanel(o) + upc() +
      '<div class="card"><h4><span>تذكيرات الصيام والمناسبات</span></h4>' + sw('occ', 'المناسبات الكبرى (عرفة، عاشوراء، رمضان…)', nf.occ) + sw('w', 'الأيام البيض', nf.w) + sw('mt', 'الاثنين والخميس', nf.mt) + '<div class="cvm"><span>تصل التذكيرات مساء اليوم السابق، وتعمل مع بقية إشعارات التطبيق.</span></div></div>';
  }
  function wire(R) {
    R.root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cv]'); if (!b) return; var a = b.dataset.cv;
      if (a === 'nf' || a === 'adj') return;
      if (a === 'pm') { st.m--; if (st.m < 1) { st.m = 12; st.y--; } } else if (a === 'nm') { st.m++; if (st.m > 12) { st.m = 1; st.y++; } }
      else if (a === 'day') st.sel = b.dataset.k; else if (a === 'fast' && st.sel) toggleFast(st.sel);
      view(R);
    });
    R.root.addEventListener('change', function (e) {
      var b = e.target; if (!b.dataset || !b.dataset.cv) return;
      if (b.dataset.cv === 'nf') setNf(b.dataset.f, b.checked); else if (b.dataset.cv === 'adj') { H().setAdj(+b.value); var t = H().today(); st.y = t.y; st.m = t.m; view(R); }
    });
  }
  var CSS = '.cvbig{font-size:1.6rem;text-align:center;color:var(--gold)}.cvm{color:var(--mut);line-height:1.9}.cvm b,.cvbig b{font-variant-numeric:tabular-nums}.cvs{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:48px}.cvh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}.cvg{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.cvw{text-align:center;font-size:.7rem;color:var(--mut);font-style:normal}.cvc{position:relative;min-height:44px;border-radius:10px;border:1px solid transparent;background:var(--cell,#eee);color:var(--tx);font:inherit;cursor:pointer}.cvc.wh{border-color:var(--gold,#c9a24b)}.cvc.fast{background:#2e9b5a55}.cvc.now{outline:2px solid var(--tx)}.cvc.sel{background:var(--gold,#c9a24b);color:#1d1a10;font-weight:700}.cvc u{position:absolute;bottom:4px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--gold,#c9a24b)}.cvl{color:var(--mut);font-size:.8rem;margin-top:6px}.cvo{border-top:1px dashed var(--line,#ddd);padding:6px 0}.cvo p{margin:2px 0;line-height:1.9}.cvq{font-family:Amiri,serif;font-size:1.1rem}.cvo small{color:var(--mut)}.cvu{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0}.cvd{text-align:end;color:var(--gold)}.cvw2{width:100%;min-height:48px;margin-top:8px}.cvc:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#cv-css')) return; var s = D.createElement('style'); s.id = 'cv-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) { css(); var t = H().ok() ? H().today() : null; st = { y: t ? t.y : 0, m: t ? t.m : 1, sel: H().todayK() }; root.innerHTML = '<div class="cvbody"></div>'; cur = { root: root }; wire(cur); view(cur); }
  window.__x_cal = { mount: mount, unmount: function () { cur = null; }, _t: { get: get, stats: stats, toggleFast: toggleFast } };
})();
