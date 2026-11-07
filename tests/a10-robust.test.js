const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..'),R=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
test('لا خطوط ولا طلبات خارجية تلقائية عند الإقلاع (Google Fonts أُزيلت)',()=>{
 const h=R('index.html');assert.ok(!/fonts\.googleapis|fonts\.gstatic/.test(h+R('sw.js')));
 assert.ok(!/<(link|script|img)[^>]+(src|href)=["']https?:/i.test(h.replace(/<a [^>]*>/g,'')),'لا link/script/img خارجي')});
test('كل ملف في @font-face موجود وفي كاش SW الاختياري، مع رخصة OFL',()=>{
 const h=R('index.html'),sw=R('sw.js'),fs_=[...h.matchAll(/url\((webfonts\/[^)]+)\)/g)].map(m=>m[1]);assert.ok(fs_.length>=10);
 for(const f of fs_){assert.ok(fs.existsSync(path.join(ROOT,f)),f);assert.ok(sw.includes("'"+f+"'"),'SW '+f)}
 assert.ok(fs.existsSync(path.join(ROOT,'webfonts/OFL-amiri.txt'))&&fs.existsSync(path.join(ROOT,'webfonts/OFL-cairo.txt')))});
test('الطلبات الخارجية المتبقية محصورة فيما يبدأه المستخدم (الطقس بموافقة، تنزيل المصحف، روابط صريحة)',()=>{
 const allowed=/open-meteo|alquran\.cloud|quran\.com|mail\.google|outlook\.live|calendar\.google|magdymoo\.github\.io|athkar\.invalid|alifta|dar-alifta|w3\.org/;
 for(const f of fs.readdirSync(ROOT).filter(f=>/\.(js|html)$/.test(f))){for(const m of R(f).matchAll(/https?:\/\/[a-z0-9.-]+/gi))assert.ok(allowed.test(m[0]),f+' '+m[0])}});
test('readiness: طلب إذن الإشعارات محروس عند غياب Notification',()=>{assert.ok(/typeof Notification==='undefined'\)return;await Notification\.requestPermission/.test(R('readiness.js')))});
const files=['data.js','day.js','home.js','loc.js','times.js','prayer.js','notify.js','readiness.js','polish.js','sakina.js','reassurance.js','search.js','qada.js','qibla.js','tools.js','umrah.js','names.js','mushaf.js','diag.js'];
function stub(){const f=function(){return p};const p=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='then'?undefined:k==='length'?0:p,apply:()=>p,construct:()=>p,set:()=>true});return p}
function load(priv){const t=()=>{throw new Error('SecurityError')},m=new Map();
 const ls=priv?new Proxy({},{get:(_,k)=>['getItem','setItem','removeItem','key'].includes(k)?t:k==='length'?t():undefined}):{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size}};
 const w={performance:{now:()=>1,getEntriesByType:()=>[],mark(){}},Intl,Date,Math,JSON,console:{log(){},warn(){},error(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,addEventListener(){},removeEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}},matchMedia:()=>({matches:false,addEventListener(){}}),location:{search:'',pathname:'/',href:'http://x/',origin:'http://x'},history:{replaceState(){},pushState(){}},navigator:{userAgent:'x',language:'ar',onLine:true},document:stub(),fetch:()=>Promise.reject(new Error('offline')),Response:class{},URL,URLSearchParams,Promise,localStorage:ls};
 w.window=w;w.self=w;vm.createContext(w);const bad=[];for(const f of files){try{vm.runInContext(R(f),w,{filename:f})}catch(e){bad.push(f+': '+e.message)}}return bad}
test('كل الوحدات تُحمَّل بلا استثناء بدون Notification/caches/indexedDB/serviceWorker/PushManager',()=>assert.deepEqual(load(false),[]));
test('كل الوحدات تُحمَّل والـlocalStorage يرمي استثناء (تبويب خاص/حظر التخزين)',()=>assert.deepEqual(load(true),[]));
