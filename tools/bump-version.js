#!/usr/bin/env node
/* tools/bump-version.js — يغيّر رقم الإصدار في كل مكان دفعة واحدة ثم يشغّل الفحص.
   الاستخدام:
     node tools/bump-version.js 2.0.0-rc.7          # تسليم مرحلي: لا يمسّ version.json أبدًا
     node tools/bump-version.js 2.0.0 --publish     # الإصدار النهائي: يكتب version.json (version + date) أيضًا
   يعدّل: index.html (مصدر AZ_V، لاحقات ?v= للسكربتات، الفوتر) و sw.js (VER والتعليق الرأسي).
   لا يعدّل NEWS/LOG ولا ملاحظات version.json (محتوى يكتبه الإنسان). */
'use strict';
const fs = require('fs'), path = require('path');
const { check } = require('./check-version.js');

function bump(root, ver, opts) {
  opts = opts || {};
  if (!/^\d+\.\d+\.\d+(-rc\.\d+)?$/.test(ver)) throw new Error('صيغة غير صالحة: ' + ver + ' (مثال: 2.0.0-rc.7 أو 2.0.0)');
  const isRc = /-rc\./.test(ver);
  if (opts.publish && isRc) throw new Error('لا يُكتب إصدار rc في version.json (ينشر النهائي فقط)');
  const P = f => path.join(root, f), rd = f => fs.readFileSync(P(f), 'utf8');
  let html = rd('index.html'), sw = rd('sw.js');
  const one = (s, re, rep, what) => { const n = (s.match(new RegExp(re.source, 'g')) || []).length; if (n !== 1) throw new Error(what + ': وجدت ' + n + ' مطابقة (المتوقع 1)'); return s.replace(re, rep); };
  html = one(html, /(var errs=\[\],ver=')[^']+(')/, '$1' + ver + '$2', 'AZ_V');
  html = one(html, /(<footer>[^<]*<b>[^<]*<\/b>[^<]*· الإصدار )\d[^<\s]*(<\/footer>)/, '$1' + ver + '$2', 'الفوتر');
  let n = 0;
  html = html.replace(/(<script\s+[^>]*src="(?!https?:|\/\/)[^"?]+\.js)\?v=[^"]+(")/g, (m, a, b) => { n++; return a + '?v=' + ver + b; });
  sw = one(sw, /(Service Worker v)\S+/, '$1' + ver, 'تعليق sw.js');
  sw = one(sw, /(const VER = ')[^']+(')/, '$1' + ver + '$2', 'sw.js VER');
  fs.writeFileSync(P('index.html'), html); fs.writeFileSync(P('sw.js'), sw);
  if (opts.publish) {
    const vj = JSON.parse(rd('version.json'));
    vj.version = ver; vj.date = opts.date || new Date().toISOString().slice(0, 10);
    fs.writeFileSync(P('version.json'), JSON.stringify(vj, null, 2) + '\n');
  }
  return { scripts: n, res: check(root, { release: !!opts.publish }) };
}
module.exports = { bump };

if (require.main === module) {
  const a = process.argv.slice(2), ver = a.find(x => !x.startsWith('--')), publish = a.includes('--publish');
  if (!ver) { console.error('الاستخدام: node tools/bump-version.js <الإصدار> [--publish]'); process.exit(2); }
  const root = path.join(__dirname, '..');
  try {
    const { scripts, res } = bump(root, ver, { publish });
    console.log('تم: ' + ver + ' — حُدّثت لاحقة ?v= في ' + scripts + ' سكربت' + (publish ? ' + version.json' : ' (version.json لم يُمسّ)'));
    res.warns.forEach(w => console.log('⚠️  ' + w)); res.errs.forEach(e => console.log('❌ ' + e));
    process.exit(res.errs.length ? 1 : 0);
  } catch (e) { console.error('❌ ' + e.message); process.exit(1); }
}
