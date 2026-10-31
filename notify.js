/* أذكاري — local notifications: prayer times (hadith), escalating reminders, settings card, diagnostics, rain card.
   ALL notifications go through reg.showNotification (system notifications). No server: see limits in RELEASE_NOTES. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s),LS={g(k){try{return localStorage.getItem(k)}catch(e){return null}},s(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const PN={fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
const H={fajr:['حان وقت الفجر 🌅','«مَنْ صَلَّى الصُّبْحَ فِي جَمَاعَةٍ فَكَأَنَّمَا صَلَّى اللَّيْلَ كُلَّهُ»','مسلم'],
 dhuhr:['حان وقت الظهر ☀️','«مَنْ حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ»','أبو داود والترمذي (صححه الألباني)'],
 asr:['حان وقت العصر 🌤️','«مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ»','متفق عليه'],
 maghrib:['حان وقت المغرب 🌇','«الدُّعَاءُ لَا يُرَدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ» فاغتنم الوقت','أبو داود والترمذي (صححه الألباني)'],
 isha:['حان وقت العشاء 🌙','«مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ»','مسلم'],
 jum:['جمعة مباركة 🕌','«إِنَّ فِي الْجُمُعَةِ لَسَاعَةً لَا يُوَافِقُهَا عَبْدٌ مُسْلِمٌ يَسْأَلُ اللَّهَ شَيْئًا إِلَّا أَعْطَاهُ»','متفق عليه']};
const R={m:['صباح الخير 🌤️','أذكار الصباح بتنتظرك… دقايق وتبقى في حفظ الله.','لسه ما قرأتش أذكار الصباح يا غالي 🤍 ما تفوّتش على نفسك الحفظ، دقيقتين بس.','الأذكار لسه مستنياك… اللي يداوم عليها بيحس بالفرق. ابدأ دلوقتي.'],
 e:['مساء النور 🌙','وقت أذكار المساء… اختم يومك بحفظ ربنا.','لسه ما قرأتش أذكار المساء 🤍 لا تنم من غير ما تتحصّن.','لسه فيه وقت… أذكار المساء هتسعدك وتطمّنك.'],
 q:['الثلث الأخير من الليل بدأ 🌌','«يَنْزِلُ رَبُّنَا إِلَى السَّمَاءِ الدُّنْيَا…» (متفق عليه). ركعتين بس؟','لسه فيه وقت قبل الفجر… الله ينادي: هل من سائل فأعطيه؟ 🤍']};
const DEF={on:true,m:true,e:true,q:true,pre:true,esc:true,g1:60,g2:120,qh:null,p:{fajr:true,dhuhr:true,asr:true,maghrib:true,isha:true}};
const cfg=()=>{try{return Object.assign({},DEF,JSON.parse(LS.g('azkar_nc')||'{}'),{p:Object.assign({},DEF.p,(JSON.parse(LS.g('azkar_nc')||'{}')).p)})}catch(e){return DEF}};
const save=c=>LS.s('azkar_nc',JSON.stringify(c));
const dk=d=>new Date(d).toISOString().slice(0,10),done=(k,now)=>LS.g('azkar_done_'+k+'_'+dk(now))==='1';
window.AZKAR_markDone=k=>LS.s('azkar_done_'+k+'_'+dk(Date.now()),'1');
/* ---------- pure planner ---------- */
function inQuiet(at,q){if(!q)return false;const d=new Date(at),m=d.getHours()*60+d.getMinutes(),a=q[0],b=q[1];return a>b?(m>=a||m<b):(m>=a&&m<b)}
function plan(now,T,third,c,friday){const out=[],M=6e4,add=(id,at,t,b,go,kind)=>{if(at&&+at>now&&!inQuiet(+at,c.qh))out.push({id,at:+at,title:t,body:b,go,kind})};
 if(!c.on)return out;
 for(const k of Object.keys(PN)){if(!T[k])continue;const h=(k==='dhuhr'&&friday)?H.jum:H[k];
  if(c.p[k])add('p-'+k,T[k],h[0],h[1],k==='dhuhr'&&friday?'jum':k,'p');
  if(c.pre&&c.p[k])add('pre-'+k,+T[k]-10*M,'اقترب وقت '+PN[k],'بعد ١٠ دقائق إن شاء الله','', 'pre')}
 const ladder=(kind,base,offs,txt)=>{if(!base||done(kind,now))return;offs.slice(0,c.esc?offs.length:1).forEach((o,i)=>add(kind+'-'+i,+base+o*M,txt[0],txt[i+1],kind,kind))};
 if(c.m)ladder('m',T.fajr&&+T.fajr+30*M,[0,c.g1,c.g2],R.m);
 if(c.e)ladder('e',T.asr&&+T.asr+30*M,[0,c.g1,c.g2],R.e);
 if(c.q)ladder('q',third,[0,45],R.q);
 return out.sort((a,b)=>a.at-b.at)}
/* ---------- delivery (real system notifications) ---------- */
const LOGK='azkar_nlog',log=(o)=>{let a=[];try{a=JSON.parse(LS.g(LOGK)||'[]')}catch(e){}a.push(Object.assign({t:Date.now()},o));LS.s(LOGK,JSON.stringify(a.slice(-60)))};
const reg=()=>navigator.serviceWorker?navigator.serviceWorker.ready:Promise.reject('no-sw');
async function fire(n,scheduledAt){try{const r=await reg();await r.showNotification(n.title,{body:n.body,tag:n.id,data:{go:n.go||''},lang:'ar',dir:'rtl'});log({id:n.id,sched:scheduledAt||null,fired:Date.now(),res:'shown'})}catch(e){log({id:n.id,sched:scheduledAt||null,res:'error:'+(e&&e.message||e)})}}
let timers=[],lastPlan=[];const trig=typeof TimestampTrigger!=='undefined';
async function schedule(){timers.forEach(clearTimeout);timers=[];const P=window.__pt&&window.__pt.compute&&window.__pt.compute();if(!P||(typeof Notification==='undefined')||Notification.permission!=='granted'){lastPlan=[];return}
 const now=Date.now();lastPlan=plan(now,P.T,P.third,cfg(),new Date().getDay()===5);
 for(const n of lastPlan){if(trig){try{const r=await reg();await r.showNotification(n.title,{body:n.body,tag:n.id,data:{go:n.go},showTrigger:new TimestampTrigger(n.at)});log({id:n.id,sched:n.at,res:'trigger-set'});continue}catch(e){}}
  if(n.at-now<2147e6)timers.push(setTimeout(()=>fire(n,n.at),n.at-now))}}
/* ---------- opening from a notification ---------- */
function handle(go){if(!go)return;try{if(H[go]){const h=H[go],o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:9800;background:#000b;display:flex;align-items:center;justify-content:center;padding:20px';o.innerHTML='<div class="card" style="max-width:420px;text-align:center"><h2>'+h[0]+'</h2><p class="sq">'+h[1]+'</p><div class="src">المصدر: '+h[2]+'</div><button class="btn main" style="margin-top:10px">إغلاق</button></div>';o.onclick=e=>{if(e.target===o||e.target.tagName==='BUTTON')o.remove()};document.body.appendChild(o)}
 else if(R[go]&&go!=='q'){const b=$('#segA [data-k="'+go+'"]');if(typeof go_==='function'){}if(b){b.click();if(typeof window.go==='function')window.go('adh')}}}catch(e){}}
function bootNav(){const q=new URLSearchParams(location.search).get('n');if(q)setTimeout(()=>handle(q),800);if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='notif')handle(e.data.go)})}
/* ---------- rain (Open-Meteo, location only, raw JSON kept for diagnostics) ---------- */
const RAIN=c=>(c>=51&&c<=67)||(c>=80&&c<=82)||(c>=95&&c<=99);
async function weather(){try{const L=JSON.parse(LS.g('azkar_loc')||'null');if(!L||!navigator.onLine)return;const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+L.lat+'&longitude='+L.lng+'&current=precipitation,weather_code');const j=await r.json();LS.s('azkar_wx',JSON.stringify(j));rainCard(j)}catch(e){}}
function rainCard(j){const h=$('#v-home');if(!h||$('#rainc'))return;const c=j&&j.current;if(!c||!(c.precipitation>0||RAIN(c.weather_code)))return;const d=document.createElement('div');d.id='rainc';d.className='card';d.innerHTML='<p style="margin:0;line-height:2">🌧️ الدنيا بتمطر — اغتنم وقت الدعاء.</p><button class="btn main" id="rainb">أذكار المطر</button>';h.insertBefore(d,h.children[1]||null);$('#rainb').onclick=()=>{const b=document.querySelector('[data-oc="المطر"]');if(b)b.click()}}
/* ---------- settings card + diagnostics ---------- */
async function card(){const m=$('#mc');if(!m||$('#nfs',m))return;const c=cfg(),rd=window.__rd?await window.__rd.state():{},d=document.createElement('div');d.id='nfs';d.className='grp';
 const tg=(id,l,on)=>'<div class="rw"><span>'+l+'</span><input type="checkbox" class="ios" data-n="'+id+'" '+(on?'checked':'')+' aria-label="'+l+'"></div>';
 const ck=(ok,l)=>'<div class="src">'+(ok?'✅':'⚠️')+' '+l+'</div>';
 d.innerHTML='<div class="gl">الإشعارات</div>'+tg('on','تشغيل الإشعارات',c.on)+tg('m','تذكير أذكار الصباح',c.m)+tg('e','تذكير أذكار المساء',c.e)+tg('q','تذكير قيام الليل (الثلث الأخير)',c.q)+tg('esc','الإشعارات التصاعدية (عتاب لطيف)',c.esc)+tg('pre','إشعار قبل الأذان بـ ١٠ دقائق',c.pre)
  +Object.keys(PN).map(k=>tg('p.'+k,'أذان '+PN[k],c.p[k])).join('')
  +'<div class="rw"><span>ساعات الهدوء (من / إلى)</span><span><input type="time" id="nq1" value="'+(c.qh?String(c.qh[0]/60|0).padStart(2,'0')+':'+String(c.qh[0]%60).padStart(2,'0'):'')+'"> <input type="time" id="nq2" value="'+(c.qh?String(c.qh[1]/60|0).padStart(2,'0')+':'+String(c.qh[1]%60).padStart(2,'0'):'')+'"></span></div>'
  +'<div class="gl">جاهزية الإشعارات</div>'+ck(rd.installed,'مثبّت على الشاشة الرئيسية')+ck(rd.notif==='granted','إذن الإشعارات')+ck(rd.geo==='granted','إذن الموقع')+ck(rd.sw,'Service Worker نشط')+ck(lastPlan.length>0,'إشعارات مجدولة: '+lastPlan.length)
  +'<div class="src">'+(trig?'الجدولة بالـ Triggers متاحة.':'الجدولة تعمل ما دام التطبيق حيًّا في الخلفية؛ الإشعار المضمون والتطبيق مغلق يحتاج Web Push (خادم).')+'</div>'
  +'<div class="row"><button class="btn" id="nt">اختبار بعد 10 ثواني</button></div>'
  +'<details><summary>شاشة الاختبار (Diagnostics)</summary><pre id="ndg" style="white-space:pre-wrap;direction:ltr;font-size:.7rem"></pre></details>';
 m.appendChild(d);
 const refresh=()=>{let P=null;try{P=window.__pt.compute()}catch(e){}$('#ndg',d).textContent=JSON.stringify({permissions:rd,location:JSON.parse(LS.g('azkar_loc')||'null'),prayerTimes:P&&{T:P.T,third:P.third},weather:JSON.parse(LS.g('azkar_wx')||'null'),scheduled:lastPlan.map(n=>({id:n.id,at:new Date(n.at).toISOString()})),log:JSON.parse(LS.g(LOGK)||'[]').slice(-15)},null,1)};refresh();
 d.onchange=e=>{const t=e.target,n=t.dataset&&t.dataset.n,x=cfg();if(n){if(n.startsWith('p.'))x.p[n.slice(2)]=t.checked;else x[n]=t.checked}else if(t.id==='nq1'||t.id==='nq2'){const a=($('#nq1',d).value||'').split(':'),b=($('#nq2',d).value||'').split(':');x.qh=(a.length===2&&b.length===2&&a[0]!==''&&b[0]!=='')?[+a[0]*60+ +a[1],+b[0]*60+ +b[1]]:null}else return;save(x);schedule().then(refresh)};
 $('#nt',d).onclick=async()=>{if(typeof Notification!=='undefined'&&Notification.permission!=='granted'){try{await Notification.requestPermission()}catch(e){}}const at=Date.now()+1e4;log({id:'test',sched:at,res:'queued'});setTimeout(()=>fire({id:'test',title:'اختبار أذكاري ✅',body:'وصل الإشعار عبر نفس مسار الإشعارات الحقيقي.',go:''},at).then(refresh),1e4)}}
function init(){try{bootNav();if(typeof openSet==='function'){const o=openSet;window.openSet=function(){const r=o.apply(this,arguments);card();return r}}setTimeout(schedule,2500);setTimeout(weather,3500);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()})}catch(e){console.warn('[notify]',e)}}
window.__nf={plan,cfg,DEF,H,R,inQuiet};
if(typeof document!=='undefined'&&document.body)init();
})();
