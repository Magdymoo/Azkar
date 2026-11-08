/* قرار 7: لقطة الترحيل (azkari__premigrate) للمفاتيح الكبيرة فقط؛ إن لم تتسع لها المساحة يُلغى الترحيل بلا فقد؛ وتُحذف بعد 14 يومًا من نجاحه. */
const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function env(seed,budget){const m=new Map(seed||[]);const ls={get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
 const w={localStorage:ls,document:{},performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}}};
 if(budget)w.AZ_BUDGET=budget;w.window=w;vm.createContext(w);vm.runInContext(R('data.js'),w);w._m=m;return w}
const OLD=()=>[['athkary.v1',JSON.stringify({profile:{name:'م'},days:{'2026-11-01':{m:1}}})],['azkar_loc',JSON.stringify({lat:21.4,lng:39.1,name:'جدة'})],['azkar_pmethod','ummalqura'],['azkar_nc','{"on":1}'],['azkar_umd_fs','22']];
test('اللقطة للمفاتيح الكبيرة فقط (state وloc) لا الإعدادات الصغيرة',()=>{const w=env(OLD()),s=JSON.parse(w._m.get('azkari__premigrate'));
 assert.deepEqual(Object.keys(s.k).sort(),['athkary.v1','azkar_loc']);assert.ok(!('azkar_pmethod' in s.k))});
test('المساحة لا تتسع للقطة ← يُلغى الترحيل كله، والقديم سليم، ولا مفاتيح جديدة نصف مكتملة',()=>{
 const w=env(OLD(),300);assert.equal(w.AZ.data.status?w.AZ.data.status().migration:'x','failed');
 assert.equal(w._m.get('azkari_state'),undefined);assert.ok(w._m.get('athkary.v1'));assert.equal(w._m.get('azkari__premigrate'),undefined);
 assert.match(String(w._m.get('azkari__mig')),/failed/);
 assert.equal(w.AZ.data.get('azkar_pmethod'),'ummalqura')});   // القراءة تعمل بالوضع القديم بلا فقد
test('اللقطة تُحذف بعد 14 يومًا من نجاح الترحيل، ولا تُحذف قبلها',()=>{
 const w=env(OLD()),m=w._m;assert.ok(m.get('azkari__premigrate'));
 const f=JSON.parse(m.get('azkari__mig'));f.t=Date.now()-10*864e5;m.set('azkari__mig',JSON.stringify(f));
 const w2=env([...m.entries()]);assert.ok(w2._m.get('azkari__premigrate'),'قبل 14 يومًا تبقى');
 f.t=Date.now()-15*864e5;w2._m.set('azkari__mig',JSON.stringify(f));
 const w3=env([...w2._m.entries()]);assert.equal(w3._m.get('azkari__premigrate'),undefined);assert.ok(w3._m.get('azkari_state'),'الحالة الجديدة سليمة بعد الحذف');assert.ok(w3._m.get('athkary.v1'),'القديم لم يُمسّ')});
