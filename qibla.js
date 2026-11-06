/* أذكاري — القبلة: بوصلة بحساس الجهاز (صفحة داخل «الأدوات والإضافات»). يعمل بدون إنترنت. الاتجاه تقريبي. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const A=n=>typeof ar==='function'?ar(n):String(n);
const KAABA={lat:21.422487,lng:39.826206},D=Math.PI/180;
const norm=a=>((a%360)+360)%360,diff=(a,b)=>{const d=norm(a-b);return d>180?d-360:d};
function bearing(lat,lng){const f1=lat*D,f2=KAABA.lat*D,dl=(KAABA.lng-lng)*D,y=Math.sin(dl)*Math.cos(f2),x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl);return norm(Math.atan2(y,x)/D)}
function dist(lat,lng){const f1=lat*D,f2=KAABA.lat*D,dp=f2-f1,dl=(KAABA.lng-lng)*D,a=Math.sin(dp/2)**2+Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}
const smooth=(prev,next,k)=>prev==null?next:norm(prev+diff(next,prev)*k);
/* الاتجاه (درجات من الشمال مع عقارب الساعة) من حدث الجهاز، أو null إن لم يكن مطلقًا */
function heading(e,ang){let h=null;if(typeof e.webkitCompassHeading==='number'&&isFinite(e.webkitCompassHeading))h=e.webkitCompassHeading;else if((e.absolute===true||e.type==='deviceorientationabsolute')&&typeof e.alpha==='number')h=360-e.alpha;return h==null?null:norm(h+(ang||0))}
const scrAng=()=>{try{return(screen.orientation&&screen.orientation.angle)||window.orientation||0}catch(e){return 0}};
const loc=()=>{try{const o=JSON.parse(AZ.data.get('azkar_loc')||'null');return o&&isFinite(o.lat)&&isFinite(o.lng)?o:null}catch(e){return null}};
/* ---------- الصفحة ---------- */
let st=null;
function dial(q){let t='';for(let i=0;i<72;i++){const l=i%9===0?14:6;t+='<line x1="100" y1="12" x2="100" y2="'+(12+l)+'" transform="rotate('+(i*5)+' 100 100)" stroke="var(--mut)" stroke-width="'+(i%9===0?2:1)+'"/>'}
 return '<svg viewBox="0 0 200 200" class="qbSv" role="img" aria-label="بوصلة القبلة"><g id="qbR"><circle cx="100" cy="100" r="92" fill="none" stroke="var(--line)" stroke-width="2"/>'+t+'<text x="100" y="46" text-anchor="middle" font-size="16" font-weight="700" fill="var(--tx)">N</text><g transform="rotate('+q.toFixed(1)+' 100 100)"><line x1="100" y1="100" x2="100" y2="40" stroke="var(--gold)" stroke-width="3"/><text x="100" y="34" text-anchor="middle" font-size="26">🕋</text></g></g><polygon points="100,2 92,18 108,18" fill="var(--acc)" id="qbP"/></svg>'}
function mount(root,api){const L=loc();
 if(!L){root.innerHTML='<div class="card"><p class="qbT">حدّد موقعك أولًا لحساب اتجاه القبلة.</p><button class="btn main" data-qb="loc">فتح المواقيت</button></div>';root.onclick=e=>{if(e.target.closest('[data-qb="loc"]')){api.close();api.navTo('loc')}};return}
 const q=bearing(L.lat,L.lng),km=Math.round(dist(L.lat,L.lng));st={q,h:null,on:false,al:false,tm:0,raf:0,api,root};
 root.innerHTML='<div class="card qbC"><div class="qbI"><span>اتجاه القبلة من موقعك</span> <b>'+A(Math.round(q))+'°</b> · <span>المسافة</span> <b>'+A(km)+'</b> <span>كم</span></div>'+dial(q)+'<div class="qbS" id="qbS" role="status" aria-live="polite">اتجاه القبلة بالدرجات من الشمال موضّح أعلاه. اضغط «تشغيل البوصلة» لاستخدام حساس الجهاز.</div><div class="row"><button class="btn main" data-qb="on">تشغيل البوصلة</button></div></div>'
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
function onO(e){const s=st;if(!s)return;const h=heading(e,scrAng());if(h==null)return;s.h=smooth(s.h,h,.25);if(!s.raf)s.raf=requestAnimationFrame(()=>{s.raf=0;paint()})}
function paint(){const s=st;if(!s||s.h==null)return;const R=$('#qbR',s.root);if(R)R.setAttribute('transform','rotate('+(-s.h).toFixed(1)+' 100 100)');const d=diff(s.q,s.h),a=Math.abs(d),S=$('#qbS',s.root);
 if(a<=3){if(S)S.innerHTML='<b>✓ أنت في اتجاه القبلة</b>';if(!s.al){s.al=true;try{if(navigator.vibrate&&AZ.data.get('azkar_vib')!=='0')navigator.vibrate([40,30,40])}catch(e){}}}
 else{if(a>6)s.al=false;if(S)S.innerHTML='<span>أدر هاتفك</span> <b>'+A(Math.round(a))+'°</b> <span>'+(d>0?'لليمين':'لليسار')+'</span>'}}
function unmount(){stop(false);st=null}
function reg(){if(window.__tl&&window.__tl.register)window.__tl.register({id:'qibla',ic:'🧭',t:'القبلة',d:'بوصلة تستخدم حساس جهازك لتحديد اتجاه الكعبة',mount,unmount})}
function css(){const s=document.createElement('style');s.textContent='#tl .qbC{text-align:center}#tl .qbSv{width:min(78vw,320px);height:auto;margin:6px auto;display:block}#tl .qbI{line-height:2}#tl .qbS{min-height:3.2em;line-height:1.9;margin:6px 0;color:var(--tx)}#tl .qbN{color:var(--mut);line-height:2;margin:4px 0}#tl .qbT{line-height:2}';document.head.appendChild(s)}
function init(){try{css();reg()}catch(e){console.warn('[qibla]',e)}}
window.__qb={bearing,dist,heading,smooth,diff,norm};
if(typeof document!=='undefined'&&document.body)init();
})();
