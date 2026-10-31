# Test report v1.8.1
| Request | Result | Verification |
|---|---|---|
| 1 Salah screen = back + video(Salah.mp4) + pray only | PASS | node fake-DOM test |
| 1 Sakina all paths (16 checks), no TypeError | PASS | node fake-DOM test |
| 1 Video plays Online/Offline, file exists on GitHub | NOT TESTED | needs device; `videos/Salah.mp4` must exist with this exact case |
| 2 Video button design (size/contrast/▶) | Implemented, not visually tested | CSS review: 52px, 17.6px/700, dark on gold |
| 3 Prayer engine raw output (Cairo, Makkah, summer/winter, last third) | PASS (plausible) | node; Cairo 31-Oct: Fajr 04:40, Sunrise 06:08, Dhuhr 11:38, Asr 14:45, Maghrib 17:09, Isha 18:27 |
| 3 Compared to official timetable / adhan-js | NOT DONE | no network; please compare |
| 3 UI tab, geolocation, countdown, Ramadan suhoor | NOT TESTED on device | |
| 4 Post-prayer counter: 105 taps → done, toast, vibration | PASS | node fake-DOM test |
| 5 Tone paths | FIXED in code | HTTP status table requires network: open Settings → نغمة التنبيه, each row now shows ✓/✗ + size |
| 5 Airplane mode, iOS Safari PWA, Chrome Android, console errors | NOT TESTED | |
