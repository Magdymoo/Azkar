/* أذكاري — صفحة «الأدوات والإضافات»: صفحة مستقلة تُفتح من الإعدادات. لا تغيّر صفحة «اليوم» ولا أي شاشة موجودة.
   تقرأ بيانات التطبيق فقط (S, ADH, st, today) ولا تكتب فيها. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const A=n=>typeof ar==='function'?ar(n):String(n);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NM={fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
let ov=null,pg='hub',pushed=false,tk=0,tgt=0,curP=null;const EXT=[];
/* صفحات الأدوات المتاحة (تُضاف هنا) */
const ORDER=['needs','tracker','cal','ramadan','learn','zakat','salah','kids','loved','qibla','search','names'],LAZY=['needs.js','qibla.js','search.js','names.js'];let modsOk=false,modsP=null;
const register=p=>{if(p&&p.id&&!EXT.find(x=>x.id===p.id))EXT.push(p)},allP=()=>PAGES.concat(EXT.slice().sort((a,b)=>(ORDER.indexOf(a.id)+1||99)-(ORDER.indexOf(b.id)+1||99)));
/* تحميل كسول لأدوات القبلة والبحث والأسماء عند أول فتح للصفحة (يخفّف الإقلاع) */
function loadMods(){if(modsP)return modsP;modsP=Promise.all(LAZY.map(src=>new Promise(res=>{try{if(document.querySelector('script[data-lz="'+src+'"]'))return res();const s=document.createElement('script');s.src=AZ.asset(src);s.dataset.lz=src;s.onload=s.onerror=()=>res();document.body.appendChild(s)}catch(e){res()}}))).then(()=>{modsOk=true});return modsP}
/* صفحات 2.0: تُدرَج في القائمة فورًا (بلا تحميل)، ويُحمَّل ملف كل صفحة عند فتحها فقط عبر AZ_lazy. كل ملف يعرّف window['__x_'+id]={mount,unmount} */
const NEWP=[['tracker','🕌','تتبّع الصلوات والسنن','سجّل صلواتك ورواتبك يوميًا مع خريطة الشهر وإضافة الفائت للفوائت'],['cal','🗓️','التقويم الهجري والمناسبات','المناسبات بأدلتها والعدّ التنازلي وسجل الصيام'],['ramadan','🌙','رمضان','الصيام والتراويح والعشر الأواخر وخطة الختمة'],['learn','📖','أتعلّم: الأربعون النووية','أحاديث بشرح موجز وتتبّع الحفظ واختبار «كمّل الحديث»'],['zakat','🧮','الزكاة والمواريث','حاسبة الزكاة ومواريث مبسّطة للحالات الشائعة'],['salah','🧭','أدوات الصلاة','أوقات النهي ووضع السفر والمدن المحفوظة'],['kids','🧒','وضع الأطفال','أدعية قصيرة ونجوم تشجيعية بأزرار كبيرة'],['loved','🤍','الدعاء للأحباء والصدقة الجارية','أسماء تدعو لها وسجل صدقاتك']];
let curReal=null;
NEWP.forEach(([id,ic,t,d])=>register({id,ic,t,d,mount(root,api){root.innerHTML=window.AZ_skel?window.AZ_skel(4):'';const src=id+'.js',probe='__x_'+id;(window.AZ_lazy?window.AZ_lazy(src,probe):Promise.reject()).then(()=>{if(curP!==this)return;curReal=window[probe];curReal.mount(root,api)}).catch(()=>{if(curP===this)root.innerHTML='<div class="card"><div class="tlM">تعذّر تحميل هذه الصفحة. تأكد من الاتصال مرة واحدة ليُحفظ للاستخدام بدون إنترنت.</div></div>'})},unmount(){if(curReal&&curReal.unmount){try{curReal.unmount()}catch(e){}}curReal=null}}));
function openPage(id){if(!allP().some(p=>p.id===id))return;if(!ov)open();pg=id;render()}
const PAGES=[{id:'today',ic:'🗓️',t:'ملخص اليوم',d:'الصلاة القادمة والورد والأذكار والفوائت في مكان واحد'}];
/* ---------- بيانات ---------- */
function nextPrayer(){try{const c=window.__pt&&window.__pt.compute&&window.__pt.compute();if(!c)return null;const now=Date.now();for(const k of['fajr','dhuhr','asr','maghrib','isha'])if(c.T[k]&&+c.T[k]>now)return{k,t:+c.T[k],tz:c.L.tz,city:c.L.name};return c.tomorrowFajr?{k:'fajr',t:+c.tomorrowFajr,tz:c.L.tz,city:c.L.name}:null}catch(e){return null}}
const fmtT=(ms,tz)=>{try{let s=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:tz}).format(ms);if(typeof LANG==='undefined'||LANG==='ar')s=s.replace('AM','ص').replace('PM','م');return A(s)}catch(e){return ''}};
const cdTxt=ms=>{const s=Math.max(0,Math.floor(ms/1e3)),p=n=>String(n).padStart(2,'0');return A(p(Math.floor(s/3600))+':'+p(Math.floor(s%3600/60))+':'+p(s%60))};
function azkarLeft(k){try{const d=(S.days&&S.days[today()])||{},L=ADH[k],left=L.filter((a,i)=>((d[k]||[])[i]||0)<a.n).length;return{left,total:L.length}}catch(e){return null}}
function quran(){try{const d=(S.days&&S.days[today()])||{},rd=d.qm||d.qe;return{read:rd||0,page:S.page||1,kh:(S.khatmat||0)+1,rem:604-(S.page||1)+1}}catch(e){return null}}
/* ---------- بطاقة العدّ التنازلي (ويدجت داخلي) ---------- */
function widget(){const n=nextPrayer();if(!n)return '<div class="card"><div class="tlM">حدّد موقعك لعرض مواقيت الصلاة.</div><button class="btn main" data-tl="loc">فتح المواقيت</button></div>';tgt=n.t;
 return '<div class="card tlW"><div class="tlM"><span>الصلاة القادمة</span></div><div class="tlN"><b>'+NM[n.k]+'</b> <span>'+fmtT(n.t,n.tz)+'</span></div><div class="tlC" data-cd role="timer" aria-label="الوقت المتبقي">'+cdTxt(n.t-Date.now())+'</div><div class="tlM">'+esc(n.city||'')+'</div></div>'}
/* ---------- الصفحات ---------- */
function hubHtml(){return widget()+'<div class="gl">الأدوات</div><div class="grp">'+allP().map(p=>'<button class="rw lnk tlI" data-tl="pg" data-p="'+p.id+'"><span class="tlE" aria-hidden="true">'+p.ic+'</span><span><b>'+p.t+'</b><span class="src">'+p.d+'</span></span></button>').join('')+'</div>'+(modsOk?'':(window.AZ_skel?window.AZ_skel(3):''))}
function todayHtml(){let h=widget();const q=quran(),m=azkarLeft('m'),e=azkarLeft('e');
 const row=(go,l,v)=>'<button class="rw lnk tlR" data-tl="go" data-g="'+go+'"><span>'+l+'</span><span class="tlV">'+v+'</span></button>';
 if(q)h+='<div class="card"><h2>ورد القرآن</h2>'+row('q','ورد اليوم',q.read?'<span>✓ قرأت صفحة</span> <b>'+A(q.read)+'</b>':'<span>الصفحة</span> <b>'+A(q.page)+'</b>')+row('q','الختمة','<b>'+A(q.kh)+'</b> · <b>'+A(q.rem)+'</b> <span>صفحة متبقية</span>')+'</div>';
 if(m&&e){const v=x=>x.left?'<span>المتبقي</span> <b>'+A(x.left)+' / '+A(x.total)+'</b>':'<span>✓ اكتملت</span>';h+='<div class="card"><h2>الأذكار</h2>'+row('adh','أذكار الصباح',v(m))+row('adh','أذكار المساء',v(e))+'</div>'}
 let qs=null;try{qs=window.__qd&&window.__qd.summary&&window.__qd.summary()}catch(x){}
 if(qs){h+='<div class="card"><h2>الفوائت</h2>'+(qs.has?row('qada','التقدم','<b>'+A(qs.pct)+'%</b>')+row('qada','المتبقي','<b>'+A(qs.rem)+'</b>')+(qs.targetToday?row('qada','قضاء اليوم','<b>'+A(qs.doneToday)+' / '+A(qs.targetToday)+'</b>'):''):'<div class="tlM">لم تُفعَّل خطة الفوائت بعد.</div><button class="btn" data-tl="go" data-g="qada">ابدأ تقدير الفوائت</button>')+'</div>'}
 return h}
function leave(){if(curP&&curP.unmount){try{curP.unmount()}catch(e){}}curP=null}
function render(){if(!ov)return;leave();const hub=pg==='hub',P=allP().find(x=>x.id===pg)||PAGES[0];
 ov.innerHTML='<div class="tlH"><button class="btn" data-tl="back" aria-label="رجوع">رجوع</button><b>'+(hub?'الأدوات والإضافات':P.t)+'</b><span class="tlSp"></span></div><div class="tlB" tabindex="-1">'+(hub?hubHtml():P.mount?'':todayHtml())+'</div>';
 clearInterval(tk);if(!hub&&P.mount){curP=P;try{P.mount($('.tlB',ov),{navTo,close,back:()=>{pg='hub';render()}})}catch(e){console.warn('[tools]',e)}}if($('[data-cd]',ov))tk=setInterval(tick,1000)}
function tick(){if(!ov){clearInterval(tk);return}const e=$('[data-cd]',ov);if(!e)return;const r=tgt-Date.now();if(r<=0){render();return}e.textContent=cdTxt(r)}
/* ---------- فتح/إغلاق مع زر الرجوع ---------- */
function open(){if(ov)return;ov=document.createElement('div');ov.id='tl';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','الأدوات والإضافات');document.body.appendChild(ov);document.body.style.overflow='hidden';pg='hub';
 try{history.pushState({tl:1},'','#tools');pushed=true}catch(e){pushed=false}ov.addEventListener('click',onClick);ov.addEventListener('keydown',e=>{if(e.key==='Escape')close()});render();if(!modsOk)loadMods().then(()=>{if(ov&&pg==='hub')render()});const b=$('[data-tl="back"]',ov);if(b&&b.focus)b.focus()}
function close(fromPop){if(!ov)return;leave();const o=ov;ov=null;clearInterval(tk);o.remove();document.body.style.overflow='';if(pushed&&!fromPop){try{history.back()}catch(e){}}pushed=false}
function navTo(k){const sel={q:'q',adh:'adh',pt:'pt',qada:'pt'}[k];if(k==='qada'){try{AZ.data.set('azkar_pt_sub','q')}catch(e){}}if(k==='loc'){try{AZ.data.set('azkar_pt_sub','t')}catch(e){}}const b=document.querySelector('nav button[data-v="'+(k==='loc'?'pt':sel)+'"]');if(b)setTimeout(()=>b.click(),0)}
function onClick(e){const b=e.target.closest&&e.target.closest('[data-tl]');if(!b||!ov)return;const a=b.dataset.tl;
 if(a==='back'){if(pg==='hub')close();else{pg='hub';render()}}
 else if(a==='pg'){pg=b.dataset.p;render()}
 else if(a==='go'||a==='loc'){const g=a==='loc'?'loc':b.dataset.g;close();navTo(g)}}
/* ---------- زر في الإعدادات ---------- */
function inject(){const m=$('#mc');if(!m||$('#tlRow',m))return;const d=document.createElement('div');d.id='tlRow';d.innerHTML='<div class="gl">أدوات إضافية</div><div class="grp"><button class="rw lnk" id="tlOpen">الأدوات والإضافات</button></div>';
 const an=[...m.querySelectorAll('.gl')].find(x=>x.textContent.trim()==='المظهر');if(an&&an.parentNode)an.parentNode.insertBefore(d,an);else m.appendChild(d);$('#tlOpen',d).onclick=launch}
function launch(){const md=$('#md');if(typeof closeM==='function'&&md&&!md.hidden){let done=false;const go=()=>{if(done)return;done=true;open()};addEventListener('popstate',go,{once:true});try{closeM()}catch(e){}setTimeout(go,350)}else open()}
function css(){const s=document.createElement('style');s.textContent='#tl{position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;background:linear-gradient(var(--bg1),var(--bg2));color:var(--tx)}#tl .tlH{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;border-bottom:1px solid var(--line)}#tl .tlH b{font-size:1.15rem}#tl .tlSp{min-width:60px}#tl .tlB{flex:1;overflow-y:auto;padding:12px 14px calc(24px + env(safe-area-inset-bottom,0px))}#tl .btn{min-height:44px}#tl .tlW{text-align:center}#tl .tlN{font-size:1.3rem;margin:4px 0}#tl .tlC{font-size:2.6rem;font-variant-numeric:tabular-nums;color:var(--gold);line-height:1.4}#tl .tlM{color:var(--mut);line-height:1.9}#tl .tlI{display:flex;align-items:center;gap:12px;text-align:start;min-height:56px}#tl .tlI .src{display:block}#tl .tlE{font-size:1.5rem}#tl .tlR{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:48px;width:100%}#tl .tlV{text-align:end}#tl b{font-variant-numeric:tabular-nums}#tl button:focus-visible{outline:3px solid var(--gold);outline-offset:2px}@media (prefers-reduced-motion:reduce){#tl *{transition:none!important;animation:none!important}}';document.head.appendChild(s)}
/* زر «الأدوات» في البار السفلي (بعد «الصلاة»): يفتح صفحة الأدوات والإضافات مباشرة */
function navBtn(){const nav=$('nav');if(!nav||$('#tlNav',nav))return;const b=document.createElement('button');b.id='tlNav';b.type='button';b.setAttribute('aria-haspopup','dialog');b.innerHTML='<b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg></b>الأدوات';b.onclick=()=>{try{if(navigator.vibrate)navigator.vibrate(6)}catch(e){}open()};nav.appendChild(b);try{if(typeof LANG!=='undefined'&&LANG!=='ar'&&typeof applyLang==='function')applyLang()}catch(e){}}
function init(){try{css();navBtn();addEventListener('popstate',()=>{if(ov)close(true)});if(typeof openSet==='function'){const o=openSet;window.openSet=function(){const r=o.apply(this,arguments);try{inject()}catch(e){}return r}}}catch(e){console.warn('[tools]',e)}}
window.__tl={open,close,openPage,register,loadMods,PAGES,allP,_mods:()=>modsOk,_t:{nextPrayer,todayHtml,hubHtml,widget,azkarLeft,quran,cdTxt}};
if(typeof document!=='undefined'&&document.body)init();
})();
