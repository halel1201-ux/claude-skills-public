---
name: right-choice-carousel
description: "קרוסלת הבחירה הנכונה: a double-panel (split panel) comic carousel. Every slide = 2 stacked comic panels (wrong choice → right choice, or action → result) with bold Hebrew captions. Trigger on: 'קרוסלת הבחירה הנכונה', 'הבחירה הנכונה', 'פאנל כפול', 'split panel', 'right choice carousel'."
risk: safe
source: self
date_added: "2026-10-11"
tags: [carousel, comic, split-panel, hebrew, instagram]
tools: [claude-code]
---

# קרוסלת הבחירה הנכונה (Right Choice Carousel)

A viral "do this, get that" format: each slide is two comic panels stacked vertically, with one bold Hebrew line at the bottom of each panel. The reader gets 9-10 quick, shareable choices. The creator (the user) is the recurring comic character.

Talk to the user in Hebrew. Follow `.agents/product-marketing-context.md` (brand) and `.agents/carousel-writing-style.md` (voice).

## Step 0: Interview first (always, before anything is generated)

Ask with AskUserQuestion. Never generate images before he answers.
1. **Topic** (if not given). Gym, bodybuilding, nutrition, supplements, peptides only. No other sports unless he approves.
2. **Panel logic for this topic:**
   - **wrong → right:** top = what most people do (✗, neon orange), bottom = the right choice (✓, neon green). The default for "mistakes" topics.
   - **action → result:** top = what to do, bottom = what it does for you (both highlights green).
   Propose the one that fits and let him confirm.
3. **Outfit:** ask every time. Offer per scene (shirtless in bed, T-shirt in kitchen, tank top in gym, scientist lab coat for research) or one fixed outfit. The user's signature items (from `assets/me/REFERENCES.md`) are ALWAYS on.
4. **Hook:** a full comic image + big title in the style of ״הטעויות שמשאירות אותך במקום״, or a double-panel hook (the first tip, with the hook as its top line). Suggest 3 hook titles. If he writes a hook, use it word for word.
5. **Ending:** salesy follow or share, never a dry "the end". Examples: ״תעקוב שלא תפספס את החלק הבא״, ״שלח לחבר שעדיין עושה את טעות מספר 3״. Ask whether to add a keyword + PDF (default: no). If yes, build the PDF guide with `carousel-pdf-designer` (Workflow B).

## Content rules

- **9-10 tips**, one tip per slide (2 panels). Hook slide + tips + ending slide = 11-12 slides.
- **Top line ≤ 8 words, bottom line ≤ 14 words.** One idea per panel. Dugri, coach voice, no "זה לא X, זה Y", no forced puns.
- **Research-inspired, not research-heavy.** Tips can be general and can extrapolate from studies (״הרחבת מחשבה״). Example: a study shows BPC-157 increases angiogenesis → the theoretical concern that it might also feed tumors.
- **Honesty line:** an extrapolation is always worded as one: ״תאוריה:״, ״יש חשש ש...״, ״ייתכן ש...״. Never state a theory as proven fact. Real numbers only when verified.
- **Sources go only in the caption** (PMIDs, verified in PubMed). No PMID on the slides.
- Medical, supplement or peptide topics: add the standard disclaimer in the caption.

## Visual rules

- **Style: comic / graphic-novel digital painting** (clean ink lines, painterly shading, warm cinematic light), consistent across all panels.
- **Character:** the creator, from the reference photos in `assets/me/REFERENCES.md` (face, cap/signature look and body). Drawn in comic style but clearly them, with their signature items from REFERENCES.md always on.
- **Every panel is its own text-free image**, ratio 3:2 (cropped to 1080x675 in Remotion). Generate the first panel, then pass it as reference image 1 for all others so style and character stay identical.
- **Quality block in every prompt** (see memory `image-quality-no-glitches`): objects whole and separate, natural grips, five fingers, undistorted face. QA-zoom every panel and regenerate flawed ones before showing him.
- **Captions are set in Remotion**, never baked into the image: Heebo 900, white with a heavy black outline and shadow, at the bottom of each panel. The highlight word is neon orange `#FF6C00` for wrong and neon green `#7CFC3A` for right, with a small ✗ or ✓ badge in wrong → right mode. A thin dark divider sits between the panels. The brand logo and handle (from `.agents/product-marketing-context.md`) go small at the top.

## Workflow

1. **Interview** (Step 0).
2. **Research:** PubMed (esearch / efetch) for the facts behind each tip. Keep the PMIDs for the caption.
3. **Copy for approval:** a table with columns #, top line, bottom line, top image (Hebrew description), bottom image, source or "תאוריה". **Wait for approval.**
4. **Images:** prompts under `carousels/<date>-<slug>/prompts/`, named `tNN-top.txt` and `tNN-bot.txt`, plus `hook.txt` and `end.txt`. Generate with `python -u scripts/gen_safe.py --ratio 3:2 ...` (default model: GPT Image 2.5 Sunburst; hook and ending use 4:5, which the script maps to 3:4 and Remotion crops), in parallel groups of 3 with retries. Recover timeouts with `KieAI().get_status(task_id)`. If a ref URL expired ("Image fetch failed"), re-upload it with the Kie upload API.
5. **QA:** zoom faces, hands and object contacts in every panel. Regenerate whatever is flawed.
6. **Render:** the template `carousel-renderer/src/rightchoice/RightChoice.tsx` (`makeRightChoice(cfg)`) + `makeTall` for the 9:16 Reels version. Copy the images to `carousel-renderer/public/<dir>/`, register in `src/Root.tsx`, run `node render.mjs`. Output goes to `final/` and `final-reels/`.
7. **Captions:** `caption.txt` (hook line, short value, sources, disclaimer if needed, hashtags) and `caption-tiktok.txt`. If there's a keyword, add `manychat.txt`, including the "not following" message.
8. **Open the folder** for him (`Invoke-Item`).
