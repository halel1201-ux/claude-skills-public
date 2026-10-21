# Claude Code Skills: סוכן קרוסלות + סקילים שימושיים

אוסף סקילים ל־Claude Code: מערכת מלאה ליצירת קרוסלות לאינסטגרם בעברית, ועוד סקילים לעיצוב, מחקר ואבטחה.

## התקנה
1. מורידים את הריפו (Code ← Download ZIP, או `git clone`).
2. מעתיקים את התיקיות שבתוך `skills/` אל:
   - `~/.claude/skills/` כדי שיעבדו בכל פרויקט, **או**
   - `<הפרויקט שלך>/.claude/skills/` כדי שיעבדו רק בפרויקט אחד.
3. פותחים מחדש את Claude Code.

## סוכן הקרוסלות
| סקיל | מה הוא עושה |
|---|---|
| `carousel-setup` | **מריצים ראשון.** אשף הגדרה: מפתחות, תמונות פנים, וראיון שבונה את קובץ המותג שלך |
| `carousel-orchestrator` | הראשי: נושא ← קרוסלה שלמה (`/carousel [נושא]`) |
| `carousel-content-planner` | תכנון מבנה, הוק וסיום |
| `carousel-copywriter` | טקסטים בעברית לשקופיות ולכיתוב |
| `carousel-image-prompter` | בחירת שיטת התמונה ופרומפטים |
| `carousel-repurposer` | לוקח קרוסלה מאינסטגרם ובונה אותה מחדש בעברית |
| `carousel-reviewer` | הרכבה ואישור סופי |
| `right-choice-carousel` | ״קרוסלת הבחירה הנכונה״: שני פאנלים קומיקס בכל שקופית |
| `carousel-pdf-designer` | עיצוב שקופיות ומדריכי PDF ב־HTML לפי מערכת העיצוב של המותג |

> הסקילים הם ״המוח״. כדי לרנדר צריך גם את חבילת המערכת (מנוע Remotion והסקריפטים), שמקבלים מבעל הריפו.
> כל הפרטים האישיים נוקו: המותג, השם, התמונות וה־handle נקבעים אצלך דרך `/carousel-setup`.

## עוד סקילים (עם רישיון פתוח)
`anatomy` · `design-taste-frontend` · `impeccable` · `last30days` · `convert-documents-to-markdown` · סקילי האבטחה של Strix: `api-security-testing`, `application-security-testing`, `ci-security-scanning-with-strix`, `find-security-vulnerabilities-in-code`, `fix-security-vulnerabilities-with-strix`, `managed-pentesting-with-strix`, `owasp-top-10-testing`, `penetration-testing-with-strix`, `web-app-penetration-testing`

## סקילים מומלצים שלא נכללו
הם לא כאן כי אין להם רישיון פתוח. אפשר להתקין אותם מהמקור (למשל עם הסקיל `find-skills`):
`marketing-psychology`, `youtube-analyzer`, `remotion-best-practices`, `ui-ux-pro-max`, `agent-reach`, `emil-design-eng`, `apple-design`, `animate`, `animate-expo`, `animation-performance`, `animation-vocabulary`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `break-ui`, `mobile-native`, `ask-sonner`, `pick-ui-library`, `prototype`, `teach`, `chief-of-staff`, `write-swift`, `find-skills`, `caveman` (וכל המשפחה שלו), `cavecrew`

---

**English:** Claude Code skills, including a full Hebrew Instagram-carousel agent. Copy the folders in `skills/` into `~/.claude/skills/` (or a project's `.claude/skills/`) and run `/carousel-setup` first. Personal details were removed; your brand is set up by the setup wizard. Third-party skills keep their own licenses (see `NOTICE.md`).
