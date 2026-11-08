# FILES_TO_DELETE (أنت تنفّذ؛ لم أحذف شيئًا)
| الملف | السبب والدليل | الخطورة | أثره على الكاش | الأمر |
|---|---|---|---|---|
| `q01.json … q31.json`, `t01.json … t31.json` (62 ملفًا، ≈3.9MB، في الجذر) | نسخ طبق الأصل من `quran/` (تحققت بـcmp). `mushaf.js` وindex.html يحمّلان من `quran/` فقط، ولا `sw.js` ولا أي سكربت يشير للجذر | منخفضة؛ قد تتأثر نسخ أقدم من 2.0 لم تخزّن المصحف بعد | لا شيء (كاش المصحف `athkar-quran` منفصل) | `git rm q[0-3][0-9].json t[0-3][0-9].json` |
| `meta.json` (الجذر) | مطابق لـ`quran/meta.json`؛ الكود يقرأ `quran/meta.json` | منخفضة | لا شيء | `git rm meta.json` |
| `azkar_duas.md` | لا يشير إليه أي ملف | منخفضة (مصدر نصي لـdua-library) | لا شيء | `git rm azkar_duas.md` (أو انقله لـdocs/) |
| `A4_A5_REPORT_rc14.md`, `A7_REPORT_rc12.md`, `A8_REPORT_rc16.md`, `A9_REPORT_rc13.md`, `A10_REPORT_rc15.md`, `RELEASE_NOTES_v1_7.md` | تقارير مؤرشفة (PROJECT_AUDIT#5) | لا خطورة | لا شيء | `git rm` أو انقلها لـdocs/archive/ |
| `KFGQPC-LICENSE.txt` (الجذر) | نسخة مطابقة لـ`fonts/KFGQPC-LICENSE.txt` | منخفضة | لا شيء | اختياري |
**لا تحذف:** `splash.jpg` (يشير له index.html وpolish.js)، `splash.webp`، `recover.html`، `sakina.js`، الفيديوهات.
قبل حذف ملفات المصحف من الجذر تأكد بعد النشر أن قراءة المصحف تعمل (أوفلاين أيضًا).
