# أذكاري v1.8.1
## Fixes
- Sakina "كرب شديد": the Salah video button was missing because v1.8 removed it from the `salah` view (`render()` had no `vbtn`). Restored: back + video (`videos/Salah.mp4`, exact case) + «حاضر…» only.
- Tones: code requested `sounds/tone1` + `.mp3`/`.wav` (lowercase); real files are `Tone1.wav…Tone5.wav` (GitHub Pages is case-sensitive → 404 → fallback beep). Paths now exact; legacy lowercase kept as fallback. Tones dialog shows per-file status + size (HEAD).
## Improvements
- Video button: gold filled 52px-high button, ▶ icon, 17.6px/700 text, dark text on gold (≈9:1 contrast), dashed "الفيديو قريبًا" when missing.
- sw.js: Tone*.wav + prayer.js precached; Range support for /sounds/ (iOS); cache name = athkar-1.8.1.
## Features
- Prayer tab (`prayer.js`): local astronomical engine (no CDN, works offline), geolocation + 9 cities fallback, 5 methods (default Egyptian 19.5°/17.5°), next-prayer countdown, last third of the night, suhoor in Ramadan only. Also syncs Isha/Fajr to the night-wake dua window.
- Post-prayer adhkar with auto-advancing counter + optional vibration.
## Known limits
- adhan-js not bundled (no network at build time): in-repo equivalent used. Compare with your local timetable (±1–3 min; Egyptian Survey publishes rounded times).
- iOS PWA: custom tone plays inside the app only; system notifications keep the default sound.
