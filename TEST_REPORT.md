# Test report v1.9
| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Umrah rotation (no repeats, cycle only after exhaustion) | ✅ | node, 10 distinct draws | seed library only |
| Counters clamp 0..7 + persist | ✅ | node | |
| Umrah UI lifecycle (open/stage/back/close/stale tap) | ✅ | node fake DOM | not tested on a device |
| LIB-034 / LIB-END-1 / LIB-069 rendered from library, not copied | ✅ | node | |
| No duplicated dua text | ⚠️ | node | LIB-059 overlaps stage-2 dua tail |
| Readiness: order, one card, 3-day throttle, don't-remind | ✅ | node (logic) | permissions/install flows not run on Android/iOS |
| Full 117-entry library + diff report | ❌ | — | needs prompt as file |
| Sections 4–7 (notifications), Diagnostics, rain card | ❌ | — | not started |
| Religious texts verified on dorar.net | ❌ | — | no network: all grades copied from your prompt, unverified |
| 15-min/1-hour closed-app notification test | ❌ | — | requires real devices |
| Notification planner (5 prayers, pre-adhan, 3-stage ladders, max 3, Friday hadith, toggles, quiet hours, no past items) | ✅ | node, 12 checks | logic only |
| Delivery via showNotification, tap opens screen, 10-s test, Diagnostics screen | ⚠️ | code review | not run on Android/iOS |
| Open-Meteo call + rain card | ⚠️ | code review | no network here; raw JSON is shown in Diagnostics after first real call |
| Escalation stops after completion | ❌ | — | hook missing (see notes) |
| 15-min / 1-hour closed-app notification test | ❌ | — | needs real devices |
