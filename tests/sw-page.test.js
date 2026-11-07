const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const code=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
function boot({cached,netFail}){
 const H={},calls={fetch:0,put:0},CACHED={cached:1};
 const ctx=vm.createContext({self:{addEventListener:(t,f)=>{H[t]=f},skipWaiting(){},clients:{claim(){}}},
  caches:{open:async()=>({put:async()=>{calls.put++}}),match:async k=>(cached&&(k==='index.html'||k==='./'))?CACHED:null,keys:async()=>[],delete:async()=>true},
  location:{origin:'http://x'},URL,Response:{error:()=>({err:1})},Request:function(u){this.url=u},
  fetch:async()=>{calls.fetch++;if(netFail)throw new Error('offline');return{ok:true,net:1}},setTimeout,Promise,Error});
 vm.runInContext(code,ctx);return{H,calls,CACHED};
}
async function nav(H,url){let p;H.fetch({request:{method:'GET',url,mode:'navigate'},respondWith:x=>p=x,waitUntil(){}});return p}
test('page: يُخدم من الكاش فورًا بلا أي طلب شبكة ولا كتابة في الكاش (لا خلط إصدارات)',async()=>{
 const{H,calls,CACHED}=boot({cached:true});const r=await nav(H,'http://x/Azkar/');
 assert.strictEqual(r,CACHED);assert.equal(calls.fetch,0);assert.equal(calls.put,0)});
test('page: لا كاش بعد (أول زيارة) ← الشبكة',async()=>{
 const{H,calls}=boot({cached:false});const r=await nav(H,'http://x/Azkar/');assert.ok(r.net);assert.equal(calls.fetch,1)});
test('page: لا كاش ولا شبكة ← Response.error بدل استثناء',async()=>{
 const{H}=boot({cached:false,netFail:true});const r=await nav(H,'http://x/Azkar/');assert.ok(r.err)});
