/* أذكاري — kids.js (2.0 · C4): وضع الأطفال. أزرار كبيرة، أدعية قصيرة صحيحة بمصادرها، ونجمة لكل دعاء يقوله الطفل مرة في اليوم،
   وشجرة تكبر بعدد النجوم. بلا حسابات ولا مشاركة ولا إعلانات. التخزين المحلي: azkari_kids = {v:1,s:{اليوم:{id:1}},tot:n} (يدخل النسخ الاحتياطي).
   اليوم = AZ.day.key. */
(function () {
  'use strict';
  if (window.__x_kids) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, KEY = 'azkari_kids';
  var ITEMS = [
    { id: 'eat1', e: '🍽️', t: 'قبل الأكل', x: 'بِسْمِ اللَّهِ', s: 'متفق عليه' },
    { id: 'eat2', e: '😋', t: 'بعد الأكل', x: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', s: 'رواه أبو داود والترمذي (حسّنه الألباني)' },
    { id: 'wake', e: '🌅', t: 'عند الاستيقاظ', x: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', s: 'رواه البخاري' },
    { id: 'sleep', e: '🌙', t: 'عند النوم', x: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', s: 'رواه البخاري' },
    { id: 'out', e: '🚪', t: 'عند الخروج من البيت', x: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', s: 'رواه أبو داود والترمذي (صححه الألباني)' },
    { id: 'sneeze', e: '🤧', t: 'عند العطاس', x: 'الْحَمْدُ لِلَّهِ', s: 'رواه البخاري' },
    { id: 'thanks', e: '🤝', t: 'شكر من أحسن إليك', x: 'جَزَاكَ اللَّهُ خَيْرًا', s: 'رواه الترمذي (صححه الألباني)' },
    { id: 'salam', e: '👋', t: 'السلام', x: 'السَّلَامُ عَلَيْكُمْ', s: 'أفشوا السلام بينكم، رواه مسلم' },
    { id: 'par', e: '👨‍👩‍👧', t: 'الدعاء للوالدين', x: '﴿رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا﴾', s: 'الإسراء ٢٤' },
    { id: 'ikh', e: '⭐', t: 'سورة الإخلاص', x: '﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾', s: 'سورة الإخلاص' }
  ];
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function today() { return AZ.day.key(); }
  function get() { try { var o = JSON.parse(AZ.data.get(KEY) || 'null'); if (o && o.v === 1 && o.s) return o; } catch (e) {} return { v: 1, s: {}, tot: 0 }; }
  function put(o) { try { var ks = Object.keys(o.s).sort(); while (ks.length > 120) delete o.s[ks.shift()]; AZ.data.set(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function say(id) { var o = get(), k = today(), d = o.s[k] = o.s[k] || {}; if (!ITEMS.some(function (i) { return i.id === id; }) || d[id]) return false; d[id] = 1; o.tot = (o.tot || 0) + 1; return put(o); }
  function stage(tot) { return tot >= 150 ? 4 : tot >= 70 ? 3 : tot >= 25 ? 2 : tot >= 5 ? 1 : 0; }
  var TREE = ['🌱', '🌿', '🌳', '🌳🍎', '🌳✨'], TN = ['بذرة صغيرة', 'نبتة', 'شجرة', 'شجرة مثمرة', 'شجرة مباركة'];
  function view(R) {
    var b = $('.kdbody', R.root); if (!b) return; var o = get(), d = o.s[today()] || {}, n = Object.keys(d).length, st = stage(o.tot || 0);
    b.innerHTML = '<div class="card kdt"><div class="kdtree" aria-hidden="true">' + TREE[st] + '</div><div><b>' + TN[st] + '</b></div><div class="kdm"><span>نجوم اليوم</span> <b>' + A(n) + '</b>/<b>' + A(ITEMS.length) + '</b> · <span>كل النجوم</span> <b>' + A(o.tot || 0) + '</b></div></div>' +
      ITEMS.map(function (i) { var on = !!d[i.id]; return '<div class="card kdc' + (on ? ' on' : '') + '"><div class="kde" aria-hidden="true">' + i.e + '</div><h3>' + i.t + '</h3><p class="kdx">' + esc(i.x) + '</p><small>' + i.s + '</small><button class="btn kdb' + (on ? '' : ' main') + '" data-kd="' + i.id + '"' + (on ? ' disabled' : '') + '>' + (on ? '<span>⭐ أحسنت</span>' : '<span>قلتها</span>') + '</button></div>'; }).join('') +
      '<div class="kdm"><span>للوالدين: الأدعية مختارة من الصحيح، وكل شيء محفوظ على جهازك فقط.</span></div>';
  }
  var CSS = '.kdt{text-align:center}.kdtree{font-size:3.2rem;line-height:1.3}.kdm{color:var(--mut);line-height:1.9;text-align:center}.kdm b{color:var(--tx);font-variant-numeric:tabular-nums}.kdc{text-align:center}.kdc.on{opacity:.85}.kde{font-size:2.6rem}.kdc h3{margin:2px 0}.kdx{font-family:Amiri,serif;font-size:1.5rem;line-height:2.1;margin:4px 0}.kdc small{color:var(--mut)}.kdb{width:100%;min-height:56px;font-size:1.15rem;margin-top:8px}.kdb:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#kd-css')) return; var s = D.createElement('style'); s.id = 'kd-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) { css(); root.innerHTML = '<div class="kdbody"></div>'; cur = { root: root }; root.addEventListener('click', function (e) { var b = e.target.closest('[data-kd]'); if (!b || b.disabled) return; if (say(b.dataset.kd)) { try { if (navigator.vibrate && AZ.data.get('azkar_vib') !== '0') navigator.vibrate(30); } catch (x) {} view(cur); } }); view(cur); }
  window.__x_kids = { mount: mount, unmount: function () { cur = null; }, ITEMS: ITEMS, _t: { say: say, get: get, stage: stage } };
})();
