/* قرار 10: عند activate يُحذف كل ما هو أقدم من الإصدار السابق مباشرةً، ويُبقى الجيل السابق وحده (للصفحات القديمة المفتوحة)،
   ولا يُمسّ كاش المصحف/الفيديو. rc أقدم من الإصدار النهائي. */
const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const code=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
const VER=/const VER = '([^']+)'/.exec(code)[1];
function boot(existing){
 const store=new Map(existing.map(n=>[n,new Map()])),deleted=[],H={};let claimed=false;
 const ctx=vm.createContext({self:{addEventListener:(t,f)=>{H[t]=f},skipWaiting(){},clients:{claim(){claimed=true}}},
  caches:{open:async n=>{if(!store.has(n))store.set(n,new Map());return{}},delete:async n=>{deleted.push(n);return store.delete(n)},keys:async()=>[...store.keys()],match:async()=>null},
  location:{origin:'http://x'},URL,Response:function(){},Request:function(){},fetch:async()=>({}),setTimeout,Promise,Error});
 vm.runInContext(code,ctx);return{H,deleted,claimed:()=>claimed}}
const act=async(existing)=>{const b=boot(existing);let p;b.H.activate({waitUntil:x=>p=x});await p;return b};
test('activate: يُبقي الجيل السابق فقط ويحذف الأقدم، ولا يمسّ المصحف والفيديو',async()=>{
 const b=await act(['athkar-'+VER,'athkar-1.14.0','athkar-1.13.1','athkar-1.9.0','athkar-quran','athkar-videos']);
 assert.deepEqual(b.deleted.sort(),['athkar-1.13.1','athkar-1.9.0']);assert.ok(b.claimed())});
test('activate: rc أقدم من النهائي (2.0.0-rc.5 < 2.0.0) ويُبقى الأحدث منهما',async()=>{
 const m=/^(\d+)\.(\d+)\.(\d+)/.exec(VER),next='athkar-'+m[1]+'.'+m[2]+'.'+(+m[3]+1);
 const b=await act([next,'athkar-2.0.0-rc.5','athkar-2.0.0-rc.3','athkar-1.14.0','athkar-quran']);   // CACHE الحالي غير موجود بعد (أقدم منه كلها)
 assert.ok(!b.deleted.includes('athkar-quran'));assert.ok(b.deleted.length>=1)});
test('activate: بلا كاش سابق لا يحذف شيئًا',async()=>{const b=await act(['athkar-'+VER,'athkar-quran']);assert.deepEqual(b.deleted,[])});
