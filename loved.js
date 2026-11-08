/* أذكاري — loved.js (2.0 · C5): الدعاء للأحباء والصدقة الجارية.
   أسماء تضيفها بنفسك (أحياء أو متوفَّون) ودعاء يومي بالتناوب مع عدّاد «دعوتُ»، وسجل صدقاتك. الدعاء والصدقة عن الميت ثابتان بالسنة.
   لا نجزم بإهداء ثواب القراءة والذكر للميت لوجود خلاف بين أهل العلم (انظر SHARIA_REVIEW). التخزين المحلي فقط: azkari_loved (يدخل النسخ الاحتياطي، وفيه أسماء). */
(function () {
  'use strict';
  if (window.__x_loved) return;
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, KEY = 'azkari_loved';
  var DUA = { l: '«اللَّهُمَّ اهْدِهِ وَاغْفِرْ لَهُ وَارْحَمْهُ وَاحْفَظْهُ وَاجْعَلْهُ مِنْ عِبَادِكَ الصَّالِحِينَ»', d: '«اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ»' };
  var SRC = { l: 'دعاء بصيغة عامة (ليس نصًّا نبويًا)', d: 'من دعاء الجنازة، رواه مسلم' };
  var IDEAS = ['سقيا ماء', 'طباعة أو إهداء مصحف', 'تعليم علم نافع', 'غرس شجرة', 'مساعدة محتاج أو كفالة يتيم', 'المساهمة في بناء أو ترميم مسجد'];
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function A(n) { try { return typeof ar === 'function' ? ar(n) : String(n); } catch (e) { return String(n); } }
  function today() { return AZ.day.key(); }
  function get() { try { var o = JSON.parse(AZ.data.get(KEY) || 'null'); if (o && o.v === 1 && Array.isArray(o.l)) { o.sd = Array.isArray(o.sd) ? o.sd : []; return o; } } catch (e) {} return { v: 1, l: [], sd: [] }; }
  function put(o) { try { AZ.data.set(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function clean(s, n) { return String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n || 40); }
  function add(name, kind) { name = clean(name, 40); if (!name) return false; var o = get(); if (o.l.length >= 60) return false; o.l.push({ id: Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36), n: name, k: kind === 'd' ? 'd' : 'l', c: 0, last: '' }); return put(o); }
  function del(id) { var o = get(); o.l = o.l.filter(function (x) { return x.id !== id; }); return put(o); }
  function prayed(id) { var o = get(), x = o.l.filter(function (y) { return y.id === id; })[0]; if (!x || x.last === today()) return false; x.last = today(); x.c = (x.c || 0) + 1; return put(o); }
  function pickToday(o) { if (!o.l.length) return null; var k = today(), h = 0, i; for (i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0; var pend = o.l.filter(function (x) { return x.last !== k; }); return pend.length ? pend[h % pend.length] : null; }
  function addSd(note, who) { var o = get(); note = clean(note, 80); if (!note) return false; o.sd.unshift({ d: today(), n: note, w: clean(who, 40) }); o.sd = o.sd.slice(0, 200); return put(o); }
  function view(R) {
    var b = $('.ldbody', R.root); if (!b) return; var o = get(), t = pickToday(o);
    var h = '<div class="card"><h4><span>دعاء اليوم</span></h4>' + (t ? '<div class="ldt"><b>' + esc(t.n) + '</b></div><p class="ldq">' + DUA[t.k] + '</p><small class="ldm">' + SRC[t.k] + '</small><button class="btn main ldw" data-ld="pray" data-id="' + t.id + '"><span>دعوتُ له</span></button>' : '<p class="ldm"><span>' + (o.l.length ? 'دعوتَ لكل من في قائمتك اليوم. جزاك الله خيرًا.' : 'أضف اسمًا لتدعو له كل يوم.') + '</span></p>') + '</div>' +
      '<div class="card"><h4><span>فضل الدعاء للغير</span></h4><p class="ldq">«دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لِأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ»</p><small class="ldm">رواه مسلم</small></div>' +
      '<div class="card"><h4><span>قائمتي</span></h4>' + o.l.map(function (x) { return '<div class="ldr"><span><b>' + esc(x.n) + '</b> <small class="ldm">' + (x.k === 'd' ? '<span>متوفى</span>' : '<span>حيّ</span>') + ' · <span>دعوتُ</span> <b>' + A(x.c || 0) + '</b></small></span><button class="btn" data-ld="del" data-id="' + x.id + '" aria-label="حذف"><span>حذف</span></button></div>'; }).join('') +
      '<div class="ldf"><input id="ldn" type="text" maxlength="40" placeholder="الاسم" aria-label="الاسم" autocomplete="off"><select id="ldk" aria-label="النوع"><option value="l">حيّ</option><option value="d">متوفى</option></select><button class="btn main" data-ld="add"><span>إضافة</span></button></div></div>' +
      '<div class="card"><h4><span>الصدقة الجارية</span></h4><p class="ldq">«إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ»</p><small class="ldm">رواه مسلم</small>' +
      '<p class="ldm"><span>والصدقة عن الميت ثابتة بالسنة، فقد سأل رجل النبي ﷺ عن الصدقة عن أمه فقال: نعم. متفق عليه.</span></p><ul class="ldi">' + IDEAS.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
      '<div class="ldf"><input id="lds" type="text" maxlength="80" placeholder="ما تصدقتَ به" aria-label="ما تصدقت به" autocomplete="off"><button class="btn main" data-ld="sd"><span>سجّل</span></button></div>' +
      o.sd.slice(0, 8).map(function (s) { return '<div class="ldr"><span>' + esc(s.n) + '</span><small class="ldm">' + esc(s.d) + '</small></div>'; }).join('') + '</div>' +
      '<div class="ldm"><span>للعلم: الثابت بالنص للميت هو الدعاء والصدقة والحج والعمرة وقضاء الصوم الواجب. أما إهداء ثواب قراءة القرآن والأذكار ففيه خلاف بين أهل العلم، فاسأل أهل العلم الذين تثق بهم.</span></div>';
    b.innerHTML = h;
  }
  var CSS = '.ldt{font-size:1.5rem;text-align:center;color:var(--gold)}.ldq{font-family:Amiri,serif;font-size:1.2rem;line-height:2.1;margin:4px 0}.ldm{color:var(--mut);line-height:1.9}.ldm b{color:var(--tx);font-variant-numeric:tabular-nums}.ldw{width:100%;min-height:48px;margin-top:6px}.ldr{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--line,#ddd)}.ldf{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.ldf input{flex:1;min-width:120px;min-height:44px;font:inherit;padding:6px 10px;border-radius:12px;border:1.5px solid var(--line,#ccc);background:var(--card,transparent);color:var(--tx)}.ldf select{min-height:44px}.ldi{line-height:2;margin:4px 0;padding-inline-start:22px}.ldf input:focus-visible{outline:3px solid var(--gold,#c9a24b);outline-offset:2px}';
  function css() { if ($('#ld-css')) return; var s = D.createElement('style'); s.id = 'ld-css'; s.textContent = CSS; D.head.appendChild(s); }
  var cur = null;
  function mount(root) {
    css(); root.innerHTML = '<div class="ldbody"></div>'; cur = { root: root };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ld]'); if (!b) return; var a = b.dataset.ld;
      if (a === 'pray') prayed(b.dataset.id); else if (a === 'del') del(b.dataset.id);
      else if (a === 'add') { var i = $('#ldn', root); if (add(i && i.value, ($('#ldk', root) || {}).value)) { /* ok */ } }
      else if (a === 'sd') { var s = $('#lds', root); addSd(s && s.value); }
      view(cur);
    });
    view(cur);
  }
  window.__x_loved = { mount: mount, unmount: function () { cur = null; }, _t: { add: add, del: del, prayed: prayed, get: get, pickToday: pickToday, addSd: addSd, clean: clean } };
})();
