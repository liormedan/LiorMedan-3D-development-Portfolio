# משימות שדרוג – אפליקציית ויזואליזציית אודיו

> כפתור הפעלה וסימון: המסמך כולל קישורי "הפעל" ו"סומן כבוצע" לכל משימה. לאחר ביצוע משימה אעדכן כאן לסימון ✔.

מסמך משימות מרוכז לשדרוג הוויזואליזציה, מחולק לפי סדר עדיפויות (P0–P2).

## מטרות
- חוויית שימוש חלקה (טעינה/גרירה/שליטה/שיתוף)
- ויזואליזציות מגוונות ויעילות ביצועית
- נגישות, ביצועים ותחזוקה לטווח ארוך

## P0 – מיידי
- [x] Drag & Drop Overlay ברור לקבצים · [▶ הפעל](#run-drag-drop-overlay) · [✓ סומן כבוצע](#done-drag-drop-overlay)
  - [x] מצב `isDragOver` עם שכבת Overlay והנחיות
  - [x] תמיכה בגרירת קובץ מחוץ/לתוך האפליקציה וביטול ברירת מחדל
  
  ביצוע: Codex · תאריך: 2025-10-31 · קבצים: `app/audio-visualizer/page.tsx`

- [x] פס זמן (Seek) משופר + תצוגת זמן · [▶ הפעל](#run-seek-bar) · [✓ סומן כבוצע](#done-seek-bar)
  - [x] תצוגת `currentTime / duration` בפס העליון
  - [x] קפיצה ±5 שניות בכפתורים

  ביצוע: Codex · תאריך: 2025-10-31 · קבצים: `app/audio-visualizer/page.tsx`

- [x] תיעוד קיצורי מקלדת (Help) · [▶ הפעל](#run-help-overlay) · [✓ סומן כבוצע](#done-help-overlay)
  - [x] חלונית “?” קטנה: Space (Play/Pause), חיצים (Seek/Volume), M (Mute)

  ביצוע: Codex · תאריך: 2025-10-31 · קבצים: `app/audio-visualizer/page.tsx`

- [ ] שיתוף Preset דרך URL
  - [ ] קריאה/כתיבה של מצב: `mode/theme/bars/bloom/trail`
  - [ ] כפתור “Share Link” שמעתיק כתובת
  
  ביצוע: Codex · תאריך: 2025-10-31 · קבצים: `app/audio-visualizer/page.tsx`
  
- [x] שיתוף Preset דרך URL
  - [x] קריאה/כתיבה של מצב: `mode/theme/bars/bloom/trail`
  - [x] כפתור “Share Link” שמעתיק כתובת

- [ ] Snapshot לתמונה (PNG)
  - [ ] כפתור “Save Thumbnail” ששומר PNG מהקנבס
  - [ ] ניסיון העתקה ל‑Clipboard אם אפשרי

- [ ] Toggle למיקרופון (Live)
  - [ ] `getUserMedia` עם חסינות הרשאות + הודעות UI
  - [ ] מעבר בין מקור קובץ למקור מיקרופון

## P1 – בינוני
- [ ] Instanced Bars + ShaderMaterial
  - [x] המרת Bars ל־`InstancedMesh` (שיפור FPS)
  - [ ] שיידר צבע/גובה לפי FFT (Uniforms לפי Theme)
- [ ] Beat/Peaks Detection
  - [x] זיהוי Peak/Spectral Flux (סינון EMA + סף אדפטיבי)
  - [x] אפקטים בביט (פולס אור עדין)
- [ ] BPM Detection (Tempo)
  - [x] חישוב BPM לא מקוון לקובץ (Autocorrelation)
  - [ ] אומדן BPM בזמן אמת מספקטרל-פלוקס ופסגות
  - [x] הצגת BPM עם Confidence (+Badge)
  - [ ] סנכרון אפקטים לקצב (Quantize ל־1/2/4 ביטים)
  - [ ] טיפול ב־Tempo Drift ומועמדים מרובים (60/120 וכו')
  - [ ] בדיקות מול לופים ודגימות לדוגמה
  - [ ] שמירה על ביצועים (Web Worker/Off-main-thread)

  ביצוע: Codex · תאריך: 2025-10-31 · קבצים: `app/audio-visualizer/page.tsx`
- [ ] מצבי תצוגה נוספים
  - [ ] Circular Waveform
  - [ ] Spectral Terrain (מיפוי FFT למשטח)
  - [ ] Particles מגיבים לבס/טרבל
- [ ] Postprocessing נוסף
  - [ ] Chromatic Aberration עדין
  - [ ] Vignette רך
  - [ ] Tone Mapping לפי Theme
- [ ] Presets ניתנים לשמירה/טעינה
  - [ ] שמירה מקומית (localStorage)
  - [ ] ייבוא/ייצוא JSON של preset

## P2 – הרחבות
- [ ] הקלטת וידאו (WebM) עם `MediaRecorder`
  - [ ] הגדרות משך/איכות + התקדמות
- [ ] התאמות מובייל
  - [ ] כפתורים גדולים, רטט (Vibration) בלחיצה
  - [ ] התאמת `barsCount` לדפדפן נייד
- [ ] אייקונים/נגישות
  - [ ] ARIA labels, קונטרסט, ניווט מקלדת

## טכני ותשתית
- [ ] שיפור ביצועים
  - [ ] Throttling/RAF יחיד לעדכוני UI
  - [ ] הקטנת הקצאות (Reuse של buffers)
- [ ] ניקוי משאבים יסודי
  - [ ] ניתוק Nodes + `URL.revokeObjectURL`
  - [ ] טיפול ב־`AudioContext` suspend/resume בין דפדפנים
- [ ] SSR/Next.js Guards
  - [ ] `typeof window !== 'undefined'` לכל שימוש בדום/אודיו
  - [ ] מניעת Hydration warnings
- [ ] טיפול שגיאות והודעות למשתמש
  - [ ] הרשאות מיקרופון/HTTPS
  - [ ] קבצים לא נתמכים/פגומים

## קבצים ומודולים (הצעות)
- `app/audio-visualizer/page.tsx`
  - הרחבת ה־UI, מצבי תצוגה, חיוויים
- `components/VisualizerModes.tsx`
  - פיצול מצבי תצוגה (Bars/Ring/Terrain/Particles)
- `lib/audio/beat.ts`
  - לוגיקת Peaks/Flux + API לאירועים
- `lib/visualizer/presets.ts`
  - ניהול Presets, URL params, localStorage

## קריטריוני קבלה (דוגמאות)
- [ ] גרירת קובץ מציגה Overlay ברור, Drop טוען ומנגן
- [ ] לחיצה על “Share Link” יוצרת URL שמחזיר תצורה זהה
- [ ] Snapshot יוצר PNG תקין עם שם קובץ ידידותי
- [ ] מצב Microphone עובד ב־HTTPS ומציג הודעות הרשאה
- [ ] Instanced Bars שומר על 60FPS ב־Desktop עם 128–256 Bars
