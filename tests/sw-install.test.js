const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const code=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
function boot(failUrl,optFail){
 const store=new Map(),log={deleted:[],puts:[]},H={};
 const cache=n=>({put:async(u,r)=>{log.puts.push(u);store.get(n).set(u,r)},add:async u=>{if(optFail)throw new Error('opt');store.get(n).set(u,1)}});
 const ctx=vm.createContext({self:{addEventListener:(t,f)=>{H[t]=f},skipWaiting(){},clients:{claim(){}}},caches:{open:async n=>{if(!store.has(n))store.set(n,new Map());return cache(n)},delete:async n=>{log.deleted.push(n);return store.delete(n)},keys:async()=>[...store.keys()],match:async()=>null},location:{origin:'http://x'},URL,Response:function(){},Request:function(u,o){this.url=u;this.o=o},fetch:async req=>{if(failUrl&&String(req.url).startsWith(failUrl))return{ok:false,status:404};return{ok:true,status:200,url:req.url,reload:req.o&&req.o.cache==='reload'}},setTimeout,Promise,Error});
 vm.runInContext(code,ctx);return{H,store,log};
}
test('install: نجاح كامل يكتب كل CORE ويجلبها بتجاوز كاش HTTP',async()=>{
 const{H,store,log}=boot();let p;H.install({waitUntil:x=>p=x});await p;
 const c=[...store.values()][0];assert.ok([...c.keys()].some(k=>/^data\.js\?v=/.test(k)));assert.ok(log.puts.length>=16)});
test('install: فشل ملف أساسي واحد ← يُرفض التثبيت ويُحذف الكاش الناقص ولا يُكتب شيء',async()=>{
 const{H,store,log}=boot('notify.js');let p;H.install({waitUntil:x=>p=x});await assert.rejects(p,/core:notify\.js/);
 assert.equal(log.puts.length,0);assert.equal(store.size,0);assert.equal(log.deleted.length,1)});
test('install: فشل ملف اختياري (أيقونة) لا يمنع التثبيت',async()=>{
 const{H}=boot(null,true);let p;H.install({waitUntil:x=>p=x});await p});
