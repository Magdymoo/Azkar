/* أذكاري — learn.js (2.0 · «أتعلّم»): الأربعون النووية. تحميل كسول عند فتح الصفحة؛ المحتوى في arbaeen.json (يُجلب مرة ويُخزَّن).
   لكل حديث: النص والراوي والمخرِّج + شرح موجز + فوائد، وتتبّع الحفظ (لم أبدأ / أحفظه / حفظته / أراجعه + تاريخ آخر مراجعة)،
   واختبار «كمّل الحديث». التخزين: azkari_arb عبر AZ.data (يدخل النسخ الاحتياطي، ≈ ٢ك لكل ٤٢ حديثًا). الشرح والفوائد بصياغتنا لا نقلًا حرفيًا. */
(function () {
  'use strict';
  if (window.__x_learn) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, KEY = 'azkari_arb', DUE_DAYS = 14;
  var DATA = null, DP = null, st = { v: 'list', f: 'all', n: 0, q: null };
  var ST = { l: 'أحفظه', h: 'حفظته', r: 'أراجعه' };
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function li() { try { return { ar: 0, en: 1, fr: 2, tr: 3 }[typeof LANG === 'undefined' ? 'ar' : LANG] || 0; } catch (e) { return 0; } }
  function today() { try { return AZ.day.key(); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function daysBetween(a, b) { var x = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a || ''), y = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b || ''); return x && y ? Math.round((Date.UTC(+y[1], +y[2] - 1, +y[3]) - Date.UTC(+x[1], +x[2] - 1, +x[3])) / 864e5) : 9999; }
  function get() { try { var o = JSON.parse(AZ.data.get(KEY) || 'null'); if (o && o.v === 1 && o.s) { o.q = o.q || { ok: 0, n: 0 }; return o; } } catch (e) {} return { v: 1, s: {}, q: { ok: 0, n: 0 } }; }
  function put(o) { try { AZ.data.set(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function setSt(n, k) { var o = get(); if (!k) delete o.s[n]; else { var e = o.s[n] || {}; e.st = k; if (k !== 'l') e.rv = e.rv || today(); o.s[n] = e; } return put(o); }
  function review(n) { var o = get(), e = o.s[n] || { st: 'r' }; if (e.st === 'l') e.st = 'r'; e.rv = today(); o.s[n] = e; return put(o); }
  function isDue(e, td) { return !!e && (e.st === 'h' || e.st === 'r') && daysBetween(e.rv, td || today()) >= DUE_DAYS; }
  function counts(o, td) { var c = { l: 0, h: 0, r: 0, due: 0 }; Object.keys(o.s).forEach(function (k) { var e = o.s[k]; if (c[e.st] != null) c[e.st]++; if (isDue(e, td)) c.due++; }); return c; }
  function load() { if (DATA) return Promise.resolve(DATA); return DP || (DP = fetch(window.AZ && AZ.asset ? AZ.asset('arbaeen.json') : 'arbaeen.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { return DATA = j.h; }).catch(function () { DP = null; return null; })); }

  /* ---- اختبار «كمّل الحديث» (دوال نقية) ---- */
  function words(t) { return String(t).replace(/[﴿﴾]/g, '').split(/\s+/).filter(Boolean); }
  function quizOf(h, all, rnd) {
    rnd = rnd || Math.random; var w = words(h.x); if (w.length < 8) return null;
    var cut = Math.min(Math.max(4, Math.floor(w.length / 2)), 22), tail = w.slice(cut, cut + 7).join(' '); if (!tail) return null;
    var ds = [], pool = all.filter(function (o) { return o.n !== h.n; }).sort(function () { return rnd() - .5; });
    for (var i = 0; i < pool.length && ds.length < 2; i++) { var v = words(pool[i].x); if (v.length < 12) continue; var s = Math.floor(v.length / 2); var d = v.slice(s, s + 7).join(' '); if (d && d !== tail) ds.push(d); }
    if (ds.length < 2) return null;
    var opts = [tail].concat(ds).map(function (t, i) { return { t: t, ok: i === 0 }; }).sort(function () { return rnd() - .5; });
    return { n: h.n, head: w.slice(0, cut).join(' '), opts: opts };
  }
  function pickQuiz(all, o, rnd) {
    var pref = all.filter(function (h) { var e = o.s[h.n]; return e && (e.st === 'l' || e.st === 'h' || e.st === 'r'); }), pool = pref.length ? pref : all;
    for (var i = 0; i < 20; i++) { var q = quizOf(pool[Math.floor((rnd || Math.random)() * pool.length)], all, rnd); if (q) return q; }
    return null;
  }

  /* ---- الواجهة ---- */
  function chips(o) {
    var c = counts(o, today()), F = [['all', 'الكل'], ['l', 'أحفظه'], ['h', 'حفظته'], ['r', 'أراجعه'], ['due', 'يحتاج مراجعة'], ['n', 'لم أبدأ']];
    return '<div class="lrf" role="group" aria-label="تصفية">' + F.map(function (f) { return '<button class="lrc' + (st.f === f[0] ? ' on' : '') + '" data-lr="f" data-f="' + f[0] + '" aria-pressed="' + (st.f === f[0]) + '"><span>' + f[1] + '</span>' + (f[0] === 'due' && c.due ? ' <b>' + A(c.due) + '</b>' : '') + '</button>'; }).join('') + '</div>';
  }
  function listV() {
    var o = get(), c = counts(o, today()), td = today(), k = li();
    var rows = DATA.filter(function (h) { var e = o.s[h.n]; return st.f === 'all' ? true : st.f === 'n' ? !e : st.f === 'due' ? isDue(e, td) : e && e.st === st.f; });
    return '<div class="card"><div class="lrh"><div><span>حفظتُ</span> <b>' + A(c.h) + '</b> / <b>' + A(42) + '</b></div><div class="lrm"><span>أحفظه الآن</span> <b>' + A(c.l) + '</b> · <span>أراجعه</span> <b>' + A(c.r) + '</b></div></div>' +
      '<div class="lrp" role="progressbar" aria-valuemin="0" aria-valuemax="42" aria-valuenow="' + c.h + '"><i style="width:' + (c.h / 42 * 100) + '%"></i></div>' +
      '<button class="btn main lrw" data-lr="quiz">اختبار «كمّل الحديث»</button>' + (o.q.n ? '<div class="lrm"><span>نتيجة الاختبارات:</span> <b>' + A(o.q.ok) + '</b>/<b>' + A(o.q.n) + '</b></div>' : '') + '</div>' +
      chips(o) + '<div class="card lrl">' + (rows.length ? rows.map(function (h) { var e = o.s[h.n], d = isDue(e, td); return '<button class="lrr" data-lr="o" data-n="' + h.n + '"><b class="lrn">' + A(h.n) + '</b><span class="lrt">' + esc(h.t[k] || h.t[0]) + '</span>' + (e ? '<span class="lrs' + (d ? ' due' : '') + '">' + (d ? '<span>يحتاج مراجعة</span>' : '<span>' + ST[e.st] + '</span>') + '</span>' : '') + '</button>'; }).join('') : '<p class="lrm"><span>لا أحاديث في هذه القائمة.</span></p>') + '</div>';
  }
  function detailV() {
    var h = DATA[st.n - 1], o = get(), e = o.s[h.n] || null, k = li();
    var sb = ['l', 'h', 'r'].map(function (s) { return '<button class="lrc' + (e && e.st === s ? ' on' : '') + '" data-lr="st" data-s="' + s + '" aria-pressed="' + !!(e && e.st === s) + '"><span>' + ST[s] + '</span></button>'; }).join('') + '<button class="lrc' + (!e ? ' on' : '') + '" data-lr="st" data-s="" aria-pressed="' + !e + '"><span>لم أبدأ</span></button>';
    return '<div class="lrb"><button class="btn" data-lr="b">→ رجوع</button><span class="lrm"><b>' + A(h.n) + '</b> / <b>' + A(42) + '</b></span></div>' +
      '<div class="card"><h3 class="lrtt">' + esc(h.t[k] || h.t[0]) + '</h3><p class="lrx">' + esc(h.x) + '</p><div class="lrsrc"><span>' + esc(h.r) + '</span><span>' + esc(h.k) + '</span></div></div>' +
      '<div class="card"><h4><span>الشرح الموجز</span></h4><p class="lre">' + esc(h.e[k] || h.e[0]) + '</p><h4><span>فوائد</span></h4><ul class="lrfi">' + h.f.map(function (f) { return '<li>' + esc(f[k] || f[0]) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h4><span>حالة الحفظ</span></h4><div class="lrf" role="group">' + sb + '</div>' + (e && e.rv ? '<div class="lrm"><span>آخر مراجعة:</span> <b>' + esc(e.rv) + '</b></div>' : '') + (e && e.st !== 'l' ? '<button class="btn lrw" data-lr="rv">راجعتُه اليوم</button>' : '') + '</div>' +
      '<div class="lrb"><button class="btn" data-lr="pv"' + (st.n <= 1 ? ' disabled' : '') + '>→ السابق</button><button class="btn" data-lr="nx"' + (st.n >= 42 ? ' disabled' : '') + '>التالي ←</button></div>';
  }
  function quizV() {
    var q = st.q; if (!q) return '<div class="card"><p class="lrm"><span>تعذّر تجهيز سؤال. جرّب مرة أخرى.</span></p><button class="btn" data-lr="b">→ رجوع</button></div>';
    var h = DATA[q.n - 1], k = li();
    return '<div class="lrb"><button class="btn" data-lr="b">→ رجوع</button></div><div class="card"><h4><span>كمّل الحديث</span></h4><p class="lrx">' + esc(q.head) + ' …</p><div class="lrq" role="group" aria-label="الخيارات">' + q.opts.map(function (p, i) { return '<button class="lro' + (q.done ? (p.ok ? ' ok' : (q.pick === i ? ' no' : '')) : '') + '" data-lr="ans" data-i="' + i + '"' + (q.done ? ' disabled' : '') + '>' + esc(p.t) + ' …</button>'; }).join('') + '</div>' +
      (q.done ? '<p class="lrm"><span>' + (q.pickOk ? 'أحسنت ✓' : 'ليست هذه، راجع الحديث') + '</span></p><p class="lrx lrfull">' + esc(h.x) + '</p><div class="lrsrc"><span>' + esc(h.t[k] || h.t[0]) + '</span><span>' + esc(h.k) + '</span></div><button class="btn main lrw" data-lr="quiz">سؤال آخر</button>' : '') + '</div>';
  }
  function view(R) { var b = $('.lrbody', R.root); if (!b) return; if (!DATA) { b.innerHTML = '<p class="lrm"><span>تعذّر تحميل الأحاديث. تأكد من الاتصال مرة واحدة ليُحفظ للاستخدام بدون إنترنت.</span></p>'; return; } b.innerHTML = st.v === 'd' ? detailV() : st.v === 'z' ? quizV() : listV(); try { b.scrollTop = 0; var s = b.closest('.tlB'); if (s) s.scrollTop = 0; } catch (e) {} }
  function wire(R) {
    R.root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lr]'); if (!b || b.disabled) return; var a = b.dataset.lr;
      if (a === 'f') { st.f = b.dataset.f; } else if (a === 'o') { st.v = 'd'; st.n = +b.dataset.n; }
      else if (a === 'b') { st.v = 'list'; st.q = null; } else if (a === 'st') { setSt(st.n, b.dataset.s); } else if (a === 'rv') { review(st.n); try { if (typeof toast === 'function') toast('سُجّلت مراجعتك'); } catch (x) {} }
      else if (a === 'pv' && st.n > 1) st.n--; else if (a === 'nx' && st.n < 42) st.n++;
      else if (a === 'quiz') { st.v = 'z'; st.q = pickQuiz(DATA, get()); }
      else if (a === 'ans' && st.q && !st.q.done) { var i = +b.dataset.i, ok = st.q.opts[i].ok, o = get(); o.q.n++; if (ok) o.q.ok++; put(o); st.q.done = true; st.q.pick = i; st.q.pickOk = ok; }
      view(R);
    });
  }
  var CSS = '.lrh{display:flex;justify-content:space-between;gap:8px;align-items:baseline;flex-wrap:wrap}.lrm{color:var(--mut);line-height:1.9}.lrm b,.lrh b{color:var(--tx);font-variant-numeric:tabular-nums}.lrp{height:8px;border-radius:4px;background:var(--line,#ddd);margin:8px 0;overflow:hidden}.lrp i{display:block;height:100%;background:var(--gold,#c9a24b)}.lrw{width:100%;min-height:48px;margin-top:6px}.lrf{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.lrc{min-height:44px;padding:6px 14px;border-radius:22px;border:1px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;font-size:.92rem;cursor:pointer}.lrc.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b);font-weight:700}.lrl{padding:4px}.lrr{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:6px 8px;border:0;border-bottom:1px solid var(--line,#ddd);background:transparent;color:var(--tx);font:inherit;text-align:start;cursor:pointer}.lrr:last-child{border-bottom:0}.lrn{min-width:2.2em;color:var(--gold)}.lrt{flex:1;line-height:1.7}.lrs{font-size:.8rem;padding:2px 10px;border-radius:12px;background:var(--cell,#eee)}.lrs.due{background:#c9772433;color:var(--tx)}.lrx{font-family:Amiri,serif;font-size:1.3rem;line-height:2.2;margin:6px 0}.lrfull{border-top:1px dashed var(--line);padding-top:8px}.lrsrc{display:flex;flex-direction:column;gap:2px;color:var(--mut);font-size:.88rem}.lrtt{margin:0 0 4px;color:var(--gold)}.lre{line-height:2;margin:4px 0}.lrfi{margin:4px 0;padding-inline-start:22px;line-height:2}.lrb{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0}.lrb .btn{min-height:44px}.lrq{display:flex;flex-direction:column;gap:8px;margin:8px 0}.lro{min-height:52px;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line,#ccc);background:var(--card,transparent);color:var(--tx);font:inherit;font-family:Amiri,serif;font-size:1.1rem;line-height:1.9;text-align:start;cursor:pointer}.lro.ok{border-color:#2e9b5a;background:#2e9b5a22}.lro.no{border-color:#c0392b;background:#c0392b22}.lrc:focus-visible,.lrr:focus-visible,.lro:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#lr-css')) return; var s = D.createElement('style'); s.id = 'lr-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) { css(); root.innerHTML = '<div class="lrbody" aria-live="polite"></div>'; cur = { root: root }; st = { v: 'list', f: 'all', n: 0, q: null }; wire(cur); view(cur); load().then(function () { if (cur) view(cur); }); }
  function unmount() { cur = null; }
  window.__x_learn = { mount: mount, unmount: unmount, load: load, _t: { quizOf: quizOf, pickQuiz: pickQuiz, words: words, isDue: isDue, counts: counts, daysBetween: daysBetween, setSt: setSt, review: review, get: get, DUE_DAYS: DUE_DAYS } };
})();
