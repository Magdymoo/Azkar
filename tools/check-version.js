#!/usr/bin/env node
/* tools/check-version.js — يفحص اتساق الإصدار في المشروع (لا يغيّر شيئًا).
   الاستخدام:  node tools/check-version.js [--release] [مسار المشروع]
   --release : وضع النشر النهائي: يشترط إصدارًا نهائيًا (بلا -rc)، و version.json مطابقًا، وغياب أي "rc" من ملفات الإصدار. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const rd = (root, f) => fs.readFileSync(path.join(root, f), 'utf8');
const SEMVER = /^\d+\.\d+\.\d+(-rc\.\d+)?$/;

function swInfo(code) {   // نقيّم sw.js في vm معزول لنقرأ VER/CORE/OPTIONAL فعليًا
  const noop = () => {};
  const ctx = vm.createContext({ self: { addEventListener: noop, skipWaiting: noop, clients: {}, registration: {} }, caches: {}, location: { origin: 'http://x' }, URL, Response: function () {}, Request: function () {}, fetch: noop, setTimeout });
  return vm.runInContext(code + '\n;({VER:VER,CORE:CORE,OPTIONAL:typeof OPTIONAL!=="undefined"?OPTIONAL:[]})', ctx);
}

function check(root, opts) {
  opts = opts || {};
  const errs = [], warns = [], info = {};
  const E = m => errs.push(m), W = m => warns.push(m);
  let html, sw, vj;
  try { html = rd(root, 'index.html'); } catch (e) { return { errs: ['index.html مفقود'], warns, info }; }
  try { sw = rd(root, 'sw.js'); } catch (e) { return { errs: ['sw.js مفقود'], warns, info }; }
  try { vj = JSON.parse(rd(root, 'version.json')); } catch (e) { E('version.json مفقود أو غير صالح'); vj = {}; }

  // 1) مصدر الإصدار الوحيد: AZ_V في حارس الأخطاء
  const gm = /var errs=\[\],ver='([^']+)'/.exec(html);
  if (!gm) E("index.html: لم أجد var errs=[],ver='…' (مصدر AZ_V)");
  const VER = gm && gm[1]; info.ver = VER;
  if (VER && !SEMVER.test(VER)) E('صيغة الإصدار غير صالحة: ' + VER);
  if (!/AZ\.asset=function/.test(html)) E('index.html: AZ.asset غير معرَّفة');
  if (!/VER=window\.AZ_V/.test(html)) E('index.html: VER يجب أن يساوي window.AZ_V (لا نسخة ثانية حرفية)');
  if ((html.match(/\bVER\s*=\s*'/g) || []).length) E("index.html: يوجد VER='…' حرفي ثانٍ");

  // 2) الفوتر
  const fm = /<footer>[^<]*<b>[^<]*<\/b>[^<]*· الإصدار (\d[^<\s]*)<\/footer>/.exec(html);
  if (!fm) W('لم أجد فوتر الإصدار الثابت'); else if (VER && fm[1] !== VER) E('الفوتر ' + fm[1] + ' ≠ ' + VER);

  // 3) كل سكربت محلي ثابت بـ ?v= مطابق
  const statics = [];
  for (const m of html.matchAll(/<script\s+[^>]*src="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:)?\/\//.test(u)) continue;
    statics.push(u);
    const vm_ = /\?v=([^"&]+)$/.exec(u);
    if (!vm_) E('سكربت بلا ?v=: ' + u);
    else if (VER && vm_[1] !== VER) E('?v= غير مطابق (' + vm_[1] + ') في: ' + u);
    if (!fs.existsSync(path.join(root, u.split('?')[0]))) E('ملف سكربت غير موجود: ' + u);
  }
  info.staticScripts = statics.length;

  // 4) sw.js
  let sv;
  try { sv = swInfo(sw); } catch (e) { E('sw.js: تعذّر تقييمه: ' + e.message); }
  if (sv) {
    if (sv.VER !== VER) E('sw.js VER ' + sv.VER + ' ≠ ' + VER);
    const hm = /Service Worker v(\S+)/.exec(sw);
    if (hm && hm[1] !== VER) E('تعليق sw.js الرأسي ' + hm[1] + ' ≠ ' + VER);
    for (const u of statics) if (!sv.CORE.includes(u)) E('سكربت ثابت غير موجود في CORE: ' + u);
    for (const u of sv.CORE) {
      if (u !== './' && !fs.existsSync(path.join(root, u.split('?')[0]))) E('CORE يشير لملف غير موجود (سيُفشل التثبيت): ' + u);
      if (/\.js(\?|$)/.test(u) && !new RegExp('\\?v=' + VER.replace(/[.\-]/g, '\\$&') + '$').test(u)) E('CORE: سكربت بلا ?v= مطابق: ' + u);
    }
    for (const u of sv.OPTIONAL) if (!fs.existsSync(path.join(root, u))) W('ملف اختياري غير موجود: ' + u);
    info.core = sv.CORE.length;
  }

  // 5) لا تحميل ديناميكي لسكربت بدون AZ.asset
  const jsFiles = fs.readdirSync(root).filter(f => f.endsWith('.js'));
  for (const f of ['index.html'].concat(jsFiles)) {
    const t = rd(root, f);
    for (const m of t.matchAll(/\bs\.src\s*=\s*([^;]+);/g)) {
      const ex = m[1];
      if (/AZ\.asset\(|\?v=/.test(ex)) continue;
      if (/createElement\('script'\)/.test(t)) E(f + ': تحميل سكربت ديناميكي بلا AZ.asset → ' + ex.slice(0, 60));
    }
  }
  if (/\['qibla\.js'[^\]]*\](?!\.map\(x=>AZ\.asset)/.test(rd(root, 'polish.js'))) E('polish.js: قائمة warm للسكربتات بلا AZ.asset');

  // 6) version.json (النسخة المنشورة للمستخدمين)
  if (vj.version) {
    if (!opts.release) {
      if (VER && /-rc\./.test(VER) && vj.version === VER) E('version.json لا يجوز أن يحمل نسخة rc: ' + vj.version);
      if (/-/.test(vj.version)) E('version.json يحمل نسخة تجريبية: ' + vj.version);
    } else {
      if (VER && vj.version !== VER) E('--release: version.json ' + vj.version + ' ≠ ' + VER);
    }
  }
  if (opts.release) {
    if (VER && /-/.test(VER)) E('--release: الإصدار ما زال تجريبيًا: ' + VER);
  }

  // 7) صحة صياغة كل ملف JS وكل <script> مضمَّن
  const syn = (name, code) => { try { new vm.Script(code, { filename: name }); } catch (e) { E('SyntaxError في ' + name + ': ' + e.message); } };
  for (const f of jsFiles) syn(f, rd(root, f));
  let i = 0;
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="(?!text\/javascript)[^"]*")[^>]*>([\s\S]*?)<\/script>/g)) syn('index.html#inline' + (++i), m[1]);
  info.inlineScripts = i;
  return { errs, warns, info };
}

module.exports = { check, swInfo };

if (require.main === module) {
  const args = process.argv.slice(2), release = args.includes('--release');
  const root = path.resolve(args.find(a => !a.startsWith('--')) || path.join(__dirname, '..'));
  const r = check(root, { release });
  r.warns.forEach(w => console.log('⚠️  ' + w));
  r.errs.forEach(e => console.log('❌ ' + e));
  console.log(r.errs.length ? '\nفشل الفحص (' + r.errs.length + ' خطأ)' : '\n✅ الإصدار متّسق: ' + r.info.ver + ' (' + r.info.staticScripts + ' سكربت ثابت، ' + r.info.core + ' في CORE، ' + r.info.inlineScripts + ' سكربت مضمَّن)');
  process.exit(r.errs.length ? 1 : 0);
}
