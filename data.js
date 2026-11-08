/* أذكاري — data.js (v2.0): طبقة البيانات الوحيدة للتخزين المحلي.
   - ترحيل آمن من المفاتيح القديمة (athkary.* و azkar_*) إلى azkari_* بلا أي فقد:
     لقطة احتياطية ← نسخ (لا نقل) ← تحقق بالقراءة العكسية ← علامة اكتمال. لا تُحذف المفاتيح القديمة أبدًا في 2.0.
   - كتابة مزدوجة: كل set يكتب الجديد ويعكس نسخة في القديم، فلو فُتحت نسخة قديمة ترى البيانات الحالية.
   - مصالحة عند كل إقلاع: إن كتبت نسخة قديمة في المفتاح القديم أثناء غياب 2.0 تُلتقط تغييراتها ولا يضيع شيء.
   - أسماء الاستدعاء قديمة أو جديدة كلاهما مقبول (athkary.v1 = azkari_state).
   يجب أن يُحمَّل هذا الملف أولًا، قبل أي سكربت آخر. */
(function (w) {
  'use strict';
  var AZ = w.AZ = w.AZ || {};
  var tr = AZ.trace = AZ.trace || function (n) { try { (AZ._tr = AZ._tr || []).push({ n: n, t: Math.round(performance.now()) }); } catch (e) {} };
  tr('data.js:start');

  var NATIVE = { azkari_qada: 1, azkari_mushaf: 1, azkari_arb: 1, azkari_trk: 1, azkari_sawm: 1, azkari_ramadan: 1, azkari_kids: 1, azkari_loved: 1, azkari_zk: 1, azkari_travel: 1, azkari_cities: 1, azkari_hj_adj: 1 };            // مفاتيح بالبادئة الجديدة أصلًا (لا مقابل قديم لها)
  var PREFS = ['azkari_loc', 'azkari_pmethod', 'azkari_pt_sub', 'azkari_vib', 'azkari_umrah', 'azkari_umd_fs', 'azkari_pa_fs', 'azkari_nc',
    'azkari_arb', 'azkari_trk', 'azkari_sawm', 'azkari_ramadan', 'azkari_kids', 'azkari_loved', 'azkari_zk', 'azkari_travel', 'azkari_cities', 'azkari_hj_adj'];   // 2.0: بيانات الوحدات الجديدة تدخل النسخ الاحتياطي (نصوص JSON صغيرة، بلا انعكاس قديم)
  var ST = { mode: 'new', mig: 'unknown', reason: '', flag: null, conflicts: [], adopted: [], mirrored: [], copied: [], errors: [] };
  var BUDGET = w.AZ_BUDGET || 2000000;                           // سقف تقديري محافظ (iOS ≈ 2.5 مليون حرف)
  var SYNC = {};                                                  // آخر قيمة (بصمتها) كانت متطابقة بين الجديد والقديم

  function L() { try { return w.localStorage; } catch (e) { return null; } }
  function internal(k) { return k.indexOf('azkari__') === 0; }
  function newName(k) {
    if (k === 'athkary.v1') return 'azkari_state';
    if (k === 'athkary.bak') return 'azkari_bak';
    if (k.indexOf('azkar_') === 0) return 'azkari_' + k.slice(6);
    return k;
  }
  function oldOf(n) {                                              // الاسم الجديد ← القديم (أو null)
    if (n === 'azkari_state') return 'athkary.v1';
    if (n === 'azkari_bak') return 'athkary.bak';
    if (NATIVE[n] || internal(n)) return null;
    if (n.indexOf('azkari_') === 0) return 'azkar_' + n.slice(7);
    return null;
  }
  function isLegacyName(k) { return k === 'athkary.v1' || k === 'athkary.bak' || k.indexOf('azkar_') === 0; }
  function hash(s) { var h = 5381, i = s.length; while (i) h = (h * 33) ^ s.charCodeAt(--i); return s.length + ':' + (h >>> 0).toString(36); }
  function usage(l) { var t = 0, i, k; for (i = 0; i < l.length; i++) { k = l.key(i); if (k) t += k.length + (l.getItem(k) || '').length; } return t; }
  /* تحرير مساحة بالترتيب: لقطة الترحيل، نسخ التعارض، نسخة bak القديمة، ثم نسخة انعكاس المفتاح نفسه. لا يمسّ مصدرًا وحيدًا. */
  function freeSpace(l, n) {
    var steps = ['azkari__premigrate'];
    allKeys(l).forEach(function (k) { if (k.indexOf('azkari__conf_') === 0) steps.push(k); });
    if (l.getItem('azkari_bak') !== null) steps.push('athkary.bak');
    var o = oldOf(n); if (o && l.getItem(n) !== null) steps.push(o);
    return steps.filter(function (k) { return l.getItem(k) !== null; });
  }
  function allKeys(l) { var a = [], i, k; for (i = 0; i < l.length; i++) { k = l.key(i); if (k) a.push(k); } return a; }

  /* ---------- القراءة والكتابة ---------- */
  function get(k) {
    var l = L(); if (!l) return null;
    try {
      var n = newName(k), o = oldOf(n);
      if (ST.mode === 'legacy') return l.getItem(o || n);
      var v = l.getItem(n);
      if (v !== null) return v;
      return o ? l.getItem(o) : null;                              // الجديد أولًا، وإن غاب فالقديم
    } catch (e) { return null; }
  }
  function saveSync() { var l = L(); try { l.setItem('azkari__sync', JSON.stringify(SYNC)); } catch (e) {} }
  function set(k, v) {                                             // يرمي خطأ فقط إن فشلت الكتابة الأساسية بعد تحرير كل ما يمكن
    var l = L(); if (!l) throw new Error('no-storage');
    var n = newName(k), o = oldOf(n); v = String(v);
    if (ST.mode === 'legacy') {
      try { l.setItem(o || n, v); } catch (e) {
        var fs0 = freeSpace(l, o || n).filter(function (x) { return x !== (o || n); }), i0 = 0, ok0 = false;
        while (i0 < fs0.length && !ok0) { try { l.removeItem(fs0[i0++]); l.setItem(o || n, v); ok0 = true; } catch (x) {} }
        if (!ok0) throw e;
      }
      return true;
    }
    try { l.setItem(n, v); }
    catch (e) {
      var fs = freeSpace(l, n), i = 0, ok = false;
      while (i < fs.length && !ok) { try { l.removeItem(fs[i++]); l.setItem(n, v); ok = true; } catch (x) {} }
      if (!ok) throw e;
    }
    if (n === 'azkari_bak') { try { l.removeItem('athkary.bak'); } catch (e) {} return true; }   // نسخة واحدة فقط (لا انعكاس)
    if (o) {
      var mirrorOk = false;
      try { if (usage(l) + v.length < BUDGET) { l.setItem(o, v); mirrorOk = true; } } catch (e) {}
      SYNC[n] = mirrorOk ? hash(v) : 'x'; saveSync();                // 'x' = القديم متأخر عن علم (ضغط مساحة)
    }
    return true;
  }
  function remove(k) {
    var l = L(); if (!l) return;
    var n = newName(k), o = oldOf(n);
    try { if (ST.mode !== 'legacy') l.removeItem(n); } catch (e) {}
    try { if (o) l.removeItem(o); } catch (e) {}
    if (SYNC[n] !== undefined) { delete SYNC[n]; saveSync(); }
  }
  function keys(prefix) {                                          // أسماء منطقية (جديدة) بلا المفاتيح الداخلية
    var l = L(), s = {}, out = []; if (!l) return out;
    allKeys(l).forEach(function (k) {
      var n = newName(k);
      if (internal(n) || n.indexOf('azkari_') !== 0 || s[n]) return;
      if (prefix && n.indexOf(newName(prefix)) !== 0) return;
      s[n] = 1; out.push(n);
    });
    return out;
  }
  function getJSON(k, d) { try { var v = get(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function setJSON(k, o) { return set(k, JSON.stringify(o)); }

  /* ---------- الترحيل ---------- */
  function readFlag(l) { try { return JSON.parse(l.getItem('azkari__mig') || 'null'); } catch (e) { return null; } }
  function migrate(l, olds) {
    var created = [];
    try {
      var snap = { t: Date.now(), from: w.AZ_V || '', k: {} }, sl = 0;
      olds.forEach(function (k) { if (k === 'athkary.bak') return; snap.k[k] = l.getItem(k); sl += snap.k[k].length; });
      if (l.getItem('azkari__premigrate') === null) {              // 1) لقطة احتياطية، فقط إن كانت المساحة تسمح (المفاتيح القديمة نفسها لا تُحذف)
        if (usage(l) + sl * 3 < BUDGET) l.setItem('azkari__premigrate', JSON.stringify(snap));
        else ST.snapshot = 'skipped-size';
      }
      if (usage(l) + sl * 2 > BUDGET * 1.1) throw new Error('not-enough-space');  // لا نضاعف بيانات تفوق السقف: نبقى على القديم
      olds.forEach(function (k) {                                  // 2) نسخ لا نقل، ولا نغطّي جديدًا موجودًا
        var n = newName(k), v = l.getItem(k);
        if (k === 'athkary.bak') return;                            // النسخة التلقائية تُقرأ من مكانها القديم حتى تُستبدل
        if (v === null || l.getItem(n) !== null) return;
        l.setItem(n, v); created.push(n);
        if (l.getItem(n) !== v) throw new Error('verify-failed:' + n);   // 3) تحقق بالقراءة العكسية
      });
      var flag = { v: 2, t: Date.now(), n: olds.length };           // 4) العلامة بعد نجاح كل ما سبق فقط
      l.setItem('azkari__mig', JSON.stringify(flag));
      ST.flag = flag; ST.mig = 'done'; ST.copied = created;
      return true;
    } catch (e) {
      created.forEach(function (n) { try { l.removeItem(n); } catch (x) {} });   // تراجع كامل، ونكمل بالقديم
      ST.mode = 'legacy'; ST.mig = 'failed'; ST.reason = String((e && e.message) || e);
      try { l.setItem('azkari__mig', JSON.stringify({ v: 'failed', t: Date.now(), reason: ST.reason })); } catch (x) {}
      return false;
    }
  }

  /* ---------- المصالحة (كل إقلاع): تغطي الكتابات من نسخ قديمة والفشل الجزئي ---------- */
  function reconcile(l) {
    try { SYNC = JSON.parse(l.getItem('azkari__sync') || '{}') || {}; } catch (e) { SYNC = {}; }
    var seen = {};
    allKeys(l).forEach(function (k) {
      if (!isLegacyName(k) || k === 'athkary.bak') return;
      var n = newName(k), nv = l.getItem(n), ov = l.getItem(k); seen[n] = 1;
      if (ov === null) return;
      if (nv === null) { try { l.setItem(n, ov); ST.copied.push(n); SYNC[n] = hash(ov); } catch (e) { ST.errors.push('copy:' + n); } return; }
      if (nv === ov) { SYNC[n] = hash(nv); return; }
      var rec = SYNC[n], hn = hash(nv), ho = hash(ov);
      var oldChanged = rec ? ho !== rec : true, newChanged = rec ? hn !== rec : true;
      if (rec === 'x') { newChanged = true; oldChanged = false; }  // الانعكاس فشل سابقًا: الجديد هو الصحيح
      if (oldChanged && !newChanged) {                              // كتبت نسخة قديمة وحدها ← نتبنّى كتابتها
        try { l.setItem(n, ov); SYNC[n] = hash(ov); ST.adopted.push(n); } catch (e) { ST.errors.push('adopt:' + n); }
      } else {                                                      // الجديد هو المرجع؛ وإن تغيّر الاثنان نحفظ القديم دون فقد
        if (oldChanged && newChanged) { try { l.setItem('azkari__conf_' + n, ov); ST.conflicts.push(n); } catch (e) { ST.errors.push('conf:' + n); } }
        try { l.setItem(k, nv); SYNC[n] = hash(nv); } catch (e) { SYNC[n] = 'x'; }
      }
    });
    allKeys(l).forEach(function (n) {                               // مفاتيح جديدة بلا نظير قديم ← ننعكس
      if (n.indexOf('azkari_') !== 0 || internal(n) || NATIVE[n] || n === 'azkari_bak') return;
      var o = oldOf(n); if (!o || l.getItem(o) !== null) return;
      var v = l.getItem(n); if (usage(l) + v.length >= BUDGET) { SYNC[n] = 'x'; return; }
      try { l.setItem(o, v); SYNC[n] = hash(v); ST.mirrored.push(n); } catch (e) { SYNC[n] = 'x'; }
    });
    saveSync();
  }


  /* ---------- استرجاع تلقائي: إن كانت حالة التطبيق فارغة وتوجد نسخة أغنى في أي مصدر ---------- */
  function rich(str) {
    try { var o = JSON.parse(str); if (!o || typeof o !== 'object') return null;
      return { days: o.days && typeof o.days === 'object' ? Object.keys(o.days).length : 0, name: !!(o.profile && o.profile.name), len: str.length }; } catch (e) { return null; }
  }
  function candidates(l) {
    var c = [];
    function add(src, v) { if (typeof v === 'string') { var r = rich(v); if (r) c.push({ src: src, val: v, r: r }); } }
    function bk(src, v) { try { var b = JSON.parse(v); if (b && b.d) add(src, JSON.stringify(b.d)); } catch (e) {} }
    add('azkari_state', l.getItem('azkari_state')); add('athkary.v1', l.getItem('athkary.v1')); add('azkari__conf_azkari_state', l.getItem('azkari__conf_azkari_state'));
    bk('azkari_bak', l.getItem('azkari_bak')); bk('athkary.bak', l.getItem('athkary.bak'));
    try { var p = JSON.parse(l.getItem('azkari__premigrate') || 'null'); if (p && p.k) { add('premigrate:athkary.v1', p.k['athkary.v1']); bk('premigrate:athkary.bak', p.k['athkary.bak']); } } catch (e) {}
    return c;
  }
  function recover(l) {
    try {
      var cur = get('athkary.v1'), cr = cur ? rich(cur) : null;
      if (cr && (cr.days > 0 || cr.name)) return;                  // الحالة الحالية ليست فارغة: لا نتدخل أبدًا
      var c = candidates(l).filter(function (x) { return x.r.days > 0 || x.r.name; });
      if (!c.length) return;
      c.sort(function (a, b) { return (b.r.days - a.r.days) || (b.r.len - a.r.len); });
      var best = c[0];
      try { set('athkary.v1', best.val); } catch (e) { ST.errors.push('recover-write:' + String(e && e.message || e)); return; }
      ST.recovered = { from: best.src, days: best.r.days, t: Date.now() };
      try { l.setItem('azkari__recovered', JSON.stringify(ST.recovered)); } catch (e) {}
    } catch (e) { ST.errors.push('recover:' + String(e && e.message || e)); }
  }

  function boot() {
    var l = L();
    if (!l) { ST.mode = 'legacy'; ST.mig = 'no-storage'; return; }
    try {
      var flag = readFlag(l); ST.flag = flag;
      var olds = allKeys(l).filter(isLegacyName);
      if (flag && flag.v === 2) ST.mig = 'done';
      else if (!olds.length) { try { var f = { v: 2, t: Date.now(), n: 0 }; l.setItem('azkari__mig', JSON.stringify(f)); ST.flag = f; ST.mig = 'done'; } catch (e) { ST.mig = 'fresh-unmarked'; } }
      else migrate(l, olds);
      if (ST.mode === 'new') reconcile(l);
      recover(l);
    } catch (e) { ST.mode = 'legacy'; ST.mig = 'error'; ST.reason = String((e && e.message) || e); }
  }

  /* ---------- أدوات ---------- */
  function wipeAll() {                                              // «حذف كل بياناتي»: كل المفاتيح الجديدة والقديمة والداخلية
    var l = L(), n = 0; if (!l) return 0;
    allKeys(l).forEach(function (k) { if (k.indexOf('azkari_') === 0 || isLegacyName(k)) { try { l.removeItem(k); n++; } catch (e) {} } });
    SYNC = {}; return n;
  }
  function exportPrefs() { var o = {}; PREFS.forEach(function (k) { var v = get(k); if (v !== null) o[k] = v; }); return o; }
  function importPrefs(o) { if (!o || typeof o !== 'object') return 0; var n = 0; PREFS.forEach(function (k) { if (typeof o[k] === 'string') { try { set(k, o[k]); n++; } catch (e) {} } }); return n; }
  function status() {
    var l = L(), c = { legacy: 0, current: 0, internal: 0 }, bytes = 0, pre = null;
    if (l) {
      allKeys(l).forEach(function (k) {
        var v = l.getItem(k) || '';
        if (internal(k)) c.internal++; else if (k.indexOf('azkari_') === 0) c.current++; else if (isLegacyName(k)) c.legacy++; else return;
        bytes += k.length + v.length;
      });
      var p = l.getItem('azkari__premigrate'); pre = p ? { exists: true, bytes: p.length } : { exists: false };
    }
    return { mode: ST.mode, migration: ST.mig, reason: ST.reason, flag: ST.flag, counts: c, approxBytes: bytes * 2, premigrate: pre,
      snapshot: ST.snapshot || null, recovered: ST.recovered || null, budget: BUDGET, usedChars: l ? usage(l) : null,
      copied: ST.copied, adopted: ST.adopted, mirrored: ST.mirrored, conflicts: ST.conflicts, errors: ST.errors };
  }
  function inventory() {
    var l = L(), o = []; if (!l) return o;
    allKeys(l).forEach(function (k) {
      if (!(k.indexOf('azkari_') === 0 || isLegacyName(k))) return;
      var v = l.getItem(k) || '';
      o.push({ key: k, bytes: v.length, value: v.length <= 300 ? v : undefined });
    });
    return o.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
  }

  boot();
  AZ.data = { get: get, set: set, remove: remove, keys: keys, getJSON: getJSON, setJSON: setJSON, wipeAll: wipeAll,
    exportPrefs: exportPrefs, importPrefs: importPrefs, status: status, inventory: inventory, newName: newName, oldName: oldOf, _hash: hash };
  tr('data.js:ready');
})(window);
