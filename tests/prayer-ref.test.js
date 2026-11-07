const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function env(loc){const m=new Map();if(loc)m.set('azkar_loc',JSON.stringify(loc));const ls={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size}};
 const w={localStorage:ls,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}},navigator:{}};w.window=w;vm.createContext(w);for(const f of['data.js','prayer.js'])vm.runInContext(R(f),w);return w}
const P=env().__pt;
/* مرجع مستقل: معادلات NOAA للزوال والشروق والغروب (-0.833°). ليس جدولًا رسميًا؛ يكشف أخطاء الحساب والتوقيت الصيفي والمنطقة الزمنية. */
// NOAA
function noaa(y,mo,d,lat,lng){const jd=Date.UTC(y,mo,d,12)/864e5+2440587.5,T=(jd-2451545)/36525;const L0=(280.46646+T*(36000.76983+T*3.032e-4))%360,M=357.52911+T*(35999.05029-1.537e-4*T),e=0.016708634-T*(4.2037e-5+1.267e-7*T);const rad=Math.PI/180;const C=Math.sin(M*rad)*(1.914602-T*(4.817e-3+1.4e-5*T))+Math.sin(2*M*rad)*(0.019993-1.01e-4*T)+Math.sin(3*M*rad)*2.89e-4;const tl=L0+C,om=125.04-1934.136*T,al=tl-0.00569-0.00478*Math.sin(om*rad);const eps=23+(26+(21.448-T*(46.815+T*(5.9e-4-T*1.813e-3)))/60)/60+0.00256*Math.cos(om*rad);const dec=Math.asin(Math.sin(eps*rad)*Math.sin(al*rad));const y2=Math.tan(eps*rad/2)**2;const eq=4*(y2*Math.sin(2*L0*rad)-2*e*Math.sin(M*rad)+4*e*y2*Math.sin(M*rad)*Math.cos(2*L0*rad)-.5*y2*y2*Math.sin(4*L0*rad)-1.25*e*e*Math.sin(2*M*rad))/rad;
const noon=720-4*lng-eq;const ha=Math.acos(Math.cos(90.833*rad)/(Math.cos(lat*rad)*Math.cos(dec))-Math.tan(lat*rad)*Math.tan(dec))/rad;return{noon:noon,sr:noon-4*ha,ss:noon+4*ha}}

const cities=[['مكة',21.4225,39.8262,'Asia/Riyadh'],['جدة',21.4858,39.1925,'Asia/Riyadh'],['الرياض',24.7136,46.6753,'Asia/Riyadh'],['المدينة',24.4686,39.6142,'Asia/Riyadh'],['القاهرة',30.0444,31.2357,'Africa/Cairo'],['دبي',25.2048,55.2708,'Asia/Dubai'],['إسطنبول',41.0082,28.9784,'Europe/Istanbul'],['لندن',51.5074,-0.1278,'Europe/London']];
const mn=(d,tz)=>{const o={};new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:tz}).formatToParts(d).forEach(x=>{if(x.type!=='literal')o[x.type]=+x.value});return o.hour*60+o.minute};
const off=(tz,y,mo,d)=>mn(new Date(Date.UTC(y,mo,d,12)),tz)-720;
const DAYS=[[2026,5,21],[2026,11,21],[2026,2,29],[2026,9,25]];
test('الزوال والشروق والغروب لثماني مدن في 4 تواريخ (صيف/شتاء/تغيّر التوقيت) ضمن دقيقتين من مرجع NOAA',()=>{
 for(const [n,la,ln,tz] of cities)for(const [y,mo,d] of DAYS){const t=P.times(y,mo,d,la,ln,P.METHODS.mwl),r=noaa(y,mo,d,la,ln),o=off(tz,y,mo,d);
  for(const [k,v] of [['dhuhr',r.noon],['sunrise',r.sr],['maghrib',r.ss]])assert.ok(Math.abs(mn(t[k],tz)-(v+o))<=2,n+' '+y+'-'+(mo+1)+'-'+d+' '+k)}});
test('ترتيب الصلوات منطقي في كل مدينة وتاريخ (طريقة أم القرى)',()=>{
 for(const [n,la,ln] of cities)for(const [y,mo,d] of DAYS){const t=P.times(y,mo,d,la,ln,P.METHODS.ummalqura);assert.ok(t.fajr<t.sunrise&&t.sunrise<t.dhuhr&&t.dhuhr<t.asr&&t.asr<t.maghrib&&t.maghrib<t.isha,n+' '+mo)}});
test('أم القرى: الفجر 18.5° أبكر من الرابطة 18° في مكة (فرق صغير ≤ 10د)',()=>{const a=P.times(2026,10,7,21.4225,39.8262,P.METHODS.ummalqura),b=P.times(2026,10,7,21.4225,39.8262,P.METHODS.mwl);const d=(b.fajr-a.fajr)/6e4;assert.ok(d>=0&&d<=10,String(d))});
test('الطريقة التلقائية حسب الدولة: السعودية ← أم القرى، مصر ← المصرية، أمريكا ← ISNA',()=>{
 const mk=(cc,lat,lng)=>env({lat,lng,tz:'UTC',cc}).__pt.methodKey();
 assert.equal(mk('SA',21.48,39.19).k,'ummalqura');assert.equal(mk('EG',30.04,31.23).k,'egyptian');assert.equal(mk('US',40.7,-74).k,'isna')});
test('كل دولة في CC لها طريقة صالحة (لا undefined)',()=>{for(const cc of Object.keys(P.CC)){const k=env({lat:25,lng:45,tz:'UTC',cc}).__pt.methodKey().k;assert.ok(P.METHODS[k],cc)}});
