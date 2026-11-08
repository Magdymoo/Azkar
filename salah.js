/* أذكاري — salah.js (2.0 · C6): أدوات الصلاة: أوقات النهي، وضع السفر، المدن المحفوظة.
   المواقيت من __pt.compute() فقط (لا حساب مستقل). أوقات النهي تقريبية (الشروق/الزوال/الغروب بهوامش معروفة).
   وضع السفر: azkari_travel={on,since}، يعرض القصر والجمع ولا يغيّر المواقيت. المدن: azkari_cities=[{name,lat,lng,tz,cc}] والتبديل عبر AZ.loc.set. */
(function () {
  'use strict';
  if (window.__x_salah) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, M = 6e4;
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function fmtT(ms, tz) { try { var s = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).format(ms); if (typeof LANG === 'undefined' || LANG === 'ar') s = s.replace('AM', 'ص').replace('PM', 'م'); return A(s); } catch (e) { return ''; } }
  function P() { try { return window.__pt && __pt.compute && __pt.compute(); } catch (e) { return null; } }
  /* ---- النهي (نقية): T = {fajr,sunrise,dhuhr,asr,maghrib} ---- */
  function nahy(T) {
    if (!T || !T.fajr || !T.sunrise || !T.dhuhr || !T.asr || !T.maghrib) return [];
    return [
      { id: 'sunrise', t: 'بعد صلاة الفجر حتى ترتفع الشمس', a: +T.fajr, b: +T.sunrise + 15 * M, note: 'ينتهي بعد الشروق بنحو ١٥ دقيقة' },
      { id: 'zenith', t: 'وقت الاستواء قبل الظهر', a: +T.dhuhr - 10 * M, b: +T.dhuhr, note: 'نحو ١٠ دقائق قبل الزوال' },
      { id: 'asr', t: 'بعد صلاة العصر حتى الغروب', a: +T.asr, b: +T.maghrib, note: 'وأشدّه حين تصفرّ الشمس وتقرب من الغروب' },
      { id: 'sunset', t: 'عند الغروب', a: +T.maghrib - 15 * M, b: +T.maghrib, note: 'نحو ١٥ دقيقة قبل المغرب' }
    ];
  }
  function nahyNow(T, now) { var L = nahy(T), hit = L.filter(function (w) { return now >= w.a && now < w.b; }); return { active: hit.length > 0, ids: hit.map(function (w) { return w.id; }), windows: L }; }
  /* ---- المدن (نقية) ---- */
  function cget() { try { var a = JSON.parse(AZ.data.get('azkari_cities') || '[]'); return Array.isArray(a) ? a.filter(function (c) { return c && isFinite(c.lat) && isFinite(c.lng) && c.name; }) : []; } catch (e) { return []; } }
  function cput(a) { try { AZ.data.set('azkari_cities', JSON.stringify(a.slice(0, 8))); return true; } catch (e) { return false; } }
  function cadd(loc) { if (!loc || !isFinite(loc.lat) || !isFinite(loc.lng)) return false; var a = cget(), n = String(loc.name || 'موقعي'); if (a.some(function (c) { return Math.abs(c.lat - loc.lat) < .05 && Math.abs(c.lng - loc.lng) < .05; })) return false; if (a.length >= 8) return false; a.push({ name: n, lat: loc.lat, lng: loc.lng, tz: loc.tz, cc: loc.cc }); return cput(a); }
  function cdel(i) { var a = cget(); a.splice(i, 1); return cput(a); }
  function csw(i) { var c = cget()[i]; if (!c) return false; try { AZ.loc.set({ lat: c.lat, lng: c.lng, name: c.name, tz: c.tz, cc: c.cc, src: 'saved' }); return true; } catch (e) { return false; } }
  /* ---- السفر ---- */
  function tget() { try { var o = JSON.parse(AZ.data.get('azkari_travel') || 'null'); return o && o.on ? o : { on: false }; } catch (e) { return { on: false }; } }
  function tset(on) { try { AZ.data.set('azkari_travel', JSON.stringify({ on: !!on, since: on ? AZ.day.key() : '' })); return true; } catch (e) { return false; } }
  function view(R) {
    var b = $('.slbody', R.root); if (!b) return; var p = P(), T = p && p.T, tz = p && p.L && p.L.tz, now = Date.now(), tv = tget(), n = nahyNow(T, now), cs = cget(), cur = null; try { cur = AZ.loc.get(); } catch (e) {}
    var h = '<div class="card"><h4><span>أوقات النهي عن الصلاة</span></h4>';
    if (!T) h += '<p class="slm"><span>حدّد موقعك من «المواقيت» لعرض الأوقات.</span></p>';
    else {
      h += '<div class="slbig ' + (n.active ? 'no' : 'ok') + '">' + (n.active ? '<span>الآن وقت نهي</span>' : '<span>الآن ليس وقت نهي</span>') + '</div>' + n.windows.map(function (w) { return '<div class="slr' + (n.ids.indexOf(w.id) >= 0 ? ' on' : '') + '"><span><b>' + w.t + '</b><small class="slm">' + w.note + '</small></span><span class="slt" dir="ltr">' + fmtT(w.a, tz) + ' – ' + fmtT(w.b, tz) + '</span></div>'; }).join('');
    }
    h += '<p class="slq">«ثَلَاثُ سَاعَاتٍ كَانَ رَسُولُ اللَّهِ ﷺ يَنْهَانَا أَنْ نُصَلِّيَ فِيهِنَّ: حِينَ تَطْلُعُ الشَّمْسُ بَازِغَةً حَتَّى تَرْتَفِعَ، وَحِينَ يَقُومُ قَائِمُ الظَّهِيرَةِ حَتَّى تَمِيلَ الشَّمْسُ، وَحِينَ تَضَيَّفُ الشَّمْسُ لِلْغُرُوبِ حَتَّى تَغْرُبَ»</p><small class="slm">رواه مسلم</small><p class="slm"><span>الأوقات تقريبية. ويختلف أهل العلم في الصلوات ذوات الأسباب (كتحية المسجد وقضاء الفوائت) في هذه الأوقات، وفي يوم الجمعة وقت الزوال، وفي مكة. فاسأل أهل العلم عند الحاجة.</span></p></div>';
    h += '<div class="card"><h4><span>وضع السفر</span></h4><label class="sls"><span>أنا مسافر</span><input type="checkbox" class="ios" data-sl="tv"' + (tv.on ? ' checked' : '') + ' aria-label="أنا مسافر"></label><p class="slq">﴿وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ﴾</p><small class="slm">النساء ١٠١</small>';
    if (tv.on) {
      h += '<p class="slm"><span>للمسافر قصر الظهر والعصر والعشاء إلى ركعتين، ويجوز له الجمع بين الظهر والعصر وبين المغرب والعشاء عند الحاجة. والفجر والمغرب لا يُقصران.</span></p>';
      if (T) h += '<div class="slr"><span><b>الظهر والعصر</b></span><span class="slt" dir="ltr">' + fmtT(+T.dhuhr, tz) + ' / ' + fmtT(+T.asr, tz) + '</span></div><div class="slr"><span><b>المغرب والعشاء</b></span><span class="slt" dir="ltr">' + fmtT(+T.maghrib, tz) + ' / ' + fmtT(+T.isha, tz) + '</span></div>';
    }
    h += '<p class="slm"><span>مسافة السفر المبيحة للقصر: الجمهور على نحو ٨٠ كم، ومن العلماء من يردّها إلى العرف. والمقيم في بلده يصلّي تامًّا، وفي مدة الإقامة في بلد السفر خلاف بين أهل العلم.</span></p></div>';
    h += '<div class="card"><h4><span>المدن المحفوظة</span></h4>' + (cs.length ? cs.map(function (c, i) { var on = cur && Math.abs(cur.lat - c.lat) < .05 && Math.abs(cur.lng - c.lng) < .05; return '<div class="slr' + (on ? ' on' : '') + '"><span><b>' + esc(c.name) + '</b>' + (on ? ' <small class="slm"><span>الحالية</span></small>' : '') + '</span><span><button class="btn" data-sl="sw" data-i="' + i + '"><span>استخدم</span></button> <button class="btn" data-sl="del" data-i="' + i + '" aria-label="حذف"><span>حذف</span></button></span></div>'; }).join('') : '<p class="slm"><span>لا مدن محفوظة بعد.</span></p>') + (cur ? '<button class="btn main slw" data-sl="add"><span>حفظ موقعي الحالي</span></button>' : '') + '<p class="slm"><span>تبديل المدينة يغيّر المواقيت والتذكيرات فورًا. حتى ٨ مدن، وتبقى على جهازك.</span></p></div>';
    b.innerHTML = h;
  }
  function wire(R) {
    R.root.addEventListener('click', function (e) { var b = e.target.closest('[data-sl]'); if (!b || b.dataset.sl === 'tv') return; var a = b.dataset.sl, i = +b.dataset.i; if (a === 'add') { var l = null; try { l = AZ.loc.get(); } catch (x) {} if (!cadd(l)) try { if (typeof toast === 'function') toast('محفوظة من قبل أو بلغت الحد'); } catch (x) {} } else if (a === 'del') cdel(i); else if (a === 'sw') csw(i); view(R); });
    R.root.addEventListener('change', function (e) { var b = e.target; if (b.dataset && b.dataset.sl === 'tv') { tset(b.checked); view(R); } });
  }
  var CSS = '.slbig{text-align:center;font-size:1.2rem;padding:10px;border-radius:14px;margin:6px 0}.slbig.no{background:#c0392b33}.slbig.ok{background:#2e9b5a22}.slr{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line,#ddd)}.slr.on{background:#c9a24b22}.slr small{display:block}.slt{font-variant-numeric:tabular-nums;white-space:nowrap}.slm{color:var(--mut);line-height:1.9}.slq{font-family:Amiri,serif;font-size:1.15rem;line-height:2.1;margin:6px 0 0}.sls{display:flex;justify-content:space-between;align-items:center;min-height:48px}.slw{width:100%;min-height:48px;margin-top:8px}';
  function css() { if ($('#sl-css')) return; var s = D.createElement('style'); s.id = 'sl-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur2 = null;
  function mount(root) { css(); root.innerHTML = '<div class="slbody"></div>'; cur2 = { root: root }; wire(cur2); view(cur2); }
  window.__x_salah = { mount: mount, unmount: function () { cur2 = null; }, _t: { nahy: nahy, nahyNow: nahyNow, cget: cget, cadd: cadd, cdel: cdel, tget: tget, tset: tset } };
})();
