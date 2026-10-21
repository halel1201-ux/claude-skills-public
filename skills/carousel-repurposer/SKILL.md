---
name: carousel-repurposer
description: "Takes an Instagram carousel link, downloads all slides, analyzes what makes it work, gets approval on the angle, then produces a Hebrew Remotion carousel ready to render."
risk: safe
source: self
date_added: "2026-04-26"
author: yaniv
tags: [carousel, repurpose, hebrew, instagram, vision, remotion]
tools: [claude-code]
---

# Carousel Repurposer

אתה לוקח קרוסלה מאינסטגרם, מבין מה גורם לה לעבוד, ומייצר גרסה עברית מלאה — ניתוח, קופי, וסליידים מרונדרים — מותאמת לקהל הישראלי של המשתמש.

## קלט

לינק לפוסט אינסטגרם, לדוגמה: `https://www.instagram.com/p/DXX80oKDovY/`

---

## שלב 1 — הורדת הסליידים

חלץ את ה-shortcode מה-URL (החלק אחרי `/p/` ולפני `/?`).

```bash
mkdir -p /tmp/carousel-{shortcode}
yt-dlp -o "/tmp/carousel-{shortcode}/%(playlist_index)s.%(ext)s" "{URL}"
```

אחר כך חלץ frame אחד מכל קובץ:

```bash
for i in 1 2 3 ...; do
  ffmpeg -i /tmp/carousel-{shortcode}/$i.mp4 -vframes 1 /tmp/carousel-{shortcode}/slide_$i.jpg -y -loglevel quiet
done
```

**שגיאות:**
- `yt-dlp` נכשל → הפוסט כנראה פרטי. בקש screenshots.
- `ffmpeg` חסר → `brew install ffmpeg`
- `yt-dlp` חסר → `pip3 install yt-dlp --break-system-packages`

---

## שלב 2 — ניתוח הסליידים

קרא כל `slide_N.jpg` בסדר עם vision. לכל קרוסלה חלץ:

- **Hook** — מה בסליד 1 גורם לעצור את הגלילה (חידה / טענה נגד אינטואיציה / מספר / כאב)
- **מבנה נרטיבי** — בעיה→פתרון / before→after / listicle / מסע
- **Insight מרכזי** — הרעיון שאם תוציא אותו, הקרוסלה קורסת
- **הוכחה** — איך הם מוכיחים את הטענה (דוגמאות, מספרים, before/after, screenshots)
- **CTA** — מה הסליד האחרון מבקש ואיך הוא בנוי
- **טון** — educational / storytelling / listicle / motivational / provocative
- **עיצוב** — פלטת צבעים, פונט, מבנה ויזואלי בולט

---

## ⏸️ CHECKPOINT — אישור כיוון

לפני שכותבים מילה בעברית, הצג למשתמש:

```
📊 ניתוח המקור
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
חשבון: @{account}
Hook: {תיאור קצר}
מבנה: {סוג נרטיב}
Insight: {הרעיון המרכזי במשפט}
טון: {טון}
CTA: {מה מבקשים}

💡 הכיוון שלי
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hook מוצע: {כותרת פתיחה עברית מוצעת}
זווית: {איך מותאם לקהל הישראלי}
CTA: {מה תהיה ה-CTA של המשתמש}

✅ להמשיך עם הכיוון הזה?
   או כתוב לי מה לשנות.
```

**המתן לאישור לפני שממשיכים.**

---

## שלב 3 — כתיבת הגרסה העברית

אחרי אישור, כתוב את כל הסליידים לפי הכללים הבאים:

**קול:** חבר שיודע, לא מרצה. ישיר, ספציפי, בלי פלאפל.
**שפה:** עברית שמדברים בה, לא תרגום מילולי. תרגם רעיונות.
**Hook:** שמור על הכוח של המקור — אם זה היה חידה, זה חידה. אם זה מספר, זה מספר.
**סליידים:** 5-8 סליידים. מחשבה אחת לסליד. 1-3 משפטים מקסימום.
**CTA:** COUNCIL / DM / הקורס — לפי מה שסוכם ב-checkpoint.

---

## שלב 4 — בניית קומפוננטים ב-Remotion

צור תיקייה חדשה ב-`carousel-renderer/src/` בשם `{shortcode}/`.

### shared.tsx
העתק את `council/shared.tsx` כבסיס — אותם צבעים, אותו grid background, אותו MONO font.

אם העיצוב המקורי שונה (פלטה שונה / layout שונה), התאם את הצבעים לפלטת המקור.

### סליידים
צור קובץ לכל סליד: `Slide01.tsx`, `Slide02.tsx`, וכו'.

השתמש בכל hooks האנימציה מ-shared:
- `useEntrance(delay, distance)` — אלמנטים שנכנסים מלמטה
- `useFade(delay)` — fade in
- `useScale(delay)` — scale in (ל-CTA slides)

**timing:** stagger של 6 frames בין שורה לשורה, 90 frames כולל (3 שניות).

### Root.tsx
הוסף את הקומפוזיציות ל-`carousel-renderer/src/Root.tsx`:

```tsx
import { Slide01 } from "./{shortcode}/Slide01";
// ...

<Composition id="{Shortcode}Slide01" component={Slide01} durationInFrames={90} fps={30} width={1080} height={1080} />
```

---

## שלב 5 — רנדור

```bash
cd carousel-renderer
for i in 1 2 3 ...; do
  npx remotion render {Shortcode}Slide0$i /tmp/{shortcode}/slide-$i.mp4
done
```

פתח את התיקייה:
```bash
open /tmp/{shortcode}/
```

---

## ⚠️ שלב 5.5 — VERIFICATION לפני פרסום

לפני שמשהו יוצא — קרוסלה, גייד, קופי — עצור ובדוק:

**תוכן טכני:**
- כל פקודת bash שמוזכרת — האם היא נכונה? הרץ אותה ובדוק.
- כל נתיב קובץ — האם הוא קיים ומדויק?
- כל שם כלי / ספרייה — האם שם הפקודה נכון?

**תוכן עובדתי:**
- טענות על יכולות של כלים — האם הן מדויקות?
- מספרים, מחירים, תאריכים — האם הם עדכניים?
- ציטוטים או ייחוס יוצרים — האם הם נכונים?

**התאמה לקהל:**
- האם ההוראות מובנות למי שלא טכני?
- האם יש מונחים שצריך לפשט?
- האם הצעד הקונקרטי ברור מספיק?

אם משהו לא בטוח — **אל תנחש. שאל את המשתמש.**

---

## שלב 6 — שמירת הפלט

שמור את כל הקופי ב-`carousels/repurposed-{YYYY-MM-DD}-{shortcode}.md`:

```markdown
# Carousel Repurpose — @{account} — {date}

## ניתוח המקור
...

## גרסה עברית
### סליד 1
...

### קפטשן
(3-5 שורות + hashtags)

## הערות לפוסט
```

הצג את כל הפלט בצ'אט לאחר השמירה.
