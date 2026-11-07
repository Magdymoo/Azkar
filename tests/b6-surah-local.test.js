const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
const h=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
test('سورة بالتمرير: المصحف المحلي أولًا، والطلب الخارجي لا يجري إلا بفعل صريح (ext)',()=>{
 assert.ok(/async function localSurah\(id\)/.test(h));assert.ok(/async function loadSurah\(id,ext\)/.test(h));
 assert.ok(/if\(!ay&&ext\)\{try\{const j=await getJ\('https:\/\/api\.alquran\.cloud/.test(h));
 assert.ok(/loadSurah\(\+card\.dataset\.sur,!!force\)/.test(h));assert.ok(/loadSurah\(a\.sur,true\)/.test(h));
 assert.ok(!/loadSurah\(\+card\.dataset\.sur\)/.test(h));});
test('الفهارس: ss/ps في meta.json متّسقة (الملك ٣٠ آية)',()=>{const M=JSON.parse(fs.readFileSync(path.join(__dirname,'..','quran','meta.json'),'utf8'));assert.equal(M.ss[67]-M.ss[66],30);assert.equal(M.ps[604],6236)});
test('B4: إعادة تصميم الفوائت بصريًا فقط — كل مفاتيح data-q باقية، جدول بأدوار ARIA، منطقة خطر بتأكيد armed، مربعات ≥44px',()=>{
 const q=fs.readFileSync(path.join(__dirname,'..','qada.js'),'utf8');
 for(const k of['plan','stats','hist','share','calc','fix','edit','newest','info','exp','imp','wipe','log','undo'])assert.ok(q.includes('data-q="'+k+'"')||q.includes("tl('"+k+"'")||q.includes("'"+k+"|"),k);
 assert.ok(/role="table"/.test(q)&&/role="row"/.test(q)&&/role="cell"/.test(q)&&/role="columnheader"/.test(q));
 assert.ok(/<details class="card qdMore">/.test(q)&&/qdDg/.test(q)&&/armed\?'اضغط مرة أخرى للتأكيد'/.test(q));
 for(const e of['🌅','☀️','🌤️','🌇','🌙','✨'])assert.ok(q.includes(e));
 assert.ok(/\.qdRow2\{min-height:56px;border-bottom:1px solid var\(--line\)\}/.test(q)&&/tabular-nums/.test(q)&&/\.qdTl\{[^}]*min-height:68px/.test(q));
 assert.ok(/window\.__qd=\{mount,notifPlan/.test(q));});
