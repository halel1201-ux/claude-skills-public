---
name: carousel-pdf-designer
description: "Designs Hebrew carousel slides and PDF lead-magnet guides as HTML with the brand's design system, then renders PNG slides plus ONE multi-page PDF. It applies the design skills in this repo (impeccable, design-taste-frontend, ui-ux-pro-max, apple-design, emil-design-eng, marketing-psychology), adapted to the brand. Also turns any folder of finished slides (Remotion final/, Kie images) into a PDF. Trigger on: 'עיצוב קרוסלה', 'קרוסלה PDF', 'תעצב לי קרוסלה', 'מדריך PDF', 'PDF למילת מפתח', 'carousel pdf', 'design carousel', 'lead magnet pdf', 'export carousel to pdf'."
risk: safe
source: self
date_added: "2026-10-21"
tags: [carousel, pdf, design, hebrew, rtl, lead-magnet, instagram, linkedin]
tools: [claude-code]
---

# Carousel PDF Designer (עיצוב קרוסלות ו-PDF)

This skill does three jobs:

1. **A designed carousel** (1080x1350): slides built in HTML/CSS on the brand system, rendered to `slide-NN.png` plus `<slug>.pdf`. The PDF is the format for LinkedIn document posts and for sending the whole carousel in one file.
2. **A PDF guide** (1240x1754, A4): the lead magnet the comment keyword sends in DM, with cover, contents, sections, checklist and soft CTA.
3. **PNG folder to PDF**: combine already-rendered slides (Remotion `final/`, right-choice panels, Kie images) into one PDF, with no redesign.

Talk to the user in Hebrew. The brand files win over everything here:
- `.agents/product-marketing-context.md`
- `.agents/carousel-writing-style.md`

## Read first

- **`references/design-playbook.md`** is mandatory before designing. It is the six design skills condensed into static slide/PDF rules, with the brand overrides in section 9 and the QA list in section 10.
- `templates/brand.css` is the design system: tokens, themes, every component. Change brand values only there.
- `templates/carousel.html` is an 8-slide reference carousel. It shows every layout: hook, VS, stat, flow, rows, chat, statement and CTA.
- `templates/guide.html` is a 4-page reference PDF guide: cover, contents, table plus callout, and checklist plus CTA.
- For deeper dives, open the source skill. Each rule in the playbook is tagged with it:
  - `impeccable/reference/*.md`
  - `design-taste-frontend`
  - `ui-ux-pro-max` (searchable data, see below)
  - `apple-design`
  - `emil-design-eng`
  - `marketing-psychology`

## One-time setup (per machine)

```bash
npm i -g playwright && npx playwright install chromium
```

The renderer finds Playwright in the current folder, next to the script, or in the global npm root. It can also use any Chrome through `--chrome <path>` or the `CHROME_PATH` environment variable. Remotion's bundled Chrome works too.

Heebo loads from Google Fonts. For offline renders, put `Heebo-Variable.ttf` in `assets/fonts/`.

## Workflow A: a designed carousel

1. **Content.** Either reuse the pipeline or start here:
   - If an approved plan and copy exist (from `carousel-orchestrator`, `carousel-copywriter` or `right-choice-carousel`), use them word for word.
   - If not, run `carousel-content-planner` → `carousel-copywriter` first, with their approval gates. Never invent copy and design it in one shot.
2. **Design Read.** Write one line per playbook section 0. Pick:
   - a theme (`cyan` / `amber` / `green` / `orange` / `rust`)
   - a layout per slide, where adjacent slides never share a layout

   Show the user a short table: # | role | layout | the one dominant element. **Wait for approval.**
3. **Build.**
   - Create `carousels/<YYYY-MM-DD>-<slug>/design/`.
   - Copy `templates/brand.css` and `templates/carousel.html` there, renaming the HTML to `carousel.html`.
   - Replace the slides, keeping the chrome (brand row, counter, swipe) on every slide. The last slide has no swipe cue.
   - **Hook with a photo:** generate the text-free hero image per `carousel-image-prompter` (RULE 0 to 2.6, `scripts/gen_safe.py`). Then use:
     ```html
     <section class="slide photo" style="--focus: 50% 80%">
       <div class="bg"><img src="../images/slide-01.png"></div> ...text...
     </section>
     ```
     The scrim is built in, so the text always reads.
   - **Logo:** if `assets/logos/` has the brand emblem, use `<span class="logo"><img src="..."> BRAND NAME</span>` (name from `.agents/product-marketing-context.md`).
   - **Icons:** use inline Lucide-style SVG inside `.chip`. Never emoji.
4. **Render.**
   ```bash
   node <skill>/scripts/render.mjs carousels/<slug>/design/carousel.html --out carousels/<slug>/final --name <slug>
   ```
   - Any `WARN ... overflows` line is a bug. Fix it and re-render.
   - Add `--scale 2` for 2160px masters.
   - Use `--png` or `--pdf` to produce only one of the two.
5. **QA.** Open every PNG with Read (vision) and run playbook section 10. Read the Hebrew letter by letter. Fix everything in one batch, re-render, check once more, then stop.
6. **Deliver.**
   - `final/slide-01.png` … for the Instagram upload.
   - `final/<slug>.pdf` for LinkedIn or for sending the whole carousel.
   - Captions stay the copywriter's job (`caption.txt`).

## Workflow B: a PDF guide (lead magnet for the keyword)

1. **Get the content.** Ask the user (AskUserQuestion) for:
   - the keyword
   - the promise (what the reader gets)
   - 4-6 sections
   - the soft CTA (DM word, link, or follow)

   Facts follow the honesty rules:
   - Use PubMed-verified numbers.
   - Label any theory with "תאוריה:".
   - Medical, supplement or peptide topics get the disclaimer on the last page.
2. **Outline for approval:** page | title | content type (table / rows / callout / steps). Keep it to 8 pages or fewer.
3. **Build.** Copy `templates/guide.html` to `carousels/<slug>/design/guide.html`, along with `brand.css`. Use one idea per page and a running footer with the page number.
4. **Render.**
   ```bash
   node <skill>/scripts/render.mjs .../guide.html --pdf --out carousels/<slug>/final --name <keyword-slug>-guide
   ```
5. **QA** as in Workflow A, plus: page numbers in the footer match the contents page, and the file is under about 10MB.
6. **Hand it to ManyChat.** If the carousel has a keyword, write `manychat.txt` with the DM text and the PDF link. Do this per `right-choice-carousel` step 7.

## Workflow C: existing slides to PDF

```bash
node <skill>/scripts/render.mjs --images carousels/<slug>/final --name <slug>
```

- Order is natural sort (`slide-2` comes before `slide-10`).
- Page size comes from the first image.
- Use this after Remotion (`render.mjs` in `carousel-renderer`) or right-choice renders, when the user wants "the carousel as PDF".

## ui-ux-pro-max: when you need a new direction

Query the data when the user asks for a different look, a new theme, or a new style:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "fitness gym dark bold" --design-system -f markdown
python3 skills/ui-ux-pro-max/scripts/search.py "dark bold neon" --domain style -n 5
python3 skills/ui-ux-pro-max/scripts/search.py "<mood words>" --domain color -n 5
```

When you translate a result:
- Turn it into a new `body[data-theme="..."]` block in `brand.css`. Never put one-off hex values on slides.
- Keep Heebo. The data's fitness fonts (Barlow, Bebas) have no Hebrew.
- Ignore the "Pattern" block in `--design-system` output. It leaks landing-page rows.

## Hard rules (short version of the playbook)

- One accent per carousel. ONE glowing element per slide. The primary element is 2-3x bigger than anything else.
- Heebo only. Nothing under 28px. Headlines are ≤ 2 lines (hook ≤ 3). Numbers go in `<bdi>`.
- No dashes (— – ־ " - ") and no emoji on slides.
- Real numbers only, with sources in the caption.
- One CTA with one Hebrew keyword.
- All text is live HTML. Generated images are always text-free.
- Adjacent slides never share a layout. The chrome is identical on all slides.
