# FILES_CHANGED — أذكاري 2.5.0 (Audit)
| المسار على GitHub | الحالة | ما تغيّر | ماذا أفعل |
|---|---|---|---|
| `sw.js` | معدَّل | activate يُبقي كاش الإصدار السابق جيلًا واحدًا (قرار 10) | استبدل |
| `data.js` | معدَّل | لقطة الترحيل للمفاتيح الكبيرة، إلغاء الترحيل عند ضيق المساحة، حذف بعد 14 يومًا (قرار 7) | استبدل |
| `index.html` | معدَّل | حارس `getContext` في `makeReport`/`shareReport` | استبدل |
| `version.json` | معدَّل | ملاحظات عربية للإصدار | استبدل |
| `CHANGELOG.md`, `RELEASE_NOTES_v2_0.md` | معدَّل | إدخال المراجعة | استبدل |
| `package.json` | جديد | `npm test` وأخواتها | ارفع |
| `tests/sw-activate.test.js`, `tests/data-snapshot.test.js` | جديد | 6 اختبارات | ارفع |
| `FILES_TO_DELETE.md`, `AUDIT_TABLE_v2_0.md`, `WEBPUSH_FEASIBILITY_v2_0.md`, `LICENSES_REPORT_v2_0.md` | جديد | تسليم المراجعة | ارفع (اختياري) |

ملاحظة: رقم الإصدار صار 2.5.0 بطلبك (كان 2.0.1)؛ تغيّرت لاحقات `?v=` في index.html وsw.js فيتحدّث الكاش كله مرة واحدة. `sw.js` تغيّر فسيتحدّث الكاش تلقائيًا. تشغيل الاختبارات: `npm test` (Node ≥ 18).

## v3.0.0
جديد: wirdi.js, tests/wirdi.test.js, RELEASE_NOTES_v3_0.md. معدّل: index.html, sw.js, manifest.webmanifest, version.json, package.json, qada.js, readiness.js, notify.js, recover.html, diag.js, الأيقونات وsplash.
