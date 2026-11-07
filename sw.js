/* أذكاري — Service Worker v2.0.0-rc.14
   - يخزّن الأساسي فقط للعمل بدون إنترنت، والباقي بعد الإقلاع (warm)
   - لا يمسّ كاش المصحف 'athkar-quran' (يديره التطبيق نفسه)
   - يدعم: رسالة 'skip' للتحديث، ورسالة {type:'delay'} لاختبار الإشعار بعد مهلة، وأحداث push وnotificationclick */
const VER = '2.0.0-rc.14';
const CACHE = 'athkar-' + VER;
const QURAN = 'athkar-quran';
const VCACHE = 'athkar-videos'; // managed by the app (sakina.js); never deleted on update
const Q = '?v=' + VER;   // نفس اللاحقة في index.html (AZ.asset) — يضبطها tools/bump-version.js ويفحصها tools/check-version.js
const CORE = [   // الأساسي: تثبيت ذرّي (إن فشل ملف واحد يفشل التثبيت كله فيبقى الإصدار القديم شغّالًا كاملًا بدل خليط نسخ)
  './', 'index.html',
  'data.js' + Q, 'day.js' + Q, 'loc.js' + Q, 'home.js' + Q, 'times.js' + Q, 'diag.js' + Q,
  'reassurance.js' + Q, 'sakina.js' + Q, 'prayer.js' + Q, 'qada.js' + Q, 'tools.js' + Q, 'polish.js' + Q, 'umrah.js' + Q, 'readiness.js' + Q, 'notify.js' + Q
];
const OPTIONAL = [   // غيابها لا يمنع التثبيت (أيقونات/شاشة بدء/manifest)
  'manifest.webmanifest', 'icon-192.png', 'apple-touch-icon.png', 'splash.webp'
];
// الباقي (القبلة/البحث/الأسماء/المصحف، مكتبة الأدعية، النغمة المختارة) يُخزَّن بعد الإقلاع (رسالة warm)

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    try {
      // نجلب الكل من الشبكة مباشرة (تجاوز كاش HTTP) ولا نكتب شيئًا قبل التأكد أن كل الأساسي نجح
      const rs = await Promise.all(CORE.map(async u => {
        const r = await fetch(new Request(u, { cache: 'reload' }));
        if (!r || !r.ok) throw new Error('core:' + u + ':' + (r && r.status));
        return r;
      }));
      await Promise.all(CORE.map((u, i) => c.put(u, rs[i])));
    } catch (err) {
      await caches.delete(CACHE);   // لا نترك كاشًا ناقصًا
      throw err;                    // التثبيت يفشل ← يبقى العامل القديم، ويُعاد المحاولة لاحقًا
    }
    await Promise.all(OPTIONAL.map(u => c.add(u).catch(() => null)));
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k !== QURAN && k !== VCACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // الواجهات الخارجية (المصحف، الطقس، الخطوط) يتولاها التطبيق
  if (url.pathname.endsWith('/recover.html')) return;    // صفحة الإنقاذ: دائمًا من الشبكة، لا تُستبدل بصفحة التطبيق
  if (url.pathname.includes('/videos/')) { e.respondWith(videoResp(req, VCACHE)); return; }
  if (url.pathname.includes('/sounds/')) { e.respondWith(videoResp(req, CACHE)); return; } // صوت: دعم Range من الكاش (iOS) // من كاش الفيديو إن وُجد (مع Range) وإلا الشبكة
  if (url.pathname.includes('/quran/') || url.pathname.includes('/fonts/')) { e.respondWith(caches.match(req).then(hit => hit || fetch(req))); return; }  // بيانات المصحف والخط: كاش أولًا بلا إعادة تحميل في الخلفية (يحفظها التطبيق في athkar-quran)
  if (url.pathname.endsWith('/version.json')) return;     // دائماً من الشبكة لاكتشاف التحديثات
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (isPage) {                                           // الصفحة: من الكاش فورًا (بلا انتظار للشبكة). التحديث يصل عبر تحديث الـSW نفسه (تثبيت ذرّي)، فلا نكتب index.html جديدًا في كاش قديم (كان يخلط الإصدارات)
    e.respondWith((async () => {
      const cached = await caches.match('index.html');
      if (cached) return cached;
      try { return await fetch(req); }                    // لا كاش بعد (أول زيارة): الشبكة
      catch (_) { return (await caches.match('./')) || Response.error(); }
    })());
    return;
  }
  e.respondWith(caches.match(req).then(hit => {            // الباقي: الكاش أولاً مع تحديث في الخلفية
    const net = fetch(req).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {}); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});

self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'skip' || (d && d.type === 'skip')) { self.skipWaiting(); return; }
  if (d && d.type === 'warm' && Array.isArray(d.urls)) {
    // تخزين مسبق هادئ لملفات ثانوية (مسارات نسبية فقط، ولا يُعاد جلب ما هو مخزَّن)
    const urls = d.urls.filter(u => typeof u === 'string' && !/^[a-z]+:|^\/\/|\.\./i.test(u)).slice(0, 12);
    e.waitUntil(caches.open(CACHE).then(c => Promise.all(urls.map(u => c.match(u).then(h => h || c.add(u)).catch(() => null)))));
    return;
  }
  if (d && d.type === 'delay') {
    // اختبار الإشعار بعد مهلة: نُبقي العامل حياً بـ waitUntil. المتصفح قد يقطع المهلة الطويلة (لذلك الاختبار ١٠ ثوانٍ فقط)
    const ms = Math.min(Math.max(+d.ms || 0, 0), 30000);
    const say = m => self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(l => l.forEach(c => c.postMessage(m))).catch(() => {});
    say({ type: 'azkar-ack', stage: 'scheduled', ms });                       // وصلت الجدولة إلى العامل
    e.waitUntil(new Promise(r => setTimeout(r, ms))
      .then(() => self.registration.showNotification(d.title || 'أذكاري', {
        body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png',
        tag: d.tag || 'test', lang: d.lang || 'ar', dir: d.dir || 'rtl', data: { url: './' }
      }))
      .then(() => say({ type: 'azkar-ack', stage: 'shown' }))
      .catch(err => say({ type: 'azkar-ack', stage: 'failed', error: String((err && err.message) || err) })));
  }
});

// Web Push حقيقي (يتطلب خادماً، خادم Push اختياري)
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'أذكاري', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'push',
    lang: d.lang || 'ar', dir: d.dir || 'rtl', data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const go = (e.notification.data && e.notification.data.go) || '';
  e.waitUntil((async () => {
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = list.find(c => c.url.startsWith(self.registration.scope));
    if (open) { try { await open.focus(); } catch (x) {} if (go) open.postMessage({ type: 'notif', go }); return; }   // مفتوح: رسالة ثم focus
    return clients.openWindow('./' + (go ? '?n=' + encodeURIComponent(go) : ''));                                     // مغلق: افتح الشاشة المطلوبة
  })());
});

// Serve cached videos with Range support (required by iOS Safari); fall back to network
async function videoResp(req, name) {
  const c = await caches.open(name), hit = await c.match(req.url), rng = req.headers.get('range');
  if (!hit) return fetch(req).catch(() => new Response('', { status: 504 }));
  if (!rng) return hit;
  const buf = await hit.arrayBuffer(), len = buf.byteLength, m = /bytes=(\d*)-(\d*)/.exec(rng);
  if (!m) return hit;
  let s, en;
  if (m[1] === '') { s = Math.max(0, len - (+m[2] || 0)); en = len - 1; } else { s = +m[1]; en = m[2] ? Math.min(+m[2], len - 1) : len - 1; }
  if (s >= len || s > en) return new Response('', { status: 416, headers: { 'Content-Range': 'bytes */' + len } });
  return new Response(buf.slice(s, en + 1), { status: 206, headers: { 'Content-Type': hit.headers.get('Content-Type') || (name === VCACHE ? 'video/mp4' : 'audio/wav'), 'Content-Range': 'bytes ' + s + '-' + en + '/' + len, 'Content-Length': String(en - s + 1), 'Accept-Ranges': 'bytes' } });
}
