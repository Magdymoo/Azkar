/* أذكاري v1.8.1 — local prayer-time engine (no CDN, no network) + prayer tab UI + post-prayer adhkar counter.
   Astronomy: low-precision solar position (accuracy ≈ 1 min). NOTE: adhan-js could not be bundled in the build
   environment (no network), so this is an equivalent in-repo implementation. Verify against your local timetable. */
(function(){'use strict';
const R=Math.PI/180,sin=x=>Math.sin(x*R),cos=x=>Math.cos(x*R),tan=x=>Math.tan(x*R),asin=x=>Math.asin(x)/R,acos=x=>Math.acos(x)/R,atan=x=>Math.atan(x)/R,fix=(x,m)=>x-m*Math.floor(x/m);
const METHODS={egyptian:{n:'الهيئة المصرية العامة للمساحة',f:19.5,i:17.5},mwl:{n:'رابطة العالم الإسلامي',f:18,i:17},ummalqura:{n:'أم القرى',f:18.5,im:90},karachi:{n:'جامعة العلوم الإسلامية - كراتشي',f:18,i:18},isna:{n:'أمريكا الشمالية (ISNA)',f:15,i:15}};
const CITIES=[['القاهرة',30.0444,31.2357,'Africa/Cairo'],['الإسكندرية',31.2001,29.9187,'Africa/Cairo'],['مكة المكرمة',21.3891,39.8579,'Asia/Riyadh'],['المدينة المنورة',24.4672,39.6111,'Asia/Riyadh'],['الرياض',24.7136,46.6753,'Asia/Riyadh'],['دبي',25.2048,55.2708,'Asia/Dubai'],['عمّان',31.9454,35.9284,'Asia/Amman'],['إسطنبول',41.0082,28.9784,'Europe/Istanbul'],['لندن',51.5072,-0.1276,'Europe/London'],['طرابلس',32.8872,13.1913,'Africa/Tripoli','mwl'],['بنغازي',32.1167,20.0667,'Africa/Tripoli','mwl'],['مصراتة',32.3754,15.0925,'Africa/Tripoli','mwl'],['سبها',27.0377,14.4283,'Africa/Tripoli','mwl'],['البيضاء',32.7627,21.7551,'Africa/Tripoli','mwl'],['طبرق',32.0836,23.9764,'Africa/Tripoli','mwl'],['سرت',31.2089,16.5887,'Africa/Tripoli','mwl'],['الزاوية',32.7571,12.7276,'Africa/Tripoli','mwl'],['زليتن',32.4674,14.5687,'Africa/Tripoli','mwl'],['درنة',32.767,22.6367,'Africa/Tripoli','mwl']];
/* ليبيا (LY, Africa/Tripoli, UTC+2 بلا توقيت صيفي): الطريقة الافتراضية = رابطة العالم الإسلامي (فجر ١٨° / عشاء ١٧°) — يحتاج مراجعة مع تقويم وزارة الأوقاف المحلي؛ يمكن تغييرها من «طريقة الحساب». */;
function sun(ts){const n=ts/864e5+2440587.5-2451545,L=fix(280.46+0.9856474*n,360),g=fix(357.528+0.9856003*n,360),lam=L+1.915*sin(g)+0.02*sin(2*g),eps=23.439-4e-7*n,dec=asin(sin(eps)*sin(lam));let ra=fix(Math.atan2(cos(eps)*sin(lam),cos(lam))/R/15,24),eqt=fix(L/15-ra+12,24)-12;return{dec,eqt}}
function times(y,m,d,lat,lng,M){const{dec,eqt}=sun(Date.UTC(y,m,d,12)-lng/15*36e5),noon=12-lng/15-eqt,
 ang=a=>{const c=(sin(a)-sin(lat)*sin(dec))/(cos(lat)*cos(dec));return c<-1||c>1?NaN:acos(c)/15},base=Date.UTC(y,m,d),T=h=>isNaN(h)?null:new Date(base+h*36e5),
 asr=atan(1/(1+tan(Math.abs(lat-dec)))),mg=noon+ang(-0.833);
 return{fajr:T(noon-ang(-M.f)),sunrise:T(noon-ang(-0.833)),dhuhr:T(noon),asr:T(noon+ang(asr)),maghrib:T(mg),isha:M.im?T(mg+M.im/60):T(noon+ang(-M.i))}}
function lastThird(y,m,d,lat,lng,M,now){const t=times(y,m,d,lat,lng,M),n=times(y,m,d+1,lat,lng,M),p=times(y,m,d-1,lat,lng,M);
 const [mg,fj]=(now&&t.fajr&&now<t.fajr)?[p.maghrib,t.fajr]:[t.maghrib,n.fajr];return mg&&fj?new Date(mg.getTime()+(fj-mg)*2/3):null}
/* ---------- state ---------- */
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const LS={g(k){try{return localStorage.getItem(k)}catch(e){return null}},s(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const loc=()=>{try{return JSON.parse(LS.g('azkar_loc'))}catch(e){return null}},method=()=>{const l=loc();return METHODS[LS.g('azkar_pmethod')]||(l&&METHODS[l.dm])||METHODS.egyptian};
const A=n=>typeof ar==='function'?ar(n):String(n);
const fmt=(d,tz)=>{if(!d)return '--';let s=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:tz}).format(d);if(typeof LANG==='undefined'||LANG==='ar')s=s.replace('AM','ص').replace('PM','م');return A(s)};
function today(tz){const p=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),o={};p.forEach(x=>o[x.type]=+x.value);return o}
function compute(){const L=loc();if(!L)return null;const M=method(),t=today(L.tz),T=times(t.year,t.month-1,t.day,L.lat,L.lng,M),now=new Date();
 const nx=times(t.year,t.month-1,t.day+1,L.lat,L.lng,M);return{L,T,tomorrowFajr:nx.fajr,third:lastThird(t.year,t.month-1,t.day,L.lat,L.lng,M,now)}}
function next(c){const now=Date.now();for(const k of['fajr','dhuhr','asr','maghrib','isha'])if(c.T[k]&&c.T[k]>now)return[k,c.T[k]];return['fajr',c.tomorrowFajr]}
const NM={fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
function ramadan(){try{return typeof HOK!=='undefined'&&HOK&&hij(new Date()).month===9}catch(e){return false}}
function syncNight(c){try{const h=d=>{const p=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:c.L.tz}).format(d);return p};if(c.T.isha)LS.s('azkar_isha',h(c.T.isha));if(c.T.fajr)LS.s('azkar_fajr',h(c.T.fajr))}catch(e){}}
/* ---------- tab UI ---------- */
let tick=0;const subT=()=>'<div id="ptSub" role="group" aria-label="الصلاة"><button data-sub="t" class="'+(subV()==='t'?'on':'')+'" aria-pressed="'+(subV()==='t')+'">الأذان والمواقيت</button><button data-sub="q" class="'+(subV()==='q'?'on':'')+'" aria-pressed="'+(subV()==='q')+'">الفوائت</button></div>',subV=()=>LS.g('azkar_pt_sub')==='q'&&window.__qd?'q':'t';
function view(){const v=$('#v-pt');if(!v)return;if(subV()==='q'){v.innerHTML=subT()+'<div id="qdRoot"></div>';window.__qd.mount($('#qdRoot',v));return}const c=compute();let h='<div class="card"><h2>مواقيت الصلاة</h2>';
 h+='<div class="row"><button class="btn main" id="ptGps">📍 تحديد موقعي</button><select id="ptCity" aria-label="المدينة"><option value="">اختر مدينة…</option>'+CITIES.map((x,i)=>'<option value="'+i+'">'+x[0]+'</option>').join('')+'</select></div><div class="rw"><span>طريقة الحساب</span><select id="ptM" aria-label="طريقة الحساب">'+Object.keys(METHODS).map(k=>'<option value="'+k+'"'+(METHODS[k]===method()?' selected':'')+'>'+METHODS[k].n+'</option>').join('')+'</select></div></div>';
 if(!c)h+='<div class="card src">حدّد موقعك (أو اختر مدينة) لعرض المواقيت.</div>';
 else{const[k,t]=next(c);syncNight(c);if(c.L.dm&&!LS.g('azkar_pmethod'))h+='<div class="card src"><span>الطريقة الافتراضية لهذه المدينة:</span> <b>'+method().n+'</b> <span>— يمكنك تغييرها من «طريقة الحساب».</span></div>';h+='<div class="card" style="text-align:center"><div class="src"><span>'+c.L.name+'</span> — <span>'+method().n+'</span></div><div>الصلاة القادمة: <b>'+NM[k]+'</b> '+fmt(t,c.L.tz)+'</div><div id="ptCd" style="font-size:2rem;font-variant-numeric:tabular-nums" data-t="'+t.getTime()+'"></div></div><div class="card">'
  +['fajr','sunrise','dhuhr','asr','maghrib','isha'].map(x=>'<div class="rw"><span>'+NM[x]+'</span><b>'+fmt(c.T[x],c.L.tz)+'</b></div>').join('')
  +'<div class="rw"><span>الثلث الأخير من الليل (بدايته)</span><b>'+fmt(c.third,c.L.tz)+'</b></div>'+(ramadan()?'<div class="rw"><span>السحور (ينتهي عند الفجر)</span><b>'+fmt(c.T.fajr,c.L.tz)+'</b></div>':'')+'</div>'}
 h+='<div class="card"><button class="btn main" id="paGo" style="width:100%">أذكار بعد الصلاة (بعدّاد تلقائي)</button></div>';v.innerHTML=subT()+h;cd()}
function cd(){const e=$('#ptCd');if(!e)return;let s=Math.max(0,Math.floor((+e.dataset.t-Date.now())/1e3));const p=n=>String(n).padStart(2,'0');e.textContent=A(p(Math.floor(s/3600))+':'+p(Math.floor(s%3600/60))+':'+p(s%60));if(s===0)setTimeout(view,1500)}
function onView(e){const t=e.target;const sb=t.closest&&t.closest('[data-sub]');if(sb){LS.s('azkar_pt_sub',sb.dataset.sub);return view()}if(t.id==='ptGps')return gps();if(t.id==='paGo')return openPA();}
function gps(){const b=$('#ptGps');if(!navigator.geolocation){if(typeof toast==='function')toast('الموقع غير مدعوم، اختر مدينة');return}b.textContent='جارٍ تحديد الموقع…';
 navigator.geolocation.getCurrentPosition(p=>{LS.s('azkar_loc',JSON.stringify({lat:p.coords.latitude,lng:p.coords.longitude,name:'موقعي الحالي',tz:Intl.DateTimeFormat().resolvedOptions().timeZone}));LS.s('azkar_geo_ok','1');LS.s('azkar_geo_asked','1');try{window.__rd&&window.__rd.syncLoc()}catch(e){}view()},()=>{if(typeof toast==='function')toast('تعذّر تحديد الموقع، اختر مدينة يدويًا');view()},{timeout:10000,maximumAge:36e5})}
function initTab(){const nav=$('nav');if(!nav||$('#v-pt'))return;const b=document.createElement('button');b.dataset.v='pt';b.innerHTML='<b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg></b>الصلاة';nav.appendChild(b);
 const v=document.createElement('section');v.className='view';v.id='v-pt';($('#v-free')||$('#v-home')).after(v);
 b.onclick=()=>{$$('nav button').forEach(x=>x.classList.toggle('on',x===b));$$('.view').forEach(x=>x.classList.toggle('on',x.id==='v-pt'));scrollTo(0,0);view()};
 v.addEventListener('click',onView);v.addEventListener('change',e=>{const t=e.target;if(t.id==='ptCity'&&t.value!==''){const c=CITIES[+t.value];LS.s('azkar_loc',JSON.stringify({lat:c[1],lng:c[2],name:c[0],tz:c[3],dm:c[4]||null}));view()}if(t.id==='ptM'){LS.s('azkar_pmethod',t.value);view()}});
 setInterval(()=>{if(v.classList.contains('on'))cd()},1000)}
/* ---------- post-prayer adhkar (v1.9.5): card per dhikr, own counter, benefit + source, font size, progress ---------- */
const ST=[
{k:'الاستغفار',t:'أَسْتَغْفِرُ اللَّهَ',n:3,b:'أول ما يُقال بعد السلام من الصلاة، وقد فعله النبي ﷺ عقب كل صلاة.',s:'صحيح مسلم ٥٩١ — ثوبان رضي الله عنه — صحيح'},
{k:'دعاء السلام',t:'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',n:1,b:'كان النبي ﷺ لا يقعد بعد السلام إلا بمقدار ما يقول هذا الدعاء.',s:'صحيح مسلم ٥٩١ (ثوبان) و٥٩٢ (عائشة) رضي الله عنهما — صحيح'},
{k:'آية الكرسي',t:'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',n:1,b:'من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا الموت.',s:'السنن الكبرى للنسائي ٩٩٢٨ — أبو أمامة رضي الله عنه — صححه الألباني (يحتاج مراجعة)'},
{k:'التسبيح',t:'سُبْحَانَ اللَّهِ',n:33,b:'مع التحميد والتكبير ثلاثًا وثلاثين لكل منها: تسعة وتسعون، ثم تمام المئة بالتهليل.',s:'صحيح مسلم ٥٩٧ — أبو هريرة رضي الله عنه — صحيح'},
{k:'التحميد',t:'الْحَمْدُ لِلَّهِ',n:33,b:'مع التسبيح والتكبير ثلاثًا وثلاثين لكل منها: تسعة وتسعون، ثم تمام المئة بالتهليل.',s:'صحيح مسلم ٥٩٧ — أبو هريرة رضي الله عنه — صحيح'},
{k:'التكبير',t:'اللَّهُ أَكْبَرُ',n:33,b:'مع التسبيح والتحميد ثلاثًا وثلاثين لكل منها: تسعة وتسعون، ثم تمام المئة بالتهليل.',s:'صحيح مسلم ٥٩٧ — أبو هريرة رضي الله عنه — صحيح'},
{k:'تمام المئة',t:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',n:1,b:'من قالها تمام المئة غُفرت خطاياه وإن كانت مثل زبد البحر.',s:'صحيح مسلم ٥٩٧ — أبو هريرة رضي الله عنه — صحيح'}];
const FSK='azkar_pa_fs',fsGet=()=>Math.min(36,Math.max(20,+LS.g(FSK)||24)),reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
let pa=null;const vib=p=>{if(LS.g('azkar_vib')!=='0')try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const escH=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function openPA(){if(pa)return;const el=document.createElement('div');el.id='pa';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','أذكار بعد الصلاة');document.body.appendChild(el);document.body.style.overflow='hidden';pa={el,c:ST.map(()=>0),a:0,fs:fsGet(),all:false};el.addEventListener('click',paClick);paRender(true)}
function paClose(){if(!pa)return;const s=pa;pa=null;s.el.removeEventListener('click',paClick);s.el.remove();document.body.style.overflow=''}
const isDone=(s,i)=>s.c[i]>=ST[i].n,nextOpen=(s,from)=>{for(let k=1;k<=ST.length;k++){const j=(from+k)%ST.length;if(!isDone(s,j))return j}return -1};
function paClick(e){const s=pa;if(!s||e.currentTarget!==s.el)return;const b=e.target.closest&&e.target.closest('[data-p]');if(!b)return;const a=b.dataset.p,i=+b.dataset.i;let adv=false;
 if(a==='x')return paClose();
 if(a==='v'){LS.s('azkar_vib',LS.g('azkar_vib')==='0'?'1':'0');return paRender()}
 if(a==='fp'||a==='fm'){s.fs=Math.min(36,Math.max(20,s.fs+(a==='fp'?2:-2)));LS.s(FSK,String(s.fs));return paRender()}
 if(a==='r'){s.c=ST.map(()=>0);s.a=0;s.all=false;adv=true}
 else if(a==='s'){if(!isDone(s,i)){s.a=i;adv=true}}
 else if(a==='z'){s.c[i]=0;s.a=i;s.all=false;adv=true}
 else if(a==='u'){const j=s.c[s.a]>0?s.a:Math.max(0,s.a-1);if(s.c[j]>0){const pv=s.a;s.c[j]--;s.a=j;s.all=false;vib(10);adv=j!==pv}}
 else if(a==='t'&&!s.all){const st=ST[s.a];s.c[s.a]++;if(s.c[s.a]>=st.n){const last=s.a,nx=nextOpen(s,last);if(nx<0){s.all=true;vib([200,100,200,100,300]);if(typeof toast==='function')toast('تقبّل الله طاعتك ✨')}else{vib([60,40,60]);s.a=nx;adv=true}}else vib(12)}
 paRender(adv)}
function paRender(scroll){const s=pa;if(!s)return;const on=LS.g('azkar_vib')!=='0',tot=ST.reduce((m,x)=>m+x.n,0),dn=ST.reduce((m,x,i)=>m+Math.min(s.c[i],x.n),0),pc=Math.round(dn*100/tot),old=$('.paL',s.el),keep=old?old.scrollTop:0,cur=ST[s.a];
 let h='<div class="paH"><button class="skb" data-p="x" aria-label="إغلاق">إغلاق</button><span class="paT2">أذكار بعد الصلاة</span><span class="paFB"><button class="skb sm" data-p="fm" aria-label="تصغير الخط">أ−</button><button class="skb sm" data-p="fp" aria-label="تكبير الخط">أ+</button></span></div>'
 +'<div class="paPg" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pc+'"><i style="width:'+pc+'%"></i></div><div class="paPt"><span>'+A(pc)+'٪</span><button class="skb sm" data-p="v">'+(on?'اهتزاز: مفعّل':'اهتزاز: متوقف')+'</button></div>'
 +'<div class="paL" style="--fs:'+s.fs+'px">'+(s.all?'<div class="paOk"><h2>تمّت أذكار ما بعد الصلاة</h2><button class="btn main" data-p="r">إعادة</button></div>':'')
 +ST.map((x,i)=>{const d=isDone(s,i),ac=i===s.a&&!s.all;return '<section class="pac'+(d?' dn':'')+(ac?' ac':'')+'" data-i="'+i+'" data-p="s"><div class="paR"><span class="paN">'+(d?'✓':A(i+1))+'</span><b>'+x.k+'</b><span class="paK">'+(d?'<em>تم</em>':A(Math.min(s.c[i],x.n))+' / '+A(x.n))+'</span></div><p class="paQ">'+x.t+'</p><div class="paB2"><span class="paBl">فائدة الذكر</span><span class="paBt">'+x.b+'</span></div><div class="paS"><span>المصدر:</span> <span>'+x.s+'</span></div>'+(d?'<button class="skb sm" data-p="z" data-i="'+i+'">إعادة هذا الذكر</button>':'')+'</section>'}).join('')+'</div>'
 +'<div class="paF"><button class="skb" data-p="u" aria-label="تراجع">تراجع</button><button class="paBig" data-p="t"'+(s.all?' disabled':'')+' aria-label="اضغط للعدّ">'+(s.all?'تم':'<b>'+A(s.c[s.a])+' / '+A(cur.n)+'</b><small>اضغط للعدّ</small>')+'</button></div>';
 s.el.innerHTML=h;const L=$('.paL',s.el);if(L)L.scrollTop=keep;
 if(scroll){const c=$('.pac.ac',s.el);if(c&&c.scrollIntoView)requestAnimationFrame(()=>c.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'}))}}
function css(){const s=document.createElement('style');s.textContent=`
#pa{--bg:#10282c;--cd:#1b3d41;--bn:#153436;--tx:#f4f8f5;--mu:#cfe4dc;--go:#e6c97a;--ok:#8fe0b0;--ln:#3d6468;position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#10282c,#183a3c);color:var(--tx);display:flex;flex-direction:column;font-family:Cairo,system-ui,sans-serif;-webkit-user-select:none;user-select:none}
#pa *{box-sizing:border-box}
#pa .paH{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 6px}
#pa .paT2{color:var(--go);font-weight:700;font-size:1.1rem}
#pa .paFB{display:flex;gap:6px}
#pa .skb{background:#2b4a4d;color:var(--tx);border:1.5px solid var(--ln);border-radius:12px;padding:9px 14px;font:inherit;min-height:44px;min-width:44px}
#pa .skb.sm{padding:6px 12px}
#pa .paPg{height:8px;margin:2px 16px;background:#0b1d20;border-radius:6px;overflow:hidden;border:1px solid var(--ln)}
#pa .paPg i{display:block;height:100%;background:var(--go);transition:width .3s ease}
#pa .paPt{display:flex;justify-content:space-between;align-items:center;padding:4px 16px 4px;color:var(--mu);font-variant-numeric:tabular-nums}
#pa .paL{flex:1;overflow-y:auto;padding:6px 14px 18px;-webkit-overflow-scrolling:touch}
#pa .pac{background:var(--cd);border:1.5px solid var(--ln);border-radius:18px;padding:12px 14px;margin:10px 0;opacity:.92;transition:border-color .25s,opacity .25s}
#pa .pac.ac{border-color:var(--go);opacity:1;box-shadow:0 0 0 2px rgba(230,201,122,.25)}
#pa .pac.dn{opacity:.8}
#pa .paR{display:flex;align-items:center;gap:10px;color:var(--mu)}
#pa .paR b{flex:1;color:var(--tx);font-size:1.05rem}
#pa .paN{min-width:30px;height:30px;border-radius:50%;background:var(--bn);color:var(--go);display:inline-flex;align-items:center;justify-content:center;font-weight:700}
#pa .dn .paN{color:var(--ok)}#pa .paK{font-variant-numeric:tabular-nums;color:var(--mu)}#pa .paK em{font-style:normal;color:var(--ok);font-weight:700}
#pa .paQ{font-family:Amiri,'Noto Naskh Arabic','Scheherazade New','Traditional Arabic','Geeza Pro',serif;font-size:var(--fs,24px);line-height:2.1;color:var(--tx);text-align:center;margin:8px 0}
#pa .paB2{background:var(--bn);border-radius:12px;padding:10px 12px;line-height:1.9}
#pa .paBl{display:block;color:var(--go);font-weight:700;font-size:.9rem}
#pa .paBt{color:#e3efe9;font-size:.98rem}
#pa .paS{color:var(--mu);font-size:.9rem;line-height:1.9;margin-top:8px}
#pa .pac .skb{margin-top:8px}
#pa .paOk{text-align:center;padding:14px;margin:6px 0;border:1.5px solid var(--ok);border-radius:18px;background:var(--bn)}
#pa .paOk h2{color:var(--ok);margin:0 0 10px}
#pa .paF{display:flex;gap:10px;align-items:stretch;padding:10px 14px calc(12px + env(safe-area-inset-bottom,0px));background:#0d2124;border-top:1px solid var(--ln)}
#pa .paBig{flex:1;min-height:72px;border:0;border-radius:18px;background:var(--go);color:#1d1a10;font:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
#pa .paBig b{font-size:1.9rem;font-variant-numeric:tabular-nums}#pa .paBig small{font-size:.85rem}
#pa .paBig:disabled{background:#2b4a4d;color:var(--tx)}
#pa button:focus-visible{outline:3px solid var(--go);outline-offset:2px}
@media (prefers-reduced-motion:reduce){#pa *{transition:none!important;animation:none!important}}
#v-pt select{max-width:100%;font:inherit;padding:8px;border-radius:10px}`;document.head.appendChild(s)}
/* ---------- tones: exact (case-sensitive) paths + diagnostics ---------- */
function toneDiag(){$$('#mc [data-tone]').forEach(r=>{const id=r.dataset.tone;if(!/^t\d$/.test(id)||typeof TONES==='undefined')return;const T=TONES.find(x=>x.id===id);if(!T)return;fetch(T.f,{method:'HEAD'}).then(x=>{const n=+x.headers.get('content-length')||0,sp=$('span',r);if(sp)sp.insertAdjacentHTML('beforeend','<small style="opacity:.7;display:block">'+(x.ok?'✓ '+(n?(n/1048576).toFixed(2)+' م.ب'+(n>1.5e6?' — كبير، يُفضّل تحويله إلى mp3/m4a':''):'موجود'):'✗ الملف غير موجود ('+x.status+')')+'</small>')}).catch(()=>{})})}
function init(){try{css();initTab();if(typeof openTones==='function'){const o=openTones;window.openTones=function(){const r=o.apply(this,arguments);setTimeout(toneDiag,0);return r}}}catch(e){console.warn('[prayer]',e)}}
window.__pt={times,lastThird,METHODS,compute,ST};
if(typeof document!=='undefined'&&document.body)init();
})();
