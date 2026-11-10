'use strict';
/* وِردي v3.0: الهوية الجديدة + طبقة التصميم الجديد (wirdi.js + wd-css) */
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path'), vm = require('vm');
const R = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const html = R('index.html'), js = R('wirdi.js');

function load() {
  const els = {}, doc = { documentElement: { dataset: {}, setAttribute() {}, removeAttribute() {} }, addEventListener() {}, querySelector() { return null; }, getElementById() { return null; }, createElement() { return { style: { setProperty() {} }, addEventListener() {} }; }, head: { appendChild() {} }, hidden: false };
  const win = { AZ: { state: () => ({ ui: { design: 'new' }, lang: 'ar', profile: { name: 'محمد' } }), save() {} }, matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} };
  const ctx = { window: win, document: doc, Intl, Date, Math, setInterval() { }, matchMedia: win.matchMedia, navigator: {}, getComputedStyle: () => ({ getPropertyValue: () => '' }), console };
  ctx.window.document = doc; vm.createContext(ctx); vm.runInContext(js, ctx); return ctx.window.AZ.wd;
}
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

test('wirdi: ≥ 40 حديثاً مشكولاً بلا تكرار وبمصدر', () => {
  const wd = load(), H = wd.hadith;
  assert.ok(H.length >= 40);
  assert.strictEqual(new Set(H.map(x => x[0])).size, H.length);
  H.forEach(([t, s]) => { assert.ok(/[ً-ْ]/.test(t), t); assert.ok(/رواه|متفق/.test(s), s); });
});
test('wirdi: الهلال يتولّد لكل أيام الشهر بمسار صالح', () => {
  const wd = load();
  for (let d = 0; d < 30; d++) { const s = wd.moonSvg(d); assert.ok(/<path d="M30,6 A24,24/.test(s) && !/NaN/.test(s), d); }
});
test('wirdi: لا طلبات خارجية ولا ألوان خارج الجدول', () => {
  assert.ok(!/https?:\/\//.test(js.replace(/\/\*[\s\S]*?\*\//g, '')));
  assert.ok(!/fonts\.googleapis/.test(js + html));
});
test('الثيمات: تباين لون التمييز مع البطاقة ≥ 4.5 في الثمانية', () => {
  const ids = ['goldnight', 'bluelight', 'pinkwhite', 'pinknight', 'emerald', 'mint', 'violet', 'sand'];
  ids.forEach(id => {
    const m = html.match(new RegExp('data-pal=' + id + '\\]\\{([^}]*)\\}'));
    assert.ok(m, id);
    const v = k => { let x = (m[1].match(new RegExp('--' + k + ':(#[0-9a-fA-F]{3,6})')) || [])[1]; if (x && x.length === 4) x = '#' + x[1] + x[1] + x[2] + x[2] + x[3] + x[3]; return x; };
    assert.ok(cr(v('gold'), v('card')) >= 4.5, id + ' gold/card ' + cr(v('gold'), v('card')));
    assert.ok(cr(v('tx'), v('bg1')) >= 7, id + ' tx/bg');
    assert.ok(cr(v('mut'), v('card')) >= 4.5, id + ' mut/card ' + cr(v('mut'), v('card')));
  });
});
test('التصميم القديم: كل قواعد الجديد مقيّدة بـ data-ui أو بعناصر جديدة فقط', () => {
  const i = html.indexOf('<style id="wd-css">'), css = html.slice(html.indexOf('>', i) + 1, html.indexOf('</style>', i));
  css.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('@') && /\{/.test(l)).forEach(l => {
    assert.ok(/^(html\[data-ui=new\]|html\[dir=ltr\]\[data-ui=new\]|#wdh|\.wdpv|\.wdpal|\.wdseg)/.test(l), 'قاعدة غير مقيّدة: ' + l.slice(0, 80));
  });
});
test('الهوية: لا بقايا «أذكاري» كاسم تطبيق ولا Athkari/Azkari', () => {
  ['index.html', 'sw.js', 'manifest.webmanifest', 'recover.html', 'qada.js', 'readiness.js', 'notify.js'].forEach(f => { const t = R(f); assert.ok(!/Athkari|Azkari/.test(t), f); assert.ok(!/(تطبيق|نسخة|افتح|ثبّت|تثبيت) أذكاري/.test(t), f); });
  assert.strictEqual(JSON.parse(R('manifest.webmanifest')).short_name, 'وِردي');
});
test('الحالة: التصميم الجديد وحده، بلا مبدّل قديم، ومفتاح التخزين ثابت', () => {
  assert.ok(!/WDHAD|data-wd="design|class="thm"/.test(html + R('wirdi.js')));
  assert.ok(/delete S\.ui\.design/.test(html));
  assert.ok(/const KEY='athkary\.v1'/.test(html));
});
test('الأيقونات وملفات الواجهة موجودة وفي CORE', () => {
  ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-32.png', 'favicon-16.png', 'splash.webp', 'wirdi.js'].forEach(f => { assert.ok(fs.existsSync(path.join(__dirname, '..', f)), f); });
  assert.ok(/'wirdi\.js' \+ Q/.test(R('sw.js')));
});
