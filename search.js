/* أذكاري — البحث الشامل في الأذكار والأدعية (يتجاهل التشكيل). صفحة داخل «الأدوات والإضافات». يعمل بدون إنترنت. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const A=n=>typeof ar==='function'?ar(n):String(n);
const esc=x=>String(x==null?'':x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* تطبيع: حذف التشكيل والتطويل وعلامات المصحف، توحيد الألف والياء والتاء المربوطة، تجاهل علامات الترقيم */
function norm(s){return String(s==null?'':s).replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
function find(items,q,limit){const toks=norm(q).split(' ').filter(Boolean);if(!toks.length)return{total:0,list:[]};const phrase=toks.join(' '),out=[];
 for(const it of items){const n=it.n;let ok=true;for(const t of toks)if(n.indexOf(t)<0&&!(t.length>2&&t.slice(-1)==='ه'&&n.indexOf(t.slice(0,-1)+'ت')>=0)){ok=false;break}if(!ok)continue;out.push({it,sc:n.indexOf(phrase)>=0?0:1,pos:n.indexOf(toks[0])})}
 out.sort((a,b)=>a.sc-b.sc||a.pos-b.pos);return{total:out.length,list:out.slice(0,limit||50).map(x=>x.it)}}
/* ---------- بناء الفهرس (مرة واحدة) ---------- */
let IDX=null,P=null,st=null;
const GROUPS=[['m','أذكار الصباح'],['e','أذكار المساء'],['s','قبل النوم'],['x','متنوعة']];
async function build(){if(IDX)return IDX;if(P)return P;P=(async()=>{const it=[],add=(g,t,f)=>{if(!t)return;const o={g,t:String(t),f:f?String(f):''};o.n=norm(o.t);if(o.n)it.push(o)};
 try{GROUPS.forEach(([k,g])=>{(typeof ADH!=='undefined'&&ADH[k]||[]).forEach(a=>add(g,a.t,a.f))})}catch(e){}
 try{(typeof INS!=='undefined'?INS:[]).forEach(a=>add('آيات وأحاديث',a[1],a[2]))}catch(e){}
 try{(window.__pt&&window.__pt.ST||[]).forEach(a=>add('أذكار بعد الصلاة',a.t,a.s||a.b))}catch(e){}
 let lib=[];try{const r=await fetch('dua-library.json');const j=await r.json();lib=j.duas||[];lib.forEach(d=>add('أدعية',d.t,d.c))}catch(e){}
 try{const byId={};lib.forEach(d=>byId[d.id]=d);((window.__um&&window.__um.STG)||[]).forEach(g=>(g.it||[]).forEach(x=>{const t=x.t||(x.ref&&byId[x.ref]&&byId[x.ref].t);if(t)add('العمرة',t,g.n+(x.s?' — '+x.s:''))}))}catch(e){}
 try{const nd=window.__needs&&await window.__needs.index();(nd||[]).forEach(o=>add(o.g,o.t,o.f))}catch(e){}
 const seen=new Set();IDX=it.filter(o=>{const k=o.g+'|'+o.n;if(seen.has(k))return false;seen.add(k);return true});return IDX})();return P}
function customItems(){try{return(typeof S!=='undefined'&&S.custom||[]).map(a=>{const o={g:'أذكاري',t:String(a.t||''),f:a.f?String(a.f):''};o.n=norm(o.t);return o}).filter(o=>o.n)}catch(e){return[]}}
/* ---------- الصفحة ---------- */
const snip=t=>{const s=String(t).replace(/\s+/g,' ').trim();return s.length>140?s.slice(0,140)+'…':s};
function mount(root,api){st={root,sel:null,q:'',tm:0};root.innerHTML='<div class="card"><label class="srL"><span>ابحث في الأذكار والأدعية</span><input type="search" id="srQ" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="اكتب كلمة أو جملة (التشكيل لا يؤثر)" aria-label="بحث"></label><div class="src" id="srH">يبحث في الأذكار والأدعية وأذكار ما بعد الصلاة والعمرة.</div></div><div id="srR" role="status" aria-live="polite"></div>';
 const q=$('#srQ',root);q.addEventListener('input',()=>{clearTimeout(st.tm);const s=st;st.tm=setTimeout(()=>{if(st===s)run(q.value)},180)});
 root.onclick=e=>{const b=e.target.closest('[data-sr]');if(!b||!st)return;const a=b.dataset.sr;if(a==='o'){st.sel=+b.dataset.i;view()}else if(a==='b'){st.sel=null;view()}else if(a==='c')copy()};
 build().then(()=>{if(st&&st.root===root)setTimeout(()=>q.focus&&q.focus(),0)})}
let RES=[];
async function run(v){const s=st;if(!s)return;s.q=v;s.sel=null;if(!IDX&&norm(v)){const R0=$('#srR',s.root);if(R0&&window.AZ_skel)R0.innerHTML=window.AZ_skel(5)}const base=await build();if(st!==s)return;const idx=base.concat(customItems());   /* المخصص يُقرأ حيًّا عند كل بحث: لا يُخزَّن في الفهرس المبني مرة واحدة فلا يتقادم ولا يبقى بعد حذفه */const r=find(idx,v,50);RES=r.list;s.total=r.total;view()}
function view(){const s=st;if(!s)return;const R=$('#srR',s.root);if(!R)return;
 if(s.sel!=null&&RES[s.sel]){const x=RES[s.sel];R.innerHTML='<div class="card"><div class="src">'+x.g+'</div><p class="srT">'+esc(x.t)+'</p>'+(x.f?'<div class="src">'+esc(x.f)+'</div>':'')+'<div class="row"><button class="btn main" data-sr="c">نسخ</button><button class="btn" data-sr="b">رجوع للنتائج</button></div></div>';return}
 if(!norm(s.q)){R.innerHTML='';return}
 if(!RES.length){R.innerHTML='<div class="card"><p class="srM">لا توجد نتائج مطابقة.</p></div>';return}
 R.innerHTML='<div class="gl"><span>عدد النتائج</span> <b>'+A(s.total)+'</b>'+(s.total>RES.length?' · <span>يُعرض الأول</span> <b>'+A(RES.length)+'</b>':'')+'</div>'+RES.map((x,i)=>'<button class="rw lnk srI" data-sr="o" data-i="'+i+'"><span class="src">'+x.g+'</span><span class="srS">'+esc(snip(x.t))+'</span></button>').join('')}
function copy(){const s=st,x=s&&RES[s.sel];if(!x)return;const say=m=>{if(typeof toast==='function')toast(m)};const fb=()=>{try{const t=document.createElement('textarea');t.value=x.t;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();say(ok?'تم النسخ':'تعذّر النسخ')}catch(e){say('تعذّر النسخ')}};
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(x.t).then(()=>say('تم النسخ'),fb);return}}catch(e){}fb()}
function unmount(){if(st)clearTimeout(st.tm);st=null;RES=[]}
function reg(){if(window.__tl&&window.__tl.register)window.__tl.register({id:'search',ic:'🔎',t:'بحث شامل',d:'ابحث في الأذكار والأدعية بدون الحاجة للتشكيل',mount,unmount})}
function css(){const s=document.createElement('style');s.textContent='#tl .srL{display:flex;flex-direction:column;gap:8px}#tl #srQ{font:inherit;font-size:1.05rem;padding:10px 12px;min-height:48px;border-radius:12px;border:1.5px solid var(--mut);background:var(--card);color:var(--tx);width:100%;box-sizing:border-box}#tl .srI{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:start;min-height:56px;width:100%}#tl .srS{line-height:1.9;font-family:Amiri,"Noto Naskh Arabic","Traditional Arabic","Geeza Pro",serif;font-size:1.1rem;color:var(--tx)}#tl .srT{font-family:Amiri,"Noto Naskh Arabic","Traditional Arabic","Geeza Pro",serif;font-size:1.5rem;line-height:2.2;margin:8px 0}#tl .srM{color:var(--mut);margin:0}';document.head.appendChild(s)}
function init(){try{css();reg()}catch(e){console.warn('[search]',e)}}
window.__sr={norm,find,build,customItems,_idx:()=>IDX};
if(typeof document!=='undefined'&&document.body)init();
})();
