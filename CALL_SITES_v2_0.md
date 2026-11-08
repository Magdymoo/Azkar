# مواضع الاستدعاء — 2.0.0 (الجديد)

| الواجهة | تعريف | يُستدعى من |
|---|---|---|
| `AZ.hijri.{of,keyOf,daysIn,today,upcoming,occOn,whiteDays,setAdj,nfX}` | `extras.js` | `cal.js`, `ramadan.js`, بطاقات `extras.js`, `__nf.extra` |
| `AZ.trk.{get,set,setP,setS,markAdded,pDone}` | `extras.js` | `tracker.js`, بطاقة `progress` |
| `AZ.ramadan.{get,set,y,toggle}` | `extras.js` | `ramadan.js`, بطاقة `ramadan` |
| `AZ.openTool(id)` ← `__tl.openPage(id)` | `extras.js`/`tools.js` | الأزرار، `AZ.openGo` |
| `AZ.openGo(k)` مغلَّفة بمفاتيح `tracker,cal,ramadan,learn,zakat,kids,loved,salah` | `extras.js` | `notify.js` (`go` في الإشعار) |
| `__nf.extra.push(nfX)` | `extras.js` | `schedule()` لكل يوم off=0..2 |
| `__qd.addMissed(prayer,n)` | `qada.js` | `tracker.js` (فقط مع خطة مفعّلة) |
| `window.renderHome` مغلَّفة | `extras.js` | يستدعي `refresh()` بعد كل رسم |
| `window.__x_<id>={mount,unmount}` | الملفات الكسولة | stub في `tools.js` (`NEWP`) عبر `AZ_lazy(id+'.js','__x_'+id)` |
| مفاتيح التخزين | `azkari_arb, trk, sawm, ramadan, kids, loved, zk, travel, cities, hj_adj` | `data.js` (`PREFS` + `NATIVE`) |
| slots الرئيسية | `progress, ramadan, friday` | `HOME_ORDER/layoutHome` (موجودة مسبقًا) |
| ملفات الكاش | الثمانية + `arbaeen.json` | `warm` في `polish.js`؛ `extras.js` في `CORE` بـ`sw.js` |
