/* يستبدل sw.js القديم: يمسح كل الكاش القديم ويلغي نفسه، فيشوف كل المستخدمين صفحة التنويه */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())await caches.delete(k);
  await self.registration.unregister();
  const cs=await self.clients.matchAll({type:'window'});
  cs.forEach(c=>{try{c.navigate(c.url)}catch(x){}});
})()));
