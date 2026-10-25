# أذكاري | Athkari

A beautiful, lightweight **Islamic Adhkar companion** in a **single HTML file**. Track your morning, evening and bedtime adhkar, keep a daily Quran wird, count tasbih freely, and build a daily streak, all in a calm "Desert Night & Gold" design with full Arabic (RTL) support.

No build step, no frameworks, no accounts. Your data stays on your device.

> Author: **Mohamed**

---

## Features

### Daily Adhkar
- Four sections: **Morning**, **Evening**, **Before Sleep**, and **Miscellaneous**.
- Every dhikr is written in full with tashkeel (including Ayat al-Kursi, Al-Ikhlas and the Mu'awwidhatayn, the last two verses of Al-Baqarah, and Sayyid al-Istighfar).
- The **virtue (fadl)** of each dhikr is shown in a clear, readable box.
- Interactive counters: tap a card to count, with a progress bar and a "done" state.
- Adhkar are **sorted from the smallest repetition count to the largest**.
- The right section opens automatically based on the time of day (morning, evening, or bedtime).
- "Reset this section for today" button if you miscounted.
- A card of sleeping etiquette from the Sunnah appears in the Before Sleep tab.

### Quran Wird
- Separate **morning** and **evening** wird, each with a "Read ✅" button.
- Page tracker (1 to 604) that advances automatically after each reading and starts a new **khatma** after page 604, with a khatma counter.
- Edit the current page manually at any time.
- Khatma progress bar with an **estimated completion date** (based on 2 pages per day).
- **Page reader**: shows the Uthmani text of the current page with a simple **Tafsir (Tafsir al-Muyassar)** below it, plus previous/next browsing that does not change your tracked position.
- Pages are cached on your device after the first load, so they can be read offline later.

### Free Counter
- A standalone circular counter with a glowing progress ring.
- Goals: **33 / 100 / 1000**.
- Choose a dhikr (Istighfar, Tasbih, Salawat, La ilaha illa Allah) or **type your own**.
- Soft **sound** (Web Audio) and **vibration**, each with its own on/off switch. Vibration is skipped safely on devices that do not support it (for example iOS).
- Cumulative total saved across sessions.

### Daily Inspiration
- A verse or hadith that changes **once per day** (based on the date, not random on every open) with a short explanation of its meaning.
- Copy and Share buttons.

### Streak and Stats
- A day counts as **complete** when you finish: morning adhkar + evening adhkar + at least one Quran wird.
- Consecutive-day **streak**, plus your **longest streak**.
- Today's progress bar (x of 3) and the number of adhkar you counted today.
- A smart **"next step"** button that takes you to what is left today.
- 35-day **heatmap** (gold = complete, light = partial) and badges for **7 / 30 / 100** days.

### Profile, Reminders and Settings (⚙)
- First launch asks for your **name and gender** and greets you with personal motivational messages.
- A prompt suggests adding the app to your Home Screen (iPhone / Android buttons) so your data stays safe.
- Reminders for morning adhkar (before sunrise), evening adhkar (before sunset, optional by location), and the morning/night Quran wird if not yet read.
- **Add to phone calendar** (.ics for Apple Calendar / Google Calendar) so reminders work even when the app is closed. In-app notifications work while the app is open.
- Change name, reminder times, backup and restore, all from Settings.

### Fasting Reminder
- Upcoming Monday/Thursday and White Days (13, 14, 15 Hijri) with authentic hadiths, their virtue, and the winter "cold booty" note.

### Look and Feel
- "Desert Night & Gold" dark theme and a warm "manuscript paper" light theme, following your system setting with a manual toggle.
- Font size control, Hijri and Gregorian date in the header.
- Glass-style cards, smooth transitions, and `prefers-reduced-motion` support.
- Mobile-first layout with safe-area support.

### Your Data
- Everything is stored in your browser's `localStorage` (key: `athkary.v1`).
- **Backup and restore**: copy your data as text, and paste it back to restore it on another device.

---

## How to Use

1. Open the app. It lands on **Today** (inspiration, streak, progress).
2. Go to **Adhkar**, pick a section, and **tap each card** to count. When a card reaches its target it turns green.
3. Go to **Quran**, read your page (tap **"Read page X with Tafsir"** to view it inside the app), then press **Read ✅** for morning or evening.
4. Use **Counter** any time for open tasbih or istighfar.
5. Come back to **Today** to see your streak, heatmap and badges.
6. Use the **Backup** card to save or restore your data.

---

## Run Locally

No installation needed. Download the file and open it in any modern browser:

```bash
git clone https://github.com/magdymoo/Azkar.git
cd Azkar
# open index.html in your browser
```

> **Important:** the Quran page reader loads text from the internet the first time a page is opened, so use the file from your device or a normal web host with an internet connection. Pages already opened are cached for offline reading.

## Deploy to GitHub Pages

1. Upload all files (index.html, manifest.webmanifest, sw.js and the icons) to the repository root.
2. On GitHub go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
4. After a minute your app is live at `https://magdymoo.github.io/Azkar/`.

On a phone, open that link and use **Add to Home Screen** for an app-like shortcut.

---

## Project Structure

```
athkari/
├── index.html            # the app (HTML + CSS + JavaScript)
├── manifest.webmanifest  # PWA manifest
├── sw.js                 # service worker (offline)
├── icon-192.png / icon-512.png / apple-touch-icon.png
└── README.md
```

## Tech Notes

- Plain HTML, CSS and vanilla JavaScript, no dependencies.
- Fonts: [Amiri](https://fonts.google.com/specimen/Amiri) and [Cairo](https://fonts.google.com/specimen/Cairo) via Google Fonts.
- Quran text and Tafsir: [AlQuran Cloud API](https://alquran.cloud/api) (`quran-uthmani` and `ar.muyassar` editions).
- Storage: `localStorage` with `try/catch` and safe defaults.

## Known Limitations

- True background push notifications need a server; use the calendar reminders for closed-app alerts. iPhone in-app notifications require the app to be added to the Home Screen.
- The Quran page reader needs an internet connection the first time each page is opened. Page 1 (Al-Fatihah) is built in.
- The daily verse/hadith list is currently small (13 entries).

## Roadmap

- Prayer times
- More adhkar (entering the home, eating, travel) and a larger daily inspiration list
- Export/import of backups as a file

## Disclaimer

The adhkar, virtues and meanings were prepared with care, but please **verify texts and rulings against trusted sources** (such as a reliable adhkar book or a scholar) before relying on them. If you find any mistake, please open an issue.

## License

MIT License. Copyright (c) 2026 Mohamed.

---

## بالعربي باختصار

**أذكاري** تطبيق أذكار في ملف HTML واحد: أذكار الصباح والمساء وقبل النوم، وورد القرآن اليومي مع التفسير الميسر، وعداد حر، وآية أو حديث اليوم، وسلسلة التزام يومية مع إحصائيات. يعمل بدون تثبيت، وبياناتك تُحفظ على جهازك فقط.
