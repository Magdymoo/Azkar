/* أذكاري — القبلة: بوصلة بحساس الجهاز (صفحة داخل «الأدوات والإضافات»). يعمل بدون إنترنت. الاتجاه تقريبي. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const A=n=>typeof ar==='function'?ar(n):String(n);
const KAABA={lat:21.422487,lng:39.826206},D=Math.PI/180;
/* الانحراف المغناطيسي (شرق موجب) من نموذج WMM-2025 مضمَّن: البوصلة مغناطيسية والقبلة جغرافية */
const WM={e:2025,g:[0,-29351.8,-1410.8,-2556.6,2951.1,1649.3,1361,-2404.1,1243.8,453.6,895,799.5,55.7,-281.1,12.1,-233.2,368.9,187.2,-138.7,-142,20.9,64.4,63.8,76.9,-115.7,-40.9,14.9,-60.7,79.5,-77,-8.8,59.3,15.8,2.5,-11.1,14.2,23.2,10.8,-17.5,2,-21.7,16.9,15,-16.8,0.9,4.6,7.8,3,-0.2,-2.5,-13.1,2.4,8.6,-8.7,-12.9,-1.3,-6.4,0.2,2,-1,-0.6,-0.9,1.5,0.9,-2.7,-3.9,2.9,-1.5,-2.5,2.4,-0.6,-0.1,-0.6,-0.1,1.1,-1,-0.2,2.6,-2,-0.2,0.3,1.2,-1.3,0.6,0.6,0.5,-0.1,-0.4,-0.2,-1.3,-0.7],h:[0,0,4545.4,0,-3133.6,-815.1,0,-56.6,237.5,-549.5,0,278.6,-133.9,212,-375.6,0,45.4,220.2,-122.9,43,106.1,0,-18.4,16.8,48.8,-59.8,10.9,72.7,0,-48.9,-14.4,-1,23.4,-7.4,-25.1,-2.3,0,7.1,-12.6,11.4,-9.7,12.7,0.7,-5.2,3.9,0,-24.8,12.2,8.3,-3.3,-5.2,7.2,-0.6,0.8,10,0,3.3,0,2.4,5.3,-9.1,0.4,-4.2,-3.8,0.9,-9.1,0,0,2.9,-0.6,0.2,0.5,-0.3,-1.2,-1.7,-2.9,-1.8,-2.3,0,-1.3,0.7,1,-1.4,0,0.6,-0.1,0.8,0.1,-1,0.1,0.2],dg:[0,12,9.7,-11.6,-5.2,-8,-1.3,-4.2,0.4,-15.6,-1.6,-2.4,-6,5.6,-7,0.6,1.4,0,0.6,2.2,0.9,-0.2,-0.4,0.9,1.2,-0.9,0.3,0.9,0,-0.1,-0.1,0.5,-0.1,-0.8,-0.8,0.8,-0.1,0.2,0,0.5,-0.1,0.3,0.2,0,0.2,0,-0.1,0.1,0.3,-0.3,0,0.3,-0.1,0.1,-0.1,0.1,0,0.1,0.1,0,-0.3,0,-0.1,-0.1,0,0,0,0,0,0,0,-0.1,0,0,-0.1,-0.1,-0.1,-0.1,0,0,0,0,0,0,0.1,0,0,0,-0.1,0,-0.1],dh:[0,0,-21.5,0,-27.7,-12.1,0,4,-0.3,-4.1,0,-1.1,4.1,1.6,-4.4,0,-0.5,2.2,0.4,1.7,1.9,0,0.3,-1.6,-0.4,0.9,0.7,0.9,0,0.6,0.5,-0.8,0,-1,0.6,-0.2,0,-0.2,0.5,-0.4,0.4,-0.5,-0.6,0.3,0.2,0,-0.3,0.3,-0.3,0.3,0.2,-0.1,-0.2,0.4,0.1,0,0,0,-0.2,0.1,-0.1,0.1,0,-0.1,0.2,0,0,0,0.1,0,0.1,0,0,0.1,0,0,0,0,0,0,0,-0.1,0.1,0,0,0,0,0,0,0,-0.1]};   /* WMM-2025 (NOAA/NCEI، صالح حتى 2029-11) */
function declination(lat,lng,date){
 const a=6378.137,b=6356.7523142,e2=1-b*b/(a*a),N=12,sp=Math.sin(lat*D),cp=Math.cos(lat*D);
 const rc=a/Math.sqrt(1-e2*sp*sp),p=rc*cp,z=rc*(1-e2)*sp,r=Math.sqrt(p*p+z*z),phi=Math.asin(z/r);   // geocentric lat
 const y0=date.getUTCFullYear(),dy=y0+(date-Date.UTC(y0,0,1))/(864e5*365)-WM.e;
 const th=Math.PI/2-phi,ct=Math.cos(th),st=Math.sin(th),P=[],dP=[];
 for(let n=0;n<=N;n++){P[n]=[];dP[n]=[]}
 P[0][0]=1;dP[0][0]=0;
 for(let n=1;n<=N;n++)for(let m=0;m<=n;m++){
  if(n===m){const k=n===1?1:Math.sqrt(1-1/(2*n));P[n][n]=k*st*P[n-1][n-1];dP[n][n]=k*(st*dP[n-1][n-1]+ct*P[n-1][n-1])}
  else{const q=Math.sqrt(n*n-m*m),k=n>=2?Math.sqrt((n-1)*(n-1)-m*m):0,p2=n>=2&&m<=n-2?P[n-2][m]:0,d2=n>=2&&m<=n-2?dP[n-2][m]:0;
   P[n][m]=((2*n-1)*ct*P[n-1][m]-k*p2)/q;dP[n][m]=((2*n-1)*(ct*dP[n-1][m]-st*P[n-1][m])-k*d2)/q}}
 let bx=0,by=0,bz=0;const lam=lng*D;
 for(let n=1;n<=N;n++){const rr=Math.pow(a/r,n+2);for(let m=0;m<=n;m++){const i=n*(n+1)/2+m,g=WM.g[i]+dy*WM.dg[i],h=WM.h[i]+dy*WM.dh[i],c=g*Math.cos(m*lam)+h*Math.sin(m*lam),s=g*Math.sin(m*lam)-h*Math.cos(m*lam);
  bz-=rr*(n+1)*c*P[n][m];bx+=rr*c*dP[n][m];by+=rr*m*s*P[n][m]/st}}
 const psi=phi-lat*D,X=bx*Math.cos(psi)-bz*Math.sin(psi);
 return Math.atan2(by,X)/D}
const norm=a=>((a%360)+360)%360,diff=(a,b)=>{const d=norm(a-b);return d>180?d-360:d};
function bearing(lat,lng){const f1=lat*D,f2=KAABA.lat*D,dl=(KAABA.lng-lng)*D,y=Math.sin(dl)*Math.cos(f2),x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl);return norm(Math.atan2(y,x)/D)}
function dist(lat,lng){const f1=lat*D,f2=KAABA.lat*D,dp=f2-f1,dl=(KAABA.lng-lng)*D,a=Math.sin(dp/2)**2+Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}
const smooth=(prev,next,k)=>prev==null?next:norm(prev+diff(next,prev)*k);
/* الاتجاه (درجات من الشمال مع عقارب الساعة) من حدث الجهاز، أو null إن لم يكن مطلقًا */
function tiltHeading(al,be,ga){const c=Math.cos,s=Math.sin,A=al*D,B=be*D,G=ga*D,rA=-c(A)*s(G)-s(A)*s(B)*c(G),rB=-s(A)*s(G)+c(A)*s(B)*c(G),tx=-s(A)*c(B),ty=c(A)*c(B);
 /* الجهاز شبه أفقي: اتجاه حافته العلوية (= 360 − alpha، لا يتأثر بالميل)؛ شبه عمودي: اتجاه ظهره (الكاميرا). نختار الأكبر مسقطًا أفقيًا فلا نقسم على صفر عند التسطّح التام */
 return norm((Math.hypot(tx,ty)>=Math.hypot(rA,rB)?Math.atan2(tx,ty):Math.atan2(rA,rB))/D)}
function heading(e,ang,decl){let h=null;if(typeof e.webkitCompassHeading==='number'&&isFinite(e.webkitCompassHeading))h=e.webkitCompassHeading;else if((e.absolute===true||e.type==='deviceorientationabsolute')&&typeof e.alpha==='number')h=(typeof e.beta==='number'&&typeof e.gamma==='number')?tiltHeading(e.alpha,e.beta,e.gamma):360-e.alpha;return h==null?null:norm(h+(ang||0)+(decl||0))}
const scrAng=()=>{try{return(screen.orientation&&screen.orientation.angle)||window.orientation||0}catch(e){return 0}};
const loc=()=>{try{const o=JSON.parse(AZ.data.get('azkar_loc')||'null');return o&&isFinite(o.lat)&&isFinite(o.lng)?o:null}catch(e){return null}};
/* ---------- الصفحة ---------- */
let st=null;
function dial(q){let t='';for(let i=0;i<72;i++){const l=i%9===0?14:6;t+='<line x1="100" y1="12" x2="100" y2="'+(12+l)+'" transform="rotate('+(i*5)+' 100 100)" stroke="var(--mut)" stroke-width="'+(i%9===0?2:1)+'"/>'}
 return '<svg viewBox="0 0 200 200" class="qbSv" role="img" aria-label="بوصلة القبلة"><g id="qbR"><circle cx="100" cy="100" r="92" fill="none" stroke="var(--line)" stroke-width="2"/>'+t+'<text x="100" y="46" text-anchor="middle" font-size="16" font-weight="700" fill="var(--tx)">N</text><g transform="rotate('+q.toFixed(1)+' 100 100)"><line x1="100" y1="100" x2="100" y2="40" stroke="var(--gold)" stroke-width="3"/><text x="100" y="34" text-anchor="middle" font-size="26">🕋</text></g></g><polygon points="100,2 92,18 108,18" fill="var(--acc)" id="qbP"/></svg>'}
function mount(root,api){const L=loc();
 if(!L){root.innerHTML='<div class="card"><p class="qbT">حدّد موقعك أولًا لحساب اتجاه القبلة.</p><button class="btn main" data-qb="loc">فتح المواقيت</button></div>';root.onclick=e=>{if(e.target.closest('[data-qb="loc"]')){api.close();api.navTo('loc')}};return}
 const q=bearing(L.lat,L.lng),km=Math.round(dist(L.lat,L.lng));let dc=0;try{dc=declination(L.lat,L.lng,new Date());if(!isFinite(dc))dc=0}catch(e){dc=0}
 st={q,dc,h:null,on:false,al:false,tm:0,raf:0,api,root};
 root.innerHTML='<div class="card qbC"><div class="qbI"><span>اتجاه القبلة من موقعك</span> <b>'+A(Math.round(q))+'°</b> · <span>المسافة</span> <b>'+A(km)+'</b> <span>كم</span> · <span>الانحراف المغناطيسي</span> <b dir="ltr">'+(dc>=0?'+':'−')+A(Math.abs(dc).toFixed(1))+'°</b></div>'+dial(q)+'<div class="qbS" id="qbS" role="status" aria-live="polite">اتجاه القبلة بالدرجات من الشمال موضّح أعلاه. اضغط «تشغيل البوصلة» لاستخدام حساس الجهاز.</div><div class="row"><button class="btn main" data-qb="on">تشغيل البوصلة</button></div></div>'
  +'<div class="card"><div class="qbN">ابعد الهاتف عن المعادن والمغناطيس، وحرّكه على شكل ٨ لمعايرة البوصلة.</div><div class="qbN">يعمل أدق والهاتف أفقيًا ومسطّحًا.</div><div class="qbN">الاتجاه تقريبي؛ تحقّق من علامة القبلة في المسجد أو الأماكن العامة عند الإمكان.</div></div>';
 root.onclick=e=>{const b=e.target.closest('[data-qb]');if(!b)return;if(b.dataset.qb==='on')start();else if(b.dataset.qb==='off')stop(true)}}
function say(m){const s=st&&$('#qbS',st.root);if(s)s.textContent=m}
async function start(){const s=st;if(!s||s.on)return;
 if(typeof DeviceOrientationEvent==='undefined'&&!('ondeviceorientation' in window)){say('جهازك أو متصفحك لا يدعم حساس الاتجاه.');return}
 try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted'){say('لم يُسمح باستخدام الحساس. على iPhone: أغلق التطبيق وافتحه من جديد، ثم اضغط «تشغيل البوصلة» واختر «سماح».');return}}}catch(e){say('تعذّر طلب إذن الحساس. أعد المحاولة من زر «تشغيل البوصلة».');return}
 if(st!==s)return;s.on=true;addEventListener('deviceorientationabsolute',onO,true);addEventListener('deviceorientation',onO,true);
 const b=$('[data-qb]',s.root);const row=$('.row',s.root);if(row)row.innerHTML='<button class="btn" data-qb="off">إيقاف البوصلة</button>';say('جارٍ قراءة الحساس…');
 s.tm=setTimeout(()=>{if(st===s&&s.h==null)say('لم تصل أي قراءة من الحساس. قد لا يملك جهازك بوصلة، أو الحساس مغلق في الإعدادات.')},3000)}
function stop(manual){const s=st;if(!s)return;removeEventListener('deviceorientationabsolute',onO,true);removeEventListener('deviceorientation',onO,true);clearTimeout(s.tm);cancelAnimationFrame(s.raf);s.on=false;if(manual){s.h=null;const R=$('#qbR',s.root);if(R)R.setAttribute('transform','');const row=$('.row',s.root);if(row)row.innerHTML='<button class="btn main" data-qb="on">تشغيل البوصلة</button>';say('تم إيقاف البوصلة.')}}
function onO(e){const s=st;if(!s)return;const h=heading(e,scrAng(),s.dc);if(h==null)return;s.h=smooth(s.h,h,.25);if(!s.raf)s.raf=requestAnimationFrame(()=>{s.raf=0;paint()})}
function paint(){const s=st;if(!s||s.h==null)return;const R=$('#qbR',s.root);if(R)R.setAttribute('transform','rotate('+(-s.h).toFixed(1)+' 100 100)');const d=diff(s.q,s.h),a=Math.abs(d),S=$('#qbS',s.root);
 if(a<=3){if(S)S.innerHTML='<b>✓ أنت في اتجاه القبلة</b>';if(!s.al){s.al=true;try{if(navigator.vibrate&&AZ.data.get('azkar_vib')!=='0')navigator.vibrate([40,30,40])}catch(e){}}}
 else{if(a>6)s.al=false;if(S)S.innerHTML='<span>أدر هاتفك</span> <b>'+A(Math.round(a))+'°</b> <span>'+(d>0?'لليمين':'لليسار')+'</span>'}}
function unmount(){stop(false);st=null}
function reg(){if(window.__tl&&window.__tl.register)window.__tl.register({id:'qibla',ic:'🧭',t:'القبلة',d:'بوصلة تستخدم حساس جهازك لتحديد اتجاه الكعبة',mount,unmount})}
function css(){const s=document.createElement('style');s.textContent='#tl .qbC{text-align:center}#tl .qbSv{width:min(78vw,320px);height:auto;margin:6px auto;display:block}#tl .qbI{line-height:2}#tl .qbS{min-height:3.2em;line-height:1.9;margin:6px 0;color:var(--tx)}#tl .qbN{color:var(--mut);line-height:2;margin:4px 0}#tl .qbT{line-height:2}';document.head.appendChild(s)}
function init(){try{css();reg()}catch(e){console.warn('[qibla]',e)}}
window.__qb={bearing,dist,heading,smooth,diff,norm,declination,tiltHeading};
if(typeof document!=='undefined'&&document.body)init();
})();
