/* أذكاري — المصحف الكامل (٦٠٤ صفحة): نص عثماني من Tanzil بخط KFGQPC HAFS، بيانات محلية تُحمَّل كسولًا وتُخزَّن للقراءة بدون إنترنت.
   المصادر والتراخيص: quran/SOURCES.txt و fonts/KFGQPC-LICENSE.txt. النص المخزَّن لا يُعدَّل؛ التحويلات كلها وقت العرض فقط (انظر disp). */
(function(){'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const A=n=>typeof ar==='function'?ar(n):String(n);
const AD=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);        /* أرقام الآيات دائمًا هندية: الخط يرسم منها الزخرفة */
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const LS={g(k){try{return localStorage.getItem(k)}catch(e){return null}},s(k,v){try{localStorage.setItem(k,v)}catch(e){}},d(k){try{localStorage.removeItem(k)}catch(e){}}};
const KEY='azkari_mushaf',QC='athkar-quran',B='quran/',FONT='fonts/KFGQPC-HAFS-Uthmanic-Script.ttf',FN='KFGQPC HAFS Uthmanic Script';
const say=m=>{if(typeof toast==='function')toast(m)};
/* ---------- عرض النص بهذا الخط (لا يغيّر الملفات المخزَّنة) ----------
   الخط لا يحوي: ࣰ ࣱ ࣲ (08F0-2) و ࣳ (08F3) و ی (06CC) ولا الفواصل 2060/200A، ويرسم ۟ (06DF) و ٜ (065C) و ۣ (06E3) و ۤ (06E4) كعلامات خاطئة (دائرة/خط على السطر)، فيُحوَّل كلٌّ إلى المقابل الذي يرسمه الخط (تحقّقتُ منه بالرسم). */
const DM={0x8F0:0x64B,0x8F1:0x64C,0x8F2:0x64D,0x8F3:0x6E5,0x6CC:0x64A,0x6DF:0x6E0,0x65C:0x656,0x6E4:0x653};
function disp(t){let o='';for(const c of String(t)){const k=c.codePointAt(0);if(k===0x2060||k===0x200A||k===0x6E3)continue;o+=k in DM?String.fromCodePoint(DM[k]):c}return o}
const nz=s=>s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u2060\u200A\u08F0-\u08F3]/g,'').replace(/ٱ/g,'ا').replace(/[ىیي]/g,'ي');
function stripBsm(t){const w=t.split(' ');return w.length>4&&nz(w.slice(0,4).join(' '))==='بسم الله الرحمن الرحيم'?w.slice(4).join(' '):t}
/* ---------- حالة محفوظة (azkari_mushaf) ---------- */
const clampP=n=>Math.min(604,Math.max(1,parseInt(n)||1));
function san(o){const r={version:1,last:{page:1},fs:28,night:false,tafsir:true,bm:[]};if(o&&typeof o==='object'&&o.version===1){r.last.page=clampP(o.last&&o.last.page);r.fs=Math.min(48,Math.max(18,+o.fs||28));r.night=!!o.night;r.tafsir=o.tafsir!==false;r.bm=Array.isArray(o.bm)?o.bm.filter(x=>x&&+x.page>=1&&+x.page<=604).slice(0,50).map(x=>({page:x.page|0,t:+x.t||0})):[]}return r}
const load=()=>{try{return san(JSON.parse(LS.g(KEY)||'null'))}catch(e){return san(null)}},store=o=>LS.s(KEY,JSON.stringify(o));
/* ---------- بيانات المصحف: تحميل كسول + تخزين دائم في athkar-quran ---------- */
let M=null;const MEM=new Map();
async function raw(url){let r=null;try{const c=await caches.open(QC);r=await c.match(url)}catch(e){}
 if(!r){r=await fetch(url);if(!r.ok)throw new Error(url+' '+r.status);try{const c=await caches.open(QC);await c.put(url,r.clone())}catch(e){}}return r}
async function jget(url){if(MEM.has(url))return MEM.get(url);const j=await(await raw(url)).json();MEM.set(url,j);if(MEM.size>8)MEM.delete(MEM.keys().next().value);return j}
const bs=(a,x,n)=>{let lo=0,hi=(n||a.length)-1,r=0;while(lo<=hi){const m=(lo+hi)>>1;if(a[m]<=x){r=m;lo=m+1}else hi=m-1}return r};
const loc=g=>{const i=bs(M.ss,g);return[i+1,g-M.ss[i]+1]},pageOfG=g=>bs(M.ps,g,604)+1,chunkOf=n=>Math.ceil(n/M.cs),cc=n=>String(chunkOf(n)).padStart(2,'0');
function head(n){const g0=M.ps[n-1],g1=M.ps[n],[s0]=loc(g0),qi=bs(M.hq,g0),qs=[];M.hq.forEach((q,i)=>{if(q>=g0&&q<g1)qs.push(i)});const names=[];for(let g=g0;g<g1;){const[s,a]=loc(g);if(!names.includes(s))names.push(s);g=M.ss[s-1]+M.su[s-1][1]}
 return{juz:bs(M.jz,g0)+1,hizb:Math.floor(qi/4)+1,part:qi%4,qstarts:qs,suras:names}}
async function pageData(n){const c=await jget(B+'q'+cc(n)+'.json'),a=M.ps[n-1],b=M.ps[n],out=[];for(let g=a;g<b;g++){const[s,ay]=loc(g);out.push({g,s,a:ay,t:c.t[g-c.a]})}return out}
async function tafData(n){const c=await jget(B+'t'+cc(n)+'.json'),a=M.ps[n-1],b=M.ps[n];return c.t.slice(a-c.a,b-c.a)}
const sajdaOf=g=>{const x=M.sj.find(y=>y[0]===g);return x?x[1]+1:0};
/* ---------- الخط ---------- */
let fontOK=null,fontP=null;
function ensureFont(){if(fontP)return fontP;fontP=(async()=>{try{if(typeof FontFace==='undefined')throw 0;const buf=await(await raw(FONT)).arrayBuffer();const f=new FontFace(FN,buf);await f.load();document.fonts.add(f);fontOK=true}catch(e){fontOK=false}return fontOK})();return fontP}
/* ---------- صفحة HTML ---------- */
const QLAB=['الحزب','ربع الحزب','نصف الحزب','ثلاثة أرباع الحزب'];
function pageHtml(n,vs){let h='';const hs=new Set(M.hq);
 vs.forEach(v=>{const first=v.a===1,nm=M.su[v.s-1][0];if(first){h+='<div class="mfSn"><span>سورة</span> <b>'+esc(nm)+'</b></div>';if(v.s!==1&&v.s!==9)h+='<div class="mfBm" aria-hidden="false">'+esc(disp(M.b))+'</div>'}
  if(hs.has(v.g))h+='<span class="mfQ" aria-label="'+QLAB[M.hq.indexOf(v.g)%4]+'">۞</span> ';
  let t=v.t;if(first&&v.s!==1&&v.s!==9)t=stripBsm(t);const sj=sajdaOf(v.g);
  h+='<span class="mfV" data-g="'+v.g+'">'+esc(disp(t))+' <span class="mfN">'+AD(v.a)+'</span>'+(sj?'<span class="mfJ" aria-label="سجدة">۩</span>':'')+'</span> '});return h}
function tafHtml(vs,tf){return vs.map((v,i)=>'<p><b>'+AD(v.a)+'</b> '+esc(tf[i]||'')+'</p>').join('')}
/* ---------- الورد اليومي ---------- */
function wirdInfo(){try{const a=Math.min(604,Math.max(1,S.page|0)),k=Math.max(1,S.qpp|0||1);return{from:a,to:Math.min(604,a+k-1),k}}catch(e){return null}}
function dayO(){try{return day(today())}catch(e){return null}}
/* ---------- الواجهة ---------- */
let st=null;
function open(o){o=o||{};if(st)return Promise.resolve(true);return(async()=>{try{M=M||await jget(B+'meta.json')}catch(e){return false}
 const P=load(),w=o.wird?wirdInfo():null;let n=clampP(w?w.from:(o.page||P.last.page));try{await pageData(n)}catch(e){return false}
 if(st)return true;const el=document.createElement('div');el.id='mf';el.className=P.night?'nt':'';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','المصحف');document.body.appendChild(el);document.body.style.overflow='hidden';
 st={el,n,P,wird:!!w,seq:0,x0:0,y0:0,sv:0,menu:false,tab:'s'};try{history.pushState({mf:1},'','#mushaf');st.pushed=true}catch(e){}
 el.innerHTML='<div class="mfH"><button class="mfb" data-mf="back" aria-label="رجوع">رجوع</button><div class="mfTt"><b id="mfT1"></b><span id="mfT2"></span><span id="mfT3"></span></div><button class="mfb" data-mf="menu" aria-label="الفهرس">☰</button></div><div id="mfWd"></div><div class="mfBody" id="mfB" tabindex="-1"><div class="mfPg" id="mfPg"></div><div class="mfT" id="mfTf"></div></div>'
  +'<div class="mfF"><div class="mfR"><button class="mfb" data-mf="prev" aria-label="الصفحة السابقة">السابق</button><input type="range" id="mfS" min="1" max="604" step="1" dir="rtl" aria-label="رقم الصفحة"><button class="mfb" data-mf="next" aria-label="الصفحة التالية">التالي</button></div><div class="mfR mfTl"><button class="mfb sm" data-mf="fm" aria-label="تصغير الخط">أ−</button><button class="mfb sm" data-mf="fp" aria-label="تكبير الخط">أ+</button><button class="mfb sm" data-mf="nt" id="mfNt"></button><button class="mfb sm" data-mf="tf" id="mfTg"></button><button class="mfb sm" data-mf="bm" id="mfBm" aria-label="إضافة علامة">☆</button></div></div><div id="mfMn" hidden></div><div class="src mfSt" id="mfSt" role="status" aria-live="polite"></div>';
 el.addEventListener('click',onClick);el.addEventListener('touchstart',ts,{passive:true});el.addEventListener('touchend',te,{passive:true});el.addEventListener('keydown',onKey);el.addEventListener('input',e=>{if(e.target.id==='mfS')st.sv=+e.target.value});el.addEventListener('change',e=>{if(e.target.id==='mfS')go(+e.target.value)});
 ensureFont().then(()=>{if(st)st.el.classList.toggle('nof',!fontOK)});render(0);const b=$('[data-mf="back"]',el);if(b&&b.focus)b.focus();return true})()}
function close(fromPop){if(!st)return;const s=st;st=null;s.el.removeEventListener('click',onClick);s.el.remove();document.body.style.overflow='';flush(s);if(s.pushed&&!fromPop){try{history.back()}catch(e){}}}
function flush(s){clearTimeout(s.sv2);const P=load();P.last.page=s.n;P.fs=s.P.fs;P.night=s.P.night;P.tafsir=s.P.tafsir;P.bm=s.P.bm;store(P)}
function save(){clearTimeout(st.sv2);st.sv2=setTimeout(()=>{if(st)flush(st)},500)}
async function render(dir){const s=st;if(!s)return;const n=s.n,seq=++s.seq,H=head(n),pg=$('#mfPg',s.el),B0=$('#mfB',s.el);
 $('#mfT1',s.el).innerHTML='<span>صفحة</span> <b>'+A(n)+'</b>';$('#mfT2',s.el).innerHTML='<span>الجزء</span> <b>'+A(H.juz)+'</b> · <span>'+QLAB[H.part]+'</span> <b>'+A(H.hizb)+'</b>';
 $('#mfT3',s.el).innerHTML=H.suras.slice(0,2).map(x=>'<span>سورة</span> '+esc(M.su[x-1][0])).join(' · ');
 $('#mfS',s.el).value=n;$('#mfNt',s.el).textContent=s.P.night?'☀':'☾';$('#mfNt',s.el).setAttribute('aria-label',s.P.night?'وضع نهاري':'وضع ليلي');const tg=$('#mfTg',s.el);tg.textContent='تفسير';tg.setAttribute('aria-pressed',String(s.P.tafsir));
 const has=s.P.bm.some(x=>x.page===n);$('#mfBm',s.el).textContent=has?'★':'☆';$('#mfBm',s.el).setAttribute('aria-label',has?'حذف العلامة':'إضافة علامة');
 pg.style.fontSize=s.P.fs+'px';s.el.style.setProperty('--mfs',s.P.fs+'px');
 if(window.AZ_skel&&dir!==undefined)pg.innerHTML=window.AZ_skel(8);
 let vs;try{vs=await pageData(n)}catch(e){if(seq===s.seq&&st===s)pg.innerHTML='<div class="mfEr"><p>تعذّر تحميل ملفات المصحف.</p><button class="mfb" data-mf="retry">إعادة المحاولة</button></div>';return}
 if(seq!==s.seq||st!==s)return;pg.className='mfPg'+(dir>0?' dN':dir<0?' dP':'');pg.innerHTML=pageHtml(n,vs);B0.scrollTop=0;
 wird(s,n);const tf=$('#mfTf',s.el);tf.innerHTML='';tf.hidden=!s.P.tafsir;
 if(s.P.tafsir){tf.innerHTML=window.AZ_skel?window.AZ_skel(4):'';tafData(n).then(t=>{if(seq===s.seq&&st===s)tf.innerHTML='<div class="mfTh"><b>التفسير الميسر</b></div>'+tafHtml(vs,t)}).catch(()=>{if(seq===s.seq&&st===s)tf.innerHTML=''})}
 $('#mfSt',s.el).textContent='';if(n<604)pre(n+1);if(n>1&&n%M.cs===1)pre(n-1);save()}
function pre(n){if(chunkOf(n)!==chunkOf(st.n)||n%M.cs>=M.cs-3||n%M.cs<=2)pageData(n).catch(()=>{})}
function wird(s,n){const box=$('#mfWd',s.el);if(!s.wird){box.innerHTML='';return}const w=wirdInfo(),d=dayO();if(!w){box.innerHTML='';return}const both=d&&d.qm&&d.qe,atEnd=n>=w.to;
 box.innerHTML='<div class="mfW"><span>الورد:</span> <span>صفحة</span> <b>'+A(w.from)+'</b>'+(w.to>w.from?' <span>إلى</span> <b>'+A(w.to)+'</b>':'')+(both?' <span class="mfOk">ورد اليوم مكتمل ✓</span>':(atEnd?' <button class="mfb gold" data-mf="done">تمت القراءة ✅</button>':''))+'</div>'}
function go(n,dir){const s=st;if(!s)return;n=clampP(n);if(n===s.n&&dir===undefined)return;const d=dir===undefined?(n>s.n?1:-1):dir;s.n=n;render(d)}
function step(k){go(st.n+k,k)}
/* RTL: الإصبع يمينًا = الصفحة التالية (كالكتاب العربي)، ويُعكس في واجهات LTR */
const rtl=()=>{try{return document.documentElement.dir==='rtl'}catch(e){return true}};
function ts(e){const t=e.changedTouches&&e.changedTouches[0];if(st&&t){st.x0=t.clientX;st.y0=t.clientY}}
function te(e){const t=e.changedTouches&&e.changedTouches[0];if(!st||!t||st.menu)return;const dx=t.clientX-st.x0,dy=t.clientY-st.y0;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.6)return;step((dx>0)===rtl()?1:-1)}
function onKey(e){if(!st)return;if(e.key==='Escape'){if(st.menu)menu(false);else close()}else if(!st.menu&&e.target.id!=='mfS'){if(e.key==='ArrowLeft')step(rtl()?1:-1);else if(e.key==='ArrowRight')step(rtl()?-1:1)}}
function onClick(e){const b=e.target.closest&&e.target.closest('[data-mf]');if(!b||!st)return;const a=b.dataset.mf,s=st;
 if(a==='back')close();else if(a==='next')step(1);else if(a==='prev')step(-1);
 else if(a==='fp'||a==='fm'){s.P.fs=Math.min(48,Math.max(18,s.P.fs+(a==='fp'?2:-2)));$('#mfPg',s.el).style.fontSize=s.P.fs+'px';save()}
 else if(a==='nt'){s.P.night=!s.P.night;s.el.classList.toggle('nt',s.P.night);$('#mfNt',s.el).textContent=s.P.night?'☀':'☾';save()}
 else if(a==='tf'){s.P.tafsir=!s.P.tafsir;save();render()}
 else if(a==='bm'){const i=s.P.bm.findIndex(x=>x.page===s.n);if(i>=0)s.P.bm.splice(i,1);else s.P.bm.unshift({page:s.n,t:Date.now()});s.P.bm=s.P.bm.slice(0,50);save();render()}
 else if(a==='done')wirdDone();else if(a==='retry')render();
 else if(a==='menu')menu(true);else if(a==='mx')menu(false);else if(a==='tab'){s.tab=b.dataset.k;menu(true)}
 else if(a==='gp'){menu(false);go(+b.dataset.p)}else if(a==='gj'){const v=parseInt($('#mfJ',s.el).value);if(v>=1&&v<=604){menu(false);go(v)}else say('أدخل رقم صفحة من ١ إلى ٦٠٤')}
 else if(a==='bd'){s.P.bm=s.P.bm.filter(x=>x.page!==+b.dataset.p);save();menu(true)}else if(a==='dl')download(b);else if(a==='sz')cacheSize()}
function wirdDone(){try{const d=day(today()),k=!d.qm?'m':(!d.qe?'e':null);if(k){const b=document.getElementById('q'+k);if(b&&!b.disabled)b.click()}}catch(e){}if(st)wird(st,st.n)}
/* ---------- الفهرس: سورة / جزء / صفحة / علامات ---------- */
function menu(on){const s=st;if(!s)return;s.menu=on;const m=$('#mfMn',s.el);m.hidden=!on;if(!on){m.innerHTML='';return}
 const tabs=[['s','سورة'],['j','جزء'],['p','صفحة'],['b','علامات']],lang=typeof LANG!=='undefined'?LANG:'ar';let body='';
 if(s.tab==='s')body='<div class="mfL">'+M.su.map((x,i)=>'<button class="mfI" data-mf="gp" data-p="'+(pageOfG(M.ss[i]))+'"><b>'+(i+1)+'. '+esc(x[0])+'</b><span class="src">'+(lang!=='ar'?esc(x[3])+' · ':'')+A(x[1])+' <small>'+'</small></span><span class="mfPn">'+A(pageOfG(M.ss[i]))+'</span></button>').join('')+'</div>';
 else if(s.tab==='j')body='<div class="mfL">'+M.jz.map((g,i)=>'<button class="mfI" data-mf="gp" data-p="'+pageOfG(g)+'"><b><span>الجزء</span> '+A(i+1)+'</b><span class="mfPn">'+A(pageOfG(g))+'</span></button>').join('')+'</div>';
 else if(s.tab==='p')body='<div class="mfJp"><label><span>رقم الصفحة (١–٦٠٤)</span><input type="number" id="mfJ" min="1" max="604" inputmode="numeric" value="'+s.n+'" aria-label="رقم الصفحة"></label><button class="mfb gold" data-mf="gj">انتقال</button></div>';
 else body=s.P.bm.length?'<div class="mfL">'+s.P.bm.map(x=>{const h=head(x.page);return '<div class="mfBr"><button class="mfI" data-mf="gp" data-p="'+x.page+'"><b><span>صفحة</span> '+A(x.page)+'</b><span class="src"><span>سورة</span> '+esc(M.su[h.suras[0]-1][0])+'</span></button><button class="mfb sm" data-mf="bd" data-p="'+x.page+'" aria-label="حذف العلامة">✕</button></div>'}).join('')+'</div>':'<p class="mfEm">لا توجد علامات بعد.</p>';
 m.innerHTML='<div class="mfMh"><button class="mfb" data-mf="mx" aria-label="إغلاق">إغلاق</button><b>الفهرس</b><span class="mfSp"></span></div><div class="mfTabs" role="tablist">'+tabs.map(t=>'<button data-mf="tab" data-k="'+t[0]+'" role="tab" aria-selected="'+(s.tab===t[0])+'" class="'+(s.tab===t[0]?'on':'')+'">'+t[1]+'</button>').join('')+'</div><div class="mfMb">'+body+'<div class="mfFt"><button class="mfb sm" data-mf="dl">تحميل المصحف كاملاً للقراءة بدون إنترنت</button> <button class="mfb sm" data-mf="sz">حجم الملفات المحفوظة</button><div class="src" id="mfSz"></div><div class="src mfCr">نص المصحف: Tanzil.net · التفسير الميسر: مجمع الملك فهد لطباعة المصحف الشريف · الخط: KFGQPC HAFS Uthmanic Script © مجمع الملك فهد لطباعة المصحف الشريف</div></div></div>'}
/* ---------- تحميل كامل للقراءة بدون إنترنت + الحجم ---------- */
const files=()=>{const L=[B+'meta.json',FONT],n=Math.ceil(604/M.cs);for(let c=1;c<=n;c++){const k=String(c).padStart(2,'0');L.push(B+'q'+k+'.json',B+'t'+k+'.json')}return L};
async function download(btn){try{M=M||await jget(B+'meta.json')}catch(e){say('تعذّر تحميل ملفات المصحف.');return false}const L=files();let ok=0;const lab=btn&&btn.innerHTML;
 const show=()=>{if(btn)btn.innerHTML='<span>جارٍ تحميل المصحف…</span> <b>'+A(ok)+' / '+A(L.length)+'</b>'};show();
 for(const u of L){try{await raw(u);ok++}catch(e){}show()}
 const all=ok===L.length;if(btn)btn.textContent=all?'✓ المصحف محفوظ للقراءة بدون إنترنت':lab&&lab.replace(/<[^>]+>/g,'')||'تحميل المصحف كاملاً للقراءة بدون إنترنت';say(all?'تم حفظ المصحف للقراءة بدون إنترنت':'تعذّر تحميل ملفات المصحف.');return all}
async function cacheSize(){const out=st&&$('#mfSz',st.el);try{const c=await caches.open(QC),ks=(await c.keys()).filter(r=>/\/(quran|fonts)\//.test(r.url));let t=0;for(const r of ks){const b=await(await c.match(r)).blob();t+=b.size}if(out)out.innerHTML='<b>'+A((t/1048576).toFixed(2))+'</b> <span>م.ب</span> · <b>'+A(ks.length)+'</b> <span>ملفًا</span>';return t}catch(e){if(out)out.textContent='—';return 0}}
/* ---------- نسخ احتياطي (azkari_mushaf) ---------- */
const exportData=()=>{const o=LS.g(KEY);return o?{azkari_mushaf:load()}:{}},importData=j=>{if(!j||!j.azkari_mushaf)return false;const o=san(j.azkari_mushaf);store(o);return true},wipe=()=>LS.d(KEY);
/* ---------- تنسيق ---------- */
function css(){if($('#mf-css'))return;const s=document.createElement('style');s.id='mf-css';s.textContent=
'#mf{--bg:#fbf6e8;--tx:#1c1a14;--mu:#5a5242;--ac:#7a5a12;--ln:#d9cfb4;--cd:#f2ead3;position:fixed;inset:0;z-index:9200;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;font-family:Cairo,system-ui,sans-serif}'
+'#mf.nt{--bg:#10161a;--tx:#e8e2cf;--mu:#b9b29d;--ac:#e0c06a;--ln:#33403f;--cd:#1a2428}#mf *{box-sizing:border-box}'
+'#mf .mfH{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;border-bottom:1px solid var(--ln)}'
+'#mf .mfTt{display:flex;flex-direction:column;align-items:center;text-align:center;line-height:1.5;min-width:0}#mf .mfTt b{font-size:1.05rem}#mf .mfTt span{font-size:.85rem;color:var(--mu)}#mf b{font-variant-numeric:tabular-nums}'
+'#mf .mfb{background:var(--cd);color:var(--tx);border:1.5px solid var(--ln);border-radius:12px;padding:8px 12px;min-height:44px;min-width:44px;font:inherit}#mf .mfb.sm{padding:6px 10px}#mf .mfb.gold{background:var(--ac);color:var(--bg);border-color:var(--ac);font-weight:700}#mf .mfb[aria-pressed=true]{border-color:var(--ac);color:var(--ac)}'
+'#mf .mfBody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:6px 14px 18px}'
+'#mf .mfPg{direction:rtl;text-align:justify;text-align-last:center;font-family:"'+FN+'","Amiri Quran","Amiri","Noto Naskh Arabic","Traditional Arabic",serif;font-size:var(--mfs,28px);line-height:2.25;padding:6px 2px}'
+'#mf .mfPg.dN{animation:mfn .22s ease}#mf .mfPg.dP{animation:mfp .22s ease}@keyframes mfn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}@keyframes mfp{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}'
+'#mf .mfSn{text-align:center;border:2px solid var(--ac);border-radius:14px;padding:2px 10px;margin:10px 0 4px;color:var(--ac);font-family:Cairo,system-ui,sans-serif;font-size:.7em;line-height:2;background:var(--cd);text-align-last:center}#mf .mfBm{text-align:center;font-size:.85em;margin:2px 0 6px}'
+'#mf .mfN{white-space:nowrap}#mf.nof .mfN::before{content:"﴿"}#mf.nof .mfN::after{content:"﴾"}#mf .mfQ{color:var(--ac);font-size:.8em}#mf .mfJ{color:var(--ac);margin-inline-start:.2em}'
+'#mf .mfT{direction:rtl;border-top:1px solid var(--ln);margin-top:10px;padding-top:6px;font-size:1rem;line-height:1.95}#mf .mfT[hidden]{display:none}#mf .mfT p{margin:6px 0}#mf .mfTh{color:var(--ac);margin:2px 0 4px}'
+'#mf .mfF{border-top:1px solid var(--ln);padding:6px 10px calc(8px + env(safe-area-inset-bottom,0px));background:var(--bg)}#mf .mfR{display:flex;align-items:center;gap:8px;margin:2px 0}#mf .mfR input[type=range]{flex:1;min-width:0;height:44px;accent-color:var(--ac)}#mf .mfTl{justify-content:center;flex-wrap:wrap}'
+'#mf .mfW{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:6px 12px;background:var(--cd);border-bottom:1px solid var(--ln);line-height:1.8}#mf .mfOk{color:var(--ac);font-weight:700}'
+'#mf .mfEr{text-align:center;padding:30px 10px;line-height:2}#mf .mfEm{text-align:center;color:var(--mu);padding:20px}'
+'#mfMn{position:absolute;inset:0;background:var(--bg);display:flex;flex-direction:column;z-index:2}#mfMn[hidden]{display:none}#mf .mfMh{display:flex;justify-content:space-between;align-items:center;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;border-bottom:1px solid var(--ln)}#mf .mfSp{min-width:60px}'
+'#mf .mfTabs{display:flex;gap:6px;padding:8px 10px}#mf .mfTabs button{flex:1;min-height:44px;border-radius:12px;border:1.5px solid var(--ln);background:var(--cd);color:var(--tx);font:inherit}#mf .mfTabs button.on{background:var(--ac);color:var(--bg);border-color:var(--ac);font-weight:700}'
+'#mf .mfMb{flex:1;overflow-y:auto;padding:4px 10px calc(16px + env(safe-area-inset-bottom,0px))}#mf .mfL{display:flex;flex-direction:column;gap:6px}#mf .mfI{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:48px;text-align:start;padding:8px 12px;border-radius:12px;border:1px solid var(--ln);background:var(--cd);color:var(--tx);font:inherit}#mf .mfI .src{flex:1;margin-inline-start:8px;color:var(--mu)}#mf .mfPn{color:var(--ac);font-weight:700}#mf .mfBr{display:flex;gap:6px;align-items:center}'
+'#mf .mfJp{display:flex;gap:10px;align-items:flex-end;padding:10px 4px}#mf .mfJp label{display:flex;flex-direction:column;gap:6px;flex:1}#mf .mfJp input{font:inherit;min-height:44px;padding:8px;border-radius:10px;border:1.5px solid var(--ln);background:var(--cd);color:var(--tx)}#mf .mfFt{margin-top:14px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}#mf .mfCr,#mf .src{color:var(--mu);line-height:1.8;font-size:.85rem}#mf .mfSt{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}'
+'#mf button:focus-visible,#mf input:focus-visible{outline:3px solid var(--ac);outline-offset:2px}@media (prefers-reduced-motion:reduce){#mf *{animation:none!important;transition:none!important}}';document.head.appendChild(s)}
function init(){try{css();addEventListener('popstate',()=>{if(st)close(true)})}catch(e){console.warn('[mushaf]',e)}}
window.__mf={open,close,download,cacheSize,exportData,importData,wipe,available:true,_t:{disp,stripBsm,nz,san,head,pageHtml,pageData,tafData,loc,pageOfG,wirdInfo,files,go:n=>go(n),st:()=>st,setM:m=>{M=m},DM,sajdaOf}};
if(typeof document!=='undefined'&&document.body)init();
})();
