# تدقيق المشروع — 2.0.0

## الحجم (بايت)
`extras.js` 22٬094 (CORE) · `tools.js` 12٬224 · `qada.js` 48٬583 · كسولة: `learn` 13٬431، `tracker` 9٬381، `cal` 9٬601، `ramadan` 8٬618، `kids` 6٬210، `loved` 8٬223، `zakat` 17٬316، `salah` 9٬849، `arbaeen.json` 63٬183.

## ملاحظات
1. `index.html` ما زال ضخمًا و`I18N` فيه ≈٣٣ سطر `Object.assign`؛ فصلهما **2.1** (قرار سابق).
2. `extras.js` يحوي بيانات المناسبات + ثلاث بطاقات + تذكيرات: مرشّح للتقسيم إن كبر (٢٢ك اليوم).
3. تكرار صغير مقصود: دوال `esc/A/fmtT` في كل وحدة كسولة لتبقى مستقلة. يمكن لاحقًا إخراجها لـ`AZ.ui` مشتركة.
4. يوجد تقويمان للهجري: `sakina.js`/`prayer.js` (Intl خام) و`AZ.hijri` (مع تعديل ±١). الأول لا يتبع التعديل؛ **اقتراح:** توجيههما إلى `AZ.hijri.today()` في 2.1.
5. تقارير rc القديمة (`A4…A10_REPORT_*`, `RELEASE_NOTES_v1_7.md`) مؤرشفة.

## قائمة الحذف المقترحة (لم أحذف شيئًا)
`A4_A5_REPORT_rc14.md`، `A7_REPORT_rc12.md`، `A8_REPORT_rc16.md`، `A9_REPORT_rc13.md`، `A10_REPORT_rc15.md`، `RELEASE_NOTES_v1_7.md` (نقلها إلى `docs/archive/`)، و`azkar_duas.md` إن لم يعد مصدرًا لـ`dua-library.json`.
