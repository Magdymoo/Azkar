/* أذكاري — قسم العمرة. Duas live ONLY in dua-library.json (referenced by id, never copied). Progress persists in localStorage. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s),LS={g(k){try{return localStorage.getItem(k)}catch(e){return null}},s(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const Z='اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ';
const MQ='موقوف';
const STG=[
{n:'الإحرام والتلبية',it:[{t:'لَبَّيْكَ عُمْرَةً',s:'مسلم',h:'عند نية العمرة'},{t:'اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي',s:'مسلم',h:'لمن يخشى عائقًا (مرض/زحام)'},{t:'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',s:'متفق عليه',h:'التلبية — تستمر حتى بداية الطواف'},{note:'دعاء السفر: راجعه في أذكار المناسبات ← السفر.'}]},
{n:'دخول المسجد الحرام',it:[{t:'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',s:'ابن ماجه وأبو داود؛ والجزء الأخير في مسلم',h:'عند الدخول'},{t:'أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ',s:'أبو داود'},{t:'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَامِ',s:'ثابت عن عمر موقوفًا — البيهقي',tag:MQ,h:'عند رؤية الكعبة'}]},
{n:'الطواف',ctr:'tawaf',it:[{t:'بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَرُ',s:'ثابت عن ابن عمر موقوفًا',tag:MQ,h:'عند بدء الطواف من الحجر الأسود'},{t:'اللَّهُ أَكْبَرُ',s:'البخاري',h:'عند محاذاة الحجر الأسود في كل شوط'},{ref:'LIB-034',s:'أبو داود',h:'بين الركن اليماني والحجر الأسود'},{note:'لم يثبت دعاء مخصوص لباقي الطواف: اذكر الله واقرأ القرآن وادعُ بما شئت، أو اختر دعاءً من القائمة أدناه.'},{note:'«إِنَّمَا جُعِلَ الطَّوَافُ بِالْبَيْتِ وَبَيْنَ الصَّفَا وَالْمَرْوَةِ وَرَمْيُ الْجِمَارِ لِإِقَامَةِ ذِكْرِ اللَّهِ» (أبو داود والترمذي)'}]},
{n:'ركعتا الطواف',it:[{t:'﴿وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى﴾',s:'البقرة ١٢٥'},{note:'ركعتان خلف المقام: الأولى بعد الفاتحة «الكافرون» والثانية «الإخلاص» (مسلم). ثم يُشرب من زمزم.'},{t:'مَاءُ زَمْزَمَ لِمَا شُرِبَ لَهُ',s:'ابن ماجه — صححه الألباني',h:'عند الشرب (لا دعاء مخصوص)'}]},
{n:'السعي بين الصفا والمروة',ctr:'sai',it:[{t:'﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ﴾ — أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',s:'مسلم',h:'عند الاقتراب من الصفا (مرة واحدة في البداية)'},{t:Z,s:'مسلم',h:'على الصفا ثم المروة: يستقبل القبلة ويرفع يديه، ثم يدعو، ويكرر ثلاث مرات (على الصفا والمروة فقط)'},{t:'رَبِّ اغْفِرْ وَارْحَمْ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ',s:'ثابت عن ابن مسعود وابن عمر موقوفًا',tag:MQ,h:'بين العلمين الأخضرين (للرجال)'},{note:'الصفا ← المروة = شوط. لا دعاء مخصوص لباقي السعي.'}]},
{n:'التحلل',it:[{note:'حلق أو تقصير للرجال، وتقصير للنساء. لا دعاء مخصوص.'},{t:'تَقَبَّلَ اللَّهُ عُمْرَتَكَ',h:'تهنئة'},{ref:'LIB-END-1'}]},
{n:'الخروج من المسجد',it:[{t:'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ',s:'مسلم وابن ماجه'},{ref:'LIB-069',h:'تتمة دعاء الخروج'}]}];
/* ---------- state ---------- */
let LIB=null;const used={tawaf:[],sai:[]},cur={tawaf:null,sai:null};
const load=()=>LIB?Promise.resolve(LIB):fetch('dua-library.json').then(r=>r.json()).then(j=>LIB=j.duas||[]).catch(()=>LIB=[]);
const byId=id=>(LIB||[]).find(d=>d.id===id);
const pool=()=>(LIB||[]).filter(d=>!/^LIB-(END|T)/.test(d.id)&&!d.skip);
/* never repeats within a cycle; starts a new cycle only when the whole library is exhausted */
function nextDua(ctx){const p=pool();if(!p.length)return null;let left=p.filter(d=>!used[ctx].includes(d.id));if(!left.length){used[ctx]=[];left=p.slice()}const d=left[Math.floor(Math.random()*left.length)];used[ctx].push(d.id);cur[ctx]=d.id;return d}
const P=()=>{try{const o=JSON.parse(LS.g('azkar_umrah'));return o&&typeof o==='object'?o:{}}catch(e){return{}}};
const getC=k=>Math.min(7,Math.max(0,+P()[k]||0)),setC=(k,v)=>{const o=P();o[k]=Math.min(7,Math.max(0,v));LS.s('azkar_umrah',JSON.stringify(o))};
/* ---------- UI: one session object, one handler, every render checks it is alive ---------- */
let st=null;
function open(){if(st)return;load().then(()=>{if(st)return;const el=document.createElement('div');el.id='um';document.body.appendChild(el);document.body.style.overflow='hidden';st={el,view:'list',i:0,closed:false};el.addEventListener('click',onClick);render()})}
function close(){if(!st)return;const s=st;st=null;s.closed=true;s.el.removeEventListener('click',onClick);s.el.remove();document.body.style.overflow=''}
function onClick(e){const s=st;if(!s||s.closed||e.currentTarget!==s.el)return;const b=e.target.closest&&e.target.closest('[data-u]');if(!b)return;const a=b.dataset.u,g=STG[s.i]&&STG[s.i].ctr;
 if(a==='back'){if(s.view==='stage')s.view='list';else return close()}
 else if(a==='go'){s.i=+b.dataset.i;s.view='stage'}
 else if(a==='plus')setC(g,getC(g)+1);else if(a==='minus')setC(g,getC(g)-1);else if(a==='reset')setC(g,0);
 else if(a==='dua'){openDua(g);return}
 if(st===s)render()}
const esc=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function duaBox(c){return '<div class="umd"><div class="umb2"><button class="umb gold" data-u="dua">اعرض لي دعاءً</button></div></div>'}
function item(x,c){if(x.note)return '<p class="umn">'+esc(x.note)+'</p>'+(c&&/لم يثبت دعاء|لا دعاء مخصوص لباقي/.test(x.note)?duaBox(c):'');let t=x.t,s=x.s||'';if(x.ref){const d=byId(x.ref);t=d?d.t:'(الدعاء غير متاح في المكتبة بعد)'}
 return '<div class="umi">'+(x.h?'<div class="src">'+esc(x.h)+'</div>':'')+'<p class="sq">'+esc(t)+'</p>'+(x.tag?'<span class="umt">'+x.tag+'</span> ':'')+(s?'<div class="src">'+esc(s)+'</div>':'')+'</div>'}
function render(){const s=st;if(!s||s.closed)return;const bk='<button class="umb" data-u="back">رجوع</button>';let h;
 if(s.view==='list'){h='<div class="umh">'+bk+'<b>العمرة</b><span></span></div><div class="umc">'+STG.map((g,i)=>'<button class="umr" data-u="go" data-i="'+i+'"><span><bdi>'+(i+1)+'.</bdi> <span>'+g.n+'</span></span>'+(g.ctr?'<em>'+getC(g.ctr)+'/7</em>':'')+'</button>').join('')+'<p class="umn">يعمل بدون إنترنت، ويحفظ تقدّمك تلقائيًا.</p></div>'}
 else{const g=STG[s.i],c=g.ctr;h='<div class="umh">'+bk+'<b>'+g.n+'</b><span></span></div><div class="umc">'
  +(c?'<div class="umk"><div class="umv">'+getC(c)+' / 7</div><div class="umb2"><button class="umb" data-u="plus">شوط جديد</button><button class="umb" data-u="minus">تراجع</button><button class="umb" data-u="reset">صفر</button></div></div>':'')
  +g.it.map(x=>item(x,c)).join('')+'</div>'}
 const old=$('.umc',s.el),keep=old&&s.last===s.view+s.i?old.scrollTop:0;s.el.innerHTML=h;s.last=s.view+s.i;const k=$('.umc',s.el);if(k)k.scrollTop=keep}
/* ---------- full-screen dua page (T5B): own history entry (#umrah-dua), auto-fit font, swipe, prev/next, copy, share ---------- */
let dv=null;const FSK='azkar_umd_fs',CTX={tawaf:'الطواف',sai:'السعي'};
const fsPref=()=>{const n=+LS.g(FSK);return n>=18&&n<=56?n:0};
const reducedM=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
function openDua(ctx){if(dv||!LIB)return;const d=nextDua(ctx);if(!d)return;const el=document.createElement('div');el.id='umd';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','دعاء');document.body.appendChild(el);
 dv={el,ctx,hist:[d.id],i:0,fs:fsPref(),pushed:false,x0:0,y0:0,t0:0};try{history.pushState({umd:1},'','#umrah-dua');dv.pushed=true}catch(e){}
 el.addEventListener('click',dvClick);el.addEventListener('touchstart',dvTs,{passive:true});el.addEventListener('touchend',dvTe,{passive:true});el.addEventListener('keydown',dvKey);dvRender('');const b=$('[data-d="back"]',el);if(b&&b.focus)b.focus()}
function closeDua(fromPop){if(!dv)return;const s=dv;dv=null;s.el.removeEventListener('click',dvClick);s.el.removeEventListener('touchstart',dvTs);s.el.removeEventListener('touchend',dvTe);s.el.removeEventListener('keydown',dvKey);s.el.remove();if(s.pushed&&!fromPop){try{history.back()}catch(e){}}}
function dvGo(dir){const s=dv;if(!s)return;if(dir>0){if(s.i<s.hist.length-1)s.i++;else{const d=nextDua(s.ctx);if(!d)return;s.hist.push(d.id);s.i=s.hist.length-1}}else if(s.i>0)s.i--;else return;dvRender(dir>0?'dvN':'dvP')}
function dvCopy(){const s=dv,d=s&&byId(s.hist[s.i]);if(!d)return Promise.resolve(false);const say=m=>{if(typeof toast==='function')toast(m)};
 const fb=()=>{try{const t=document.createElement('textarea');t.value=d.t;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();say(ok?'تم نسخ الدعاء':'تعذّر النسخ');return ok}catch(e){say('تعذّر النسخ');return false}};
 try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(d.t).then(()=>{say('تم نسخ الدعاء');return true},()=>fb())}catch(e){}return Promise.resolve(fb())}
function dvShare(){const s=dv,d=s&&byId(s.hist[s.i]);if(!d)return;if(navigator.share){navigator.share({text:d.t}).catch(()=>{});return}dvCopy()}
function dvSize(delta){const s=dv;if(!s)return;const T=$('#dvT',s.el);const cur=T?parseFloat(T.style.fontSize)||24:24;if(delta===0){s.fs=0;LS.s(FSK,'')}else{s.fs=Math.min(56,Math.max(18,Math.round(cur)+delta));LS.s(FSK,String(s.fs))}fit()}
function dvClick(e){const s=dv;if(!s||e.currentTarget!==s.el)return;const b=e.target.closest&&e.target.closest('[data-d]');if(!b)return;const a=b.dataset.d;
 if(a==='back')closeDua();else if(a==='next')dvGo(1);else if(a==='prev')dvGo(-1);else if(a==='copy')dvCopy();else if(a==='share')dvShare();else if(a==='fp')dvSize(2);else if(a==='fm')dvSize(-2);else if(a==='fa')dvSize(0)}
function dvKey(e){if(e.key==='Escape')closeDua()}
function dvTs(e){const s=dv,t=e.changedTouches&&e.changedTouches[0];if(!s||!t)return;s.x0=t.clientX;s.y0=t.clientY}
/* RTL-aware: in RTL the finger moving right goes forward; in LTR languages the finger moving left goes forward */
function dvTe(e){const s=dv,t=e.changedTouches&&e.changedTouches[0];if(!s||!t)return;const dx=t.clientX-s.x0,dy=t.clientY-s.y0;if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return;const rtl=document.documentElement.dir==='rtl';dvGo((dx>0)===rtl?1:-1)}
function dvRender(anim){const s=dv;if(!s)return;const d=byId(s.hist[s.i]);if(!d)return;const lab=CTX[s.ctx];
 s.el.innerHTML='<div class="dvH"><button class="umb" data-d="back" aria-label="رجوع">رجوع</button><b>دعاء'+(lab?' <span>'+lab+'</span>':'')+'</b><span class="dvSp"></span></div>'
 +'<div class="dvBody" id="dvB" tabindex="-1"><div class="dvIn '+anim+'" id="dvI" aria-live="polite"><div class="dvC">'+esc(d.c)+'</div><p class="dvT" id="dvT" lang="ar" dir="rtl">'+esc(d.t)+'</p></div><div class="dvMore" id="dvM" hidden>المزيد أدناه ↓</div></div>'
 +'<div class="dvF"><div class="dvR"><button class="umb" data-d="prev" '+(s.i===0?'disabled':'')+'>السابق</button><button class="umb gold" data-d="next">دعاء آخر</button></div>'
 +'<div class="dvR"><button class="umb sm" data-d="copy">نسخ</button><button class="umb sm" data-d="share">مشاركة</button><button class="umb sm" data-d="fm" aria-label="تصغير الخط">أ−</button><button class="umb sm" data-d="fp" aria-label="تكبير الخط">أ+</button><button class="umb sm'+(s.fs?'':' on')+'" data-d="fa">تلقائي</button></div></div>';
 const B=$('#dvB',s.el);if(B)B.addEventListener('scroll',dvMore,{passive:true});fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(dv===s)fit()})}
/* auto-fit: the largest size (MAX..MIN px) whose content fits without scrolling; below MIN the page itself scrolls and shows a hint */
function fit(){const s=dv;if(!s)return;const B=$('#dvB',s.el),T=$('#dvT',s.el),I=$('#dvI',s.el);if(!B||!T||!I)return;const MAX=44,MIN=18;let px;
 if(s.fs)px=s.fs;else{let lo=MIN,hi=MAX;for(let k=0;k<7;k++){const m=(lo+hi)/2;T.style.fontSize=m+'px';if(I.offsetHeight<=B.clientHeight)lo=m;else hi=m}px=Math.floor(lo*2)/2}
 T.style.fontSize=px+'px';B.scrollTop=0;dvMore()}
function dvMore(){const s=dv;if(!s)return;const B=$('#dvB',s.el),M=$('#dvM',s.el);if(!B||!M)return;M.hidden=!(B.scrollHeight>B.clientHeight+2&&B.scrollTop+B.clientHeight<B.scrollHeight-6)}
function css(){const s=document.createElement('style');s.textContent=`
#um{--b1:#10261f;--b2:#1a362c;--cd:#24443a;--tx:#f7f2e4;--mu:#d3e0d3;--go:#f1da92;--ln:#4d6d5f;position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,var(--b1),var(--b2));color:var(--tx);display:flex;flex-direction:column;font-family:Cairo,system-ui,sans-serif;font-size:1.05rem}
#um *{box-sizing:border-box}
#um .umh{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;border-bottom:1px solid var(--ln)}
#um .umh b{color:var(--go);font-size:1.2rem}
#um .umc{flex:1;overflow-y:auto;padding:12px 16px calc(28px + env(safe-area-inset-bottom,0px));text-align:center}
#um .umb{background:var(--cd);color:var(--tx);border:1.5px solid var(--ln);border-radius:14px;padding:10px 18px;font:inherit;min-height:46px;min-width:46px}
#um .umb.gold{background:var(--go);color:#1d1a10;border-color:var(--go);font-weight:700}
#um .umr{display:flex;justify-content:space-between;align-items:center;width:100%;margin:9px 0;padding:14px 16px;background:var(--cd);color:var(--tx);border:1.5px solid var(--ln);border-radius:16px;font:inherit;font-size:1.1rem;min-height:52px;text-align:start}
#um .umr em{font-style:normal;background:var(--go);color:#1d1a10;border-radius:10px;padding:2px 10px;font-weight:700}
#um .umn{color:var(--mu);line-height:2.1;margin:12px 4px}
#um .umi{margin:14px 0;padding:14px 12px;border-radius:18px;background:var(--cd);border:1px solid var(--ln)}
#um .sq{color:var(--tx);font-family:Amiri,'Traditional Arabic',serif;font-size:1.6rem;line-height:2.3;margin:6px 0}
#um .src{color:var(--mu);opacity:1;font-size:.95rem;line-height:1.9}
#um .umt{background:var(--go);color:#1d1a10;border-radius:8px;padding:2px 10px;font-size:.85rem;font-weight:700}
#um .umk{margin:6px 0 14px}
#um .umv{font-size:2.8rem;color:var(--go);font-weight:700;font-variant-numeric:tabular-nums}
#um .umb2{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px}
#um .umd{margin:12px 0 18px;padding:14px 12px;border:1.5px dashed var(--go);border-radius:18px;background:rgba(241,218,146,.07)}
#um button:focus-visible{outline:3px solid var(--go);outline-offset:2px}
@media (prefers-reduced-motion:reduce){#um *{transition:none!important;animation:none!important}}
#umd{--b1:#10261f;--b2:#1a362c;--cd:#24443a;--tx:#f7f2e4;--mu:#d3e0d3;--go:#f1da92;--ln:#4d6d5f;position:fixed;inset:0;z-index:9100;background:linear-gradient(180deg,var(--b1),var(--b2));color:var(--tx);display:flex;flex-direction:column;font-family:Cairo,system-ui,sans-serif;font-size:1.05rem}
#umd *{box-sizing:border-box}
#umd .dvH{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;border-bottom:1px solid var(--ln)}
#umd .dvH b{color:var(--go);font-size:1.15rem}#umd .dvSp{min-width:46px}
#umd .umb{background:var(--cd);color:var(--tx);border:1.5px solid var(--ln);border-radius:14px;padding:10px 18px;font:inherit;min-height:46px;min-width:46px}
#umd .umb.sm{padding:8px 14px}#umd .umb.on{border-color:var(--go);color:var(--go)}#umd .umb:disabled{opacity:.55}
#umd .umb.gold{background:var(--go);color:#1d1a10;border-color:var(--go);font-weight:700;flex:1}
#umd .dvBody{flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:8px 18px;position:relative;-webkit-overflow-scrolling:touch}
#umd .dvIn{margin:auto 0;text-align:center}
#umd .dvC{color:var(--mu);font-size:.95rem;line-height:1.9}
#umd .dvT{font-family:Amiri,'Noto Naskh Arabic','Scheherazade New','Traditional Arabic','Geeza Pro',serif;font-size:32px;line-height:2.1;color:var(--tx);margin:8px 0}
#umd .dvMore{position:sticky;bottom:6px;align-self:center;margin-top:auto;background:#2b4a3d;color:var(--tx);border:1px solid var(--ln);border-radius:999px;padding:4px 14px;font-size:.9rem}
#umd .dvMore[hidden]{display:none}
#umd .dvF{display:flex;flex-direction:column;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--ln);background:#0d1f19}
#umd .dvR{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
#umd .dvN{animation:dvn .24s ease}#umd .dvP{animation:dvp .24s ease}
@keyframes dvn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}@keyframes dvp{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}
#umd button:focus-visible{outline:3px solid var(--go);outline-offset:2px}
@media (prefers-reduced-motion:reduce){#umd *{transition:none!important;animation:none!important}}
#umgo{width:100%;background:linear-gradient(135deg,#2f5a45,#3f7a5f);color:#fff;border:0;border-radius:16px;padding:14px;font:inherit;font-weight:700;min-height:48px}`;document.head.appendChild(s)}
function init(){try{css();addEventListener('popstate',()=>{if(dv)closeDua(true)});addEventListener('resize',()=>{if(dv)fit()});document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('#umgo');if(t)open()})}catch(e){console.warn('[umrah]',e)}}
window.__um={_st:()=>st,_dv:()=>dv,openDua,closeDua,dvGo,open,nextDua,getC,setC,load,STG,_used:used,_lib:()=>LIB};
if(typeof document!=='undefined'&&document.body)init();
})();
