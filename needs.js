/* «أنا محتاج» — أدعية وأذكار حسب الموقف. تحميل كسول؛ المحتوى في needs.json (يُجلب مرة ويُخزَّن). نافذة سفلية ~70% وصفحة داخل «الأدوات».
   كل عنصر بمصدره ودرجته؛ ما كان اجتهادًا يُعنوَن صراحة. */
(function(){'use strict';if(window.__needs)return;
var D=document,$=function(s,r){return(r||D).querySelector(s)};
var RK='azkar_needs_recent',DATA=null,DP=null,sheet=null;
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function nz(s){return String(s||'').replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^ء-ي0-9a-z ]/gi,' ').replace(/\s+/g,' ').trim().toLowerCase()}
function rec(){try{var a=JSON.parse(AZ.data.get(RK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function mark(id){try{var a=rec().filter(function(x){return x!==id});a.unshift(id);AZ.data.set(RK,JSON.stringify(a.slice(0,4)))}catch(e){}}
function load(){if(DATA)return Promise.resolve(DATA);return DP||(DP=fetch(window.AZ&&AZ.asset?AZ.asset('needs.json'):'needs.json').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){return DATA=j.needs}).catch(function(){DP=null;return null}))}
function toastM(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
function copy(t){function fb(){try{var a=D.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';D.body.appendChild(a);a.select();D.execCommand('copy');a.remove();toastM('تم النسخ')}catch(e){toastM('تعذر النسخ')}}
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toastM('تم النسخ')},fb);return}}catch(e){}fb()}
function byId(id){return(DATA||[]).filter(function(n){return n.id===id})[0]}
function match(n,q){if(!q)return true;var h=nz(n.n+' '+n.k);return q.split(' ').every(function(w){return h.indexOf(w)>-1})}
function grid(st){var q=nz(st.q),L=(DATA||[]).filter(function(n){return match(n,q)}),h='';
 if(!q){var r=rec().map(byId).filter(Boolean);if(r.length)h+='<div class="ndr" role="group" aria-label="آخر ما استخدمت"><span class="ndl">آخر ما استخدمت</span>'+r.map(function(n){return'<button class="ndc" data-nd="o" data-id="'+n.id+'">'+n.ic+' '+esc(n.n)+'</button>'}).join('')+'</div>'}
 h+='<div class="ndg">'+L.map(function(n){return'<button class="ndt" data-nd="o" data-id="'+n.id+'"><span class="nde" aria-hidden="true">'+n.ic+'</span><span>'+esc(n.n)+'</span></button>'}).join('')+'</div>';
 if(!L.length)h+='<p class="ndm">لا يوجد موقف بهذا الاسم. جرّب كلمة أخرى، أو ابحث في «البحث الشامل».</p>';return h}
function item(x,i){var cp=x.x?'':'<button class="ndb" data-nd="c" data-i="'+i+'" aria-label="نسخ">نسخ</button>';
 return'<div class="ndi"><p class="ndq'+(x.x?' ndp':'')+'">'+esc(x.t)+'</p>'+(x.w?'<div class="ndw">'+esc(x.w)+'</div>':'')+'<div class="ndc2"><span>'+esc(x.s)+(x.g?' — '+esc(x.g):'')+'</span>'+cp+'</div></div>'}
function detail(st){var n=byId(st.sel);if(!n)return'';st.items=[];var h='<div class="ndh"><button class="ndb" data-nd="b">→ رجوع</button><h3>'+n.ic+' '+esc(n.n)+'</h3></div>';
 if(n.intro)h+='<p class="ndm">'+esc(n.intro)+'</p>';
 n.groups.forEach(function(g){if(g.h)h+='<h4>'+esc(g.h)+'</h4>';g.items.forEach(function(x){st.items.push(x);h+=item(x,st.items.length-1)})});
 if(n.note)h+='<p class="ndn">'+esc(n.note)+'</p>';return h}
function view(st){var b=$('.ndbody',st.root);if(!b)return;if(st.sel){b.innerHTML=detail(st);var s=$('.nds',st.root);if(s)s.hidden=true;b.scrollTop=0;try{$('[data-nd=b]',b).focus({preventScroll:true})}catch(e){}}
 else{var s2=$('.nds',st.root);if(s2)s2.hidden=false;b.innerHTML=DATA?grid(st):'<p class="ndm">تعذّر تحميل المحتوى. تأكد من الاتصال مرة واحدة ليُحفظ للاستخدام بدون إنترنت.</p>'}}
function ripple(e){var t=e.target.closest&&e.target.closest('.ndt');if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=t.getBoundingClientRect(),i=D.createElement('i');i.className='ndrp';var d=Math.max(r.width,r.height)*1.6;i.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';t.appendChild(i);setTimeout(function(){i.remove()},700)}
function wire(st){var root=st.root;root.addEventListener('pointerdown',ripple);
 root.addEventListener('click',function(e){var b=e.target.closest('[data-nd]');if(!b)return;var a=b.dataset.nd;
  if(a==='o'){st.sel=b.dataset.id;mark(st.sel);view(st)}else if(a==='b'){st.sel=null;view(st)}
  else if(a==='c'){var x=st.items[+b.dataset.i];if(x)copy(x.t+'\n'+x.s+(x.g?' — '+x.g:'')+'\n(أذكاري)')}
  else if(a==='x')close()});
 var q=$('.ndq0',root);if(q)q.addEventListener('input',function(){st.q=q.value;st.sel=null;view(st)})}
function shell(){return'<div class="nds"><p class="ndv">﴿أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ﴾ <small>البقرة ١٨٦</small></p><input class="ndq0" type="search" enterkeyhint="search" autocomplete="off" placeholder="ابحث عن موقفك: قلق، سفر، دين…" aria-label="ابحث عن موقف"></div><div class="ndbody" aria-live="polite"></div>'}
var CSS='.ndv{font-family:Amiri,serif;font-size:1.3rem;line-height:2;text-align:center;margin:2px 0 8px;color:var(--gold,#a67c00)}.ndv small{font-family:inherit;font-size:.8rem;opacity:.85}.ndq0{font:inherit;font-size:1rem;padding:10px 12px;min-height:48px;border-radius:12px;border:1.5px solid var(--mut,#888);background:var(--card,#fff);color:var(--tx,#222);width:100%;box-sizing:border-box;margin-bottom:10px}.ndr{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:10px}.ndl{font-size:.8rem;color:var(--mut,#666)}.ndc{min-height:44px;padding:6px 12px;border-radius:22px;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:var(--tx,#222);font:inherit;font-size:.9rem;cursor:pointer}.ndg{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ndt{position:relative;overflow:hidden;min-height:76px;border-radius:16px;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:var(--tx,#222);font:inherit;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 6px;cursor:pointer}.ndt:focus-visible,.ndc:focus-visible,.ndb:focus-visible,.ndx:focus-visible{outline:3px solid var(--gold,#a67c00);outline-offset:2px}.nde{font-size:1.6rem}.ndrp{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(90,160,200,.45),rgba(90,160,200,0) 70%);transform:scale(.1);opacity:1;pointer-events:none;animation:ndrp .7s ease-out forwards}@keyframes ndrp{to{transform:scale(1);opacity:0}}.ndh{display:flex;align-items:center;gap:8px;margin-bottom:6px}.ndh h3{margin:0;font-size:1.15rem}.ndb{min-height:44px;padding:6px 14px;border-radius:12px;border:1px solid var(--line,#ccc);background:transparent;color:var(--gold,#a67c00);font:inherit;font-weight:600;cursor:pointer}h4{margin:14px 0 4px}.ndi{border:1px solid var(--line,#ddd);border-radius:14px;background:var(--card,#fff);padding:10px 12px;margin:8px 0}.ndq{font-family:Amiri,serif;font-size:1.35rem;line-height:2.1;margin:2px 0;color:var(--tx,#222)}.ndq.ndp{font-family:inherit;font-size:1rem;line-height:1.9}.ndw{font-size:.85rem;color:var(--mut,#666);margin:2px 0}.ndc2{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:.82rem;color:var(--mut,#666)}.ndm{line-height:1.9;color:var(--tx,#222)}.ndn{line-height:1.9;font-size:.9rem;background:color-mix(in srgb,var(--gold,#a67c00) 12%,transparent);border-radius:12px;padding:8px 12px;margin-top:10px}';
var SCSS='#nd{position:fixed;inset:0;z-index:9050;background:rgba(0,0,0,.45);display:flex;align-items:flex-end}#nd .ndsh{width:100%;max-height:78vh;height:70vh;background:var(--bg,#faf6ec);color:var(--tx,#222);border-radius:22px 22px 0 0;display:flex;flex-direction:column;padding:6px 14px calc(14px + env(safe-area-inset-bottom,0px));box-sizing:border-box;animation:ndup .25s ease-out}#nd .ndhd{display:flex;align-items:center;justify-content:space-between;min-height:48px}#nd .ndhd b{font-size:1.15rem}#nd .ndx{min-width:44px;min-height:44px;border:0;border-radius:50%;background:transparent;color:var(--tx,#222);font-size:1.2rem;cursor:pointer}#nd .ndroot{flex:1;min-height:0;display:flex;flex-direction:column}#nd .ndbody{overflow-y:auto;flex:1;min-height:0;-webkit-overflow-scrolling:touch}@keyframes ndup{from{transform:translateY(40px);opacity:.4}}@media (prefers-reduced-motion:reduce){#nd .ndsh,.ndrp{animation:none}}';
function css(){if($('#nd-css'))return;var e=D.createElement('style');e.id='nd-css';e.textContent=CSS+SCSS;D.head.appendChild(e)}
function open(o){o=o||{};if(sheet)return;css();var el=D.createElement('div');el.id='nd';el.innerHTML='<div class="ndsh" role="dialog" aria-modal="true" aria-label="أنا محتاج"><div class="ndhd"><b>🤲 أنا محتاج…</b><button class="ndx" data-nd="x" aria-label="إغلاق">✕</button></div><div class="ndroot">'+shell()+'</div></div>';
 D.body.appendChild(el);D.body.style.overflow='hidden';var st=sheet={el:el,root:$('.ndroot',el),q:'',sel:null,items:[]};
 el.addEventListener('click',function(e){if(e.target===el)close()});D.addEventListener('keydown',onKey);wire(st);view(st);
 load().then(function(){if(sheet!==st)return;if(o.id&&byId(o.id)){st.sel=o.id;mark(o.id)}view(st)})}
function onKey(e){if(e.key==='Escape'&&sheet)close()}
function close(){var s=sheet;if(!s)return;sheet=null;D.removeEventListener('keydown',onKey);s.el.remove();D.body.style.overflow=''}
/* صفحة داخل «الأدوات» */
var pg=null;
function mount(root){css();root.innerHTML='<div class="card ndroot">'+shell()+'</div>';pg={root:$('.ndroot',root),q:'',sel:null,items:[]};wire(pg);view(pg);load().then(function(){if(pg)view(pg)})}
function unmount(){pg=null}
function reg(){try{if(window.__tl&&window.__tl.register)window.__tl.register({id:'needs',ic:'🤲',t:'أنا محتاج',d:'أدعية وأذكار حسب موقفك: قلق، حزن، سفر، استخارة، رقية…',mount:mount,unmount:unmount})}catch(e){}}
function index(){return load().then(function(L){var o=[];(L||[]).forEach(function(n){n.groups.forEach(function(g){g.items.forEach(function(x){if(!x.x)o.push({g:'أنا محتاج',t:x.t,f:n.n+' — '+x.s+(x.g?' — '+x.g:'')})})})});return o})}
window.__needs={open:open,close:close,load:load,index:index,reg:reg,_t:{nz:nz,match:match,rec:rec,mark:mark}};
reg();
})();
