# أذكاري v1.8
## Fixes
- Sakina "رجوع" TypeError: root cause = stale overlay click handler firing after close() (event bubbling from the "done" screen) → show() ran with ov===null. Now one session object per open, handler bound once and removed on close, every render checks the session is alive.
- Occasions (travel/food/rain): all three home buttons used data-oc="1" with no group filter → whole list shown. Now data-oc carries the group, list is filtered by group, plus a chips bar (الكل/السفر/الطعام/المطر).
## Sakina
- Removed "التالي". "كرب شديد" screen has only: رجوع + «حاضر، هاقوم أصلي ركعتين لله عز وجل وأشكو همي».
- Home card: "في كرب شديد أو ضيق؟ اضغط هنا".
- Offline videos: Cache API `athkar-videos`, served by sw.js with Range (206) support; two toggles + size + clear button in Settings.
## NOT in this release (pending): prayer-times tab, post-prayer counter adhkar, Hajj/Umrah adhkar, Khatmah badge, icon-update popup.
