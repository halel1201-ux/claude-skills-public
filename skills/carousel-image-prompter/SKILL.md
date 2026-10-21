---
name: carousel-image-prompter
description: "Decides the image generation method per slide and produces prompts/code accordingly. Hook: GPT Image 2 (text baked in, reference photos from /assets/me/). Content slides: Remotion TSX components. Orchestrates both paths."
risk: safe
source: self
date_added: "2026-04-04"
author: yaniv
tags: [carousel, image-generation, remotion, gpt-image-2, prompts]
tools: [claude-code]
---

# Carousel Image Prompter - Agent 3

You handle image generation for Instagram carousel slides using TWO different methods depending on the slide role.

## When to Use

Called by the carousel-orchestrator as Agent 3 in the pipeline, after copy is approved.

## Image Generation Methods

| Slide | Method | Description |
|-------|--------|-------------|
| **HOOK (Slide 1)** | **GPT Image 2** | Photo of the user, text baked into the image, reference photos from `/assets/me/` |
| **Content + CTA (Slides 2+)** | **Remotion** | TSX components in `carousel-renderer/src/[carousel-slug]/`, rendered with `node render-[slug].mjs` |

### Hook Slide (cover)

⚠️ **RULE 0 — the VISUAL hook must stop the scroll (as important as the words):** the cover has about half a second to stop the thumb, so design ONE bold, high-contrast focal visual, never a generic portrait. the user's face PLUS a single strong metaphor object/scene that screams the topic (a phone typing by itself, glowing money, a knowledge-graph brain, a laptop on a beach, a giant glowing file). Rules: one clear focal point, huge contrast, dark premium background with a single accent glow, face large and frontal, clean negative space for the baked text. Pick the visual metaphor BEFORE writing the prompt. If the cover could be any influencer's headshot, it failed, redo it.

⚠️ **RULE 0.5 — HEROIC + EXAGGERATED style (hard requirement):** the user must NEVER look tired, passive, or ordinary. Every hook portrays him as the HERO of an epic movie poster: confident power pose (arms crossed, or one hand raised commanding the scene, or walking toward camera in slow-motion energy), chin slightly up, intense determined eyes, subtle victorious smirk. Lighting is dramatic and larger-than-life: strong hero rim light, god rays / light bursts behind him, low-angle "looking up at a giant" camera when it fits. The scene itself is EXAGGERATED, not literal — glowing energy, sparks, oversized props, cinematic scale (think Marvel poster / blockbuster key art, not a candid photo). Always include in the prompt: "heroic movie-poster composition, epic dramatic lighting, confident energized expression, NOT tired, no eye bags, awake and powerful". If the result looks like a normal tired selfie — regenerate.

⚠️ **RULE 1 (UPDATED 2026-10-03, overrides the old baked-text rule below):** ZERO text errors is the user's top requirement. GPT Image 2 garbles mixed Hebrew/English/numbers. So: generate TEXT-FREE images (prompt: "ABSOLUTELY NO TEXT anywhere", top ~42% dark negative space, face sharp in the lower part), and render EVERY word (hook included) in Remotion with Heebo, wrapping numbers in `<bdi>`. Reference implementation: `carousel-renderer/src/myostatin/index.tsx` (Shell pushes the image down with `shift` so text never covers the face). Before shipping, view every rendered slide and check the text letter by letter.

~~Old rule~~ **RULE 1 (legacy) — text is ALWAYS baked into the prompt:** write the exact Hebrew hook text directly INTO the image-generation prompt so the model renders it inside the image. NEVER leave hook text as a manual overlay added afterward. Specify each line's content, color, weight, and placement, and instruct the model to render the Hebrew letters exactly and correctly, right-to-left, no spelling errors.

⚠️ **RULE 2 — face reference must be a TIGHT FACE CROP (critical for likeness):** pass a close-up headshot of the user, NOT a full-body photo. If the face is small in the source photo, crop tightly to the head FIRST, or the model will not match his face (this is the #1 cause of "doesn't look like me"). Pass **2 crops** (a frontal one + a 3/4 one) for a stronger identity lock.

⚠️ **RULE 2.5 — read `assets/me/REFERENCES.md` first:** it lists which face/body refs exist, their Drive links, and the user's appearance description. Put that appearance description into every hook prompt. When the torso/physique is visible in the hook, also pass `--ref assets/me/ref-body2.jpg` (and `ref-body.jpg` for full body) after the face refs and add: "body and physique must match the body reference photos exactly".

⚠️ **RULE 2.6 — THE CAP IS ALWAYS ON (user's signature, non-negotiable):** every image of the user shows him wearing his signature cap (exact wording in `assets/me/REFERENCES.md`), even though the frontal face ref is bareheaded. Always pass `ref-front2.jpg` (the cap photo). Bareheaded result = regenerate.

- Generate with the ONE reusable **`scripts/gen_image.py`** (it auto-hosts local refs to catbox). **Never write a per-carousel gen script.** Example: `python scripts/gen_image.py --out carousels/SLUG/images/slide-01.png --prompt-file carousels/SLUG/prompts/slide-01.txt --ref assets/me/ref-front.jpg --ref assets/me/ref-front2.jpg`. Refs order: face crops first, body ref next, brand logo last. Only pass refs that exist on disk. `--model gpt` (default, uses input_urls) or `--model nano` (image_input); `--ratio` / `--res` as needed.
- Prompt must describe: exact-identity person (from the face refs), setting/vibe, the brand logo (from its reference image), and the baked Hebrew text (content + style + placement).

**Prompt template (Kie AI / Nano Banana 2, image_input refs):**
```
Instagram carousel cover, vertical 4:5 1080x1350.
A [age/appearance] man, MUST be the EXACT SAME PERSON and face as the reference face photos (preserve identity precisely: same face shape, eyes, nose, beard, skin tone).
[Signature cap line from assets/me/REFERENCES.md: the cap is ALWAYS on his head, never bareheaded.]
[setting, lighting, brand visual; the logo from the last reference image, kept exact].
Large bold designed Hebrew text baked into the image, [placement]:
line 1 "[HEBREW LINE 1]" in [color], line 2 "[HEBREW LINE 2]" in [color].
Render the Hebrew letters EXACTLY and correctly, right-to-left, no spelling mistakes, no gibberish.
Small Hebrew text [placement]: "[CTA e.g. החליקו]".
Premium, cinematic, high contrast. Vertical 4:5, 1080x1350.
```
> After generating, ALWAYS eyeball the baked Hebrew for spelling errors. If the model mangled a word, regenerate (or as a last resort, overlay that word cleanly). Prefer baked text.

### Content Slides — Remotion

- Build TSX components in `carousel-renderer/src/[carousel-slug]/`
- One file per slide: `Slide02.tsx`, `Slide03.tsx`, etc.
- Shared theme in `shared.tsx` (colors, fonts, Card, BrandingRow)
- Register in `carousel-renderer/src/Root.tsx`
- Render with the ONE reusable **`carousel-renderer/render.mjs`**. **Never write a per-carousel render script.** Run: `cd carousel-renderer && node render.mjs carousels/SLUG/final CompId2=slide-02.png CompId3=slide-03.png ...`

⚠️ **RULE 3 — every content slide gets a REAL VISUAL, not just centered text (hard requirement):** a carousel where every slide is "kicker + title + body lines" on the same background is a FAIL. Each slide must use the layout from the visual layout library that best expresses its idea, and adjacent slides must never share the same layout. Remotion is full React: build actual UI, not styled paragraphs.

⚠️ **RULE 4 — phone / app screens use the user's own app style:** any slide that shows a phone or app screen (training, nutrition, peptides, cycle management) follows `## App / Phone Screen Mockups` in `.agents/product-marketing-context.md`. Always keep the FJ emblem + "FIT JOURNEY" header and the caption "המחשה מתוך האפליקציה". Reference image: `assets/app/fj-app-split-mockup.png`.

#### Visual Layout Library (pick per slide by what the idea IS)

| The idea is... | Layout | How |
|---|---|---|
| Before/after, us-vs-them, old way vs new way | **Comparison / VS** | Two cards side by side: left dim/red-tinted ("בלי"), right glowing accent ("עם"). Big ✗/✓ or icons, VS badge between them |
| A number, a result, money, time saved | **Stat hero** | One HUGE number (180px+, gradient text or glow), small label under it, optional mini bar/sparkline behind |
| Steps, a process, "how it works" | **Flow diagram** | 3-4 nodes connected by glowing arrows/lines (vertical or Z-pattern), current step highlighted, others dimmed |
| A list of things / tools / mistakes | **Cards grid / checklist** | 2-4 rounded cards with icon + short label each, or checklist rows with glowing ✓/✗ markers |
| A conversation, a DM, "someone asked me" | **Chat mockup** | iOS/WhatsApp-style bubbles (RTL), sender vs receiver colors, realistic paddings |
| A prompt, code, terminal, Claude Code itself | **Window mockup** | Mac window chrome (3 dots, title bar), monospace text inside, syntax-ish coloring, cursor |
| Growth, timeline, "in 3 months" | **Timeline / progress** | Horizontal line with dots/milestones, filled progress with glow, dates as labels |
| One bold claim / punchline | **Big statement** | The ONLY case where centered text is allowed — but add a visual anchor: giant quote mark, glowing keyword highlight, or accent underline |

**Craft rules for beauty (apply always):**
- Depth: layered backgrounds (base gradient + subtle radial glow behind the focal element + soft grain/vignette), never a flat fill
- Glow accents: `boxShadow` / `textShadow` with the theme accent on the ONE most important element per slide — not on everything
- Hierarchy: one element must be 2-3x bigger than everything else; if all text is similar size the slide failed
- Numbers/highlight words get the accent color or a gradient `background-clip: text`
- Real spacing: generous padding (≥80px sides), let it breathe — crowded = ugly
- Emojis/icons: inline SVG or unicode glyphs styled big (60-90px) inside icon "chips" (rounded square with translucent accent bg)
- Keep BrandingRow + counter consistent across slides — that's the only thing that should repeat

## Inputs

You receive:
1. **Approved copy** (from carousel-copywriter output)
2. **Carousel type** (educational, promotional, tips, storytelling)
3. **Content plan** (from carousel-content-planner)
4. **Available assets**: check `/assets/me/` for the user's reference photos

## Process

### Step 1: Select Visual Theme for Remotion

Select color theme for Remotion components based on carousel type:

| Carousel Type | Theme |
|--------------|-------|
| Educational  | Dark + Cyan (#00D4FF) |
| Promotional  | Dark + Amber (#FFA046) |
| Tips/Listicle| Dark + Cyan or Amber based on topic |
| Storytelling | Warm dark + Rust (#C0392B) |
| Security/Tech | Dark navy + Cyan (#00D4FF) |

### Step 2: Build Remotion Components

For each content slide (2+):
1. Create `src/[slug]/shared.tsx` with colors, FontFace, DarkBackground, BrandingRow, Card
2. Create `src/[slug]/Slide0N.tsx` per slide
3. Use `fonts/Rubik-Variable.ttf` (via `staticFile("fonts/Rubik-Variable.ttf")`)
4. Direction: `rtl` for Hebrew text
5. No dashes in any displayed text

### Step 3: Generate GPT Image 2 Prompt for Hook

Reference photos are in `/assets/me/`, indexed in `assets/me/REFERENCES.md` (face refs, body ref, appearance description). Read it, then pass the right refs to `gen_image.py` per RULE 2 / 2.5.

### Step 4: Register and Render

1. Add imports + `<Composition>` entries to `Root.tsx`
2. Render content slides with the reusable `render.mjs` (skip slide 01, that's GPT Image 2): `cd carousel-renderer && node render.mjs carousels/SLUG/final CompId=slide-0N.png ...`

### Step 5: Self-Review

- [ ] The cover has a STRONG VISUAL HOOK: one bold focal metaphor + high contrast, not a generic portrait (RULE 0)
- [ ] HEROIC + EXAGGERATED (RULE 0.5): power pose, epic movie-poster lighting, energized expression — never tired/passive
- [ ] Hook prompt has the Hebrew hook text baked INTO the prompt (never left for manual overlay)
- [ ] The user is wearing his signature cap in the generated image (RULE 2.6)
- [ ] Hook uses a TIGHT FACE CROP (close-up headshot), not a full-body photo; ideally 2 crops (frontal + 3/4)
- [ ] Face refs + logo passed as image_input URLs (face crops first, logo last)
- [ ] Prompt says "EXACT SAME PERSON / preserve identity" and "render Hebrew exactly, RTL, no gibberish"
- [ ] Remotion components have no dashes in text
- [ ] Every content slide uses a layout from the visual layout library that matches its idea (RULE 3) — no two adjacent slides share a layout, and no slide is plain centered text (except one "big statement" max)
- [ ] Each slide has ONE dominant visual element (2-3x bigger) + glow accent on it only
- [ ] All slides use RTL direction
- [ ] BrandingRow (the handle from product-marketing-context.md) present on all slides
- [ ] CTA slide has `showSwipe={false}`

---

## Output Format

```json
{
  "style_anchor": "The full style anchor prefix used",
  "image_format": "1080x1080",
  "carousel_type": "educational",
  "available_assets": {
    "me": ["photo1.jpg"],
    "logos": ["logo.png"],
    "backgrounds": []
  },
  "prompts": [
    {
      "slide_number": 1,
      "role": "hook",
      "prompt": "Full English prompt for Nano Banana Pro / Kie AI",
      "text_overlay_zone": "bottom 35%",
      "notes": "Any special instructions for this slide"
    },
    {
      "slide_number": 2,
      "role": "content",
      "prompt": "...",
      "text_overlay_zone": "bottom 35%",
      "notes": "..."
    }
  ],
  "generation_instructions": "Copy each prompt into Kie AI one at a time. Generate in order. If a result doesn't match the style of previous slides, regenerate it."
}
```

---

## Tips for Better Nano Banana Pro Results

1. **Be specific about lighting**: "soft diffused window light from the left" beats "good lighting"
2. **Name the camera perspective**: "overhead flat-lay", "45-degree angle", "eye-level close-up"
3. **Specify materials/textures**: "matte white desk surface", "brushed aluminum laptop"
4. **Use photography terms**: "shallow depth of field", "bokeh background", "rule of thirds"
5. **Avoid abstract requests**: "the feeling of success" is bad. "Person smiling at laptop screen showing green metrics" is good.
6. **Color precision**: "Pantone Classic Blue (19-4052)" or "hex #2196F3" beats "blue"
7. **Negative prompts**: Include what NOT to show: "No text, no watermarks, no logos, no cluttered background"

---

## User Handoff Note

After generating all prompts, remind the user:

```
PROMPTS READY!

Auto-generate all images:
  python scripts/generate_carousel.py carousels/[slug]/

Or with options:
  python scripts/generate_carousel.py carousels/[slug]/ --resolution 2K
  python scripts/generate_carousel.py carousels/[slug]/ --slides 1,3,5
  python scripts/generate_carousel.py carousels/[slug]/ --dry-run

Images will be saved to carousels/[slug]/images/

Available assets for text overlay:
  - Fonts: [list from /assets/fonts/]
  - Logos: [list from /assets/logos/]
  - Your photos: [list from /assets/me/]

Text overlay tip: Use Canva, Figma, or any editor to add
the Hebrew text on top of the generated backgrounds.
```

## Image backends (from 2026-10-14)
- **Drafts, style tests, single fixes → ChatGPT (free with the user's plan):** `python -u scripts/gen_safe.py --model codex --out ... --prompt-file ... --ref <local path or URL> --ratio 4:5`. Runs through the Codex CLI's built-in image tool. About 2 min per image, about 1K, one at a time. Refs can be local files.
- **Final images, 2K/4K, batches → Kie (default `gpt25` = GPT Image 2.5 Sunburst).** Add `--fallback-codex` so a Kie failure (block, timeout, fetch error) retries once through ChatGPT.
