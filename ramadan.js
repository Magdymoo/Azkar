/* أذكاري — ramadan.js (2.0 · C3): وضع رمضان. يعمل تلقائيًا بالتاريخ الهجري (AZ.hijri، شهر ٩) وبطاقة اليوم في extras.js.
   الصفحة: الإفطار والإمساك، شبكة ٣٠ يومًا (صيام / تراويح)، ليالي العشر الوترية، خطة الختمة، وأدعية بمصادرها.
   التخزين: azkari_ramadan = {v:1, y:{السنة:{f:[أيام صيام], t:[تراويح], q:[ليالي قيام]}}, nf:0|1}. تذكيرات السحور والإفطار في extras.js.
   عشاء أم القرى +١٢٠ د في رمضان يطبّقه prayer.js (isRamadan) وهو من مصدر واحد. */
(function () {
  'use strict';
  if (window.__x_ramadan) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, R = function () { return AZ.ramadan; }, H = function () { return AZ.hijri; };
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function fmtT(ms, tz) { try { var s = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).format(ms); if (typeof LANG === 'undefined' || LANG === 'ar') s = s.replace('AM', 'ص').replace('PM', 'م'); return A(s); } catch (e) { return ''; } }
  var DUAS = [['عند الإفطار', '«ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ»', 'رواه أبو داود (حسّنه الألباني)'], ['ليلة القدر', '«اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي»', 'رواه الترمذي وابن ماجه (صححه الألباني)'], ['السحور', '«تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً»', 'متفق عليه'], ['تفطير الصائم', '«مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ، غَيْرَ أَنَّهُ لَا يَنْقُصُ مِنْ أَجْرِ الصَّائِمِ شَيْئًا»', 'رواه الترمذي (صححه الألباني)']];
  function view(R0) {
    var b = $('.rmbody', R0.root); if (!b) return; var hj = H();
    if (!hj.ok()) { b.innerHTML = '<div class="card"><p class="rmm"><span>متصفحك لا يدعم التقويم الهجري.</span></p></div>'; return; }
    var t = hj.today(), o = R().get(), inR = t.m === 9, y = inR ? t.y : (t.m > 9 ? t.y + 1 : t.y), r = R().y(o, y), len = inR ? hj.daysIn(t.y, 9) : 30, h = '';
    var P = null; try { P = __pt.compute(); } catch (e) {}
    if (inR) {
      var s = AZ.state(), pg = s.page || 1, rem = 604 - (pg - 1), left = Math.max(1, len - t.d + 1);
      h += '<div class="card"><div class="rmbig"><span>اليوم</span> <b>' + A(t.d) + '</b> <span>من رمضان</span></div>' + (P && P.T ? '<div class="rmm"><span>الإفطار</span> <b>' + fmtT(+P.T.maghrib, P.L.tz) + '</b> · <span>الإمساك (الفجر)</span> <b>' + fmtT(+P.T.fajr, P.L.tz) + '</b></div>' : '') +
        '<div class="rmm"><span>صمتُ</span> <b>' + A(r.f.length) + '</b> · <span>التراويح</span> <b>' + A(r.t.length) + '</b></div>' +
        (rem > 0 ? '<div class="rmm"><span>ورد اليوم لختمة في رمضان:</span> <b>' + A(Math.ceil(rem / left)) + '</b> <span>صفحة</span> · <span>الصفحة الحالية</span> <b>' + A(pg) + '</b></div>' : '') + '</div>';
    } else {
      var u = hj.upcoming(12).filter(function (x) { return x.o.id === 'ramadan'; })[0];
      h += '<div class="card"><div class="rmbig">' + (u ? '<b>' + A(u.days) + '</b> <span>يوم على رمضان بحسب التقويم</span>' : '') + '</div><div class="rmm"><span>تظهر بطاقة رمضان في «اليوم» تلقائيًا عند دخول الشهر.</span></div></div>';
    }
    h += '<div class="card"><h4><span>أيام رمضان</span></h4><div class="rmg" role="group">';
    for (var d = 1; d <= len; d++) {
      var f = r.f.indexOf(d) >= 0, tr = r.t.indexOf(d) >= 0, cur = inR && d === t.d, locked = inR && d > t.d;
      h += '<div class="rmc' + (cur ? ' now' : '') + '"><b>' + A(d) + '</b><button class="rmt' + (f ? ' on' : '') + '" data-rm="f" data-d="' + d + '" aria-pressed="' + f + '" aria-label="صيام"' + (locked ? ' disabled' : '') + '>ص</button><button class="rmt' + (tr ? ' on' : '') + '" data-rm="t" data-d="' + d + '" aria-pressed="' + tr + '" aria-label="تراويح"' + (locked ? ' disabled' : '') + '>ت</button></div>';
    }
    h += '</div><div class="rmm"><span>ص = صيام · ت = تراويح</span></div></div>';
    h += '<div class="card"><h4><span>ليالي العشر الوترية</span></h4><div class="rmq">' + [21, 23, 25, 27, 29].map(function (n) { var on = r.q.indexOf(n) >= 0; return '<button class="rmn' + (on ? ' on' : '') + '" data-rm="q" data-d="' + n + '" aria-pressed="' + on + '"><b>' + A(n) + '</b></button>'; }).join('') + '</div><div class="rmm"><span>سجّل الليالي التي قمتها. وليلة القدر تُطلب في الوتر من العشر الأواخر ولا تُعلم بعينها.</span></div></div>';
    h += '<div class="card"><h4><span>أدعية وسنن</span></h4>' + DUAS.map(function (d) { return '<div class="rmd"><b>' + d[0] + '</b><p class="rmdq">' + esc(d[1]) + '</p><small>' + d[2] + '</small></div>'; }).join('') + '</div>';
    h += '<div class="card"><label class="rms"><span>تذكير السحور والإفطار</span><input type="checkbox" class="ios" data-rm="nf"' + (o.nf !== 0 ? ' checked' : '') + ' aria-label="تذكير السحور والإفطار"></label><div class="rmm"><span>يصل تذكير السحور قبل الفجر بأربعين دقيقة، وتذكير الإفطار قبل المغرب بعشر دقائق.</span></div></div>';
    b.innerHTML = h;
  }
  function wire(R0) {
    R0.root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rm]'); if (!b || b.dataset.rm === 'nf' || b.disabled) return; var k = b.dataset.rm, d = +b.dataset.d, hj = H(), t = hj.today(), o = R().get(), y = t.m === 9 ? t.y : (t.m > 9 ? t.y + 1 : t.y), r = R().y(o, y), a = r[k], i = a.indexOf(d);
      if (i < 0) a.push(d); else a.splice(i, 1); R().set(o); view(R0); try { var s = $('.tlB'); } catch (x) {}
    });
    R0.root.addEventListener('change', function (e) { var b = e.target; if (b.dataset && b.dataset.rm === 'nf') { var o = R().get(); o.nf = b.checked ? 1 : 0; R().set(o); try { if (window.__nf) window.__nf.schedule(); } catch (x) {} } });
  }
  var CSS = '.rmbig{font-size:1.4rem;text-align:center;color:var(--gold)}.rmbig b{font-variant-numeric:tabular-nums}.rmm{color:var(--mut);line-height:1.9;text-align:center}.rmm b{color:var(--tx);font-variant-numeric:tabular-nums}.rmg{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.rmc{display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px;border-radius:10px;background:var(--cell,#eee)}.rmc.now{outline:2px solid var(--gold,#c9a24b)}.rmt{min-width:44px;min-height:44px;border-radius:50%;border:1px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;cursor:pointer}.rmt.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b);font-weight:700}.rmt:disabled{opacity:.4}.rmq{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0}.rmn{min-width:52px;min-height:52px;border-radius:50%;border:1.5px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;font-size:1.05rem;cursor:pointer}.rmn.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b)}.rmd{border-top:1px dashed var(--line,#ddd);padding:6px 0}.rmdq{font-family:Amiri,serif;font-size:1.15rem;line-height:2;margin:2px 0}.rmd small{color:var(--mut)}.rms{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:48px}.rmt:focus-visible,.rmn:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#rm-css')) return; var s = D.createElement('style'); s.id = 'rm-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) { css(); root.innerHTML = '<div class="rmbody"></div>'; cur = { root: root }; wire(cur); view(cur); }
  window.__x_ramadan = { mount: mount, unmount: function () { cur = null; } };
})();
