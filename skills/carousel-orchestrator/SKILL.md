---
name: carousel-orchestrator
description: "Multi-agent pipeline for creating Instagram carousels. Orchestrates content planning, Hebrew copywriting, image prompt generation, and final assembly. Invoke with a topic to create a complete carousel package."
risk: safe
source: self
date_added: "2026-04-04"
author: yaniv
tags: [instagram, carousel, multi-agent, orchestrator, content-creation, hebrew]
tools: [claude-code]
---

# Carousel Orchestrator - Master Pipeline

You orchestrate the creation of Instagram carousels through a multi-agent pipeline. Given a topic, you produce a complete carousel package: Hebrew text for each slide, optimized image prompts for Kie AI / Nano Banana Pro, and a ready-to-paste caption.

## When to Use

- User says "carousel", "create carousel", "Instagram carousel"
- User says "קרוסלה", "תייצר קרוסלה", "פוסט לאינסטגרם"
- User provides a topic for Instagram content
- User invokes `/carousel [topic]`

## Pipeline Overview

```
[1] Load Context → [2] Plan → [GATE 1] → [3] Copy → [GATE 2] → [4] Image Prompts → [5] Review → [GATE 3] → Done
```

**4 Agents, 3 Approval Gates:**
1. **carousel-content-planner** → plans 10-slide structure
2. **carousel-copywriter** → writes Hebrew text + caption
3. **carousel-image-prompter** → generates Nano Banana Pro prompts
4. **carousel-reviewer** → assembles package + final review

---

## Step 0: Load Context

Before starting the pipeline, load these files:

### Required
- **`.agents/product-marketing-context.md`** → brand voice, products, audience, writing rules

### Optional (use if available)
- **`data/instagram-insights.json`** → performance data from instagram-marketer
  - Check `last_updated` -- if older than 7 days, mention to user: "Your insights are from [date]. Consider running the marketer first for fresh data."
- **`data/carousel-history.json`** → previously created carousels
  - Check if this topic was already covered. If so, mention it.

### Check Assets
- Read `/assets/` directory to know what's available (photos, fonts, logos)
- Pass asset info to the image prompter

---

## Step 1: Determine Carousel Type

If the user specified a type, use it. Otherwise, auto-detect from topic:

| Topic pattern | Auto-detected Type |
|--------------|-------------------|
| "how to", "איך", steps, process | Educational |
| course, product, "קורס", sale, offer | Promotional |
| "N things", tips, mistakes, tools, list | Tips/Listicle |
| "I", story, journey, "סיפור", learned | Storytelling |

If unclear, ask the user:

```
What type of carousel fits this topic best?

1. Educational - teaching a concept step by step
2. Promotional - selling the course/product
3. Tips/Listicle - quick value, numbered tips
4. Storytelling - personal story with a lesson
```

Read the selected template from `carousel-orchestrator/references/carousel-types.md`.

---

## Step 2: Run Content Planner (Agent 1)

Invoke `carousel-content-planner` with:
- Topic
- Carousel type
- Brand context summary
- Instagram insights (if available)

**Output**: Structured 10-slide plan

### GATE 1: Plan Approval

Present the plan to the user:

```
CAROUSEL PLAN - [topic]
━━━━━━━━━━━━━━━━━━━━━━

Type: [type] | Hook: [hook_type] | Slides: [count]

1. [HOOK]    [key_message]
2. [PROBLEM] [key_message]
3. [CONTENT] [key_message]
4. [CONTENT] [key_message]
5. [CONTENT] [key_message]
6. [CONTENT] [key_message]
7. [CONTENT] [key_message]
8. [CONTENT] [key_message]
9. [SUMMARY] [key_message]
10. [CTA]    [key_message]

Caption: [angle] | CTA: [cta_type]

Approve this plan? (yes / modify / change type)
```

**WAIT for user response.** Do NOT proceed without approval.

If user modifies: update plan and re-present.

---

## Step 3: Run Copywriter (Agent 2)

Invoke `carousel-copywriter` with:
- Approved plan
- Brand context

**Output**: Hebrew text for each slide + caption + hashtags

### GATE 2: Copy Approval

Present the copy:

```
CAROUSEL COPY - [topic]
━���━━━━━━━━━���━━━━━━━━━━

Slide 1 [HOOK]:
  [text_he]

Slide 2 [PROBLEM]:
  [text_he]

... (all slides)

CAPTION:
  [first 125 chars visible...]
  [full caption]

  Hashtags: [list]

Approve this copy? (yes / edit slide N / rewrite caption / change tone)
```

**WAIT for user response.** Do NOT proceed without approval.

---

## Step 4: Run Image Prompter (Agent 3)

Invoke `carousel-image-prompter` with:
- Approved copy (with English translations)
- Carousel type
- Available assets from `/assets/`

**Output**: 10 optimized English prompts for Kie AI / Nano Banana Pro

Save each prompt to `carousels/[slug]/prompts/slide-NN.txt`.

## Step 4.5: Generate Images via Kie AI API

After prompts are saved, run the image generation script:

```bash
python scripts/generate_carousel.py carousels/[slug]/
```

This calls Kie AI (Nano Banana 2) API for each prompt and saves images to `carousels/[slug]/images/`.

**API details** (Kie AI / Nano Banana 2):
- Endpoint: `POST https://api.kie.ai/api/v1/jobs/createTask`
- Model: `nano-banana-2`
- Auth: Bearer token from `KIE_AI_API_KEY` in `.env`
- Async: creates task → polls status → downloads result
- Format: 1:1, 1K resolution, PNG

Options:
- `--resolution 2K` for higher quality
- `--slides 1,5` to regenerate specific slides
- `--dry-run` to preview without API calls

---

## Step 5: Run Reviewer (Agent 4)

Invoke `carousel-reviewer` with:
- Content plan
- Approved copy
- Image prompts
- Topic and metadata

**Output**: Complete carousel package saved to `carousels/[date]-[slug]/`

### GATE 3: Final Approval

The reviewer presents the complete slide-by-slide review with all texts and prompts.

**WAIT for user response.** Options: approve, redo slide, edit text, redo images, edit caption.

---

## Output

When approved, the final output is:

```
carousels/[YYYY-MM-DD]-[topic-slug]/
├── carousel-data.json    # Complete metadata + all content
├── caption.txt           # Copy-paste ready caption
├── prompts/
│   ├── slide-01.txt      # Image prompt for Kie AI
│   ├── slide-02.txt
│   ...
│   └── slide-10.txt
└── images/               # Generated by Kie AI API
    ├── slide-01.png
    ├── slide-02.png
    ...
    └── slide-10.png
```

### Final Message to User

```
CAROUSEL READY!
━━━━━━━━━━━━━━━

Topic: [topic]
Type: [type]
Slides: [count]
Output: carousels/[slug]/

NEXT STEPS:
1. Open prompts in carousels/[slug]/prompts/
2. Generate images one by one in Kie AI
   (start with slide 1 -- it sets the visual style)
3. Add Hebrew text overlay on each image
   (use fonts from /assets/fonts/ if uploaded)
4. Upload as carousel to Instagram
5. Paste caption from carousels/[slug]/caption.txt

Best posting time: [from insights, or "check your insights"]

Tip: Run /marketer after posting to track performance!
```

---

## Optional: Designed Slides + PDF

To build the slides as a designed HTML carousel (the brand's design system) instead of a manual text overlay, or to export the carousel as one PDF (LinkedIn, sending it whole, or the keyword lead-magnet guide), hand the approved copy to **`carousel-pdf-designer`**. It renders `final/slide-NN.png` + `final/<slug>.pdf`, and can turn any existing `final/` folder into a PDF with `--images`.

---

## Error Handling

- **Missing brand context**: Create a minimal context by asking the user key questions
- **Missing insights**: Proceed without -- mention that insights would improve results
- **User rejects at any gate**: Loop back to the relevant agent with feedback
- **Topic already covered**: Warn user, suggest a different angle or confirm they want a fresh take
- **Unclear topic**: Ask the user to be more specific before starting

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/carousel [topic]` | Start the full pipeline |
| `/carousel tips [topic]` | Start with tips/listicle type |
| `/carousel promo [topic]` | Start with promotional type |
| `/carousel story [topic]` | Start with storytelling type |
| `/marketer` | Run Instagram analysis first |
| `/copy [text]` | Use standalone copywriter |
