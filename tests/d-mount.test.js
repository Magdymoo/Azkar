/* اختبار دخان للواجهات: محاكي DOM صغير (innerHTML نص فقط) يتحقق أن mount لا يرمي، وأن الـHTML الناتج يحوي العناصر المتوقعة،
   وأن النقرات الأساسية (data-*) تعمل على الحالة. ليس بديلًا عن QA على جهاز. */
const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..'),R=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const CITY={lat:21.4858,lng:39.1925,name:'جدة',tz:'Asia/Riyadh',cc:'SA'};
function mkEl(){const L={};const e={_h:'',children:[],dataset:{},classList:{toggle(){},add(){},remove(){}},style:{},
 get innerHTML(){return this._h},set innerHTML(v){this._h=String(v)},addEventListener(t,f){(L[t]=L[t]||[]).push(f)},_fire(t,ev){(L[t]||[]).forEach(f=>f(ev))},
 querySelector(){return null},closest(){return null},appendChild(c){this.children.push(c)},setAttribute(){},remove(){},scrollTop:0,textContent:''};return e}
function env(seed,skipExtras){const m=new Map([['azkar_loc',JSON.stringify(CITY)]].concat(seed||[]));const ls={get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
 const doc={head:mkEl(),body:mkEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>mkEl()};
 const w={localStorage:ls,document:doc,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}},
  fetch:async u=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(ROOT,String(u).split('?')[0]),'utf8'))}),toast(){},ar:n=>String(n),LANG:'ar'};w.window=w;vm.createContext(w);
 for(const f of['data.js','prayer.js','day.js','times.js','home.js','loc.js'].concat(skipExtras?[]:['extras.js']))vm.runInContext(R(f),w);
 w.AZ.state=()=>({days:{},page:5});return w}
const click=(root,attrs)=>{const b={dataset:attrs,disabled:false};root._fire('click',{target:{closest:()=>b}})};
const mount=(w,f,id)=>{vm.runInContext(R(f),w);const root=mkEl();w['__x_'+id].mount(root,{});return root};
test('learn: القائمة ثم التفاصيل ثم الاختبار',async()=>{const w=env(),root=mount(w,'learn.js','learn');await w.__x_learn.load();
 const body=mkEl();root.querySelector=s=>s==='.lrbody'?body:null;w.__x_learn.mount(root);await w.__x_learn.load();await new Promise(r=>setImmediate(r));
 assert.match(body.innerHTML,/اختبار «كمّل الحديث»/);assert.equal((body.innerHTML.match(/data-lr="o"/g)||[]).length,42);
 click(root,{lr:'o',n:'1'});assert.match(body.innerHTML,/إنما الأعمال بالنيات/);click(root,{lr:'st',s:'h'});assert.equal(w.__x_learn._t.get().s[1].st,'h');assert.match(body.innerHTML,/آخر مراجعة/);
 click(root,{lr:'b'});click(root,{lr:'quiz'});assert.match(body.innerHTML,/data-lr="ans"/);click(root,{lr:'ans',i:'0'});assert.match(body.innerHTML,/سؤال آخر/);assert.equal(w.__x_learn._t.get().q.n,1)});
test('tracker: يعرض اليوم والخريطة، ويسجّل ويمنع إضافة فوائت بلا خطة',()=>{const w=env(),body=mkEl(),root=mkEl();root.querySelector=s=>s==='.tkbody'?body:null;vm.runInContext(R('tracker.js'),w);w.__x_tracker.mount(root);
 assert.match(body.innerHTML,/خريطة الشهر/);assert.equal((body.innerHTML.match(/data-tk="p"/g)||[]).length,10);const k=w.AZ.day.key();
 click(root,{tk:'p',i:'0',v:'o'});assert.equal(w.AZ.trk.pDone(k),1);click(root,{tk:'p',i:'1',v:'x'});assert.match(body.innerHTML,/data-tk="q"/);
 click(root,{tk:'q',i:'1'});assert.ok(!w.AZ.trk.get().d[k].a);click(root,{tk:'s',i:'0'});assert.equal(w.AZ.trk.get().d[k].s[0],'o');click(root,{tk:'nm'});click(root,{tk:'pm'})});
test('cal: يعرض الشهر الهجري والمناسبات ويسجّل الصيام',()=>{const w=env(),body=mkEl(),root=mkEl();root.querySelector=s=>s==='.cvbody'?body:null;vm.runInContext(R('cal.js'),w);w.__x_cal.mount(root);
 assert.match(body.innerHTML,/المناسبات القادمة/);assert.ok((body.innerHTML.match(/data-cv="day"/g)||[]).length>=29);const k=w.AZ.hijri.todayK();click(root,{cv:'day',k,d:'1'});click(root,{cv:'fast'});assert.equal(w.__x_cal._t.get().d[k],1);click(root,{cv:'fast'});assert.equal(w.__x_cal._t.get().d[k],undefined);click(root,{cv:'pm'});click(root,{cv:'nm'})});
test('ramadan: تعمل داخل رمضان وخارجه',()=>{for(const day of['2026-11-07','2026-03-01']){const w=env(),body=mkEl(),root=mkEl();root.querySelector=s=>s==='.rmbody'?body:null;const RD=w.AZ.hijri;
 const real=RD.todayK;vm.runInContext(R('ramadan.js'),w);w.AZ.hijri.today=()=>w.AZ.hijri.of(day);w.AZ.hijri.todayK=()=>day;w.__x_ramadan.mount(root);assert.match(body.innerHTML,/ليالي العشر الوترية/);assert.match(body.innerHTML,/الْأَجْرُ/)}
 const w=env(),body=mkEl(),root=mkEl();root.querySelector=s=>s==='.rmbody'?body:null;vm.runInContext(R('ramadan.js'),w);const day='2026-03-01';w.AZ.hijri.today=()=>w.AZ.hijri.of(day);w.__x_ramadan.mount(root);assert.match(body.innerHTML,/data-rm="f"/);click(root,{rm:'f',d:'3'});const o=w.AZ.ramadan.get();assert.deepEqual(Array.from(o.y[w.AZ.hijri.of(day).y].f),[3])});
test('kids/loved/zakat/salah: تتركّب وتستجيب',()=>{let w=env(),body=mkEl(),root=mkEl();root.querySelector=s=>s==='.kdbody'?body:null;vm.runInContext(R('kids.js'),w);w.__x_kids.mount(root);assert.equal((body.innerHTML.match(/data-kd=/g)||[]).length,10);click(root,{kd:'wake'});assert.match(body.innerHTML,/أحسنت/);
 w=env();body=mkEl();root=mkEl();root.querySelector=s=>s==='.ldbody'?body:s==='#ldn'?{value:'أبي'}:s==='#ldk'?{value:'d'}:null;vm.runInContext(R('loved.js'),w);w.__x_loved.mount(root);assert.match(body.innerHTML,/أضف اسمًا/);click(root,{ld:'add'});assert.equal(w.__x_loved._t.get().l.length,1);assert.match(body.innerHTML,/دعوتُ له/);
 w=env();body=mkEl();root=mkEl();root.querySelector=s=>s==='.zkbody'?body:null;vm.runInContext(R('zakat.js'),w);w.__x_zakat.mount(root);assert.match(body.innerHTML,/سعر غرام الذهب/);click(root,{zk:'tab',t:'m'});assert.match(body.innerHTML,/احسب الأنصبة/);
 w=env();body=mkEl();root=mkEl();root.querySelector=s=>s==='.slbody'?body:null;vm.runInContext(R('salah.js'),w);w.__x_salah.mount(root);assert.match(body.innerHTML,/أوقات النهي عن الصلاة/);assert.match(body.innerHTML,/(الآن وقت نهي|الآن ليس وقت نهي)/);assert.match(body.innerHTML,/حفظ موقعي الحالي/);click(root,{sl:'add'});assert.equal(w.__x_salah._t.cget().length,1);assert.match(body.innerHTML,/الحالية/)});
test('البطاقات الثلاث: progress دائمة، ramadan خارج رمضان لا تظهر، friday في الجمعة فقط',()=>{
 const cards=(day,hj)=>{const w=env([],true),hm=mkEl(),made={};hm.appendChild=c=>{hm.children.push(c);made[c.id]=c};w.document.querySelector=s=>s==='#v-home'?hm:(s[0]==='#'?(made[s.slice(1)]||null):null);
  w.st=()=>({mD:true,eD:false,q:true});w.AZ.state=()=>({days:{},page:5});
  const orig=w.AZ.day.key;w.AZ.day.key=()=>day;vm.runInContext(R('extras.js'),w);return {w,made}};
 let r=cards('2026-11-06');assert.ok(r.made.xPrg&&/تقدّمي اليوم/.test(r.made.xPrg.innerHTML));assert.ok(!r.made.xRam);assert.ok(r.made.xFri,'6 نوفمبر ٢٠٢٦ جمعة');assert.match(r.made.xFri.innerHTML,/سورة الكهف/);
 r=cards('2026-11-07');assert.ok(!r.made.xFri&&!r.made.xRam);r=cards('2026-03-06');assert.ok(r.made.xRam&&/رمضان/.test(r.made.xRam.innerHTML)&&/الإفطار/.test(r.made.xRam.innerHTML));
 assert.ok(r.made.xFri,'٦ مارس ٢٠٢٦ جمعة');const html=r.made.xRam.innerHTML;assert.ok(/data-x="rmf"/.test(html)&&/data-x="rmt"/.test(html))});
