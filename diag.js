/* أذكاري — diag.js (v2.0): لوحة التشخيص. تُحمَّل كسولًا من الإعدادات ← البيانات ← التشخيص.
   تعرض JSON خامًا قابلًا للنسخ، ولا ترسل أي شيء خارج الجهاز. */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  function tryv(f, d) { try { var v = f(); return v === undefined ? d : v; } catch (e) { return d === undefined ? { error: String(e && e.message || e) } : d; } }
  function jp(k) { return tryv(function () { var v = AZ.data.get(k); return v == null ? null : JSON.parse(v); }, { parseError: true, raw: tryv(function () { return String(AZ.data.get(k)).slice(0, 200); }, '') }); }
  function raw(k, n) { return tryv(function () { var v = AZ.data.get(k); return v == null ? null : String(v).slice(0, n || 400); }, null); }

  async function collect() {
    var o = { generatedAt: new Date().toISOString() };
    o.version = { app: w.AZ_V || null, note: 'rc builds تظهر هنا فقط' };
    o.env = { ua: navigator.userAgent, standalone: tryv(function () { return matchMedia('(display-mode: standalone)').matches || !!navigator.standalone; }, null),
      lang: document.documentElement.lang, online: navigator.onLine,
      api: { Notification: 'Notification' in w ? Notification.permission : 'absent', serviceWorker: 'serviceWorker' in navigator, caches: !!w.caches, indexedDB: !!w.indexedDB, wakeLock: !!navigator.wakeLock, PushManager: 'PushManager' in w } };
    var tz = tryv(function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; }, null), now = new Date();
    o.time = { deviceTz: tz, offsetMin: -now.getTimezoneOffset(), nowISO: now.toISOString(),
      calendarKey: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0'),
      azkariDayKey: (AZ.day && AZ.day.key) ? tryv(function () { return AZ.day.key(); }, null) : 'pending (A2)', dayKeyMethod: (AZ.day && AZ.day.info) ? tryv(function () { return AZ.day.info(); }, null) : 'pending (A2)' };
    var loc = jp('azkar_loc'), S = tryv(function () { return AZ.state(); }, null);
    o.location = { azkar_loc: loc, stateLoc: S ? S.loc || null : null, storedTz: loc && loc.tz || null, tzMatchesDevice: loc && loc.tz ? loc.tz === tz : null,
      mismatch: (loc && S && S.loc) ? { latDiff: +(loc.lat - S.loc.lat).toFixed(5), lonDiff: +(loc.lng - S.loc.lon).toFixed(5) } : null };
    var pt = w.__pt || {};
    o.prayer = { methodStored: raw('azkar_pmethod'), methodsAvailable: tryv(function () { return Object.keys(pt.METHODS || {}); }, []), fajrStored: raw('azkar_fajr'), ishaStored: raw('azkar_isha'),
      effectiveMethod: 'pending (A5: source user/default/fallback)', today: tryv(function () { var r = pt.compute && pt.compute(); return r ? JSON.parse(JSON.stringify(r)) : null; }, null) };
    o.data = tryv(function () { return AZ.data.status(); });
    o.keys = tryv(function () { return AZ.data.inventory(); });
    o.storage = await tryv(function () { return navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : null; }, null);
    o.notifications = { nc: raw('azkar_nc', 600), nlog: raw('azkar_nlog', 3000), wx: raw('azkar_wx', 300) };
    o.serviceWorker = { controller: !!(navigator.serviceWorker && navigator.serviceWorker.controller), registrations: null, caches: null };
    try {
      var regs = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
      o.serviceWorker.registrations = regs.map(function (r) { return { scope: r.scope, active: r.active && r.active.state, waiting: !!r.waiting, installing: !!r.installing, script: r.active && r.active.scriptURL }; });
    } catch (e) { o.serviceWorker.registrations = String(e); }
    try {
      var names = w.caches ? await caches.keys() : [], out = [];
      for (var i = 0; i < names.length; i++) { var c = await caches.open(names[i]); out.push({ name: names[i], items: (await c.keys()).length }); }
      o.serviceWorker.caches = out;
    } catch (e) { o.serviceWorker.caches = String(e); }
    o.boot = { trace: AZ._tr || [], navigation: tryv(function () { var n = performance.getEntriesByType('navigation')[0]; return n ? { type: n.type, domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), responseEnd: Math.round(n.responseEnd), transferSize: n.transferSize } : null; }, null),
      paint: tryv(function () { return performance.getEntriesByType('paint').map(function (p) { return { name: p.name, t: Math.round(p.startTime) }; }); }, []) };
    o.requests = { external: tryv(function () { return performance.getEntriesByType('resource').filter(function (r) { try { return new URL(r.name).origin !== location.origin; } catch (e) { return false; } }).map(function (r) { return { url: r.name.slice(0, 120), type: r.initiatorType }; }); }, []) };
    o.errors = tryv(function () { return (AZ.errs || []).slice(-10).map(function (e) { return String(e).slice(0, 300); }); }, []);
    o.qa = { silentScriptErrors: AZ.silentErrs || 0, lastAction: AZ.lastAction || null };
    return o;
  }

  function open() {
    var el = document.getElementById('azdiag'); if (el) el.remove();
    el = document.createElement('div'); el.id = 'azdiag'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'التشخيص');
    el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:var(--bg,#fff);color:var(--tx,#111);display:flex;flex-direction:column;font-family:system-ui,sans-serif';
    el.innerHTML = '<div style="display:flex;gap:8px;align-items:center;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;border-bottom:1px solid rgba(128,128,128,.35)">' +
      '<b style="flex:1">التشخيص</b><button class="btn" data-d="cp" style="min-height:44px">نسخ كل البيانات</button><button class="btn" data-d="rf" style="min-height:44px">تحديث</button><button class="btn" data-d="x" style="min-height:44px">إغلاق</button></div>' +
      '<pre id="azdiagP" dir="ltr" style="flex:1;margin:0;padding:10px;overflow:auto;font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;user-select:text;-webkit-user-select:text">…</pre>';
    document.body.appendChild(el);
    var pre = el.querySelector('#azdiagP'), last = '';
    function run() { pre.textContent = '…'; collect().then(function (o) { last = JSON.stringify(o, null, 2); pre.textContent = last; }).catch(function (e) { pre.textContent = String(e); }); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-d]'); if (!b) return; var a = b.dataset.d;
      if (a === 'x') el.remove(); else if (a === 'rf') run();
      else if (a === 'cp') { var done = function () { b.textContent = 'تم النسخ'; setTimeout(function () { b.textContent = 'نسخ كل البيانات'; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(last).then(done, function () { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); });
        else { var r2 = document.createRange(); r2.selectNodeContents(pre); var s2 = getSelection(); s2.removeAllRanges(); s2.addRange(r2); } }
    });
    run();
  }
  AZ.diag = { open: open, collect: collect };
})(window);
