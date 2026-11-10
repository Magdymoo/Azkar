/* وِردي v3.0 — طبقة التصميم الجديد (زجاجي). تعمل فقط حين S.ui.design === 'new'.
   لا تُغيّر أي بيانات أو وظائف: تضيف الهيرو والتحية والهلال والحديث وإعدادات المظهر. */
(function () {
  'use strict';
  var AZ = window.AZ = window.AZ || {};
  var DARK = { goldnight: 1, pinknight: 1, emerald: 1, violet: 1 };
  var PALS = [
    ['goldnight', 'ذهبي ليلي', '#000000', '#e8c56d'], ['bluelight', 'أزرق فاتح', '#f2f3f7', '#2a56c6'],
    ['pinkwhite', 'وردي وأبيض', '#fff7f9', '#c2306a'], ['pinknight', 'وردي ليلي', '#0d0709', '#f08ab0'],
    ['emerald', 'زمردي', '#050b09', '#5fd0a0'], ['mint', 'نعناعي', '#f1f7f4', '#1f7a5a'],
    ['violet', 'بنفسجي', '#09070f', '#b49cff'], ['sand', 'رملي دافئ', '#f6f0e6', '#b0532c']
  ];
  /* أحاديث صحيحة مشكولة (متفق عليه أو مسلم أو البخاري أو صحّحه الألباني) — تتغيّر يومياً */
  var HD = [
    ['أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', 'متفق عليه'],
    ['خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', 'رواه البخاري'],
    ['لَا يَزَالُ لِسَانُكَ رَطْبًا مِنْ ذِكْرِ اللَّهِ', 'رواه الترمذي وصححه الألباني'],
    ['إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', 'متفق عليه'],
    ['كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', 'متفق عليه'],
    ['مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ', 'متفق عليه'],
    ['الطُّهُورُ شَطْرُ الْإِيمَانِ', 'رواه مسلم'],
    ['الدِّينُ النَّصِيحَةُ', 'رواه مسلم'],
    ['مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', 'رواه مسلم'],
    ['الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', 'متفق عليه'],
    ['لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', 'متفق عليه'],
    ['مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', 'متفق عليه'],
    ['تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ', 'رواه الترمذي وصححه الألباني'],
    ['الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', 'متفق عليه'],
    ['مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ', 'متفق عليه'],
    ['مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', 'متفق عليه'],
    ['الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، كَفَّارَةٌ لِمَا بَيْنَهُنَّ مَا لَمْ تُغْشَ الْكَبَائِرُ', 'رواه مسلم'],
    ['مَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', 'متفق عليه'],
    ['أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ', 'رواه مسلم'],
    ['لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', 'متفق عليه'],
    ['مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', 'متفق عليه'],
    ['الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ', 'رواه مسلم'],
    ['عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ', 'رواه مسلم'],
    ['مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', 'رواه مسلم'],
    ['إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ', 'رواه مسلم'],
    ['الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', 'رواه مسلم'],
    ['مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ', 'متفق عليه'],
    ['مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا', 'رواه الترمذي وصححه الألباني'],
    ['اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ', 'رواه مسلم'],
    ['الصَّلَاةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ', 'رواه مسلم'],
    ['مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ', 'رواه مسلم'],
    ['وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ', 'رواه مسلم'],
    ['إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ', 'متفق عليه'],
    ['مَنْ كَانَ آخِرُ كَلَامِهِ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ', 'رواه أبو داود وصححه الألباني'],
    ['الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ', 'متفق عليه'],
    ['إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ أَحْسَنَكُمْ أَخْلَاقًا', 'رواه البخاري'],
    ['مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالْآخِرَةِ', 'رواه مسلم'],
    ['الدُّعَاءُ هُوَ الْعِبَادَةُ', 'رواه الترمذي وصححه الألباني'],
    ['أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ', 'رواه مسلم'],
    ['مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا', 'رواه مسلم'],
    ['إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ', 'رواه مسلم'],
    ['يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا', 'متفق عليه'],
    ['مَنْ غَشَّنَا فَلَيْسَ مِنَّا', 'رواه مسلم'],
    ['الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا', 'متفق عليه']
  ];
  var GREET = {
    ar: { m: ['صباح الخير', 'صباح النور'], a: ['طاب يومك', 'أهلاً بك'], e: ['مساء الخير', 'مساؤك نور'], n: ['ليلة هادئة', 'تصبح على خير'], by: ' يا ' },
    en: { m: ['Good morning'], a: ['Good afternoon'], e: ['Good evening'], n: ['Good night'], by: ', ' },
    fr: { m: ['Bonjour'], a: ['Bon après-midi'], e: ['Bonsoir'], n: ['Bonne nuit'], by: ' ' },
    tr: { m: ['Günaydın'], a: ['İyi günler'], e: ['İyi akşamlar'], n: ['İyi geceler'], by: ', ' }
  };
  var TINT = { fajr: ['#6d5a9c', .35], sunrise: ['#f2a65a', .4], duha: ['#ffe29a', .22], dhuhr: ['#ffffff', 0], asr: ['#e0a860', .2], maghrib: ['#e0703c', .42], isha: ['#2a2a5a', .3], night: ['#000a1e', .38] };

  function S() { try { return AZ.state() || {}; } catch (e) { return {}; } }
  function ui() { return S().ui || {}; }
  function isNew() { return true; }
  function lang() { var l = S().lang; return GREET[l] ? l : 'ar'; }
  function locale() { return ({ ar: 'ar-EG', en: 'en-US', fr: 'fr-FR', tr: 'tr-TR' })[lang()]; }
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function hex(c) { c = c.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(c.substr(i, 2), 16) || 0; }); }
  function mix(a, b, t) { var x = hex(a), y = hex(b); return '#' + [0, 1, 2].map(function (i) { return ('0' + Math.round(x[i] + (y[i] - x[i]) * t).toString(16)).slice(-2); }).join(''); }
  function appDay() { try { if (typeof todayD === 'function') return todayD(); } catch (e) { } var d = new Date(); d.setHours(12, 0, 0, 0); return d; }

  /* ---- الفترات ---- */
  function times() {
    var f = null;
    try { var c = window.__pt && window.__pt.compute && window.__pt.compute(); if (c && c.T) f = c.T; } catch (e) { }
    var d = new Date(), at = function (h, m) { var x = new Date(d); x.setHours(h, m || 0, 0, 0); return x.getTime(); };
    var g = function (k, h, m) { try { var v = f && f[k]; if (v) return v instanceof Date ? v.getTime() : +v; } catch (e) { } return at(h, m); };
    return { fajr: g('fajr', 5), sunrise: g('sunrise', 6, 20), dhuhr: g('dhuhr', 12), asr: g('asr', 15, 30), maghrib: g('maghrib', 18), isha: g('isha', 19, 30) };
  }
  function period() {
    var T = times(), n = Date.now();
    if (n < T.fajr || n >= T.isha + 3 * 3600e3) return 'night';
    if (n < T.sunrise) return 'fajr';
    if (n < T.sunrise + 90 * 60e3) return 'sunrise';
    if (n < T.dhuhr - 30 * 60e3) return 'duha';
    if (n < T.asr) return 'dhuhr';
    if (n < T.maghrib) return 'asr';
    if (n < T.isha) return 'maghrib';
    return 'isha';
  }
  function group(p) { return { fajr: 'm', sunrise: 'm', duha: 'm', dhuhr: 'a', asr: 'a', maghrib: 'e', isha: 'n', night: 'n' }[p]; }

  /* ---- الهلال: يُحسب من يوم الشهر الهجري (أم القرى) ---- */
  function moonSvg(age) {
    var R = 24, cx = 30, cy = 30, p = Math.max(0, Math.min(1, (age % 29.53) / 29.53)), waxing = p <= .5, q = waxing ? p : 1 - p;
    var c = Math.cos(2 * Math.PI * q), rx = Math.abs(c) * R, sweep = c > 0 ? 0 : 1;
    var path = 'M' + cx + ',' + (cy - R) + ' A' + R + ',' + R + ' 0 0 1 ' + cx + ',' + (cy + R) + ' A' + rx.toFixed(2) + ',' + R + ' 0 0 ' + sweep + ' ' + cx + ',' + (cy - R) + 'Z';
    return '<svg class="wd-moon" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" fill="rgba(255,255,255,.14)"/><path d="' + path + '" fill="#fff3cf" transform="' + (waxing ? '' : 'translate(60,0) scale(-1,1)') + '"/></svg>';
  }

  function hijriParts(d) {
    var out = { d: 1, txt: '' };
    try {
      var lc = lang() === 'ar' ? 'ar-SA' : locale();
      var f = new Intl.DateTimeFormat(lc + '-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }), P = f.formatToParts(d), v = {};
      P.forEach(function (x) { v[x.type] = x.value; });
      out.d = parseInt(v.day, 10) || 1; out.txt = v.day + ' ' + v.month + ' ' + v.year;
    } catch (e) { }
    return out;
  }

  /* ---- الهيرو ---- */
  var ICO_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
  function tr(s) { try { var l = lang(); if (l === 'ar') return s; var t = (typeof I18N !== 'undefined') && I18N[s]; if (t) return t[{ en: 0, fr: 1, tr: 2 }[l]] || s; } catch (e) { } return s; }
  function hero() {
    if (!isNew()) return unhero();
    var h = $('header'); if (!h) return;
    var el = $('#wdh');
    if (!el) { el = document.createElement('section'); el.id = 'wdh'; el.setAttribute('aria-label', 'وِردي'); h.parentNode.insertBefore(el, h); el.addEventListener('click', function (e) { if (e.target.closest('.wd-city')) openLoc(); }); }
    var d = appDay(), L = locale(), hj = hijriParts(d), ph = period(), g = group(ph), G = GREET[lang()];
    var name = (S().profile && S().profile.name) || '';
    var base = G[g][Math.floor(d / 864e5) % G[g].length];
    var greet = name ? base + G.by + name : base;
    var c = null; try { c = AZ.loc && AZ.loc.get(); } catch (e) { }
    var city = (c && c.name) || tr('حدّد موقعك');
    var di = Math.floor(d / 864e5), hd = HD[di % HD.length];
    var gdate = '';
    try { gdate = new Intl.DateTimeFormat(L + (L.indexOf('-u-') < 0 ? '-u-nu-latn' : ''), { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch (e) { }
    var dn = ''; try { dn = new Intl.DateTimeFormat(L, { weekday: 'long' }).format(d); } catch (e) { }
    el.dataset.ph = ph;
    el.innerHTML = moonSvg(hj.d - 1) + '<div class="wd-in"><div class="wd-dn">' + esc(dn) + '</div><button type="button" class="wd-city" aria-label="' + esc(tr('الموقع')) + ': ' + esc(city) + '">' + ICO_PIN + '<span>' + esc(city) + '</span></button>' +
      '<div class="wd-dates"><span>' + esc(hj.txt) + '</span><i></i><span>' + esc(gdate) + '</span></div><div class="wd-gr">' + esc(greet) + '</div><div class="wd-hd">«' + esc(hd[0]) + '»<small>' + esc(hd[1]) + '</small></div></div>';
    sky(el, ph);
    icons();
  }
  function sky(el, ph) {
    try {
      var cs = getComputedStyle(document.documentElement), a = cs.getPropertyValue('--sky1').trim(), b = cs.getPropertyValue('--sky2').trim(), t = TINT[ph], k = t[1] * (DARK[window.__wdPal] ? 1 : .55);
      if (/^#[0-9a-f]{6}$/i.test(a) && /^#[0-9a-f]{6}$/i.test(b) && k) { el.style.setProperty('--sky1', mix(a, t[0], k)); el.style.setProperty('--sky2', mix(b, t[0], k * .6)); } else { el.style.removeProperty('--sky1'); el.style.removeProperty('--sky2'); }
    } catch (e) { }
  }
  function unhero() { var el = $('#wdh'); if (el) el.remove(); var b = $('#bNeed'); if (b && b.dataset.wdOld) { b.innerHTML = b.dataset.wdOld; delete b.dataset.wdOld; } }
  function openLoc() { try { AZ.data.set('azkar_pt_sub', 't'); } catch (e) { } var b = $('nav button[data-v="pt"]'); if (b) b.click(); }
  function icons() {
    var b = $('#bNeed');
    if (b && !b.dataset.wdOld) { b.dataset.wdOld = b.innerHTML; b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z"/></svg>'; }
  }
  /* ---- تطبيق الحالة ---- */
  function apply() {
    try { window.__wdEarly(ui()); } catch (e) { }
    if (isNew()) { hero(); } else unhero();
  }
  function setUi(k, v) {
    var s = S(); if (!s.ui) s.ui = {};
    s.ui[k] = v; try { AZ.save(); } catch (e) { }
    apply();
  }

  /* ---- إعدادات المظهر (تُحقن في نافذة الإعدادات) ---- */
  function settingsHtml() {
    var u = ui(), nw = true, cur = window.__wdPal;
    var h = '';
    if (nw) {
      h += '<div class="wdpal" role="radiogroup" aria-label="الثيم">' + PALS.map(function (p) {
        var on;
        on = cur === p[0];
        return '<button type="button" data-wd="pal:' + p[0] + '" class="' + (on ? 'on' : '') + '" role="radio" aria-checked="' + on + '"><i style="background:' + p[2] + ';box-shadow:inset 0 0 0 1px rgba(128,128,128,.35);border-bottom:10px solid ' + p[3] + '"></i><span>' + p[1] + '</span></button>';
      }).join('') + '</div>';
      var dual = (u.pal || 'goldnight') === 'goldnight' || (u.pal || 'goldnight') === 'bluelight';
      if (dual) h += '<div class="wdseg" role="radiogroup" aria-label="الوضع">' + [['auto', 'تلقائي'], ['light', 'فاتح'], ['dark', 'داكن']].map(function (m) { var on = (u.mode || 'auto') === m[0]; return '<button type="button" data-wd="mode:' + m[0] + '" class="' + (on ? 'on' : '') + '" role="radio" aria-checked="' + on + '">' + m[1] + '</button>'; }).join('') + '</div>';
      h += '<div class="wdseg" role="radiogroup" aria-label="التمويه">' + [['1', 'التمويه: مفعّل'], ['0', 'التمويه: معطّل']].map(function (m) { var on = String(u.blur === 0 ? 0 : 1) === m[0]; return '<button type="button" data-wd="blur:' + m[0] + '" class="' + (on ? 'on' : '') + '" role="radio" aria-checked="' + on + '">' + m[1] + '</button>'; }).join('') + '</div>';
      h += '<div class="wdseg" role="radiogroup" aria-label="الحركة">' + [['auto', 'الحركة: تلقائية'], ['reduce', 'تقليل الحركة']].map(function (m) { var on = (u.motion === 'reduce' ? 'reduce' : 'auto') === m[0]; return '<button type="button" data-wd="motion:' + m[0] + '" class="' + (on ? 'on' : '') + '" role="radio" aria-checked="' + on + '">' + m[1] + '</button>'; }).join('') + '</div>';
    }
    return h;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-wd]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var kv = b.dataset.wd.split(':'), k = kv[0], v = kv[1], mc = document.getElementById('mc'), sc = mc ? mc.scrollTop : 0;
    if (k === 'blur') v = +v;
    if (k === 'pal' && (v === 'goldnight' || v === 'bluelight')) { var s0 = S(); if (s0.ui) s0.ui.mode = v === 'goldnight' ? 'dark' : 'light'; }
    setUi(k, v);
    try { if (typeof openSet === 'function') { openSet(); var m2 = document.getElementById('mc'); if (m2) m2.scrollTop = sc; } } catch (x) { }
  }, true);

  /* لمسة اهتزاز خفيفة على الأزرار (تحترم إعداد الاهتزاز) */
  document.addEventListener('pointerdown', function (e) {
    if (!isNew() || ui().motion === 'reduce') return;
    if (!(e.target.closest && e.target.closest('.btn,nav button,.rw,.item,.tools button,.seg button'))) return;
    try { if (S().vib !== false && navigator.vibrate) navigator.vibrate(8); } catch (x) { }
  }, { passive: true });

  /* ظلّ الشريط العلوي عند التمرير (يعمل أصلاً بـ .tb.sc) — نضمن تحديث الهيرو عند عودة التطبيق والدقيقة */
  document.addEventListener('visibilitychange', function () { if (!document.hidden && isNew()) hero(); });
  setInterval(function () { if (isNew() && !document.hidden) hero(); }, 60000);
  try { var od = window.renderDate; if (typeof od === 'function') window.renderDate = function () { var r = od.apply(this, arguments); try { if (isNew()) hero(); } catch (e) { } return r; }; } catch (e) { }
  try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (isNew()) apply(); }); } catch (e) { }

  /* ترجمات النصوص الجديدة */
  try {
    var X = {
      'حدّد موقعك': ['Set your location', 'Définir votre position', 'Konumunu belirle'], 'التصميم': ['Design', 'Design', 'Tasarım'],
      'التصميم القديم': ['Classic design', 'Design classique', 'Klasik tasarım'], 'التصميم الجديد': ['New design', 'Nouveau design', 'Yeni tasarım'],
      'الثيم': ['Theme', 'Thème', 'Tema'], 'الوضع': ['Mode', 'Mode', 'Mod'], 'تلقائي': ['Auto', 'Auto', 'Otomatik'], 'فاتح': ['Light', 'Clair', 'Açık'], 'داكن': ['Dark', 'Sombre', 'Koyu'],
      'التمويه: مفعّل': ['Blur: on', 'Flou : activé', 'Bulanıklık: açık'], 'التمويه: معطّل': ['Blur: off', 'Flou : désactivé', 'Bulanıklık: kapalı'],
      'الحركة: تلقائية': ['Motion: auto', 'Animation : auto', 'Hareket: otomatik'], 'تقليل الحركة': ['Reduce motion', 'Réduire les animations', 'Hareketi azalt'], 'التمويه': ['Blur', 'Flou', 'Bulanıklık'], 'الحركة': ['Motion', 'Animation', 'Hareket'],
      'ذهبي ليلي': ['Night gold', 'Or nocturne', 'Gece altını'], 'أزرق فاتح': ['Light blue', 'Bleu clair', 'Açık mavi'], 'وردي وأبيض': ['Pink & white', 'Rose et blanc', 'Pembe ve beyaz'], 'وردي ليلي': ['Night pink', 'Rose nuit', 'Gece pembesi'],
      'زمردي': ['Emerald', 'Émeraude', 'Zümrüt'], 'نعناعي': ['Mint', 'Menthe', 'Nane'], 'بنفسجي': ['Violet', 'Violet', 'Mor'], 'رملي دافئ': ['Warm sand', 'Sable chaud', 'Sıcak kum']
    };
    if (typeof I18N !== 'undefined') Object.keys(X).forEach(function (k) { if (!I18N[k]) I18N[k] = X[k]; });
  } catch (e) { }

  AZ.wd = { apply: apply, hero: hero, isNew: isNew, settingsHtml: settingsHtml, hadith: HD, period: period, moonSvg: moonSvg, set: setUi };
  apply();
})();
