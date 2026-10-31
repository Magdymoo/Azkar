/* أذكاري v1.8.1 — local prayer-time engine (no CDN, no network) + prayer tab UI + post-prayer adhkar counter.
   Astronomy: low-precision solar position (accuracy ≈ 1 min). NOTE: adhan-js could not be bundled in the build
   environment (no network), so this is an equivalent in-repo implementation. Verify against your local timetable. */
(function(){'use strict';
const R=Math.PI/180,sin=x=>Math.sin(x*R),cos=x=>Math.cos(x*R),tan=x=>Math.tan(x*R),asin=x=>Math.asin(x)/R,acos=x=>Math.acos(x)/R,atan=x=>Math.atan(x)/R,fix=(x,m)=>x-m*Math.floor(x/m);
const METHODS={egyptian:{n:'الهيئة المصرية العامة للمساحة',f:19.5,i:17.5},mwl:{n:'رابطة العالم الإسلامي',f:18,i:17},ummalqura:{n:'أم القرى',f:18.5,im:90},karachi:{n:'جامعة العلوم الإسلامية - كراتشي',f:18,i:18},isna:{n:'أمريكا الشمالية (ISNA)',f:15,i:15}};
const CITIES=[['القاهرة',30.0444,31.2357,'Africa/Cairo'],['الإسكندرية',31.2001,29.9187,'Africa/Cairo'],['مكة المكرمة',21.3891,39.8579,'Asia/Riyadh'],['المدينة المنورة',24.4672,39.6111,'Asia/Riyadh'],['الرياض',24.7136,46.6753,'Asia/Riyadh'],['دبي',25.2048,55.2708,'Asia/Dubai'],['عمّان',31.9454,35.9284,'Asia/Amman'],['إسطنبول',41.0082,28.9784,'Europe/Istanbul'],['لندن',51.5072,-0.1276,'Europe/London']];
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
const loc=()=>{try{return JSON.parse(LS.g('azkar_loc'))}catch(e){return null}},method=()=>METHODS[LS.g('azkar_pmethod')]||METHODS.egyptian;
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
let tick=0;
function view(){const v=$('#v-pt');if(!v)return;const c=compute();let h='<div class="card"><h2>مواقيت الصلاة</h2>';
 h+='<div class="row"><button class="btn main" id="ptGps">📍 تحديد موقعي</button><select id="ptCity" aria-label="المدينة"><option value="">اختر مدينة…</option>'+CITIES.map((x,i)=>'<option value="'+i+'">'+x[0]+'</option>').join('')+'</select></div><div class="rw"><span>طريقة الحساب</span><select id="ptM" aria-label="طريقة الحساب">'+Object.keys(METHODS).map(k=>'<option value="'+k+'"'+(METHODS[k]===method()?' selected':'')+'>'+METHODS[k].n+'</option>').join('')+'</select></div></div>';
 if(!c)h+='<div class="card src">حدّد موقعك (أو اختر مدينة) لعرض المواقيت.</div>';
 else{const[k,t]=next(c);syncNight(c);h+='<div class="card" style="text-align:center"><div class="src">'+c.L.name+' — '+method().n+'</div><div>الصلاة القادمة: <b>'+NM[k]+'</b> '+fmt(t,c.L.tz)+'</div><div id="ptCd" style="font-size:2rem;font-variant-numeric:tabular-nums" data-t="'+t.getTime()+'"></div></div><div class="card">'
  +['fajr','sunrise','dhuhr','asr','maghrib','isha'].map(x=>'<div class="rw"><span>'+NM[x]+'</span><b>'+fmt(c.T[x],c.L.tz)+'</b></div>').join('')
  +'<div class="rw"><span>الثلث الأخير من الليل (بدايته)</span><b>'+fmt(c.third,c.L.tz)+'</b></div>'+(ramadan()?'<div class="rw"><span>السحور (ينتهي عند الفجر)</span><b>'+fmt(c.T.fajr,c.L.tz)+'</b></div>':'')+'</div>'}
 h+='<div class="card"><button class="btn main" id="paGo" style="width:100%">أذكار بعد الصلاة (بعدّاد تلقائي)</button></div>';v.innerHTML=h;cd()}
function cd(){const e=$('#ptCd');if(!e)return;let s=Math.max(0,Math.floor((+e.dataset.t-Date.now())/1e3));const p=n=>String(n).padStart(2,'0');e.textContent=A(p(Math.floor(s/3600))+':'+p(Math.floor(s%3600/60))+':'+p(s%60));if(s===0)setTimeout(view,1500)}
function onView(e){const t=e.target;if(t.id==='ptGps')return gps();if(t.id==='paGo')return openPA();}
function gps(){const b=$('#ptGps');if(!navigator.geolocation){if(typeof toast==='function')toast('الموقع غير مدعوم، اختر مدينة');return}b.textContent='جارٍ تحديد الموقع…';
 navigator.geolocation.getCurrentPosition(p=>{LS.s('azkar_loc',JSON.stringify({lat:p.coords.latitude,lng:p.coords.longitude,name:'موقعي الحالي',tz:Intl.DateTimeFormat().resolvedOptions().timeZone}));view()},()=>{if(typeof toast==='function')toast('تعذّر تحديد الموقع، اختر مدينة يدويًا');view()},{timeout:10000,maximumAge:36e5})}
function initTab(){const nav=$('nav');if(!nav||$('#v-pt'))return;const b=document.createElement('button');b.dataset.v='pt';b.innerHTML='<b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg></b>المواقيت';nav.appendChild(b);
 const v=document.createElement('section');v.className='view';v.id='v-pt';($('#v-free')||$('#v-home')).after(v);
 b.onclick=()=>{$$('nav button').forEach(x=>x.classList.toggle('on',x===b));$$('.view').forEach(x=>x.classList.toggle('on',x.id==='v-pt'));scrollTo(0,0);view()};
 v.addEventListener('click',onView);v.addEventListener('change',e=>{const t=e.target;if(t.id==='ptCity'&&t.value!==''){const c=CITIES[+t.value];LS.s('azkar_loc',JSON.stringify({lat:c[1],lng:c[2],name:c[0],tz:c[3]}));view()}if(t.id==='ptM'){LS.s('azkar_pmethod',t.value);view()}});
 setInterval(()=>{if(v.classList.contains('on'))cd()},1000)}
/* ---------- post-prayer adhkar: tap counts, steps advance automatically ---------- */
const ST=[{t:'أَسْتَغْفِرُ اللَّهَ',n:3,s:'مسلم ٥٩١ (من حديث ثوبان)'},{t:'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',n:1,s:'مسلم ٥٩١'},
{t:'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',n:1,s:'آية الكرسي — النسائي في الكبرى ٩٩٢٨ (صحّحه الألباني؛ يُراجع)'},
{t:'سُبْحَانَ اللَّهِ',n:33,s:'مسلم ٥٩٥، ٥٩٧'},{t:'الْحَمْدُ لِلَّهِ',n:33,s:'مسلم ٥٩٥، ٥٩٧'},{t:'اللَّهُ أَكْبَرُ',n:33,s:'مسلم ٥٩٥، ٥٩٧'},
{t:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',n:1,s:'تمام المئة — مسلم ٥٩٧'}];
let pa=null;const vib=p=>{if(LS.g('azkar_vib')!=='0')try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function openPA(){if(pa)return;const el=document.createElement('div');el.id='pa';document.body.appendChild(el);document.body.style.overflow='hidden';pa={el,i:0,c:0,done:false};el.addEventListener('click',paClick);paRender()}
function paClose(){if(!pa)return;const s=pa;pa=null;s.el.removeEventListener('click',paClick);s.el.remove();document.body.style.overflow=''}
function paClick(e){const s=pa;if(!s||e.currentTarget!==s.el)return;const b=e.target.closest&&e.target.closest('[data-p]');const a=b?b.dataset.p:s.done?null:'tap';if(!a)return;
 if(a==='x')return paClose();if(a==='v'){LS.s('azkar_vib',LS.g('azkar_vib')==='0'?'1':'0');return paRender()}if(a==='r'){s.i=0;s.c=0;s.done=false;return paRender()}
 if(a==='tap'&&!s.done){const st=ST[s.i];s.c++;if(s.c>=st.n){vib(s.i===ST.length-1?[200,100,200,100,300]:[60,40,60]);s.c=0;s.i++;if(s.i>=ST.length){s.done=true;if(typeof toast==='function')toast('تقبّل الله طاعتك ✨')}}else vib(12);paRender()}}
function paRender(){const s=pa;if(!s)return;const st=ST[s.i],on=LS.g('azkar_vib')!=='0';
 s.el.innerHTML='<div class="paH"><button class="skb" data-p="x">إغلاق</button><span>'+(s.done?'تم':A(s.i+1)+' / '+A(ST.length))+'</span><button class="skb" data-p="v">'+(on?'اهتزاز: مفعّل':'اهتزاز: متوقف')+'</button></div>'
 +(s.done?'<div class="paB"><h2>تمّت أذكار ما بعد الصلاة</h2><button class="btn main" data-p="r">إعادة</button></div>':'<div class="paB" data-tap="1"><p class="sq">'+st.t+'</p><div class="src">'+st.s+'</div><div class="paC">'+A(s.c)+' <small>/ '+A(st.n)+'</small></div><div class="src">اضغط في أي مكان للعدّ — ينتقل الذكر التالي تلقائيًا</div></div>')}
function css(){const s=document.createElement('style');s.textContent='#pa{position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#10282c,#183a3c);color:#eaf6f2;display:flex;flex-direction:column;user-select:none;-webkit-user-select:none}#pa .paH{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 8px}#pa .paB{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px 22px calc(24px + env(safe-area-inset-bottom,0px));gap:12px;overflow-y:auto}#pa .paB .sq{font-size:1.6rem;line-height:2.2}#pa .paC{font-size:4rem;color:#e6c97a;font-variant-numeric:tabular-nums}#pa .src{opacity:.85}#pa .skb{background:rgba(255,255,255,.14);color:inherit;border:0;border-radius:12px;padding:9px 14px;font:inherit}#v-pt select{max-width:100%;font:inherit;padding:8px;border-radius:10px}';document.head.appendChild(s)}
/* ---------- tones: exact (case-sensitive) paths + diagnostics ---------- */
function toneDiag(){$$('#mc [data-tone]').forEach(r=>{const id=r.dataset.tone;if(!/^t\d$/.test(id)||typeof TONES==='undefined')return;const T=TONES.find(x=>x.id===id);if(!T)return;fetch(T.f,{method:'HEAD'}).then(x=>{const n=+x.headers.get('content-length')||0,sp=$('span',r);if(sp)sp.insertAdjacentHTML('beforeend','<small style="opacity:.7;display:block">'+(x.ok?'✓ '+(n?(n/1048576).toFixed(2)+' م.ب'+(n>1.5e6?' — كبير، يُفضّل تحويله إلى mp3/m4a':''):'موجود'):'✗ الملف غير موجود ('+x.status+')')+'</small>')}).catch(()=>{})})}
function init(){try{css();initTab();if(typeof openTones==='function'){const o=openTones;window.openTones=function(){const r=o.apply(this,arguments);setTimeout(toneDiag,0);return r}}}catch(e){console.warn('[prayer]',e)}}
window.__pt={times,lastThird,METHODS,compute};
if(typeof document!=='undefined'&&document.body)init();
})();
