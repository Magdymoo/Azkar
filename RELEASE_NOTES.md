# أذكاري v1.9.1 (partial scope — see "Not done")
## Added
- Umrah section (`umrah.js`): 7 stages (ihram/talbiyah, entering the Haram, tawaf, 2 rakaat + zamzam, sa'i, tahallul, leaving), 7-round counters for tawaf and sa'i (persisted in localStorage `azkar_umrah`), mawquf narrations tagged «موقوف», fully offline.
- Dua library engine: all duas referenced by id from `dua-library.json` (single source, never copied); picker never repeats inside a tawaf/sa'i until the whole library is exhausted.
- Startup readiness card (`readiness.js`): install → notifications → location → service worker; ONE card, at most every 3 days, "don't remind me" honored; on iOS notification permission is never requested before the app is installed.
## Not done (needs your decision/input)
- Full library (117 entries): `dua-library.json` is a **seed of 11 entries**. The prompt text was only in the chat, not a file, so it could not be extracted/diffed by script. Upload the prompt as a .md file and it will be generated verbatim with an automatic diff.
- Sections 4–7: escalating reminders, prayer-time notifications with hadith, notification settings, scheduling/Periodic Sync/Triggers, Diagnostics screen, rain card.
## Known overlap
- LIB-059 «اللهم افتح لي أبواب رحمتك» is also the tail of the mosque-entry dua (stage 2). Decide whether to drop LIB-059 from the picker.

## v1.9.1 additions (`notify.js`, `sw.js` notificationclick)
- Prayer notifications with the per-prayer hadith + source (Friday dhuhr uses the Jumu'a hadith), optional 10-min pre-adhan.
- Escalating reminders: morning (fajr+30/+90/+150), evening (asr+30…), qiyam (last third, +45); max 3 per kind; quiet hours; master/individual toggles (all ON by default).
- Delivery only via `registration.showNotification`; the "test in 10 s" button uses the same path. TimestampTrigger when available, else timers while the page is alive.
- Settings card: toggles, readiness ✅/⚠️, Diagnostics (permissions, location, prayer times JSON, weather JSON, scheduled list, log).
- Rain card via Open-Meteo (only lat/lng sent); button opens the existing "المطر" occasions list (no text copied).
- Tap on a notification opens the app (hadith details or the adhkar page).
## Still not done
- Escalation stop-on-completion: `AZKAR_markDone('m'|'e'|'q')` exists but is NOT yet called from the app's completion logic (needs a hook in the adhkar-completion code) → today ladders keep going even after reading.
- Reminders for sleep adhkar / duha / witr / Friday Kahf / fasting-eve notifications, and the 3.1 location-permission flow tied to Open-Meteo privacy page.
- Closed-app delivery needs Web Push (server). Proposed (not implemented without your approval): Cloudflare Worker + VAPID. iOS: only installed PWA (16.4+), no guarantee while force-quit.
