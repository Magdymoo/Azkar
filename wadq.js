/* الودق — تحميل كسول (AZ_lazy). مشاهد Canvas 2D إجرائية: نار هادئة ← مطر ← كلمة (آية/حديث بالمصدر والدرجة).
   لا مكتبات ولا صور. 30fps، يتوقف عند إخفاء الصفحة، ويحترم prefers-reduced-motion (صورتان ثابتتان). */
(function(){'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)};
var LS={g:function(k){try{return AZ.data.get(k)}catch(e){return null}},s:function(k,v){try{AZ.data.set(k,v)}catch(e){}}};
var SND='sounds/wadq-rain.mp3',RAIN_MS=7000,FRAME=1000/30;
var st=null,bag=[],lastItem=null,sndOk=null;
function reduced(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
function low(){try{return (navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||4)<=2}catch(e){return false}}
function items(){return window.AZKAR_REASSURANCE_ITEMS||[{c:'قلق',t:'﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',s:'الشرح ٥'}]}
/* حقيبة عشوائية: لا تكرار حتى تُستنفد؛ ولا يتكرر آخر عنصر عند إعادة الملء */
function pick(cat){var all=items(),pool=cat?all.filter(function(x){return x.c===cat}):all;if(!pool.length)pool=all;
 var key=cat||'*';bag=bag.filter(function(x){return x.k===key});
 if(!bag.length){var ix=pool.map(function(_,i){return i});for(var i=ix.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=ix[i];ix[i]=ix[j];ix[j]=t}
  if(ix.length>1&&pool[ix[ix.length-1]]===lastItem){var f=ix.shift();ix.push(f)}
  bag=ix.map(function(i){return{k:key,it:pool[i]}})}
 var n=bag.pop().it;lastItem=n;return n}
function cite(x){return x.s+(x.g?' — '+x.g:'')}
function full(x){return x.t+'\n'+cite(x)+'\n(أذكاري)'}
/* ---------- رسم ---------- */
function sprite(r,g,b){var c=D.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d'),q=x.createRadialGradient(32,32,0,32,32,32);
 q.addColorStop(0,'rgba('+r+','+g+','+b+',1)');q.addColorStop(.4,'rgba('+r+','+g+','+b+',.45)');q.addColorStop(1,'rgba('+r+','+g+','+b+',0)');x.fillStyle=q;x.fillRect(0,0,64,64);return c}
var SP=null;
function fireInit(s){SP=SP||[sprite(255,200,90),sprite(255,130,40),sprite(200,50,20)];s.p=[];var n=low()?26:48;for(var i=0;i<n;i++)s.p.push(spawn(s,true))}
function spawn(s,init){var w=s.w,h=s.h;return{x:w*.5+(Math.random()-.5)*w*.09,y:h*.52+Math.random()*h*.02,vx:(Math.random()-.5)*.3,vy:-(.35+Math.random()*.6)*h/420,l:init?Math.random():0,d:.007+Math.random()*.008,r:(.07+.06*Math.random())*Math.min(w,h*.8)}}
function bg(x,s,a,b){var g=x.createLinearGradient(0,0,0,s.h);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,s.w,s.h)}
function fire(s,t){var x=s.x,w=s.w,h=s.h;bg(x,s,'#0c1416','#1d1410');
 var g=x.createRadialGradient(w/2,h*.45,0,w/2,h*.45,h*.45);g.addColorStop(0,'rgba(255,140,50,'+(.22+.04*Math.sin(t/700))+')');g.addColorStop(1,'rgba(255,140,50,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.fillStyle='#2a1a12';var lw=w*.34,lh=h*.028,cx=w/2,cy=h*.56;x.save();x.translate(cx,cy);x.rotate(.12);x.fillRect(-lw/2,0,lw,lh);x.restore();x.save();x.translate(cx,cy);x.rotate(-.12);x.fillRect(-lw/2,lh*.4,lw,lh);x.restore();
 x.globalCompositeOperation='lighter';
 for(var i=0;i<s.p.length;i++){var p=s.p[i];p.l+=p.d;if(p.l>=1){s.p[i]=p=spawn(s)}
  p.x+=p.vx*w/220+Math.sin(t/900+i)*.25*w/220;p.y+=p.vy;var k=1-p.l,r=p.r*(.4+k*.9),sp=SP[p.l<.35?0:p.l<.7?1:2];x.globalAlpha=Math.max(0,k*.3);x.drawImage(sp,p.x-r*.8,p.y-r*1.6,r*1.6,r*3.2)}
 x.globalAlpha=1;x.globalCompositeOperation='source-over'}
function rainInit(s){var n=low()?60:110;s.d=[];for(var i=0;i<n;i++)s.d.push({x:Math.random()*s.w,y:Math.random()*s.h,l:s.h*(.03+Math.random()*.05),v:s.h*(.016+Math.random()*.014),a:.25+Math.random()*.4});s.rp=[]}
function rain(s,t){var x=s.x,w=s.w,h=s.h;bg(x,s,'#0e1b26','#16303a');
 for(var c=0;c<4;c++){var cx=w*(.15+c*.25)+Math.sin(t/4000+c)*w*.03,g=x.createRadialGradient(cx,h*.06,0,cx,h*.06,w*.4);g.addColorStop(0,'rgba(120,150,165,.28)');g.addColorStop(1,'rgba(120,150,165,0)');x.fillStyle=g;x.fillRect(0,0,w,h*.5)}
 x.lineCap='round';x.lineWidth=Math.max(1,w/380);
 for(var i=0;i<s.d.length;i++){var d=s.d[i];d.y+=d.v;d.x-=d.v*.12;if(d.y>h*.94){if(s.rp.length<14)s.rp.push({x:d.x,y:h*.94+Math.random()*h*.05,r:2,a:.35});d.y=-d.l;d.x=Math.random()*w*1.1}
  x.strokeStyle='rgba(190,215,230,'+d.a+')';x.beginPath();x.moveTo(d.x,d.y);x.lineTo(d.x+d.l*.12,d.y+d.l);x.stroke()}
 for(var j=s.rp.length-1;j>=0;j--){var r=s.rp[j];r.r+=.7;r.a-=.012;if(r.a<=0){s.rp.splice(j,1);continue}x.strokeStyle='rgba(190,215,230,'+r.a+')';x.beginPath();x.ellipse(r.x,r.y,r.r*2,r.r*.6,0,0,6.283);x.stroke()}}
function size(s){var cv=s.cv,k=(s.scene==='rain'?.75:(low()?.4:.55)),w=Math.max(1,Math.round(cv.clientWidth*k)),h=Math.max(1,Math.round(cv.clientHeight*k));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}s.w=w;s.h=h}
function loop(ts){var s=st;if(!s||s.closed)return;s.raf=0;if(s.scene==='word'||s.paused)return;
 s.raf=requestAnimationFrame(loop);if(ts-s.last<FRAME)return;s.last=ts;draw(s,ts)}
function draw(s,ts){if(s.scene==='fire')fire(s,ts);else if(s.scene==='rain')rain(s,ts)}
function startAnim(s){if(s.raf)cancelAnimationFrame(s.raf);s.raf=0;size(s);if(s.scene==='fire')fireInit(s);else if(s.scene==='rain')rainInit(s);
 if(s.scene==='word'){rainInit(s);rain(s,0);return}
 if(reduced()){var t=s.scene==='fire'?0:4e3;if(s.scene==='fire')for(var i=0;i<30;i++)draw(s,i*33);else for(var k=0;k<40;k++)draw(s,t+k*33);return}
 s.last=0;s.raf=requestAnimationFrame(loop)}
/* ---------- واجهة ---------- */
var CSS='#wd{position:fixed;inset:0;z-index:9100;background:#0c1416;color:#f4f8f5;display:flex;flex-direction:column;font-family:inherit}#wd canvas{position:absolute;inset:0;width:100%;height:100%;display:block;transition:opacity .6s}#wd .wdu{position:relative;flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:calc(56px + env(safe-area-inset-top,0px)) 20px calc(22px + env(safe-area-inset-bottom,0px));text-align:center;gap:10px;overflow-y:auto}#wd .wdp{background:rgba(8,14,16,.62);border-radius:18px;padding:14px 16px;max-width:560px;width:100%}#wd .wdx{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline-end:14px;z-index:2;min-width:44px;min-height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:1.1rem;cursor:pointer}#wd .wds{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline-start:14px;z-index:2;min-width:44px;min-height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:1.1rem;cursor:pointer}#wd h2{margin:0 0 4px;color:#e6c97a;font-size:1.3rem}#wd .wdq{font-family:Amiri,serif;font-size:1.55rem;line-height:2.1;margin:6px 0}#wd .wdq.big{font-size:1.75rem}#wd .wdm{line-height:1.9;margin:4px 0;color:#f4f8f5}#wd .wdc{color:#cfe4dc;font-size:.9rem}#wd .wdt{display:inline-block;background:rgba(230,201,122,.2);color:#e6c97a;border-radius:10px;padding:2px 12px;font-size:.85rem;margin-bottom:6px}#wd .wdr{display:grid;gap:8px;width:100%;max-width:560px}#wd .wdr.two{grid-template-columns:1fr 1fr}#wd button.wb{min-height:48px;border-radius:14px;border:1.5px solid rgba(255,255,255,.4);background:rgba(255,255,255,.1);color:#f4f8f5;font:inherit;font-weight:600;cursor:pointer;padding:8px 14px}#wd button.wb.main{background:#e6c97a;color:#1b2b2c;border-color:#e6c97a;font-weight:700}#wd button:focus-visible{outline:3px solid #fff;outline-offset:2px}@media (prefers-reduced-motion:reduce){#wd canvas{transition:none}}';
function css(){if($('#wd-css'))return;var e=D.createElement('style');e.id='wd-css';e.textContent=CSS;D.head.appendChild(e)}
function btn(a,l,m){return '<button class="wb'+(m?' main':'')+'" data-a="'+a+'">'+l+'</button>'}
function view(s){var h='',u=$('.wdu',s.el);
 if(s.scene==='fire')h='<div class="wdp"><h2>الودق</h2><p class="wdm">اجلس قليلًا، وخذ نفسًا عميقًا… واذكر الله.</p><p class="wdq">﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾</p><div class="wdc">الرعد ٢٨</div></div><div class="wdr">'+btn('ok','قلبي اطمأن',1)+btn('more','ما زلت أحتاج المزيد')+'</div>';
 else if(s.scene==='rain')h='<div class="wdp"><p class="wdq">﴿فَتَرَى الْوَدْقَ يَخْرُجُ مِنْ خِلَالِهِ﴾</p><div class="wdc">النور ٤٣، والروم ٤٨</div><p class="wdm">الحمد لله… بعد الغيم يأتي الودق.</p></div><div class="wdr">'+btn('skip',reduced()?'التالي':'تخطّي',1)+'</div>';
 else{var x=s.item;h='<div class="wdp"><span class="wdt">'+x.c+'</span><p class="wdq big">'+x.t+'</p><div class="wdc">'+cite(x)+'</div></div><div class="wdr two">'+btn('next','آية/حديث آخر',1)+btn('copy','نسخ')+btn('share','مشاركة')+btn('close','إغلاق')+'</div><div class="wdr">'+btn('needs','أحتاج دعاءً لموقفي… (أنا محتاج)')+'</div>'}
 u.innerHTML=h;u.setAttribute('aria-live','polite');var f=$('button.main',u)||$('button',u);try{f&&f.focus({preventScroll:true})}catch(e){}}
function go(s,scene){if(s.timer){clearTimeout(s.timer);s.timer=0}s.scene=scene;s.cv.style.opacity=scene==='word'?'.35':'1';
 if(scene==='word'){s.item=pick(s.cat);stopSnd(s)}
 if(scene==='rain'){s.cv.style.opacity='0';setTimeout(function(){if(st===s)s.cv.style.opacity='1'},30);if(!reduced())s.timer=setTimeout(function(){if(st===s&&s.scene==='rain')go(s,'word')},RAIN_MS);playSnd(s)}
 startAnim(s);view(s)}
function onClick(e){var s=st;if(!s||s.closed)return;var b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a;
 if(a==='close')return close();
 if(a==='ok')go(s,'rain');else if(a==='skip')go(s,'word');else if(a==='next'){s.item=pick(s.cat);view(s)}
 else if(a==='more'){close();try{window.__sk&&window.__sk.open()}catch(x){}}
 else if(a==='needs'){close();window.AZ_lazy('needs.js','__needs').then(function(){window.__needs.open()}).catch(function(){})}
 else if(a==='copy')copy(s.item);else if(a==='share')share(s.item);else if(a==='snd')toggleSnd(s,b)}
function toastM(m){try{if(typeof toast==='function')toast(m)}catch(e){}}
function copy(x){var t=full(x);function fb(){try{var a=D.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';D.body.appendChild(a);a.select();D.execCommand('copy');a.remove();toastM('تم النسخ')}catch(e){toastM('تعذر النسخ')}}
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toastM('تم النسخ')},fb);return}}catch(e){}fb()}
/* صورة المشاركة: 1080×1350 */
function wrap(x,t,max){var w=t.split(' '),L=[],c='';for(var i=0;i<w.length;i++){var n=c?c+' '+w[i]:w[i];if(x.measureText(n).width>max&&c){L.push(c);c=w[i]}else c=n}if(c)L.push(c);return L}
async function card(it){try{if(D.fonts&&D.fonts.load){await D.fonts.load('700 40px Amiri');await D.fonts.load('400 40px Cairo')}}catch(e){}
 var c=D.createElement('canvas');c.width=1080;c.height=1350;var x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#0f2a2e');g.addColorStop(1,'#16383a');x.fillStyle=g;x.fillRect(0,0,1080,1350);
 x.strokeStyle='#e6c97a';x.lineWidth=4;x.strokeRect(44,44,992,1262);x.direction='rtl';x.textAlign='center';x.textBaseline='middle';
 x.fillStyle='#e6c97a';x.font='700 52px Amiri,serif';x.fillText('الودق',540,150);
 var len=it.t.length,fs=len>150?46:len>90?54:len>45?66:78;x.font='700 '+fs+'px Amiri,serif';x.fillStyle='#f4f8f5';var L=wrap(x,it.t,900),lh=fs*1.9,y=675-(L.length-1)*lh/2;
 L.forEach(function(l,i){x.fillText(l,540,y+i*lh)});
 x.font='400 34px Cairo,sans-serif';x.fillStyle='#cfe4dc';x.fillText(cite(it),540,1160);x.fillStyle='#e6c97a';x.font='700 38px Amiri,serif';x.fillText('أذكاري',540,1240);return c}
async function share(it){try{var c=await card(it);c.toBlob(async function(b){if(!b){copy(it);return}var f=new File([b],'wadq.png',{type:'image/png'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:full(it)});return}}catch(e){if(e&&e.name==='AbortError')return}
 var a=D.createElement('a');a.href=URL.createObjectURL(b);a.download='wadq.png';D.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},4000);toastM('تم تجهيز الصورة')},'image/png')}catch(e){copy(it)}}
/* ---------- صوت المطر (اختياري، معطّل افتراضيًا، والملف غير مضمَّن) ---------- */
function sndProbe(){return sndOk||(sndOk=(async function(){try{var u=window.AZ&&AZ.asset?AZ.asset(SND):SND,r=await fetch(u,{method:'HEAD'});return r.ok?u:null}catch(e){return null}})())}
function sndPref(){return LS.g('azkar_wadq_snd')==='1'}
function playSnd(s){if(!sndPref())return;sndProbe().then(function(u){if(!u||!st||st!==s||s.scene!=='rain')return;try{var a=new Audio(u);a.loop=true;a.volume=.5;s.au=a;a.play().catch(function(){})}catch(e){}})}
function stopSnd(s){try{if(s.au){s.au.pause();s.au=null}}catch(e){}}
function toggleSnd(s,b){var on=!sndPref();LS.s('azkar_wadq_snd',on?'1':'0');b.textContent=on?'🔊':'🔇';b.setAttribute('aria-pressed',on?'true':'false');if(on){if(s.scene==='rain')playSnd(s)}else stopSnd(s)}
/* ---------- دورة الحياة ---------- */
function onVis(){var s=st;if(!s)return;if(D.hidden){s.paused=true;if(s.raf){cancelAnimationFrame(s.raf);s.raf=0}stopSnd(s)}else if(s.paused){s.paused=false;if(s.scene==='rain'||s.scene==='fire'){if(!reduced()){s.last=0;s.raf=requestAnimationFrame(loop)}if(s.scene==='rain')playSnd(s)}}}
function onKey(e){if(e.key==='Escape'&&st)close()}
function open(o){o=o||{};if(st){if(st.el&&D.body.contains(st.el))return;st=null}css();var el=D.createElement('div');el.id='wd';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','الودق');
 el.innerHTML='<canvas aria-hidden="true"></canvas><button class="wdx" data-a="close" aria-label="إغلاق">✕</button><button class="wds" data-a="snd" aria-label="صوت المطر" aria-pressed="false" hidden></button><div class="wdu"></div>';
 D.body.appendChild(el);D.body.style.overflow='hidden';
 var s=st={el:el,cv:$('canvas',el),x:$('canvas',el).getContext('2d'),scene:'',cat:o.cat||null,onClose:o.onClose,raf:0,paused:false,closed:false,timer:0};
 el.addEventListener('click',onClick);D.addEventListener('visibilitychange',onVis);D.addEventListener('keydown',onKey);
 sndProbe().then(function(u){var b=$('.wds',el);if(u&&b&&st===s){b.hidden=false;var on=sndPref();b.textContent=on?'🔊':'🔇';b.setAttribute('aria-pressed',on?'true':'false')}});
 try{go(s,o.scene||'fire')}catch(err){close();throw err}}
function close(){var s=st;if(!s)return;st=null;s.closed=true;if(s.raf)cancelAnimationFrame(s.raf);if(s.timer)clearTimeout(s.timer);stopSnd(s);s.el.removeEventListener('click',onClick);D.removeEventListener('visibilitychange',onVis);D.removeEventListener('keydown',onKey);s.el.remove();D.body.style.overflow='';try{s.onClose&&s.onClose()}catch(e){}}
window.__wadq={open:open,close:close,pick:pick,items:items,cite:cite,card:card,_st:function(){return st}};
})();
