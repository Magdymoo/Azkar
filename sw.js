/* أذكاري — Service Worker v1.7
   - يخزّن ملفات التطبيق للعمل بدون إنترنت
   - لا يمسّ كاش المصحف 'athkar-quran' (يديره التطبيق نفسه)
   - يدعم: رسالة 'skip' للتحديث، ورسالة {type:'delay'} لاختبار الإشعار بعد مهلة، وأحداث push وnotificationclick */
const VER = '1.7';
const CACHE = 'athkar-' + VER;
const QURAN = 'athkar-quran';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'icon-192.png', 'apple-touch-icon.png',
  'reassurance.js', 'sakina.js', 'sounds/tone1.mp3', 'sounds/tone2.mp3', 'sounds/tone3.mp3', 'sounds/tone4.mp3', 'sounds/tone5.mp3'
];

self.addEventListener('install', e => {
  // كل ملف على حدة: غياب ملف (مثل أيقونة) لا يُفشل التثبيت كله
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null)))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k !== QURAN).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // الواجهات الخارجية (المصحف، الطقس، الخطوط) يتولاها التطبيق
  if (url.pathname.includes('/videos/')) return;          // الفيديوهات: من الشبكة مباشرة (بدون كاش، تدعم Range)
  if (url.pathname.endsWith('/version.json')) return;     // دائماً من الشبكة لاكتشاف التحديثات
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (isPage) {                                           // الصفحة: الشبكة أولاً ثم الكاش
    e.respondWith(fetch(req).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)).catch(() => {}); }
      return r;
    }).catch(() => caches.match('index.html').then(r => r || caches.match('./'))));
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

// Web Push حقيقي (يتطلب خادماً، انظر CLOUDFLARE_GUIDE.md)
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
  const target = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow(target);
  }));
});
