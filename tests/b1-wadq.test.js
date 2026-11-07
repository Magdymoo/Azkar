const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..'),R=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const norm=s=>s.replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ‌-‏⁠࣓-ࣿ]/g,'').replace(/[ةۀ]/g,'ه').replace(/ک/g,'ك').replace(/[اأإآٱءئؤيىی]/g,'').replace(/[^ء-ي]/g,'');
const QURAN=norm(fs.readdirSync(path.join(ROOT,'quran')).filter(f=>/^q\d+\.json$/.test(f)).sort().map(f=>JSON.parse(R('quran/'+f)).t.join(' ')).join(' '));
function ctx(){const w={console,Math,JSON,Date,document:{},navigator:{},matchMedia:()=>({matches:false}),setTimeout,clearTimeout};w.window=w;vm.createContext(w);vm.runInContext(R('reassurance.js'),w);vm.runInContext(R('wadq.js'),w);return w}
const W=ctx(),ITEMS=W.AZKAR_REASSURANCE_ITEMS,CATS=['قلق','حزن','خوف','ضيق','رزق','ذنب'];
test('الودق: ≥40 نصًا في 6 تصنيفات (≥5 لكل تصنيف) وكل عنصر بمصدر',()=>{assert.ok(ITEMS.length>=40);for(const c of CATS)assert.ok(ITEMS.filter(x=>x.c===c).length>=5,c);for(const x of ITEMS){assert.ok(CATS.includes(x.c));assert.ok(x.t&&x.s)}
 assert.equal(new Set(ITEMS.map(x=>x.t)).size,ITEMS.length)});
test('كل الأحاديث لها درجة، وكل آية مطابقة لنص المصحف المحلي (quran/)',()=>{let q=0;for(const x of ITEMS){if(x.q){q++;assert.ok(QURAN.includes(norm(x.t.replace(/[﴿﴾۝]/g,' '))),x.q+' '+x.t)}else{assert.ok(x.g,'حديث بلا درجة: '+x.t.slice(0,30))}}assert.ok(q>=30)});
test('آيتا الودق: النور ٤٣ والروم ٤٨ في نص المصحف',()=>{const k=norm('فَتَرَى الْوَدْقَ يَخْرُجُ مِنْ خِلَالِهِ');assert.equal(QURAN.split(k).length-1,2);assert.ok(/النور ٤٣، والروم ٤٨/.test(R('wadq.js')))});
test('shuffle-bag: لا تكرار قبل استنفاد الحقيبة ولا تكرار متجاور عند إعادة الملء',()=>{const w=ctx(),n=w.__wadq.items().length;let prev=null;for(let round=0;round<4;round++){const seen=new Set();for(let i=0;i<n;i++){const t=w.__wadq.pick().t;assert.ok(!seen.has(t));seen.add(t);if(i===0&&prev)assert.notEqual(t,prev);prev=t}assert.equal(seen.size,n)}});
test('shuffle-bag بتصنيف: لا يخرج إلا من التصنيف',()=>{const w=ctx();for(let i=0;i<30;i++)assert.equal(w.__wadq.pick('رزق').c,'رزق')});
test('الودق كسول: ليس في CORE، ضمن warm، حجمه ≤ 18KB، والواجهة تقول «الودق» لا «سكينة»',()=>{assert.ok(!/wadq\.js/.test(R('sw.js')));assert.ok(/'wadq\.js'/.test(R('polish.js')));assert.ok(fs.statSync(path.join(ROOT,'wadq.js')).size<=18000);
 const s=R('sakina.js');assert.ok(s.includes('<b>الودق</b>'));assert.ok(!s.includes('<b>سَكِينة</b>'));assert.ok(!s.includes('فيديوهات سكينة'));assert.ok(/AZ_lazy\('wadq\.js','__wadq'\)/.test(s))});
test('الودق: reduced-motion وvisibilitychange والتباين وaria موجودة',()=>{const s=R('wadq.js');for(const k of['prefers-reduced-motion','visibilitychange','aria-live','aria-modal','FRAME=1000/30','sounds/wadq-rain.mp3'])assert.ok(s.includes(k),k)});
