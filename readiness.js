/* أذكاري — startup readiness: ONE card only, in order: install → notifications → location → service worker. */
(function(){'use strict';
const $=s=>document.querySelector(s),LS={g(k){try{return localStorage.getItem(k)}catch(e){return null}},s(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const DAY3=3*864e5;
function pick(x){if(!x.installed)return'install';if(x.notif==='denied')return'notif-denied';if(x.notif!=='granted')return'notif';if(x.geo==='denied')return'geo-denied';if(x.geo==='prompt'||x.geo==='unsupported')return'geo';if(!x.sw)return'sw';return null}
/* geo values: granted | denied | prompt | unsupported (API missing, never asked, no saved location) | unknown (API missing, asked before: don't nag) */
const hasLoc=()=>{try{const a=JSON.parse(LS.g('azkar_loc')||'null');if(a&&isFinite(a.lat)&&isFinite(a.lng))return true}catch(e){}try{const s=JSON.parse(LS.g('athkary.v1')||'null');if(s&&s.loc&&isFinite(s.loc.lat)&&isFinite(s.loc.lon))return true}catch(e){}return false};
const tzn=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){return 'UTC'}};
/* one source of truth, two storage shapes: azkar_loc {lat,lng,name,tz} and athkary.v1.loc {lat,lon} */
function syncLoc(c){try{let a=null;try{a=JSON.parse(LS.g('azkar_loc')||'null')}catch(e){}
 if(c&&isFinite(c.lat)&&isFinite(c.lng))a=Object.assign({},a||{},{lat:c.lat,lng:c.lng,name:(a&&a.name)||'موقعي الحالي',tz:tzn()});
 if(!a||!isFinite(a.lat)){try{const s=JSON.parse(LS.g('athkary.v1')||'null');if(s&&s.loc&&isFinite(s.loc.lat))a={lat:s.loc.lat,lng:s.loc.lon,name:'موقعي الحالي',tz:tzn()}}catch(e){}}
 if(!a||!isFinite(a.lat))return;if(!a.tz)a.tz=tzn();LS.s('azkar_loc',JSON.stringify(a));
 try{if(typeof S!=='undefined'&&S&&(!S.loc||S.loc.lat!==a.lat||S.loc.lon!==a.lng)){S.loc={lat:a.lat,lon:a.lng};if(typeof save==='function')save()}}catch(e){}}catch(e){}}
const shouldShow=(step,now,last,off)=>!!step&&!off&&(!last||now-last>=DAY3);
const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
async function state(){const o={installed:false,notif:'default',geo:'prompt',sw:false};
 try{o.installed=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){}
 try{if('Notification' in window)o.notif=Notification.permission}catch(e){}
 let perm=null;try{perm=(await navigator.permissions.query({name:'geolocation'})).state}catch(e){perm=null}
 const saved=hasLoc()||LS.g('azkar_geo_ok')==='1';
 o.geo=perm==='granted'||(perm!=='denied'&&saved)||(perm==='denied'&&hasLoc())?'granted':perm==='denied'?'denied':perm==='prompt'?'prompt':(LS.g('azkar_geo_asked')==='1'?'unknown':'unsupported');
 try{const r=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();o.sw=!!(r&&r.active)}catch(e){}return o}
const TXT={install:['علشان الإشعارات توصلك حتى لو التطبيق مقفول، لازم تضيف التطبيق للشاشة الرئيسية وتفتحه منها.',()=>ios()?'iPhone (Safari): زر المشاركة ← «إضافة إلى الشاشة الرئيسية» ← افتح التطبيق من الأيقونة.':'Android (Chrome): القائمة ⋮ ← «تثبيت التطبيق» / «إضافة إلى الشاشة الرئيسية».','ثبّت التطبيق'],
 notif:['الإشعارات مش متفعّلة. علشان تفعّلها دوس «سماح / Allow» على الرسالة اللي هتظهر لك.','','تفعيل الإشعارات'],
 'notif-denied':['الإشعارات مرفوضة، ولازم تفعّلها من الإعدادات.',()=>ios()?'iPhone: الإعدادات ← الإشعارات ← أذكاري ← سماح.':'Android: اضغط على أيقونة القفل بجانب العنوان ← الأذونات ← الإشعارات ← سماح.',''],
 geo:['فعّل الموقع علشان نعرف مواقيت الصلاة المناسبة لك، ونطلّع لك دعاء المطر لو الدنيا بتمطر.','','تفعيل الموقع'],
 'geo-denied':['الموقع مرفوض، ولازم تفعّله من الإعدادات.',()=>ios()?'iPhone: الإعدادات ← الخصوصية ← خدمات الموقع ← Safari/أذكاري.':'Android: القفل بجانب العنوان ← الأذونات ← الموقع ← سماح.',''],
 sw:['التطبيق يحتاج إعادة فتح ليكتمل تجهيز العمل بدون إنترنت.','','إعادة التحميل']};
let dip=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e});
async function act(step){try{
 if(step==='install'){if(dip){dip.prompt();await dip.userChoice}return}
 if(step==='notif'){if(ios()&&!matchMedia('(display-mode: standalone)').matches)return;await Notification.requestPermission();return}   /* iOS: never before installed */
 if(step==='geo')return new Promise(res=>{if(!navigator.geolocation)return res();LS.s('azkar_geo_asked','1');navigator.geolocation.getCurrentPosition(p=>{LS.s('azkar_geo_ok','1');syncLoc({lat:p.coords.latitude,lng:p.coords.longitude});try{document.dispatchEvent(new Event('visibilitychange'));if(typeof renderHome==='function')renderHome()}catch(e){}res(p)},()=>res(),{timeout:10000,maximumAge:36e5})});
 if(step==='sw')location.reload()}catch(e){}}
async function run(){try{syncLoc();const h=$('#v-home');if(!h)return;const old=$('#rdy');if(old)old.remove();const x=await state(),step=pick(x);
 if(!shouldShow(step,Date.now(),+LS.g('azkar_rd_last')||0,LS.g('azkar_rd_off')==='1'))return;const T=TXT[step];
 const c=document.createElement('div');c.id='rdy';c.className='card';c.innerHTML='<p style="line-height:2;margin:0">'+T[0]+'</p>'+(T[1]?'<p class="src" style="line-height:2">'+T[1]()+'</p>':'')+'<div class="row">'+(T[2]?'<button class="btn main" data-r="go">'+T[2]+'</button>':'')+'<button class="btn" data-r="later">لاحقًا</button><button class="btn" data-r="off">لا تذكّرني</button></div>';
 c.onclick=async e=>{const r=e.target.dataset&&e.target.dataset.r;if(!r)return;if(r==='go'){await act(step);return run()}LS.s(r==='off'?'azkar_rd_off':'azkar_rd_last',r==='off'?'1':String(Date.now()));c.remove()};c.dataset.slot='temp';h.appendChild(c);try{window.layoutHome&&window.layoutHome()}catch(e){}}catch(e){console.warn('[ready]',e)}}
window.__rd={pick,shouldShow,state,run,syncLoc,hasLoc};
if(typeof document!=='undefined'&&document.body)setTimeout(run,1200);
})();
