/* أذكاري — zakat.js (2.0 · C6): حاسبة الزكاة + مواريث مبسّطة. الدوال النقية في window.__x_zakat._t للاختبار.
   الزكاة: النصاب ٨٥ غ ذهب أو ٥٩٥ غ فضة، ٢.٥٪، الحول ٣٥٤ يومًا هجريًا تقريبًا، تُخصم الديون الحالّة، والأسعار يدخلها المستخدم (لا طلب خارجي).
   المواريث: الزوج/الزوجات والأب والأم والأبناء والبنات فقط. وجود إخوة أو أجداد أو أحفاد أو غيرهم ← «راجع أهل العلم».
   الفرائض بالكسور الصحيحة، مع العول، والرد على قول الجمهور (وفيه خلاف) والعمريتان. ليست فتوى. التخزين: azkari_zk (الأسعار وآخر حساب). */
(function () {
  'use strict';
  if (window.__x_zakat) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, KEY = 'azkari_zk';
  var NISAB_G = 85, NISAB_S = 595, RATE = 0.025, HAWL = 354;
  function num(v) { v = parseFloat(String(v == null ? '' : v).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[,،\s]/g, '')); return isFinite(v) && v > 0 ? v : 0; }
  /* ---- الزكاة (نقية) ---- */
  function zakat(i) {
    var gp = num(i.goldPrice), sp = num(i.silverPrice), gold = num(i.goldGrams) * (num(i.karat) ? num(i.karat) / 24 : 1), silver = num(i.silverGrams);
    var assets = num(i.cash) + gold * gp + silver * sp + num(i.trade) + num(i.receivable), debts = num(i.debts), net = Math.max(0, assets - debts);
    var nG = gp ? NISAB_G * gp : 0, nS = sp ? NISAB_S * sp : 0, base = i.nisab === 'gold' ? nG : nS, ok = !!base;
    var reached = ok && net >= base, hawlOk = i.hawlDone !== false;
    return { assets: assets, debts: debts, net: net, nisabGold: nG, nisabSilver: nS, base: base, priceMissing: !ok, reached: reached, hawl: hawlOk, due: reached && hawlOk ? net * RATE : 0, pct: RATE * 100 };
  }
  function hawlDate(startKey) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startKey || ''); if (!m) return null; var t = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + HAWL, 12)); return t.getUTCFullYear() + '-' + ('0' + (t.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + t.getUTCDate()).slice(-2); }
  /* ---- المواريث (نقية) ---- */
  function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
  function fr(n, d) { var g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
  function fadd(a, b) { return fr(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fsub(a, b) { return fr(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fmul(a, k) { return fr(a.n * k.n, a.d * k.d); }
  function fdiv(a, k) { return fr(a.n * k.d, a.d * k.n); }
  var Z = { n: 0, d: 1 }, ONE = { n: 1, d: 1 };
  function f(n, d) { return fr(n, d); }
  function mawarith(h) {
    var husband = h.husband ? 1 : 0, wives = Math.max(0, Math.min(4, +h.wives || 0)), father = h.father ? 1 : 0, mother = h.mother ? 1 : 0, sons = Math.max(0, Math.min(30, +h.sons || 0)), dau = Math.max(0, Math.min(30, +h.daughters || 0));
    if (h.other) return { refer: true, why: 'وجود إخوة أو أجداد أو أحفاد أو غيرهم يغيّر الأنصبة. راجع أهل العلم.' };
    if (husband && wives) return { refer: true, why: 'لا يجتمع زوج وزوجات.' };
    if (!(husband || wives || father || mother || sons || dau)) return { refer: true, why: 'اختر وارثًا واحدًا على الأقل.' };
    var desc = sons + dau > 0, male = sons > 0, S = [], notes = [], fixed = Z, i;
    function put(id, label, share, cnt, resid) { S.push({ id: id, label: label, share: share, count: cnt || 1, resid: !!resid }); }
    var sp = null;
    if (husband) sp = ['husband', 'الزوج', desc ? f(1, 4) : f(1, 2), 1]; else if (wives) sp = ['wives', 'الزوجات', desc ? f(1, 8) : f(1, 4), wives];
    if (sp) { put(sp[0], sp[1], sp[2], sp[3]); fixed = fadd(fixed, sp[2]); }
    var umar = !desc && sp && father && mother;      // العمريتان: للأم ثلث الباقي بعد الزوج
    if (mother) { var ms = desc ? f(1, 6) : (umar ? fmul(fsub(ONE, sp[2]), f(1, 3)) : f(1, 3)); put('mother', 'الأم', ms, 1); fixed = fadd(fixed, ms); if (umar) notes.push('العمريتان: للأم ثلث الباقي بعد نصيب الزوج/الزوجة.'); }
    if (father) { if (desc) { put('father', 'الأب', f(1, 6), 1); fixed = fadd(fixed, f(1, 6)); } }
    var femaleShare = Z;
    if (!male && dau) { femaleShare = dau === 1 ? f(1, 2) : f(2, 3); put('daughters', dau === 1 ? 'البنت' : 'البنات', femaleShare, dau); fixed = fadd(fixed, femaleShare); }
    var left = fsub(ONE, fixed), cmp = left.n * 1;
    if (left.n < 0) {   // عول: تُنسب الأنصبة إلى مجموعها
      var tot = fixed; S.forEach(function (s) { s.share = fdiv(s.share, tot); }); notes.push('عَوْل: زادت الفروض على الأصل فنقصت الأنصبة بنسبة واحدة.');
      return finish(S, notes);
    }
    if (left.n > 0) {
      if (male) {             // الأبناء والبنات يتقاسمون الباقي للذكر مثل حظ الأنثيين
        var units = sons * 2 + dau; put('children', dau ? 'الأبناء والبنات' : 'الأبناء', left, sons + dau, true); S[S.length - 1].units = { sons: sons, dau: dau, total: units };
      } else if (father) {    // الأب يرث الباقي تعصيبًا (مع الفرض 1/6 إن وُجد فرع وارث)
        var fs = S.filter(function (s) { return s.id === 'father'; })[0]; if (fs) { fs.share = fadd(fs.share, left); fs.resid = true; } else put('father', 'الأب', left, 1, true);
      } else {                // رد على أصحاب الفروض غير الزوجين، على قول الجمهور
        var rr = S.filter(function (s) { return s.id !== 'husband' && s.id !== 'wives'; });
        if (rr.length) {
          var sum = rr.reduce(function (a, s) { return fadd(a, s.share); }, Z); rr.forEach(function (s) { s.share = fadd(s.share, fmul(left, fdiv(s.share, sum))); });
          notes.push('رَدّ: بقي بعد الفروض شيء ولا عاصب، فرُدّ على أصحاب الفروض غير الزوجين. هذا قول جمهور الفقهاء، وفي المسألة خلاف عند المالكية والشافعية المتقدمين فراجع أهل العلم.');
        } else return { refer: true, why: 'لا عاصب في هذه الحالة. راجع أهل العلم.' };
      }
    }
    return finish(S, notes);
  }
  function finish(S, notes) {
    var tot = S.reduce(function (a, s) { return fadd(a, s.share); }, Z), ok = tot.n === 1 && tot.d === 1;
    return { refer: false, shares: S.map(function (s) { return { id: s.id, label: s.label, count: s.count, share: s.share, pct: s.share.n / s.share.d * 100, resid: s.resid, units: s.units }; }), notes: notes, total: ok };
  }
  function estate(total, debts, will, hasHeirsWill) { total = num(total); debts = num(debts); var net = Math.max(0, total - debts), w = Math.min(num(will), net / 3); return { net: net, will: w, dist: net - w, willCapped: num(will) > net / 3 }; }
  /* ---- الواجهة ---- */
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function M(v) { return A((Math.round(v * 100) / 100).toLocaleString('en-US')); }
  function sv() { try { var o = JSON.parse(AZ.data.get(KEY) || 'null'); return o && o.v === 1 ? o : { v: 1 }; } catch (e) { return { v: 1 }; } }
  function ld(o) { try { AZ.data.set(KEY, JSON.stringify(o)); } catch (e) {} }
  var tab = 'z';
  function fld(id, l, v, ph) { return '<label class="zkf"><span>' + l + '</span><input id="' + id + '" inputmode="decimal" autocomplete="off" value="' + esc(v == null ? '' : v) + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></label>'; }
  function zView(R) {
    var o = sv(), z = o.z || {}, h = '<div class="card"><h4><span>الأسعار (تدخلها أنت)</span></h4>' + fld('zgp', 'سعر غرام الذهب (عيار ٢٤)', z.goldPrice) + fld('zsp', 'سعر غرام الفضة', z.silverPrice) + '<div class="zkm"><span>لا يجلب التطبيق الأسعار من الإنترنت. أدخلها من مصدر موثوق في بلدك.</span></div></div>' +
      '<div class="card"><h4><span>أموالك</span></h4>' + fld('zc', 'النقد والأرصدة', z.cash) + fld('zgg', 'ذهب (غرامات)', z.goldGrams) + '<label class="zkf"><span>عيار الذهب</span><select id="zk"><option value="24"' + (z.karat == 24 ? ' selected' : '') + '>٢٤</option><option value="21"' + (z.karat == 21 ? ' selected' : '') + '>٢١</option><option value="18"' + (z.karat == 18 ? ' selected' : '') + '>١٨</option></select></label>' + fld('zsg', 'فضة (غرامات)', z.silverGrams) + fld('zt', 'عروض التجارة (القيمة الحالية)', z.trade) + fld('zr', 'ديون مرجوة السداد لك', z.receivable) + fld('zd', 'ديون حالّة عليك', z.debts) +
      '<label class="zkf"><span>النصاب المعتمد</span><select id="zn"><option value="silver"' + (z.nisab !== 'gold' ? ' selected' : '') + '>الفضة (٥٩٥ غ)</option><option value="gold"' + (z.nisab === 'gold' ? ' selected' : '') + '>الذهب (٨٥ غ)</option></select></label>' +
      '<label class="zkf"><span>بدء الحول (تاريخ بلوغ النصاب)</span><input id="zh" type="date" value="' + esc(z.hawlStart || '') + '"></label><button class="btn main zkw" data-zk="calc"><span>احسب</span></button></div><div id="zres"></div>';
    $('.zkbody', R.root).innerHTML = h; if (z.res) $('#zres', R.root).innerHTML = z.res;
  }
  function readZ(root) { var g = function (id) { var e = $('#' + id, root); return e ? e.value : ''; }; return { goldPrice: g('zgp'), silverPrice: g('zsp'), cash: g('zc'), goldGrams: g('zgg'), karat: g('zk'), silverGrams: g('zsg'), trade: g('zt'), receivable: g('zr'), debts: g('zd'), nisab: g('zn'), hawlStart: g('zh') }; }
  function calc(R) {
    var i = readZ(R.root), td = AZ.day.key(), due = hawlDate(i.hawlStart); i.hawlDone = i.hawlStart ? td >= due : true;
    var r = zakat(i), h = '<div class="card"><h4><span>النتيجة</span></h4>';
    if (r.priceMissing) h += '<p class="zkm"><span>أدخل سعر الذهب أو الفضة بحسب النصاب المختار.</span></p>';
    else { h += '<div class="zkr"><span>صافي المال</span> <b>' + M(r.net) + '</b></div><div class="zkr"><span>النصاب</span> <b>' + M(r.base) + '</b></div>';
      if (!r.reached) h += '<p class="zkm"><span>لم يبلغ مالك النصاب، فلا زكاة عليك الآن.</span></p>';
      else if (!r.hawl) h += '<p class="zkm"><span>بلغ المال النصاب ولم يتم الحول بعد. يتم تقريبًا في:</span> <b>' + esc(due) + '</b></p>';
      else h += '<div class="zkbig"><span>الزكاة الواجبة</span> <b>' + M(r.due) + '</b></div>'; }
    h += '<p class="zkm"><span>الزكاة ٢٫٥٪ من صافي المال. الراتب والأسهم والعقار المؤجَّر والمعادن لها تفصيلات فقهية، فراجع أهل العلم. الحول هنا ٣٥٤ يومًا.</span></p></div>';
    i.res = h; var o = sv(); o.z = i; ld(o); $('#zres', R.root).innerHTML = h;
  }
  var HL = [['husband', 'زوج', 1], ['wives', 'زوجات (١–٤)', 4], ['father', 'أب', 1], ['mother', 'أم', 1], ['sons', 'أبناء', 30], ['daughters', 'بنات', 30]];
  function mView(R) {
    var h = '<div class="card"><h4><span>التركة</span></h4>' + fld('mt', 'إجمالي التركة', '') + fld('md', 'الديون ومصاريف التجهيز', '') + fld('mw', 'الوصية (لغير وارث، حتى الثلث)', '') + '</div><div class="card"><h4><span>الورثة</span></h4>' + HL.map(function (x) { return '<label class="zkf"><span>' + x[1] + '</span><input id="m_' + x[0] + '" type="number" min="0" max="' + x[2] + '" value="0" inputmode="numeric"></label>'; }).join('') +
      '<label class="zkf"><span>يوجد إخوة أو أجداد أو أحفاد أو غيرهم</span><input id="m_other" type="checkbox" class="ios" aria-label="يوجد إخوة أو أجداد أو أحفاد أو غيرهم"></label><button class="btn main zkw" data-zk="mcalc"><span>احسب الأنصبة</span></button></div><div id="mres"></div>';
    $('.zkbody', R.root).innerHTML = h;
  }
  function mcalc(R) {
    var g = function (id) { var e = $('#m_' + id, R.root); return e ? +e.value || 0 : 0; }, e = estate(($('#mt', R.root) || {}).value, ($('#md', R.root) || {}).value, ($('#mw', R.root) || {}).value);
    var r = mawarith({ husband: g('husband'), wives: g('wives'), father: g('father'), mother: g('mother'), sons: g('sons'), daughters: g('daughters'), other: ($('#m_other', R.root) || {}).checked }), h = '<div class="card"><h4><span>النتيجة</span></h4>';
    if (r.refer) h += '<p class="zkm">' + esc(r.why) + '</p>';
    else {
      h += '<div class="zkm"><span>الباقي للتوزيع بعد الدين والوصية:</span> <b>' + M(e.dist) + '</b></div>' + (e.willCapped ? '<p class="zkm"><span>الوصية لا تتجاوز الثلث، فقُيّدت به.</span></p>' : '');
      h += '<div class="zkt"><div class="zkr zkh"><span>الوارث</span><span>النصيب</span><span>المبلغ</span></div>';
      r.shares.forEach(function (s) {
        var tot = e.dist * s.share.n / s.share.d, line = function (l, amt, nfr) { return '<div class="zkr"><span>' + l + '</span><span dir="ltr">' + nfr + '</span><b>' + M(amt) + '</b></div>'; };
        if (s.units) { var u = s.units; if (u.sons) h += line('<span>الأبناء</span> (' + A(u.sons) + ')', tot * (u.sons * 2) / u.total, s.share.n + '/' + s.share.d + '*'); if (u.dau) h += line('<span>البنات</span> (' + A(u.dau) + ')', tot * u.dau / u.total, ''); }
        else h += line('<span>' + s.label + '</span>' + (s.count > 1 ? ' (' + A(s.count) + ')' : ''), tot, s.share.n + '/' + s.share.d);
      });
      h += '</div>' + r.notes.map(function (n) { return '<p class="zkm">' + n + '</p>'; }).join('') + '<p class="zkm"><span>للذكر مثل حظ الأنثيين. توزيع الزوجات والبنات يكون بالتساوي بينهن.</span></p>';
    }
    $('#mres', R.root).innerHTML = h + '<p class="zkm"><span>هذه أداة مبسّطة للحالات الشائعة وليست فتوى. للحالات الأخرى أو الخلافية راجع أهل العلم أو المحكمة الشرعية.</span></p></div>';
  }
  function view(R) { var b = $('.zkbody', R.root); if (!b) return; $$('.zkt2').forEach(function (x) { x.classList.toggle('on', x.dataset.t === tab); x.setAttribute('aria-pressed', x.dataset.t === tab); }); if (tab === 'z') zView(R); else mView(R); }
  function $$(s) { return [].slice.call(D.querySelectorAll(s)); }
  var CSS = '.zkf{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:48px}.zkf input,.zkf select{min-height:44px;min-width:130px;max-width:55%;font:inherit;padding:6px 10px;border-radius:12px;border:1.5px solid var(--line,#ccc);background:var(--card,transparent);color:var(--tx);text-align:end}.zkf input[type=checkbox]{min-width:44px}.zkm{color:var(--mut);line-height:1.9}.zkm b{color:var(--tx)}.zkw{width:100%;min-height:48px;margin-top:8px}.zkr{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line,#ddd);font-variant-numeric:tabular-nums}.zkh{color:var(--mut);font-size:.85rem}.zkbig{font-size:1.4rem;color:var(--gold);text-align:center;margin:8px 0}.zktabs{display:flex;gap:6px;margin-bottom:8px}.zkt2{flex:1;min-height:44px;border-radius:22px;border:1px solid var(--line,#ccc);background:transparent;color:var(--tx);font:inherit;cursor:pointer}.zkt2.on{background:var(--gold,#c9a24b);color:#1d1a10;border-color:var(--gold,#c9a24b);font-weight:700}.zkf input:focus-visible,.zkf select:focus-visible,.zkt2:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#zk-css')) return; var s = D.createElement('style'); s.id = 'zk-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) {
    css(); tab = 'z'; root.innerHTML = '<div class="zktabs" role="group"><button class="zkt2 on" data-t="z" data-zk="tab"><span>الزكاة</span></button><button class="zkt2" data-t="m" data-zk="tab"><span>المواريث</span></button></div><div class="zkbody"></div>'; cur = { root: root };
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-zk]'); if (!b) return; var a = b.dataset.zk; if (a === 'tab') { tab = b.dataset.t; view(cur); } else if (a === 'calc') calc(cur); else if (a === 'mcalc') mcalc(cur); });
    view(cur);
  }
  window.__x_zakat = { mount: mount, unmount: function () { cur = null; }, _t: { zakat: zakat, hawlDate: hawlDate, mawarith: mawarith, estate: estate, num: num, NISAB_G: NISAB_G, NISAB_S: NISAB_S, HAWL: HAWL } };
})();
