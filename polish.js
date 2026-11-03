/* أذكاري — تحسينات الوصول (Accessibility) والإقلاع: أهداف لمس ≥٤٤px، أدوار ARIA، تخزين مسبق خفيف في الخلفية.
   لا يغيّر منطق أي شاشة؛ يضيف سمات وأنماطًا فقط. */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
function css(){const s=document.createElement('style');s.id='a11y-css';s.textContent=
'.tools button{width:44px;height:44px}.btn,.skb,.mx,.seg button,nav button{min-height:44px}.btn{min-width:44px}'
+'input[type=checkbox].ios{min-width:44px;min-height:28px}select,input[type=time],input[type=date],input[type=number],input[type=search]{min-height:44px}'
+'summary{min-height:44px}a.rw,button.rw,.rw.lnk{min-height:44px}'
+':where(button,a,select,input,summary,[tabindex]):focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}'
+'@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}';
 document.head.appendChild(s)}
/* ---------- أدوار ARIA ---------- */
function nav(){const n=$('nav');if(!n)return;if(!n.getAttribute('aria-label'))n.setAttribute('aria-label','التنقل الرئيسي');const sync=()=>$$('button',n).forEach(b=>{if(b.classList.contains('on'))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});sync();new MutationObserver(sync).observe(n,{subtree:true,attributes:true,attributeFilter:['class']})}
function dialogs(){const mc=$('#mc');if(mc){mc.setAttribute('role','dialog');mc.setAttribute('aria-modal','true');const label=()=>{const h=$('h2,h3',mc);if(h){if(!h.id)h.id='mcT';mc.setAttribute('aria-labelledby',h.id)}else mc.removeAttribute('aria-labelledby')};label();new MutationObserver(label).observe(mc,{childList:true})}
 const fm=$('#fm');if(fm&&!fm.getAttribute('role')){fm.setAttribute('role','dialog');fm.setAttribute('aria-modal','true');if(!fm.getAttribute('aria-label'))fm.setAttribute('aria-label','وضع التركيز')}}
function switches(root){$$('input[type=checkbox].ios',root||document).forEach(i=>{if(!i.getAttribute('role'))i.setAttribute('role','switch')})}
/* تقرير بسيط عن العناصر التفاعلية بلا اسم (للمراجعة T9) */
function audit(){const bad=[];$$('button,a[href],input,select,[role=button]').forEach(e=>{if(e.type==='hidden'||e.hidden)return;const t=(e.getAttribute('aria-label')||e.textContent||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim(),lb=e.id&&$('label[for="'+e.id+'"]'),wrap=e.closest&&e.closest('label');if(!t&&!lb&&!wrap)bad.push((e.tagName+'#'+(e.id||'')+'.'+(e.className||'')).slice(0,80))});return bad}
/* ---------- تخزين مسبق خفيف بعد الإقلاع (الأساسي فقط في SW) ---------- */
function warm(){try{if(!navigator.serviceWorker||!navigator.onLine)return;navigator.serviceWorker.ready.then(r=>{const w=r.active;if(!w)return;const u=['qibla.js','search.js','names.js','dua-library.json','splash.jpg'];try{if(typeof S!=='undefined'&&typeof TONES!=='undefined'&&S.tone&&/^t\d$/.test(S.tone)){const t=TONES.find(x=>x.id===S.tone);if(t)u.push(t.f)}}catch(e){}w.postMessage({type:'warm',urls:u})}).catch(()=>{})}catch(e){}}
function init(){try{css();nav();dialogs();switches();new MutationObserver(()=>switches()).observe(document.body,{childList:true,subtree:true});
 const idle=window.requestIdleCallback||(f=>setTimeout(f,1500));const go=()=>setTimeout(()=>idle(warm),4000);if(document.readyState==='complete')go();else addEventListener('load',go)}catch(e){console.warn('[polish]',e)}}
window.__a11y={audit,warm};
if(typeof document!=='undefined'&&document.body)init();
})();
