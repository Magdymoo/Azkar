const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function env(){const m=new Map();const ls={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size}};
 const w={localStorage:ls,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}},navigator:{}};w.window=w;vm.createContext(w);for(const f of['data.js','prayer.js'])vm.runInContext(R(f),w);return w}
const w=env(),P=w.__pt,UQ=P.METHODS.ummalqura;
const mins=(a,b)=>Math.round((b-a)/6e4);
test('isRamadan: حدود رمضان 1448 (≈ 18 فبراير – 19 مارس 2026 / 1447 = فبراير–مارس 2026)',()=>{
 assert.equal(P.isRamadan(2026,2,1),true);   // 1 مارس 2026 داخل رمضان 1447
 assert.equal(P.isRamadan(2026,10,7),false);
 assert.equal(P.isRamadan(2026,1,10),false)});
test('أم القرى: العشاء = المغرب + 120د في رمضان و90د خارجه',()=>{
 const r=P.times(2026,2,1,21.4225,39.8262,UQ),n=P.times(2026,10,7,21.4225,39.8262,UQ);
 assert.equal(mins(r.maghrib,r.isha),120);assert.equal(mins(n.maghrib,n.isha),90)});
test('طرق أخرى لا تتأثر برمضان (مصرية)',()=>{const a=P.times(2026,2,1,30.04,31.24,P.METHODS.egyptian),b=P.times(2026,10,7,30.04,31.24,P.METHODS.egyptian);assert.ok(mins(a.maghrib,a.isha)>60&&mins(a.maghrib,a.isha)<120&&mins(b.maghrib,b.isha)>60)});
test('لندن صيفًا: الفجر/العشاء بقاعدة سُبع الليل بدل null، ومرتّبة منطقيًا',()=>{
 const t=P.times(2026,5,21,51.5074,-0.1278,P.METHODS.mwl);
 for(const k of['fajr','sunrise','dhuhr','asr','maghrib','isha'])assert.ok(t[k] instanceof Date&&!isNaN(t[k]),k);
 const night=(t.sunrise.getTime()+864e5-t.maghrib.getTime());
 assert.ok(t.fajr<t.sunrise&&t.isha>t.maghrib);
 assert.ok(Math.abs((t.sunrise-t.fajr)-night/7)<6e4*2,'fajr = sunrise - night/7');assert.ok(Math.abs((t.isha-t.maghrib)-night/7)<6e4*2)});
test('لندن شتاءً: الحساب بالزاوية كما هو (لا قاعدة السُبع)',()=>{const t=P.times(2026,11,21,51.5074,-0.1278,P.METHODS.mwl);assert.ok(mins(t.fajr,t.sunrise)>80)});
test('القطب (شمس منتصف الليل): لا انهيار، تبقى null للمرتبط بالشروق',()=>{const t=P.times(2026,5,21,69.65,18.96,P.METHODS.mwl);assert.ok(t.dhuhr instanceof Date);assert.equal(t.sunrise,null)});
test('مرجع: مكة 7 نوفمبر (الظهر ≈ 12:04، المغرب ≈ 17:41) ضمن المعقول (الظهر والمغرب)',()=>{
 const m=P.times(2026,10,7,21.4225,39.8262,UQ),h=x=>+new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Riyadh'}).format(x).replace(':','');
 assert.ok(h(m.dhuhr)>=1155&&h(m.dhuhr)<=1215,'dhuhr Mecca '+h(m.dhuhr));assert.ok(h(m.maghrib)>=1730&&h(m.maghrib)<=1750,'maghrib '+h(m.maghrib))});
