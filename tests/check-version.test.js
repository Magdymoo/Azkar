const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),os=require('os');
const {check}=require('../tools/check-version.js'),{bump}=require('../tools/bump-version.js');
const ROOT=path.join(__dirname,'..');
const FILES=fs.readdirSync(ROOT).filter(f=>/\.(js|html|json)$/.test(f)&&fs.statSync(path.join(ROOT,f)).isFile());
function clone(){const d=fs.mkdtempSync(path.join(os.tmpdir(),'azv-'));for(const f of FILES)fs.copyFileSync(path.join(ROOT,f),path.join(d,f));return d}
const rw=(d,f,fn)=>{const p=path.join(d,f);fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')))};
const errs=d=>check(d).errs;

test('المشروع الحالي يمرّ من check-version',()=>{assert.deepEqual(errs(ROOT),[])});

test('سكربت ثابت بلا ?v= يُرفض',()=>{const d=clone();rw(d,'index.html',s=>s.replace('notify.js?v=','notify.js?x='));assert.ok(errs(d).some(e=>/notify\.js/.test(e)))});
test('?v= غير مطابق يُرفض',()=>{const d=clone();rw(d,'index.html',s=>s.replace(/(prayer\.js\?v=)[^"]+/,'$11.0.0'));assert.ok(errs(d).some(e=>/غير مطابق/.test(e)))});
test('sw.js VER مختلف يُرفض',()=>{const d=clone();rw(d,'sw.js',s=>s.replace(/const VER = '[^']+'/,"const VER = '9.9.9'"));assert.ok(errs(d).length>0)});
test('سكربت ثابت غير مذكور في CORE يُرفض',()=>{const d=clone();rw(d,'sw.js',s=>s.replace(" 'notify.js' + Q",""));assert.ok(errs(d).some(e=>/CORE/.test(e)&&/notify/.test(e)))});
test('CORE يشير لملف غير موجود يُرفض (سيُفشل التثبيت)',()=>{const d=clone();fs.unlinkSync(path.join(d,'diag.js'));assert.ok(errs(d).some(e=>/diag\.js/.test(e)))});
test('تحميل ديناميكي بلا AZ.asset يُرفض',()=>{const d=clone();rw(d,'tools.js',s=>s.replace("s.src=AZ.asset(src)","s.src=src"));assert.ok(errs(d).some(e=>/AZ\.asset/.test(e)))});
test('قائمة warm بلا AZ.asset تُرفض',()=>{const d=clone();rw(d,'polish.js',s=>s.replace(".map(x=>AZ.asset(x))",""));assert.ok(errs(d).some(e=>/warm/.test(e)))});
test('version.json بنسخة rc يُرفض',()=>{const d=clone();rw(d,'version.json',s=>s.replace('"1.14.0"','"2.0.0-rc.6"'));assert.ok(errs(d).some(e=>/version\.json/.test(e)))});
test('SyntaxError في ملف JS أو سكربت مضمَّن يُرفض',()=>{let d=clone();rw(d,'day.js',s=>s+'\n)(');assert.ok(errs(d).some(e=>/SyntaxError/.test(e)));d=clone();rw(d,'index.html',s=>s.replace('window.AZ_lazy=function','window.AZ_lazy=function(((('));assert.ok(errs(d).some(e=>/inline/.test(e)))});

test('bump إلى rc جديد: كل المواضع تتغير ولا يُمسّ version.json',()=>{
 const d=clone(),before=fs.readFileSync(path.join(d,'version.json'),'utf8');
 const r=bump(d,'2.0.0-rc.7');assert.deepEqual(r.res.errs,[]);assert.ok(r.scripts>=13);
 assert.equal(fs.readFileSync(path.join(d,'version.json'),'utf8'),before);
 assert.ok(!/2\.0\.0-rc\.6/.test(fs.readFileSync(path.join(d,'sw.js'),'utf8')));
 const h=fs.readFileSync(path.join(d,'index.html'),'utf8');assert.ok(!/\?v=2\.0\.0-rc\.6/.test(h));assert.ok(h.includes("ver='2.0.0-rc.7'"));assert.ok(h.includes('الإصدار 2.0.0-rc.7</footer>'));
 assert.deepEqual(errs(d),[])});
test('bump idempotent',()=>{const d=clone();bump(d,'2.0.0-rc.7');const a=fs.readFileSync(path.join(d,'index.html'),'utf8');bump(d,'2.0.0-rc.7');assert.equal(fs.readFileSync(path.join(d,'index.html'),'utf8'),a)});
test('bump النهائي --publish يكتب version.json ويمرّ فحص --release',()=>{
 const d=clone(),r=bump(d,'2.0.0',{publish:true,date:'2026-12-01'});assert.deepEqual(r.res.errs,[]);
 const j=JSON.parse(fs.readFileSync(path.join(d,'version.json'),'utf8'));assert.equal(j.version,'2.0.0');assert.equal(j.date,'2026-12-01');assert.ok(j.notes.length);
 assert.deepEqual(check(d,{release:true}).errs,[])});
test('bump يرفض rc مع publish وصيغة غير صالحة',()=>{const d=clone();assert.throws(()=>bump(d,'2.0.0-rc.8',{publish:true}));assert.throws(()=>bump(d,'v2'))});
test('--release على rc يُرفض',()=>{assert.ok(check(ROOT,{release:true}).errs.length>0)});
