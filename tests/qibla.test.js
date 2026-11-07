const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const w={console,Intl,Date,Math,JSON,document:undefined,setTimeout(){},navigator:{},addEventListener(){},AZ:{data:{get:()=>null}}};w.window=w;vm.createContext(w);vm.runInContext(R('qibla.js'),w);
const Q=w.__qb,near=(a,b,t,m)=>assert.ok(Math.abs(a-b)<=t,(m||'')+' '+a+' vs '+b);
test('اتجاه القبلة الجغرافي لمدن مرجعية',()=>{near(Q.bearing(51.5074,-0.1278),118.99,1.5,'لندن');near(Q.bearing(40.7128,-74.006),58.48,1.5,'نيويورك');near(Q.bearing(30.0444,31.2357),136.1,1.5,'القاهرة');near(Q.bearing(21.4858,39.1925),96.0,2,'جدة');near(Q.bearing(41.0082,28.9784),151.6,1.5,'إسطنبول')});
test('الانحراف المغناطيسي WMM-2025 مطابق للمرجع (NOAA عبر مكتبة geomagnetism) ضمن 0.1° في 7 نوفمبر 2026',()=>{
 const t=new Date('2026-11-07T00:00:00Z'),ref=[[21.42,39.83,3.501],[21.49,39.19,3.579],[24.71,46.68,3.090],[30.04,31.24,4.772],[25.2,55.27,2.238],[41.0,28.98,6.080],[51.5,-0.13,1.221],[40.7,-74,-12.461],[34,-118,11.272],[-33.9,151.2,12.838],[35.7,139.7,-7.944],[-34.6,-58.4,-10.274]];
 for(const [la,ln,d] of ref)near(Q.declination(la,ln,t),d,0.1,la+','+ln)});
test('heading: iOS مغناطيسي + انحراف + زاوية الشاشة',()=>{near(Q.heading({webkitCompassHeading:100},0,3.5),103.5,1e-9);near(Q.heading({webkitCompassHeading:358},0,4),2,1e-9);near(Q.heading({webkitCompassHeading:10},90,0),100,1e-9)});
test('heading: Android مطلق، الهاتف مسطّح: 360 − alpha، ثم الانحراف',()=>{const e={absolute:true,alpha:90,beta:0,gamma:0};near(Q.heading(e,0,0),270,1e-6);near(Q.heading(e,0,3.5),273.5,1e-6)});
test('تعويض الميل: ميل الهاتف للأمام (beta) لا يغيّر الاتجاه',()=>{for(const b of[5,20,45,70,85])near(Q.tiltHeading(270,b,0),90,1e-6,'beta '+b);for(const a of[0,37,123,200,359])near(Q.tiltHeading(a,40,0),(360-a)%360,1e-6,'alpha '+a)});
test('تعويض الميل: مطابق لمصفوفة دوران مستقلة (الحافة العلوية أو الظهر حسب الأكبر أفقيًا)',()=>{const D=Math.PI/180,mm=(a,b)=>a.map((r,i)=>[0,1,2].map(j=>r[0]*b[0][j]+r[1]*b[1][j]+r[2]*b[2][j])),mv=(m,v)=>m.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
 const Rz=a=>[[Math.cos(a),-Math.sin(a),0],[Math.sin(a),Math.cos(a),0],[0,0,1]],Rx=a=>[[1,0,0],[0,Math.cos(a),-Math.sin(a)],[0,Math.sin(a),Math.cos(a)]],Ry=a=>[[Math.cos(a),0,Math.sin(a)],[0,1,0],[-Math.sin(a),0,Math.cos(a)]];
 for(const [a,b,g] of[[30,20,10],[200,35,-15],[310,10,25],[90,80,-5],[150,0,0],[250,88,3],[10,-30,5],[75,0,0]]){const M=mm(mm(Rz(a*D),Rx(b*D)),Ry(g*D)),top=mv(M,[0,1,0]),back=mv(M,[0,0,-1]),v=Math.hypot(top[0],top[1])>=Math.hypot(back[0],back[1])?top:back;let h=Math.atan2(v[0],v[1])/D;if(h<0)h+=360;near(Q.tiltHeading(a,b,g),h,1e-6,[a,b,g].join())}});
test('مسطّح تمامًا (beta=gamma=0) لا يعطي NaN',()=>{for(const a of[0,45,90,180,270])assert.ok(isFinite(Q.tiltHeading(a,0,0)))});
test('إن غاب beta/gamma يرجع إلى 360 − alpha؛ بلا اتجاه مطلق ← null',()=>{near(Q.heading({absolute:true,alpha:30},0,0),330,1e-9);assert.equal(Q.heading({alpha:30},0,0),null)});
test('تسمية الانحراف لها ترجمة I18N (4 لغات)',()=>{const h=R('index.html'),i=h.indexOf('"الانحراف المغناطيسي":[');assert.ok(i>0);assert.equal(h.slice(i,h.indexOf(']',i)).split('","').length,3)});
