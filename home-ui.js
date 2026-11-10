/* وِردي — home-ui.js (v3.1.0): الرئيسية والقائمة الجانبية بتصميم السماء (مطابق للصور المرجعية).
   يعتمد على AZ.times.get() للمواقيت، وعلى أزرار التنقّل الحالية (nav) وAZ_lazy لفتح الصفحات. لا طلبات خارجية. */
(function () {
'use strict';
var D = document, $ = function (s, r) { return (r || D).querySelector(s); };
var DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
var PN = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
var IC = { fajr: '🌅', sunrise: '☀️', dhuhr: '🌞', asr: '⛅', maghrib: '🌇', isha: '🌙' };
function safe(f) { return function () { try { return f.apply(this, arguments); } catch (e) { console.warn('[home-ui]', e); } }; }
function t12(d) { if (!d) return '--:--'; var h = d.getHours() % 12 || 12, m = d.getMinutes(); return h + ':' + (m < 10 ? '0' : '') + m; }
function ampm(d) { return d && d.getHours() < 12 ? 'ص' : 'م'; }
function hijri(now) {
  try {
    var p = {}; new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })
      .formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    return { d: p.day, m: p.month, y: String(p.year).replace(/\D/g, '') };
  } catch (e) { return { d: '', m: '', y: '' }; }
}
function times() { try { return window.AZ && AZ.times && AZ.times.get(0); } catch (e) { return null; } }
function nextPrayer(now) {
  var T = times(); if (!T) return null;
  var ks = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (var i = 0; i < ks.length; i++) if (T[ks[i]] && T[ks[i]] > now) return { k: ks[i], at: T[ks[i]] };
  var N = null; try { N = AZ.times.get(1); } catch (e) {}
  return N && N.fajr ? { k: 'fajr', at: N.fajr } : null;
}
function mins(ms) { return Math.max(0, Math.round(ms / 60000)); }
function human(m) { if (m < 1) return 'الآن'; if (m < 60) return m + (m < 11 ? ' دقائق' : ' دقيقة'); var h = Math.floor(m / 60), r = m % 60; return h + ' ساعة' + (r ? ' و' + r + ' دقيقة' : ''); }
function forbidden(now) {
  var T = times(); if (!T) return null; var M = 6e4;
  var W = [[T.fajr, T.sunrise && +T.sunrise + 15 * M, 'بعد صلاة الفجر', 'إلى ارتفاع الشمس قيد رمح'],
    [T.dhuhr && +T.dhuhr - 10 * M, T.dhuhr, 'قبيل الزوال', 'حتى يدخل وقت الظهر'],
    [T.asr, T.maghrib, 'من بعد صلاة العصر', 'إلى أذان المغرب']];
  for (var i = 0; i < W.length; i++) { var a = +W[i][0], b = +W[i][1]; if (a && b && now >= a && now < b) return { on: true, a: W[i][2], b: W[i][3] }; }
  return null;
}
function azkarNow(now) {
  var T = times(), h = now.getHours();
  if (T && T.fajr && T.dhuhr && now >= T.fajr && now < T.dhuhr) return { t: 'أذكار الصباح', s: 'ابدأ يومك بذكر الله', ic: '🌅' };
  if (T && T.asr && T.isha && now >= T.asr && now < +T.isha + 6e5) return { t: 'أذكار المساء', s: 'اختم نهارك بذكر الله', ic: '🌇' };
  if (h >= 21 || h < 4) return { t: 'أذكار النوم', s: 'نم على ذكر الله', ic: '🌙' };
  return { t: 'أذكار الصباح', s: 'ابدأ يومك بذكر الله', ic: '🌅' };
}
function sky(now) {
  var T = times(), h = now.getHours() + now.getMinutes() / 60;
  if (T && T.maghrib && T.isha && now >= +T.maghrib - 36e5 && now < T.isha) return ['#2b1a5c', '#8a4a82', '#7a3f35'];
  if (T && T.isha && (now >= T.isha || h < 4)) return ['#0e1230', '#1d1f55', '#2a2358'];
  if (h < 8) return ['#16375e', '#4a6b86', '#7a6648'];
  return ['#1a4f86', '#4f86b8', '#a9c3d6'];
}
function css() {
  if ($('#wh-css')) return;
  var s = D.createElement('style'); s.id = 'wh-css';
  s.textContent = 'html[data-wh] #v-home>:not(#wh){display:none!important}'
    + '#wh{margin:-12px -14px 0;padding:0 16px 24px;min-height:100vh;color:#fff;font-family:Cairo,sans-serif;direction:rtl;background:linear-gradient(180deg,var(--s1) 0,var(--s2) 340px,#000 560px)}'
    + '#wh .bar{display:flex;align-items:center;justify-content:space-between;padding:calc(14px + env(safe-area-inset-top,0px)) 0 8px}'
    + '#wh .bar .lg{font:700 2rem Amiri,serif}#wh .rb{width:46px;height:46px;border-radius:50%;border:1px solid #ffffff40;background:#ffffff26;color:#fff;font-size:1.2rem;display:grid;place-items:center;margin:0 4px}'
    + '#wh .row{display:flex;align-items:center}'
    + '#wh .day{font:700 4.2rem/1.1 Amiri,serif;margin-top:14px}#wh .city{opacity:.7;font-size:1.05rem}'
    + '#wh .moon{width:62px;height:62px;border-radius:50%;box-shadow:inset 12px 0 0 0 #f4ecd8;background:#ffffff1a;margin-inline-start:auto}'
    + '#wh .dts{display:flex;justify-content:space-between;border-top:1px solid #ffffff3a;margin:14px 0;padding-top:14px}#wh .dts b{font-size:1.6rem}#wh .dts small{display:block;opacity:.65;font-size:1.1rem}'
    + '#wh .cd{background:#ffffff14;border:1px solid #ffffff22;border-radius:26px;padding:14px 18px;margin:12px 0;width:100%;color:#fff;font:inherit;text-align:right;display:flex;align-items:center;gap:12px;backdrop-filter:blur(10px)}'
    + '#wh .cd .bd{width:5px;align-self:stretch;border-radius:4px;background:#2d7fb0}#wh .cd.rd .bd{background:#e5534b}#wh .cd .x{flex:1}#wh .cd b{display:block;font-size:1.3rem}#wh .cd span{opacity:.75}#wh .cd .ti{font-size:1.9rem;opacity:.7;direction:ltr}'
    + '#wh .pg{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#ffffff10;border:1px solid #ffffff22;border-radius:26px;padding:14px;margin:12px 0}#wh .pg h3{grid-column:1/-1;margin:0 4px 2px;font-size:1.2rem}'
    + '#wh .pt{background:#ffffff12;border-radius:18px;padding:12px;line-height:1.7}#wh .pt.on{outline:1.5px solid #e1c779}#wh .pt b{font-size:1.7rem;display:block}#wh .pt i{font-style:normal;opacity:.6;font-size:.9rem}'
    + '#wh .gd{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}#wh .gd button{display:flex;align-items:center;gap:10px;background:#ffffff14;border:1px solid #ffffff22;border-radius:30px;padding:12px 14px;color:#fff;font:700 1.1rem Cairo,sans-serif}'
    + '#wh .gd em{font-style:normal;width:40px;height:40px;border-radius:50%;background:#ffffff20;display:grid;place-items:center}'
    + '#wd0{position:fixed;inset:0;z-index:8000;display:none}#wd0.on{display:block}#wd0 .sh{position:absolute;inset:0;background:#0009}'
    + '#wd0 .pn{position:absolute;top:0;bottom:0;right:0;width:82%;max-width:360px;background:#000;color:#fff;direction:rtl;padding:calc(30px + env(safe-area-inset-top,0px)) 24px 24px;overflow:auto;animation:wdin .22s ease-out}'
    + '@keyframes wdin{from{transform:translateX(40px);opacity:0}}#wd0 .lg{font:700 2.2rem Amiri,serif;margin-bottom:18px}#wd0 button.it{display:flex;align-items:center;gap:16px;width:100%;background:none;border:0;color:#fff;font:700 1.5rem Cairo,sans-serif;padding:13px 0;text-align:right}#wd0 hr{border:0;border-top:1px solid #ffffff30;margin:14px 0}';
  D.head.appendChild(s);
}
function openNav(v) { var b = $('nav button[data-v="' + v + '"]'); if (b) b.click(); }
function openPage(id) { try { window.__tl.openPage(id); } catch (e) { } }
function closeDrawer() { var d = $('#wd0'); if (d) d.classList.remove('on'); }
var ACT = {
  prayer: function () { openPage('salah'); }, counter: function () { openNav('free'); }, fav: function () { openPage('loved'); },
  qibla: function () { window.AZ_lazy('qibla.js', '__qb').then(function () { var b = $('#qb,[data-a=qibla]'); b && b.click(); }).catch(function () { openPage('qibla'); }); },
  mine: function () { openNav('adh'); }, mushaf: function () { openNav('q'); }, misc: function () { openPage('today'); }, all: function () { try { __tl.open(); } catch (e) { } },
  set: function () { try { window.openSet(); } catch (e) { } }, search: function () { var b = $('#sr,[data-a=search],#srB'); if (b) b.click(); else try { window.AZ_lazy('search.js', '__sr'); } catch (e) { } },
  dua: function () { try { window.AZ_lazy('needs.js', '__needs').then(function () { __needs.open(); }); } catch (e) { } },
  wadq: function () { window.__sk && __sk.wadq().catch(function () { __sk.open(); }); }, track: function () { openPage('tracker'); }, adh: function () { openNav('adh'); }
};
var MENU = [['prayer', '🕐', 'الصلاة'], ['counter', '#', 'العداد'], ['fav', '♥', 'المفضلة'], ['qibla', '➤', 'القبلة'], ['mine', '☆', 'أذكاري'], ['mushaf', '📖', 'المصحف'], ['misc', '🔀', 'المنوعة'], ['all', '▦', 'جميع الأقسام'], ['-'], ['set', '⚙', 'الإعدادات'], ['search', '🔍', 'بحث'], ['dua', '🔖', 'دعائي']];
function drawer() {
  var d = $('#wd0'); if (d) return d;
  d = D.createElement('div'); d.id = 'wd0';
  d.innerHTML = '<div class="sh" data-a="x"></div><div class="pn" role="dialog" aria-label="القائمة"><div class="lg">وِردي</div>' + MENU.map(function (m) { return m[0] === '-' ? '<hr>' : '<button class="it" data-m="' + m[0] + '"><span style="width:34px;text-align:center">' + m[1] + '</span>' + m[2] + '</button>'; }).join('') + '</div>';
  d.addEventListener('click', function (e) { var b = e.target.closest('[data-m],[data-a]'); if (!b) return; closeDrawer(); if (b.dataset.m && ACT[b.dataset.m]) setTimeout(safe(ACT[b.dataset.m]), 120); });
  D.body.appendChild(d); return d;
}
function render() {
  var h = $('#v-home'); if (!h) return; css(); D.documentElement.setAttribute('data-wh', '1');
  var w = $('#wh'); if (!w) { w = D.createElement('div'); w.id = 'wh'; h.insertBefore(w, h.firstChild); }
  var now = new Date(), T = times() || {}, H = hijri(now), sk = sky(now), np = nextPrayer(now), fb = forbidden(now), az = azkarNow(now), loc = null;
  try { loc = AZ.loc.get(); } catch (e) { }
  w.style.setProperty('--s1', sk[0]); w.style.setProperty('--s2', sk[1]);
  var city = (loc && (loc.name || loc.city || loc.n)) || 'مكة المكرمة';
  var ks = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  w.innerHTML = '<div class="bar"><div class="row"><button class="rb" data-a="set" aria-label="الإعدادات">⚙</button><button class="rb" data-a="search" aria-label="بحث">🔍</button></div><div class="lg">وِردي</div><button class="rb" data-a="menu" aria-label="القائمة">☰</button></div>'
    + '<div class="row"><div class="moon" aria-hidden="true"></div><div style="margin-inline-start:auto;text-align:right"><div class="day">' + DAYS[now.getDay()] + '</div><div class="city">' + city + '</div></div></div>'
    + '<div class="dts"><div><b>' + H.d + ' ' + H.m + '</b><small>' + H.y + '</small></div><div style="text-align:left"><b>' + now.getDate() + ' ' + MON[now.getMonth()] + '</b><small>' + now.getFullYear() + '</small></div></div>'
    + (np ? '<div class="cd"><i class="bd"></i><div class="x"><b>أذان ' + PN[np.k] + ' بعد ' + human(mins(np.at - now)) + '</b></div><span class="ti">' + t12(np.at) + '</span></div>' : '')
    + (fb ? '<button class="cd rd" data-a="x"><i class="bd"></i><div class="x"><b>أوقات النهي عن الصلاة</b><span>' + fb.a + ' ' + fb.b + '</span></div></button>' : '')
    + '<button class="cd" data-a="adh"><i class="bd" style="background:#e1c779"></i><div class="x"><b>' + az.t + ' · الآن</b><span>' + az.s + '</span></div><span style="font-size:1.8rem">' + az.ic + '</span></button>'
    + '<button class="cd" data-a="wadq"><i class="bd" style="background:#2f7470"></i><div class="x"><b>الودق</b><span>في كرب شديد أو ضيق؟ اضغط هنا</span></div><span style="font-size:1.8rem">🤍</span></button>'
    + '<div class="pg"><h3>مواقيت الصلاة</h3>' + ks.map(function (k) { return '<div class="pt' + (np && np.k === k ? ' on' : '') + '"><span>' + IC[k] + ' ' + PN[k] + '</span><b>' + t12(T[k]) + ' <small>' + ampm(T[k]) + '</small></b></div>'; }).join('') + '</div>'
    + '<div class="gd">' + [['prayer', '🕐', 'الصلاة'], ['qibla', '➤', 'القبلة'], ['counter', '#', 'العداد'], ['mushaf', '📖', 'المصحف'], ['fav', '♥', 'المفضلة'], ['track', '📊', 'المتابعة'], ['mine', '☆', 'أذكاري'], ['all', '▦', 'جميع الأقسام']].map(function (g) { return '<button data-a="' + g[0] + '"><em>' + g[1] + '</em>' + g[2] + '</button>'; }).join('') + '</div>';
}
function init() {
  safe(css)(); safe(render)(); safe(drawer)();
  /* تفويض النقر على مستوى المستند: يبقى شغّالًا حتى لو أُعيد رسم الرئيسية */
  D.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#wh [data-a]'); if (!b) return;
    var a = b.dataset.a; if (a === 'menu') { drawer().classList.add('on'); return; } if (a === 'x') return; var f = ACT[a]; if (f) safe(f)();
  });
  setInterval(safe(render), 30000);
  D.addEventListener('visibilitychange', function () { if (!D.hidden) safe(render)(); });
  var nav = $('nav'); if (nav) new MutationObserver(safe(function () { if (!$('#wh') && $('#v-home')) render(); })).observe($('#v-home'), { childList: true });
}
window.__whome = { render: render, ACT: ACT };
if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init); else init();
})();
