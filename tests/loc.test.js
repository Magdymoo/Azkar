const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function env(store){const m=new Map(Object.entries(store||{}));const ls={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size}};
 const ev=[];const w={localStorage:ls,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(e){ev.push(e.type)},Event:class{constructor(t){this.type=t}},navigator:{}};w.window=w;w.__ev=ev;vm.createContext(w);
 for(const f of['data.js','day.js','loc.js'])vm.runInContext(R(f),w);return w}
test('loc: set/get، lng فقط، tz تلقائي، حدث azkar:times',()=>{const w=env();assert.equal(w.AZ.loc.get(),null);const o=w.AZ.loc.set({lat:21.4,lng:39.8,src:'gps'});assert.equal(o.lng,39.8);assert.ok(o.tz);assert.ok(!('lon' in o));assert.ok(w.__ev.includes('azkar:times'));assert.equal(w.AZ.loc.has(),true)});
test('loc: الاسم/الدولة يبقيان لنفس المكان ويُمسحان عند الانتقال الفعلي',()=>{const w=env({azkar_loc:JSON.stringify({lat:30.04,lng:31.23,name:'القاهرة',tz:'Africa/Cairo',cc:'EG'})});
 let o=w.AZ.loc.set({lat:30.05,lng:31.24,src:'gps'});assert.equal(o.name,'القاهرة');assert.equal(o.cc,'EG');
 o=w.AZ.loc.set({lat:21.48,lng:39.19,src:'gps'});assert.equal(o.cc,undefined);assert.notEqual(o.name,'القاهرة')});
test('loc: قيم غير صالحة تُرفض',()=>{const w=env();assert.equal(w.AZ.loc.set({lat:NaN,lng:1}),null);assert.equal(w.AZ.loc.set(null),null);w.AZ.data.set('azkar_loc',JSON.stringify({lat:99,lng:0}));assert.equal(w.AZ.loc.get(),null)});
test('migrate: S.loc القديم ← azkar_loc ثم يُحذف؛ لا يكتب فوق موقع موجود؛ idempotent',()=>{
 let w=env();let S={loc:{lat:24.7,lon:46.67},days:{}};assert.equal(w.AZ.loc.migrate(S),true);assert.ok(!('loc' in S));const g=w.AZ.loc.get();assert.equal(g.lat,24.7);assert.equal(g.lng,46.67);assert.equal(w.AZ.loc.migrate(S),false);
 w=env({azkar_loc:JSON.stringify({lat:1,lng:2,tz:'UTC'})});S={loc:{lat:24.7,lon:46.67}};w.AZ.loc.migrate(S);assert.equal(w.AZ.loc.get().lat,1);
 w=env();S={loc:null};assert.equal(w.AZ.loc.migrate(S),true);assert.equal(w.AZ.loc.get(),null)});
test('لا بقايا S.loc/.lon في الكود (باستثناء الترحيل)',()=>{for(const f of['index.html','notify.js','readiness.js','qada.js','tools.js','prayer.js','qibla.js']){const t=R(f);assert.ok(!/\bS\.loc\b/.test(t),f+' S.loc');assert.ok(!/\bloc\.lon\b|S\.loc\.lon/.test(t.replace(/s\.loc\.lon/g,'')),f+' .lon')}});
const mkL=(tz,dev)=>{const w=env({azkar_loc:JSON.stringify({lat:30.04,lng:31.23,name:'القاهرة',tz,cc:'EG'})});return w};
test('travel: نفس المنطقة أو اسم مستعار بنفس الإزاحة ← لا سفر',()=>{const w=mkL('Africa/Cairo');assert.equal(w.AZ.loc.travel('Africa/Cairo'),null);const w2=env({azkar_loc:JSON.stringify({lat:22.5,lng:88.3,name:'كلكتا',tz:'Asia/Calcutta'})});assert.equal(w2.AZ.loc.travel('Asia/Kolkata'),null)});
test('travel: منطقة مختلفة الإزاحة ← سفر، والرفض يُحفظ لنفس الزوج فقط',()=>{const w=mkL('Africa/Cairo');let t=w.AZ.loc.travel('Asia/Riyadh');assert.ok(t);assert.equal(t.from,'Africa/Cairo');assert.equal(t.to,'Asia/Riyadh');assert.equal(t.name,'القاهرة');
 w.AZ.loc.dismissTravel('Asia/Riyadh');assert.equal(w.AZ.loc.travel('Asia/Riyadh'),null);assert.ok(w.AZ.loc.travel('Asia/Tokyo'))});
test('travel: بلا موقع أو بلا tz ← null؛ وبعد تحديث الموقع (tz = الجهاز) لا يتكرر',()=>{assert.equal(env().AZ.loc.travel('Asia/Riyadh'),null);const w=mkL('Africa/Cairo');w.AZ.loc.set({lat:21.48,lng:39.19,tz:'Asia/Riyadh',cc:'SA',name:'جدة'});assert.equal(w.AZ.loc.travel('Asia/Riyadh'),null)});
test('بطاقة السفر: كل نصوصها لها ترجمات I18N (4 لغات)',()=>{const h=R('index.html');for(const k of['يبدو أنك سافرت','المنطقة الزمنية لجهازك تختلف عن موقع المواقيت المحفوظ. هل تريد تحديث موقعك لتصحيح المواقيت؟','حدّد موقعي الآن','أبقِ الموقع الحالي']){const i=h.indexOf('"'+k+'":[');assert.ok(i>0,k);const seg=h.slice(i,h.indexOf(']',i));assert.equal((seg.match(/","|",/g)||[]).length>=0,true);assert.equal(seg.split('","').length,3,k)}});
