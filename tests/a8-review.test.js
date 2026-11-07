const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function env(store,files){const m=new Map(Object.entries(store||{}));const ls={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size}};
 const w={localStorage:ls,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>0,clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}},navigator:{}};w.window=w;w.__m=m;vm.createContext(w);for(const f of files||['data.js','prayer.js','day.js'])vm.runInContext(R(f),w);return w}
/* حذف كل البيانات */
test('wipeAll يحذف كل مفاتيح التطبيق (الحالية والقديمة athkary.* والداخلية) ولا يمسّ مفاتيح غيره',()=>{
 const src=['index.html',...fs.readdirSync(path.join(__dirname,'..')).filter(f=>/\.js$/.test(f))].map(R).join('\n');
 const keys=[...new Set([...src.matchAll(/['"](azkar_[A-Za-z0-9_]+)['"]/g)].map(x=>x[1]))];assert.ok(keys.length>=20);
 const w=env();keys.forEach(k=>w.AZ.data.set(k,'1'));w.AZ.data.set('azkari_state','{}');['athkary.v1','athkary.bak','azkari__sync','azkari__premigrate'].forEach(k=>w.__m.set(k,'1'));w.__m.set('other_app_key','keep');
 w.AZ.data.wipeAll();assert.deepEqual([...w.__m.keys()],['other_app_key'])});
/* فهرس البحث: مرة واحدة، والمخصص حيّ */
test('search: المخصص لا يدخل الفهرس المبني (يُقرأ حيًّا عند كل بحث)',()=>{const t=R('search.js');
 const b=t.slice(t.indexOf('async function build'),t.indexOf('function customItems'));assert.ok(!/S\.custom/.test(b),'build لا يفهرس المخصص');assert.ok(/IDX=null/.test(t)&&/if\(IDX\)return IDX;if\(P\)return P/.test(t),'يُبنى مرة واحدة');
 assert.ok(/base\.concat\(customItems\(\)\)/.test(t))});
test('search.customItems: حذف/إضافة مخصص ينعكس فورًا',()=>{const w=env(null,['data.js']);const stub=()=>{const f=function(){return p};const p=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='then'?undefined:p,apply:()=>p,construct:()=>p,set:()=>true});return p};
 w.document=stub();w.S={custom:[{t:'سبحان الله وبحمده',f:'x'}]};vm.runInContext(R('search.js'),w);
 assert.equal(w.__sr.customItems().length,1);w.S.custom=[];assert.equal(w.__sr.customItems().length,0)});
/* تحميل الوحدات الكسول */
test('AZ_lazy: فشل تنفيذ السكربت (onload بلا الكائن المتوقع) يُعدّ فشلًا',()=>{const h=R('index.html');assert.ok(/AZ_lazy=function\(src,probe\)/.test(h)&&/probe&&!window\[probe\]/.test(h));assert.ok(!/AZ_lazy\('mushaf\.js'\)/.test(h))});
/* حد اليوم الأذكاري */
const JED={lat:21.4858,lng:39.1925,name:'جدة',tz:'Asia/Riyadh',cc:'SA'};
const at=(w,y,m,d,hh,mm,off)=>Date.UTC(y,m,d,hh,mm)-(off||0)*36e5;
test('AZ.day.key: قبل الفجر ← اليوم السابق، وبعده ← اليوم، وبعد منتصف الليل قبل الفجر ← السابق',()=>{
 const w=env({azkar_loc:JSON.stringify(JED)}),T=w.__pt.times(2026,10,7,JED.lat,JED.lng,w.__pt.method()),f=+T.fajr;
 assert.equal(w.AZ.day.key(f-6e4),'2026-11-06');assert.equal(w.AZ.day.key(f+6e4),'2026-11-07');
 assert.equal(w.AZ.day.key(at(w,2026,10,7,0,30,3)),'2026-11-06');assert.equal(w.AZ.day.key(at(w,2026,10,7,23,59,3)),'2026-11-07')});
test('AZ.day.key: وضع منتصف الليل يغيّر اليوم عند 00:00',()=>{const w=env({azkar_loc:JSON.stringify(JED),azkar_daystart:'midnight'});assert.equal(w.AZ.day.key(at(w,2026,10,7,0,30,3)),'2026-11-07')});
test('AZ.day.key: لندن عند نهاية التوقيت الصيفي (25 أكتوبر 2026) متّسق قبل الفجر وبعده',()=>{
 const L={lat:51.5074,lng:-0.1278,tz:'Europe/London',cc:'GB',name:'لندن'},w=env({azkar_loc:JSON.stringify(L)}),T=w.__pt.times(2026,9,25,L.lat,L.lng,w.__pt.method()),f=+T.fajr;
 assert.equal(w.AZ.day.key(f-6e4),'2026-10-24');assert.equal(w.AZ.day.key(f+6e4),'2026-10-25')});
test('AZ.day.key: بلا موقع يرجع لحدّ 04:00 بلا استثناء',()=>{const w=env();assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(w.AZ.day.key(Date.UTC(2026,10,7,1,0))))});
