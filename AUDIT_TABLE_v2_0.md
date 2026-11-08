# جدول التحقق (بالصدق: ✅ بدليل / 🔧 أصلحته / ◻︎ لم يُفحص بعمق)
| البند | الحالة | الدليل |
|---|---|---|
| A0-أ جرد/حذف | 🔧 | FILES_TO_DELETE.md، فحص مراجع بـgrep وcmp |
| A0 تشخيص | ✅ | diag.js: version، dayKey، boot trace، nlog |
| A1 ترحيل | 🔧 ✅ | fixture 1.14.0 في jsdom حقيقي، idempotent؛ قرار 7 صُلّح + 3 اختبارات؛ schema:2 موجود |
| A2 يوم أذكاري | ✅ | `AZ.day`، `today()=AZ.day.key()`، اختبارات d-edge |
| A3 homeMessage | ✅ | d-edge |
| A5 موقع/طريقة | ✅ | `azkar_pmode` auto، loc.js، اختبارات prayer-ref/loc (لم تُقارَن بتقويم أم القرى المطبوع) |
| A4-ب AZ.times | ✅ مع ملاحظة | `dueTime` مفوِّض رقيق لـqm/qe |
| A4 إشعارات | ✅ مع ملاحظة | `check()` fallback محروس بـ`__nf.covers`؛ markDone يُستدعى من save()؛ لم تُجرَّب إشعارات حقيقية |
| A6 كاش | 🔧 | قرار 10 صُلّح + sw-activate.test |
| A7 إقلاع | ◻︎ | لا قياس على جهاز؛ idle/unload بـgrep فقط |
| A9 مودالات/تثبيت | ◻︎ | اعتمدت A9_REPORT؛ يحتاج جهازًا |
| A10 حارس الأخطاء | ✅ | موجود؛ جولة jsdom بلا أخطاء |
| A8 QA | 🔧 | نقر آلي على التابات والصفحات التسع؛ حارس canvas |
| B1–B5, C1–C6, E | ◻︎ | اختبارات موجودة (b1,b2,b6,c-*,d-mount) تمرّ؛ لم أراجع الكود سطرًا سطرًا |
| D اختبارات | ✅ | 165/165، `npm test` |
