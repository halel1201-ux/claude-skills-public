# Design Playbook: the design skills, adapted to the brand's carousels and PDFs

This file condenses the design skills in this repo into rules for **static** work:
- Instagram carousel slides (1080x1350, 4:5)
- PDF lead-magnet guides (1240x1754, A4)

All of it is Hebrew RTL, dark premium, with neon accents.

Sources and their tags:

| Tag | Skill |
|---|---|
| [imp] | `impeccable` |
| [taste] | `design-taste-frontend` |
| [uupm] | `ui-ux-pro-max` |
| [apple] | `apple-design` |
| [emil] | `emil-design-eng` |
| [psych] | `marketing-psychology` |

Interaction, animation timing, gestures, forms and code libraries from those skills are dropped here. They do not apply to a still image or a PDF.

**Precedence.** impeccable says it itself: *"The brief wins. Honor pinned aesthetics... even when they conflict with a saturated-pattern warning."* So the order is:
1. Brand files: `.agents/product-marketing-context.md` and `.agents/carousel-writing-style.md`
2. The `carousel-*` skills
3. This playbook
4. The original design skills

Section 9 lists every place where the brand deliberately overrides a design-skill rule.

---

## 0. Before designing: the Design Read (one line)

Before any layout, write one sentence:

> Reading this as: **<carousel type>** for **<audience>**, with a **<voice>** language, leaning toward **<style family>**. Dials: VARIANCE <n> / DENSITY <n>. [taste]

- **Default for the brand:** Reading this as an educational fitness carousel for Israeli gym-goers aged 18-35, with a dugri coach voice, leaning toward Dark OLED with block-based neon. VARIANCE 7 / DENSITY 3. [taste: premium consumer = 7/3] [uupm: Fitness = Vibrant & Block-based + Dark Mode OLED]
- **Mode** [imp]:
  - Carousels are **Persuade**: earn attention, then one action.
  - PDF guides are **Read**: structure for comprehension, then make it worth staying in.
- **The skeleton test** [imp/bolder]: blur or strip the words. Does the slide still show what it is (a comparison, a number, a process)? If it only works once the words return, the design is just big text.
- **The specificity test** [imp/critique]: could an unrelated brand post this slide unchanged? If yes, it failed. Our signature is:
  - the Heebo 900 headline with one neon word
  - the brand row
  - the coach's face on the hook
  - real gym content

## 1. Typography

**Family.** Use Heebo only.
- Weights: 900 for headlines, 700-800 for subheads and labels, 400-500 for body.
- One family, 3-4 sizes per slide, 2-3 weights. [imp/distill]
- **Emphasis stays in the same family.** Never inject a second font for a highlighted word. [taste]
- [uupm] recommends Barlow Condensed and Bebas Neue for fitness. Neither has Hebrew, so they may only be used for Latin words or numbers, and only if the user asks.
- If Heebo ever fails to load, the fallback is Noto Sans Hebrew (the only Hebrew pairing in [uupm]), never Arial. [imp: "the closest installed font is a failure, not a fallback"]

**Scale on the 1080 canvas.** These are the tokens in `templates/brand.css`.

| Role | px | Weight | Line-height | Tracking |
|---|---|---|---|---|
| Stat number | 220 (hook up to 420) | 900 | 0.9 | -0.04em (floor [imp]) |
| Hero / hook | 132 | 900 | 1.02 | -0.02em |
| Slide title (h1) | 84 | 900 | 1.08 | -0.015em |
| h2 | 60 | 800 | 1.15 | 0 |
| Body | 42 | 400 | 1.45 | 0 |
| Small | 32 | 500 | 1.4 | 0 |
| Micro (brand row, counter) | 28 | 700 | n/a | +0.02em |

**Size rules**
- **Nothing ships below 28px.** On a phone, 1080px displays at about 390pt wide, so 28px is about 10pt, the floor. Body text stays at 40px or more.
- **Headline length sets headline size** [taste]:
  - 3-5 words can use the hero size.
  - More than 6 words: drop one step.
  - A headline over 2 lines (3 on the hook) is a font-size error, not a copy error.
- Tracking moves opposite to size [apple]: negative on display, 0 on body, slightly positive on micro labels.

**Light text on dark** [imp/typeset] needs compensation on all three axes:
- slightly more leading
- a touch more tracking
- one step more weight

That is why body text is 400 and not 300.

**Line length and wrapping**
- Body max about 30ch on a slide (`.body { max-width: 30ch }`) and 34ch on a PDF page. [imp: 45-75ch is for reading pages; slides are billboards]
- Use `text-wrap: balance` on headlines and `pretty` on body. No orphan word on the last line.

**Numbers**
- Wrap every number in `<bdi>` or use `.num`, so RTL never flips "2.5" or "12/8".
- Use tabular numerals in tables. [imp/typeset]

**Dashes**
- **No dash characters in visible text.** That means `—`, `–`, ` - ` and the Hebrew maqaf `־` before numbers.
- Rephrase instead: "עד 12 חזרות", not "ל־12". [brand + taste EM-DASH BAN]
- Use gershayim `״` for abbreviations (ק״ג).

## 2. Color

**Roles, not swatches** [imp/colorize]
- The tokens are `--bg`, `--surface`, `--ink`, `--ink-2`, `--accent` and `--wrong`/`--right`.
- Never hardcode a hex on a slide. Use a token or a `data-theme`.

**One accent per carousel, locked on every slide** [taste COLOR CONSISTENCY LOCK]
- Choose it with `<body data-theme="...">`.

| Theme | Accent | Use for |
|---|---|---|
| `cyan` (default) | #00D4FF | educational, science, tech |
| `amber` | #FFA046 | promotional, sales |
| `green` | #7CFC3A | results, transformation, "do this" |
| `orange` | #FF6C00 | warnings, myths, "stop doing this" |
| `rust` | warm dark + #E0563F | storytelling |

**The 10% rule** [imp/quieter]
- Neutrals do about 90% of the work.
- The accent owns one deliberate thing per slide: the highlight word, the stat, the focused card, the CTA box.
- If the accent is on more than 2 elements in a slide, remove some.

**Semantic colors**
- `--wrong` #FF6C00 and `--right` #7CFC3A are only for ✗/✓ logic (the right-choice format).
- Never use them as decoration.
- **Color is never the only signal** [uupm][imp]: wrong/right always carries a ✗/✓ mark or a word.

**No pure black and no pure white** [taste]
- The background is #0A0E1A (cool, tinted toward the accent) and text is #F4F6FB.

**Secondary text**
- On dark it is `--ink-2` (#B9C1D6), a tinted gray.
- On an accent surface, use `--accent-ink`, never gray. [imp: "never gray on color"]

**Banned color choices**
- AI purple/pink gradients [uupm][taste LILA RULE]
- Random multi-neon gradients
- The beige, brass and espresso "premium" palette [taste]

**Contrast** [imp][uupm]
- Body ≥ 4.5:1, large text ≥ 3:1. Aim for 7:1 on the hook and CTA (dark+neon systems).
- Cyan on #0A0E1A is about 11:1 and #B9C1D6 on #0A0E1A is about 10:1. Both are fine.
- Text over a photo always sits on a scrim (`.slide.photo .bg::after`). [taste]

## 3. Layout and composition

**The squint test** [imp/layout]: blurred, can you name the primary element, then the secondary, then the groups?
- One primary element, 2-3 secondary, everything else muted. [imp/critique]
- The primary is 2-3x bigger than anything else. [carousel-image-prompter RULE 3]

**One dominant move per slide** [imp/visualize]. "Busy is louder, not bolder."
- Two elements competing at the same scale is a fail.

**Spacing**
- Use one spacing scale: the 8px tokens `--gap-1..7`. [imp][uupm]
- Side padding is 88px on slides and 120px on A4. [brand: ≥80px]
- **More space above a heading than below it.** Tight groups, generous separation. [imp/craft-floor]

**Alignment**
- RTL means everything aligns right (start) by default.
- Center only on the hook, the stat hero, the big statement and the CTA, where "the message itself is the design". [taste]
- Never mix alignments inside one slide. [imp/distill]

**One radius system** [taste shape lock]
- Cards use `--radius` (32).
- Anything inside a card uses `--radius-sm` (20).
- Pills are only for the kicker.

**Cards**
- Use a card only when elevation means something. [taste][imp]
- **Never nest cards.**
- For a list of 3-4 items, use `.rows`, not a card grid.

**Grids** [taste]
- Have exactly as many cells as you have content. Never add an empty filler tile.

**Item count**
- At most 4 items per group on a slide. [imp/critique: working memory]
- More than 4 means split across two slides, or group the items.

**Adjacent slides never share a layout** [carousel-image-prompter RULE 3]. For example, VS, then stat, then flow, then rows, then chat, then statement.
- Only the chrome repeats (brand row, counter, swipe) [apple consistency], so the reader always knows where they are.

**Brightness** [apple]
- No harsh brightness jumps between adjacent slides.
- Keep the glow position (`--glow-y`) close from slide to slide, so swiping feels continuous.

## 4. Depth, materials, glow

**Depth comes from layers, never a flat fill** [brand]
- The base gradient is `--bg-2` → `--bg`.
- One radial accent glow sits behind the focal element (`--glow-x/--glow-y`).
- Film grain at 7% and a vignette. All of this is built into `.slide`.

**Material weight shows hierarchy** [apple]
- The focused card is lighter and glows (`.card.focus`).
- The rejected or "before" card is dimmed (`.card.dim`): "dim to focus".

**Edges and stacking** [apple]
- A bright 1px top inner edge reads as light catching the material. `.card` has `inset 0 1px 0 rgba(255,255,255,.05)`.
- Never stack a translucent surface on another translucent surface.

**Glow budget: ONE glowing element per slide.** [brand rule; it narrows the design skills' "minimal glow"]
- The stat, the active step, the focused card, or the CTA keyword.
- If two things glow, nothing is focal.

**Blur and shadows**
- Keep blur ≤ 20px. [emil] Heavy blur also bloats the PDF.
- Shadows have an offset and are tinted dark. [imp/craft-floor]

## 5. Imagery and icons

- **Text stays live and never baked into an image** [imp/visualize + image-prompter RULE 1]. Images are generated text-free; all words are HTML.
- **Hook = the coach + one bold metaphor object**, heroic movie-poster style. Use it as `.slide.photo` with a scrim. See `carousel-image-prompter` RULE 0 to 2.6. [imp: "the subject must be in it"]
- **Icons:**
  - One family, Lucide-style line icons: 24 viewBox, stroke 2.2, round caps, inside `.chip`. [uupm][taste]
  - **No emoji as icons, and no emoji on slides at all** (emoji belong in the caption only). [carousel-copywriter]
  - ✓ and ✗ are allowed only as the wrong/right marks.
- **No fake UI built from divs** [taste], except brand mockups that serve the idea:
  - chat bubbles
  - an app window
  - the brand's app screen, which follows `## App / Phone Screen Mockups` in the brand file
- No geometric masks pretending to be a cutout. Use a real cutout (`remove_background`) or a full-bleed photo. [imp/craft-floor]

## 6. Copy load per slide

[carousel-copywriter + taste + imp]
- **Hook:**
  - At most 4 text elements: brand row, headline (≤ 10 words, ≤ 3 lines), one support line (≤ 12 words), swipe cue.
  - It must pass the **5-second test**: what is this, and why should I swipe? [imp/critique]
- **Content slide:**
  - A headline (≤ 8 words) plus one supporting element: a visual, OR ≤ 2 body lines (≤ 25 words).
  - Never both a long paragraph and a visual.
- **Say each idea once** [imp/clarify]. If the title already says it, the body adds something new or disappears.
- **Real numbers only.** No fake-precise (92%, 4.1x) or fake-perfect (99.99%) numbers. [taste]
  - Every number on a slide is verified, and the source goes in the caption.
  - Extrapolations are labeled "תאוריה:" (right-choice-carousel honesty line).
- No filler verbs ("מהפכני", "חדשני", "פורץ דרך" / Elevate, Seamless, Unleash). [copywriter][taste]

## 7. Psychology mapped to slides

[psych, applied]

| Slide | Principle | How it shows on the slide |
|---|---|---|
| Hook | **Loss aversion** | Frame as what they are losing now ("טעויות שתוקעות לך את המסה"), not as a gain |
| Hook | **Zeigarnik / open loop** | A number or question that only the swipe resolves ("5 טעויות", "?"). Close the loop by the end |
| Hook | **Availability** | One concrete, vivid image, not an abstract idea |
| Body | **Contrast effect** | Show the "before" clearly (`.card.dim`) so the "after" looks vivid (`.card.focus`) |
| Body | **Goal-gradient** | The "3 / 8" counter on every slide, so finishing feels close |
| Body | **Hick's law** | One idea per slide, ≤ 4 items |
| Body | **Jobs to be done** | Headlines name the result (the physique, the strength), not the method |
| Peak | **Peak-end rule** | One standout slide (the big statement) plus a strong last slide. Never end on "the end" |
| Proof | **Social proof / authority** | Real client results or credentials on a metric card. Only real data |
| CTA | **Reciprocity** | The carousel gave value first. The ask comes only on the last slide |
| CTA | **Zero-price** | "חינם" / "מדריך חינמי" said explicitly when the keyword sends a free PDF |
| CTA | **BJ Fogg / activation energy** | One trivial action: comment ONE Hebrew word. The keyword box is the only glowing thing on the slide |
| All | **Mere exposure** | The same chrome, font and accent family on every carousel, so the brand is recognized in the feed |

Ethics [psych]: scarcity and urgency only when they are genuinely true.

## 8. PDF guide specifics (`.slide.a4`)

- **Mode = Read.** Comprehension first. Body text is 34-46px on the 1240 page, max 34ch.
- **Page order:** cover → contents → sections (one idea per page) → checklist → soft CTA.
  - This mirrors the [uupm] "Lead Magnet" pattern: preview the value, then a ≤ 1-step ask.
- **Editorial grid** [uupm]:
  - a huge section number in the accent
  - a heading
  - content: a table, rows or a callout
  - running footer with the guide name and page number
- Tables have 3-4 columns. Numbers are left-aligned with tabular figures. The header rule is in the accent.
- **Callouts** use a tinted surface plus an accent label, never a thick colored side stripe. [imp bans side-stripe borders]
- PDFs are delivered by DM or ManyChat. Keep them under about 8 pages. If the file grows over about 10MB, reduce the glow and grain.

## 9. Deliberate brand overrides

Each of these breaks a design-skill rule on purpose. Keep them; do not "fix" them.

| Design-skill rule | Brand decision | Why |
|---|---|---|
| [taste][imp] Neon and outer glows are banned; zero-offset halos are decoration | **Allowed on ONE element per slide** | Neon glow on dark is the brand's visual signature (image-prompter craft rules). [uupm] Dark OLED allows "minimal glow" |
| [taste][imp] Gradient text is banned | **Allowed only on the stat number** (`.grad`) | Brand rule: "numbers get the accent color or a gradient". Never on words |
| [imp] Kicker/eyebrow above a heading is banned | **Allowed as a content label** ("טעות 2", "מדריך חינמי") | It carries real content (which mistake), not decoration. Max one per slide, never on the hook |
| [imp] Hero-metric template is banned | **Stat hero allowed** when the number IS the idea | Brand layout library. The rule's spirit still applies: no row of supporting fake stats, one number, real |
| [taste] Section numbers like 01/02 are banned | **Allowed** for the slide counter and PDF section numbers | Goal-gradient [psych] and wayfinding [apple] outweigh it in a swipe format |
| [taste] A layout family may never repeat | **Only adjacent slides must differ** | A 10-slide carousel has more slides than layout families |
| [taste] Avoid centered layouts | **Centered allowed** for hook, stat, statement and CTA | "Manifesto" slides, where the message is the design |
| [taste] Use emoji sparingly | **Zero emoji on slides** | Stricter than the source (copywriter rule) |

## 10. Pre-flight QA

Run this on every slide before showing the user. Fix everything in one batch, re-check once, then stop polishing. [imp]

**Direction**
- [ ] The Design Read line is written. The specificity test passes, so it couldn't be any brand's slide.
- [ ] The hook passes the 5-second test and has a scroll-stopping focal visual.

**Hierarchy**
- [ ] The squint test passes: one primary (2-3x bigger), 2-3 secondary, the rest muted.
- [ ] The skeleton test passes: the layout says "comparison / number / process" without the words.
- [ ] Exactly ONE glowing element and one accent "owner" per slide.
- [ ] Adjacent slides use different layouts. Chrome (brand row, counter, swipe) is identical on all slides; the last slide has no swipe cue.

**Type**
- [ ] Heebo is loaded (no fallback font in the render). Nothing is under 28px; body text is 40px or more.
- [ ] Headlines are ≤ 2 lines (hook ≤ 3) with no orphan words.
- [ ] Every number is wrapped in `<bdi>`/`.num`, and no number is flipped.
- [ ] **Hebrew read letter by letter**: spelling, final letters (ך ם ן ף ץ), and gershayim ״ not ".
- [ ] Zero dashes (— – ־ and " - ") anywhere visible. Zero emoji on slides.

**Color**
- [ ] One `data-theme` for the whole carousel, and no hardcoded hex on slides.
- [ ] ✗/✓ colors are used only for wrong/right, always with the mark.
- [ ] Text on photos sits on the scrim. Contrast is ≥ 4.5:1 for body.

**Content**
- [ ] One idea per slide, ≤ 4 items, and no idea said twice.
- [ ] Every number is real and sourced in the caption. Theories are labeled "תאוריה:".
- [ ] One CTA, one action, a one-word Hebrew keyword.

**Render**
- [ ] `render.mjs` printed no `WARN ... overflows` lines.
- [ ] Every PNG was opened and looked at. The PDF has the right page count and size.
