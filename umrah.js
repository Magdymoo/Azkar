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
const pool=()=>(LIB||[]).filter(d=>!/^LIB-(END|T)/.test(d.id));
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
 else if(a==='dua'||a==='skip')nextDua(g);
 if(st===s)render()}
const esc=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function item(x){if(x.note)return '<p class="umn">'+esc(x.note)+'</p>';let t=x.t,s=x.s||'';if(x.ref){const d=byId(x.ref);t=d?d.t:'(الدعاء غير متاح في المكتبة بعد)'}
 return '<div class="umi">'+(x.h?'<div class="src">'+esc(x.h)+'</div>':'')+'<p class="sq">'+esc(t)+'</p>'+(x.tag?'<span class="umt">'+x.tag+'</span> ':'')+(s?'<div class="src">'+esc(s)+'</div>':'')+'</div>'}
function render(){const s=st;if(!s||s.closed)return;const bk='<button class="umb" data-u="back">رجوع</button>';let h;
 if(s.view==='list'){h='<div class="umh">'+bk+'<b>العمرة</b><span></span></div><div class="umc">'+STG.map((g,i)=>'<button class="umr" data-u="go" data-i="'+i+'"><span>'+(i+1)+'. '+g.n+'</span>'+(g.ctr?'<em>'+getC(g.ctr)+'/7</em>':'')+'</button>').join('')+'<p class="umn">يعمل بدون إنترنت، ويحفظ تقدّمك تلقائيًا.</p></div>'}
 else{const g=STG[s.i],c=g.ctr;h='<div class="umh">'+bk+'<b>'+g.n+'</b><span></span></div><div class="umc">'
  +(c?'<div class="umk"><div class="umv">'+getC(c)+' / 7</div><div class="umb2"><button class="umb" data-u="plus">شوط جديد</button><button class="umb" data-u="minus">تراجع</button><button class="umb" data-u="reset">صفر</button></div></div>':'')
  +g.it.map(item).join('')
  +(c?'<div class="umd"><div class="src">أدعية للاختيار (بلا تكرار)</div>'+(cur[c]&&byId(cur[c])?'<p class="sq">'+esc(byId(cur[c]).t)+'</p>':'')+'<button class="umb" data-u="dua">اعرض لي دعاءً</button> <button class="umb" data-u="skip">لا أريد هذا</button></div>':'')+'</div>'}
 s.el.innerHTML=h;const k=$('.umc',s.el);if(k)k.scrollTop=0}
function css(){const s=document.createElement('style');s.textContent='#um{position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#1d2b24,#27392e);color:#f1f5ee;display:flex;flex-direction:column}#um .umh{display:flex;justify-content:space-between;align-items:center;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 8px}#um .umc{flex:1;overflow-y:auto;padding:8px 18px calc(24px + env(safe-area-inset-bottom,0px));text-align:center}#um .umb{background:#ffffff24;color:inherit;border:0;border-radius:12px;padding:10px 16px;font:inherit;min-height:44px}#um .umr{display:flex;justify-content:space-between;width:100%;margin:8px 0;padding:14px;background:#ffffff1a;color:inherit;border:0;border-radius:14px;font:inherit;font-size:1.05rem;min-height:48px}#um .umn{opacity:.85;line-height:2}#um .umi{margin:14px 0;padding:10px;border-radius:14px;background:#ffffff12}#um .sq{font-size:1.45rem;line-height:2.2}#um .umt{background:#e6c97a;color:#222;border-radius:8px;padding:1px 8px;font-size:.8rem}#um .umv{font-size:2.6rem;color:#e6c97a}#um .umb2{display:flex;gap:8px;justify-content:center}#um .umd{margin-top:18px;padding-top:12px;border-top:1px solid #ffffff33}#umgo{width:100%;background:linear-gradient(135deg,#3d5a45,#557a5f);color:#fff;border:0;border-radius:16px;padding:14px;font:inherit;font-weight:700}';document.head.appendChild(s)}
function init(){try{css();const h=$('#v-home');if(h&&!$('#umgo')){const c=document.createElement('div');c.className='card';c.innerHTML='<button id="umgo">🕋 العمرة — أدعية وأذكار ومراحل وعدّاد أشواط</button>';h.insertBefore(c,h.children[2]||null);$('#umgo').onclick=open}}catch(e){console.warn('[umrah]',e)}}
window.__um={_st:()=>st,open,nextDua,getC,setC,load,STG,_used:used,_lib:()=>LIB};
if(typeof document!=='undefined'&&document.body)init();
})();
