const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const CITY={lat:21.4858,lng:39.1925,name:'جدة',tz:'Asia/Riyadh',cc:'SA'};
function env(rem){const m=new Map([['azkar_loc',JSON.stringify(CITY)]]);const ls={get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
 const w={localStorage:ls,performance:{now:()=>1},Intl,Date,Math,JSON,console,setTimeout:f=>{f();return 0},clearTimeout(){},addEventListener(){},dispatchEvent(){},Event:class{constructor(t){this.type=t}}};w.window=w;vm.createContext(w);
 for(const f of['data.js','prayer.js','day.js','times.js'])vm.runInContext(R(f),w);
 w.S={rem:rem||{m:{on:1,t:'05:00',sun:0},e:{on:1,t:'17:00',sun:0},qm:{on:1,t:'09:30'},qe:{on:1,t:'21:15'},ql:{on:1,t:'03:30',sun:0}}};w.AZ.times.bind(()=>w.S,()=>{});return w}
test('nextAt: m/e follow anchors (== resolve), qm/qe fixed from S.rem.t, always in the future',()=>{const w=env();const now=Date.now();
 for(const k of['m','e']){const d=w.AZ.times.nextAt(k,now);assert.ok(+d>now);assert.ok([0,1,2].some(i=>+w.AZ.times.resolve(k,i)===+d))}
 const q=w.AZ.times.nextAt('qm',now);assert.equal(q.getHours()*60+q.getMinutes(),9*60+30);assert.ok(+q>now);
 const q2=w.AZ.times.nextAt('qe',now);assert.equal(q2.getHours()*60+q2.getMinutes(),21*60+15)});
test('nextAt: just after today Maghrib moves to tomorrow Maghrib',()=>{const w=env();const mg=+w.__pt.computeFor(0).T.maghrib;assert.equal(+w.AZ.times.nextAt('e',mg+1000),+w.__pt.computeFor(1).T.maghrib)});
test('lastThird: AZ.times anchor == __pt single implementation',()=>{const w=env();assert.equal(+w.AZ.times.at('lastThird',0,0),+w.__pt.computeFor(0).third);assert.ok(+w.__pt.computeFor(0).third>0)});
test('no module computes prayer times independently (qada/tools/home/search/umrah use __pt/AZ.times only)',()=>{
 for(const f of['qada.js','tools.js','home.js','search.js','umrah.js']){const s=R(f);assert.ok(!/__pt\.times\s*\(|__pt\.lastThird\s*\(|PrayTimes|adhan/i.test(s),f)}});
test('openCal uses AZ.times.nextAt; notify/diag reliability7d use AZ.day.key (not UTC slice only)',()=>{
 assert.ok(/function openCal\(\)\{[^]*?AZ\.times\.nextAt/.test(R('index.html')));
 assert.ok(/reliability7d[^]*AZ\.day\.key\(x\.at\)/.test(R('notify.js')));assert.ok(/reliability7d[^]*AZ\.day\.key\(x\.at\)/.test(R('diag.js')));
 assert.ok(!/pending \(A/.test(R('diag.js')))});
test('CCM: الكويت والإمارات لهما طريقتهما الرسمية، وتركيا تبقى على الرابطة (18/17 = زوايا الديانت)',()=>{
 const P=env().__pt;assert.equal(P.CCM.KW,'kuwait');assert.equal(P.CCM.AE,'uae');assert.deepEqual([P.METHODS.kuwait.f,P.METHODS.kuwait.i],[18,17.5]);assert.deepEqual([P.METHODS.uae.f,P.METHODS.uae.i],[18.2,18.2]);
 assert.equal(P.CCM.TR,undefined);assert.equal(P.autoDm({lat:41,lng:29,tz:'Europe/Istanbul',cc:'TR'}),'mwl');
 const t=P.times(2026,10,7,29.3759,47.9774,P.METHODS.kuwait),m=P.times(2026,10,7,29.3759,47.9774,P.METHODS.mwl);assert.ok(t.isha>m.isha&&+t.fajr===+m.fajr);
 const u=P.times(2026,10,7,25.2048,55.2708,P.METHODS.uae);assert.ok(u.fajr<u.sunrise&&u.maghrib<u.isha)});
