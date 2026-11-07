/* أذكاري — local notifications: prayer times (hadith), escalating reminders, settings card, diagnostics, rain card.
   ALL notifications go through reg.showNotification (system notifications). No server: see limits in RELEASE_NOTES. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s),LS={g(k){try{return AZ.data.get(k)}catch(e){return null}},s(k,v){try{AZ.data.set(k,v)}catch(e){}}};
const tr=x=>{try{return typeof trs==='function'&&typeof LANG!=='undefined'&&LANG!=='ar'?(trs(x,LANG)||x):x}catch(e){return x}};
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
const RF={m:['صباح الخير 🌤️','حان وقت أذكار الصباح، فاجعلها حصنك في يومك.','لم تقرأ أذكار الصباح بعد 🤍 فلا تفوّت على نفسك الحفظ، دقيقتان فقط.','ما زال في الوقت متسع، فابدأ أذكار الصباح الآن.'],
 e:['مساء الخير 🌙','حان وقت أذكار المساء، فاختم يومك بحفظ الله.','لم تقرأ أذكار المساء بعد 🤍 فلا تنم قبل أن تتحصّن بها.','ما زال في الوقت متسع، وأذكار المساء تطمئن القلب.'],
 q:['بدأ الثلث الأخير من الليل 🌌','«يَنْزِلُ رَبُّنَا إِلَى السَّمَاءِ الدُّنْيَا…» (متفق عليه). ولو ركعتين.','ما زال في الليل متسع قبل الفجر… هل من سائل فيُعطى؟ 🤍']};
const DEF={on:true,m:true,e:true,q:true,pre:true,esc:true,qa:false,tone:'amiya',g1:60,g2:120,qh:null,p:{fajr:true,dhuhr:true,asr:true,maghrib:true,isha:true}};
const cfg=()=>{try{return Object.assign({},DEF,JSON.parse(LS.g('azkar_nc')||'{}'),{p:Object.assign({},DEF.p,(JSON.parse(LS.g('azkar_nc')||'{}')).p)})}catch(e){return DEF}};
const save=c=>LS.s('azkar_nc',JSON.stringify(c));
/* مصدر واحد لتفعيل التذكيرات: S.rem.{m,e,qm,qe,ql}.on (قسم «التذكيرات» في الإعدادات). azkar_nc يحمل الباقي فقط (تشغيل عام، نبرة، تصاعد، أذان، هدوء). */
const rem=()=>{try{return(window.AZ&&AZ.state&&AZ.state().rem)||{}}catch(e){return{}}};
const eff=()=>{const c=cfg(),r=rem();return Object.assign({},c,{m:r.m?!!r.m.on:c.m,e:r.e?!!r.e.on:c.e,q:r.ql?!!r.ql.on:c.q})};
/* ترحيل لمرة واحدة: مفاتيح m/e/q المعطّلة صراحةً في azkar_nc تنتقل إلى S.rem (بلا فقد: لا يُفعَّل شيء كان معطّلًا) */
function migrateNc(){try{const c=JSON.parse(LS.g('azkar_nc')||'{}');if(c.mig)return false;const S0=window.AZ&&AZ.state&&AZ.state(),r=S0&&S0.rem;if(!r)return false;let ch=false;const granted=typeof Notification!=='undefined'&&Notification.permission==='granted';
[['m','m'],['e','e']].forEach(([a,b])=>{if(c[a]===false&&r[b]&&r[b].on){r[b].on=0;ch=true}});
if(r.ql){const want=c.q===false?0:(granted?1:r.ql.on);if(!!r.ql.on!==!!want){r.ql.on=want?1:0;ch=true}}   /* قيام الليل: كان الإشعار مفعّلًا افتراضيًا في azkar_nc بينما مفتاح الإعدادات مطفأ؛ نحفظ السلوك الفعلي لمن منحوا الإذن */['m','e','q'].forEach(a=>delete c[a]);c.mig=1;LS.s('azkar_nc',JSON.stringify(c));if(ch)try{AZ.save()}catch(e){}return ch}catch(e){return false}}
/* ورد الصباح/الليل (qm/qe): إشعار واحد في الوقت الثابت لكل يوم من الأفق، يُتخطّى إن اكتمل النوع */
const qx=(T,now,c,ctx)=>{const r=rem(),out=[],off=(ctx&&ctx.off)||0;['qm','qe'].forEach(k=>{const o=r[k];if(!o||!o.on)return;const p=String(o.t||'').split(':'),h=+p[0],mi=+p[1];if(!isFinite(h)||!isFinite(mi)||p.length!==2)return;const d=new Date();d.setDate(d.getDate()+off);d.setHours(h,mi,0,0);const at=+d;if(at<=now||doneK(k,dk(at)))return;
  let body='';try{body=typeof RT==='function'?RT(k):''}catch(e){}let title=k==='qm'?'ورد الصباح':'ورد الليل';try{if(typeof RNM!=='undefined'&&RNM[k])title=RNM[k]}catch(e){}
  out.push({id:k+'-0',at,title,body:body||title,go:k,kind:k})});return out};
const dk=d=>AZ.day.key(+new Date(d)),doneK=(k,key)=>{try{return !!(window.AZ&&AZ.isDone&&AZ.isDone(k,key))}catch(e){return false}},done=(k,ts)=>doneK(k,dk(ts));
/* AZKAR_markDone: لم تعد تكتب حالة منفصلة. الحالة الوحيدة هي حالة التطبيق (AZ.isDone)، وهذه الدالة مجرد مُحفِّز: تغلق ما عُرض من إشعارات اكتمل نوعه وتعيد الجدولة */
let mdT=0;window.AZKAR_markDone=function(){clearTimeout(mdT);mdT=setTimeout(async()=>{try{const r=await reg(),l=await r.getNotifications();l.forEach(x=>{const t=String(x.tag||''),k=t.split('-')[0],key=t.split('@')[1];if(['m','e','q','qm','qe'].includes(k)&&key&&doneK(k,key))x.close()})}catch(e){}schedule()},1200)};
/* ---------- pure planner ---------- */
function minOf(at,tz){try{const o={};new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:tz||undefined}).formatToParts(new Date(at)).forEach(x=>{if(x.type!=='literal')o[x.type]=+x.value});return(o.hour%24)*60+o.minute}catch(e){const d=new Date(at);return d.getHours()*60+d.getMinutes()}}
function inQuiet(at,q,tz){if(!q)return false;const m=minOf(at,tz),a=q[0],b=q[1];if(a===b)return false;return a>b?(m>=a||m<b):(m>=a&&m<b)}
function plan(now,T,third,c,friday,ctx){ctx=ctx||{};const out=[],M=6e4,sk=ctx.skipped||[],RT=c.tone==='fusha'?RF:R;
 const add=(id,at,t,b,go,kind)=>{if(!at||+at<=now)return;const key=dk(+at);id=id+'@'+key;if(inQuiet(+at,c.qh,ctx.tz)&&((kind!=='p'&&kind!=='pre')||c.qa)){sk.push({id,kind,at:+at,skipped:'quiet'});return}out.push({id,at:+at,title:tr(t),body:tr(b),go,kind})};
 if(!c.on)return out;
 for(const k of Object.keys(PN)){if(!T[k])continue;const h=(k==='dhuhr'&&friday)?H.jum:H[k];
  if(c.p[k])add('p-'+k,T[k],h[0],h[1],k==='dhuhr'&&friday?'jum':k,'p');
  if(c.pre&&c.p[k])add('pre-'+k,+T[k]-10*M,'اقترب وقت '+PN[k],'بعد ١٠ دقائق إن شاء الله','','pre')}
 const g1=Math.min(240,Math.max(15,+c.g1||60)),g2=Math.max(g1+15,Math.min(360,+c.g2||120));   /* سلّم العتاب: g1 ≥ 15د وg2 > g1 دائمًا */
 const ladder=(kind,base,offs,txt,go,lim)=>{if(!base)return;const key=dk(+base);offs.slice(0,c.esc?offs.length:1).forEach((o,i)=>{const at=+base+o*M;if(at<=now)return;if(lim&&i>0&&at>=lim){sk.push({id:kind+'-'+i+'@'+key,kind,at,skipped:'window'});return}   /* لا عتاب خارج نافذة النوع */if(doneK(kind,key)){sk.push({id:kind+'-'+i+'@'+key,kind,at,skipped:'done'});return}add(kind+'-'+i,at,txt[0],txt[i+1],go||kind,kind)})};
 const rb=k=>{try{const d=window.AZ&&AZ.times&&AZ.times.resolve(k,ctx.off||0);if(d)return +d}catch(e){}return null};   /* مرساة واحدة: نفس موعد الإعدادات ونوافذ الرئيسية */
 if(c.m){let b=rb('m');if(b==null){b=T.fajr&&+T.fajr+30*M;if(b&&T.sunrise&&b>+T.sunrise-5*M)b=+T.sunrise-5*M}ladder('m',b,[0,g1,g2],RT.m,null,T.dhuhr?+T.dhuhr:null)}
 if(c.e){let b=rb('e');if(b==null)b=T.asr&&+T.asr+30*M;ladder('e',b,[0,g1,g2],RT.e)}
 if(c.q)ladder('q',third,[0,45],RT.q,'night');
 try{const q=window.__qd&&window.__qd.notifPlan&&window.__qd.notifPlan(T,now);(q||[]).forEach(x=>add(x.id,x.at,x.title,x.body,x.go,'qd'))}catch(e){}
 try{((window.__nf&&window.__nf.extra)||[]).forEach(f=>{try{(f(T,now,c,ctx)||[]).forEach(x=>add(x.id,x.at,x.title,x.body,x.go,x.kind||'x'))}catch(e){}})}catch(e){}
 return out.sort((a,b)=>a.at-b.at)}
/* ---------- delivery (real system notifications) ---------- */
const LOGK='azkar_nlog',log=(o)=>{let a=[];try{a=JSON.parse(LS.g(LOGK)||'[]')}catch(e){}a.push(Object.assign({t:Date.now()},o));LS.s(LOGK,JSON.stringify(a.slice(-60)))};
const reg=()=>navigator.serviceWorker?navigator.serviceWorker.ready:Promise.reject('no-sw');
const HK='azkar_nhist',hist=()=>{try{return JSON.parse(LS.g(HK)||'{}')}catch(e){return{}}},hsave=h=>{const cut=Date.now()-7*864e5;Object.keys(h).forEach(k=>{if(h[k].at<cut)delete h[k]});LS.s(HK,JSON.stringify(h))};
async function fire(n,scheduledAt){const h=hist();try{
  if(['m','e','q','qm','qe'].includes(n.kind)&&done(n.kind,n.at)){h[n.id]=Object.assign(h[n.id]||{k:n.kind,at:n.at},{s:'done'});hsave(h);log({id:n.id,kind:n.kind,sched:scheduledAt||null,res:'skipped:done',path:'timer'});return}   /* دفاع ثانٍ: فحص الإتمام لحظة الإرسال */
  const r=await reg();await r.showNotification(n.title,{body:n.body,tag:n.id,data:{go:n.go||'',kind:n.kind},lang:'ar',dir:'rtl'});h[n.id]=Object.assign(h[n.id]||{k:n.kind,at:n.at},{f:Date.now()});hsave(h);log({id:n.id,kind:n.kind,sched:scheduledAt||null,fired:Date.now(),res:'shown',path:'timer'})}catch(e){log({id:n.id,kind:n.kind,sched:scheduledAt||null,res:'error:'+(e&&e.message||e)})}}
let timers=[],lastPlan=[],nextT=0;const trig=typeof TimestampTrigger!=='undefined';
const fri=(tz,off)=>{try{return new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:tz}).format(new Date(Date.now()+(off||0)*864e5))==='Fri'}catch(e){return new Date(Date.now()+(off||0)*864e5).getDay()===5}};
async function schedule(){timers.forEach(clearTimeout);timers=[];clearTimeout(nextT);const pt=window.__pt;if(!pt||!pt.compute||(typeof Notification==='undefined')||Notification.permission!=='granted'||!pt.loc()){lastPlan=[];return}
 const now=Date.now(),c=eff(),L=pt.loc(),out=[],skipped=[],fajrs=[];
 for(let off=0;off<=2;off++){let P=null;try{P=off===0?pt.compute():pt.computeFor(off)}catch(e){}if(!P||!P.T)continue;if(P.T.fajr)fajrs.push(+P.T.fajr);
  out.push(...plan(now,P.T,P.third,c,off===0?fri(L.tz,0):P.dayOfWeek===5,{tz:L.tz,skipped,off}))}
 const seen={};lastPlan=out.filter(n=>seen[n.id]?false:(seen[n.id]=1)).sort((a,b)=>a.at-b.at);
 const h=hist();lastPlan.forEach(n=>{if(!h[n.id])h[n.id]={k:n.kind,at:n.at}});skipped.forEach(x=>{if(!h[x.id])h[x.id]={k:x.kind,at:x.at,s:x.skipped};else if(!h[x.id].s&&!h[x.id].f)h[x.id].s=x.skipped});hsave(h);
 for(const n of lastPlan){if(trig){try{const r=await reg();await r.showNotification(n.title,{body:n.body,tag:n.id,data:{go:n.go,kind:n.kind},showTrigger:new TimestampTrigger(n.at)});log({id:n.id,kind:n.kind,sched:n.at,res:'trigger-set',path:'trigger'});continue}catch(e){}}
  if(n.at-now<2147e6)timers.push(setTimeout(()=>fire(n,n.at),n.at-now))}
 const nf=fajrs.filter(x=>x>now).sort((a,b)=>a-b)[0];if(nf)nextT=setTimeout(schedule,Math.min(nf-now+5e3,2147e6))}   /* حدّ اليوم الأذكاري (الفجر) يعيد الجدولة */
function missed(){try{if(typeof Notification==='undefined'||Notification.permission!=='granted')return;const last=+LS.g('azkar_nlast')||0,now=Date.now(),h=hist();LS.s('azkar_nlast',String(now));if(!last)return;
 const n=Object.keys(h).filter(k=>{const x=h[k];return x.at>last&&x.at<now-6e4&&!x.f&&!x.s&&['m','e','q','qm','qe','p'].includes(x.k)}).length;if(n>0&&typeof toast==='function')toast(tr('فاتتك تنبيهات أثناء إغلاق التطبيق')+': '+n+' — '+tr('الإشعارات المحلية تعمل ما دام التطبيق حيًّا'))}catch(e){}}
/* ---------- opening from a notification ---------- */
function handle(go){if(!go)return;try{if(H[go]){const h=H[go],o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:9800;background:#000b;display:flex;align-items:center;justify-content:center;padding:20px';o.innerHTML='<div class="card" style="max-width:420px;text-align:center"><h2>'+h[0]+'</h2><p class="sq">'+h[1]+'</p><div class="src"><span>المصدر:</span> <span>'+h[2]+'</span></div><button class="btn main" style="margin-top:10px">إغلاق</button></div>';o.onclick=e=>{if(e.target===o||e.target.tagName==='BUTTON')o.remove()};document.body.appendChild(o)}
 else if(go==='qada'){try{LS.s('azkar_pt_sub','q');const b=$('nav button[data-v="pt"]');if(b)b.click()}catch(e){}}else if(window.AZ&&AZ.openGo)AZ.openGo(go)}catch(e){}}
function bootNav(){const q=new URLSearchParams(location.search).get('n');if(q){let t=0;const iv=setInterval(()=>{if(window.__booted||++t>60){clearInterval(iv);setTimeout(()=>handle(q),500)}},200);try{history.replaceState(null,'',location.pathname)}catch(e){}}
 if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='notif')handle(e.data.go)})}
/* المطر: مصدر واحد في index.html (checkRain يجلب ويحفظ azkar_wx ويعرض «دعاء المطر» في الرسالة الذكية)؛ لا جلب ولا بطاقة ثانية هنا. */
/* ---------- settings card + diagnostics ---------- */
async function card(){const m=$('#mc');if(!m||$('#nfs',m))return;const c=cfg(),rd=window.__rd?await window.__rd.state():{},d=document.createElement('div');d.id='nfs';d.className='grp';
 const tg=(id,l,on)=>'<div class="rw"><span>'+l+'</span><input type="checkbox" class="ios" data-n="'+id+'" '+(on?'checked':'')+' aria-label="'+l+'"></div>';
 const ck=(ok,l,n)=>'<div class="src">'+(ok?'✅':'⚠️')+' <span>'+l+'</span>'+(n==null?'':' <b>'+n+'</b>')+'</div>';
 d.innerHTML='<div class="gl">الإشعارات</div>'+tg('on','تشغيل الإشعارات',c.on)+'<div class="src">تفعيل تذكيرات الأذكار والورد وقيام الليل وأوقاتها من قسم «التذكيرات» في الإعدادات.</div>'+tg('esc','الإشعارات التصاعدية (عتاب لطيف)',c.esc)+'<div class="rw"><span>نبرة التذكير</span><select id="ntone" aria-label="نبرة التذكير"><option value="amiya"'+(c.tone!=='fusha'?' selected':'')+'>لطيفة (عامية)</option><option value="fusha"'+(c.tone==='fusha'?' selected':'')+'>فصحى</option></select></div>'+tg('pre','إشعار قبل الأذان بـ ١٠ دقائق',c.pre)
  +Object.keys(PN).map(k=>tg('p.'+k,'أذان '+PN[k],c.p[k])).join('')
  +'<div class="rw"><span>ساعات الهدوء (من / إلى)</span><span><input type="time" id="nq1" value="'+(c.qh?String(c.qh[0]/60|0).padStart(2,'0')+':'+String(c.qh[0]%60).padStart(2,'0'):'')+'"> <input type="time" id="nq2" value="'+(c.qh?String(c.qh[1]/60|0).padStart(2,'0')+':'+String(c.qh[1]%60).padStart(2,'0'):'')+'"></span></div>'
  +tg('qa','ساعات الهدوء تشمل الأذان',c.qa)+'<div class="gl">جاهزية الإشعارات</div>'+ck(rd.installed,'مثبّت على الشاشة الرئيسية')+ck(rd.notif==='granted','إذن الإشعارات')+ck(rd.geo==='granted','إذن الموقع')+ck(rd.sw,'Service Worker نشط')+ck(lastPlan.length>0,'إشعارات مجدولة:',lastPlan.length)
  +'<div class="src">'+(trig?'الجدولة بالـ Triggers متاحة.':'الجدولة تعمل ما دام التطبيق حيًّا في الخلفية؛ الإشعار المضمون والتطبيق مغلق يحتاج Web Push (خادم).')+'</div>'
  +'<div class="row"><button class="btn" id="nt">اختبار بعد 10 ثواني</button></div>'
  +'<details><summary>شاشة الاختبار (Diagnostics)</summary><pre id="ndg" style="white-space:pre-wrap;direction:ltr;font-size:.7rem"></pre></details>';
 m.appendChild(d);
 const refresh=()=>{let P=null;try{P=window.__pt.compute()}catch(e){}$('#ndg',d).textContent=JSON.stringify({permissions:rd,location:JSON.parse(LS.g('azkar_loc')||'null'),prayerTimes:P&&{T:P.T,third:P.third},weather:JSON.parse(LS.g('azkar_wx')||'null'),scheduled:lastPlan.map(n=>({id:n.id,kind:n.kind,at:new Date(n.at).toISOString()})),reliability7d:(()=>{const h=hist(),o={};Object.values(h).forEach(x=>{const d=new Date(x.at).toISOString().slice(0,10);o[d]=o[d]||{planned:0,fired:0,skippedDone:0,skippedQuiet:0,missed:0};const r=o[d];r.planned++;if(x.f)r.fired++;else if(x.s==='done')r.skippedDone++;else if(x.s==='quiet')r.skippedQuiet++;else if(x.at<Date.now()-6e4)r.missed++});return o})(),log:JSON.parse(LS.g(LOGK)||'[]').slice(-15)},null,1)};refresh();
 d.onchange=e=>{const t=e.target,n=t.dataset&&t.dataset.n,x=cfg();if(n){if(n.startsWith('p.'))x.p[n.slice(2)]=t.checked;else x[n]=t.checked}else if(t.id==='ntone'){x.tone=t.value}else if(t.id==='nq1'||t.id==='nq2'){const a=($('#nq1',d).value||'').split(':'),b=($('#nq2',d).value||'').split(':');x.qh=(a.length===2&&b.length===2&&a[0]!==''&&b[0]!=='')?[+a[0]*60+ +a[1],+b[0]*60+ +b[1]]:null}else return;save(x);schedule().then(refresh)};
 $('#nt',d).onclick=async()=>{if(typeof Notification!=='undefined'&&Notification.permission!=='granted'){try{await Notification.requestPermission()}catch(e){}}const at=Date.now()+1e4;log({id:'test',sched:at,res:'queued'});setTimeout(()=>fire({id:'test',title:tr('اختبار أذكاري ✅'),body:tr('وصل الإشعار عبر نفس مسار الإشعارات الحقيقي.'),go:''},at).then(refresh),1e4)}}
function init(){try{bootNav();if(typeof openSet==='function'){const o=openSet;window.openSet=function(){const r=o.apply(this,arguments);card();return r}}setTimeout(()=>{migrateNc();missed();schedule()},2500);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});window.addEventListener('azkar:times',()=>{setTimeout(schedule,300)});window.addEventListener('times:changed',()=>{setTimeout(schedule,300)})}catch(e){console.warn('[notify]',e)}}
const covers=k=>{const c=eff(),r=rem();return !!(c.on&&typeof Notification!=='undefined'&&Notification.permission==='granted'&&((k==='m'&&c.m)||(k==='e'&&c.e)||(k==='ql'&&c.q)||((k==='qm'||k==='qe')&&r[k]&&r[k].on)))};
window.__nf={plan,cfg,eff,migrateNc,DEF,H,R,RF,inQuiet,covers,schedule,extra:[qx]};
if(typeof document!=='undefined'&&document.body)init();
})();
