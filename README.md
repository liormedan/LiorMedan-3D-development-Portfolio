# תיק עבודות 3D - Portfolio

אתר תיק עבודות מתקדם עם דוגמאות תלת-ממדיות ואנימציות מרהיבות, נבנה עם Next.js ו-Three.js.

## ✨ תכונות

- 🎮 **חוויות 3D אינטראקטיביות** - אובייקטים תלת-ממדיים מתקדמים עם Three.js
- 🎨 **עיצוב מודרני** - ממשק משתמש מרהיב עם Tailwind CSS
- ⚡ **אנימציות חלקות** - אנימציות מתקדמות עם Framer Motion
- 📱 **רספונסיבי** - מותאם לכל הגדלי מסך
- 🚀 **ביצועים מעולים** - אופטימיזציה מלאה עם Next.js 14

## 🛠️ טכנולוגיות

- **Next.js 14** - פריימוורק React מתקדם
- **React Three Fiber** - Three.js עבור React
- **Three.js** - ספריית 3D לדפדפן
- **Framer Motion** - אנימציות מתקדמות
- **Tailwind CSS** - עיצוב מהיר ומודרני
- **TypeScript** - פיתוח בטוח עם טיפוסים

## 🚀 התקנה והרצה

1. **התקן dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **הרץ את השרת המקומי:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **פתח בדפדפן:**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 📁 מבנה הפרויקט

\`\`\`
├── app/
│   ├── components/          # רכיבי React
│   │   ├── Hero.tsx        # עמוד הבית עם 3D
│   │   ├── ProjectsSection.tsx  # גלריית פרויקטים
│   │   ├── SkillsSection.tsx    # כישורים עם 3D
│   │   ├── ContactSection.tsx   # טופס יצירת קשר
│   │   └── Navigation.tsx       # תפריט ניווט
│   ├── globals.css         # סגנונות גלובליים
│   ├── layout.tsx          # פריסה ראשית
│   └── page.tsx           # עמוד הבית
├── public/                 # קבצים סטטיים
└── package.json           # תלויות הפרויקט
\`\`\`

## 🎨 התאמה אישית

### שינוי צבעים
ערוך את קובץ \`tailwind.config.js\` כדי לשנות את ערכת הצבעים:

\`\`\`javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
\`\`\`

### הוספת פרויקטים
ערוך את \`ProjectsSection.tsx\` והוסף פרויקטים חדשים למערך \`projects\`.

### שינוי אנימציות 3D
התאם את הפרמטרים ב-\`Hero.tsx\` ו-\`SkillsSection.tsx\` לשינוי התנהגות האובייקטים התלת-ממדיים.

## 📦 בנייה לפרודקשן

\`\`\`bash
npm run build
npm start
\`\`\`

## 🚀 פרסום ב-Vercel

### דרך הממשק של Vercel:
1. היכנס ל-[Vercel](https://vercel.com)
2. חבר את חשבון GitHub שלך
3. בחר את הריפוזיטורי: \`LiorMedan-3D-development-Portfolio\`
4. Vercel יזהה אוטומטית שזה פרויקט Next.js
5. לחץ Deploy!

### דרך CLI:
\`\`\`bash
# התקן Vercel CLI
npm i -g vercel

# התחבר לחשבון
vercel login

# פרסם את הפרויקט
vercel --prod
\`\`\`

### הגדרות Environment Variables ב-Vercel:
1. לך ל-Dashboard של הפרויקט ב-Vercel
2. Settings → Environment Variables
3. הוסף את המשתנים מקובץ \`.env.example\`

## 🤝 תרומה

מוזמנים לתרום לפרויקט! פתחו issue או שלחו pull request.

## 📄 רישיון

MIT License - ראו קובץ LICENSE לפרטים נוספים.

---

נבנה עם ❤️ ו-Three.js