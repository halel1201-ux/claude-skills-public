# Image Prompt Patterns for Nano Banana Pro / Kie AI

## General Rules

1. **All prompts in English** - Nano Banana Pro works best with English prompts
2. **No Hebrew text in images** - AI cannot reliably render RTL Hebrew. Generate backgrounds/illustrations only, overlay text manually
3. **Consistent style anchor** - Every carousel uses a style prefix that stays the same across all 10 slides
4. **Leave text space** - Reserve 30-40% of the image for Hebrew text overlay (usually bottom or center)
5. **Instagram dimensions** - Always specify: 1080x1080 (square) or 1080x1350 (4:5 portrait)

---

## Style Anchor Template

Every carousel starts with a **style anchor** - a consistent prefix applied to ALL slide prompts:

```
Style anchor: [COLOR_SCHEME] [MOOD] [SETTING] [LIGHTING] [COMPOSITION_STYLE].
Always: modern, clean, professional. No text, no words, no letters in the image.
Aspect ratio: 1:1. Leave [POSITION] 35% of the frame empty for text overlay.
```

### Pre-built Style Anchors

**Tech/Professional** (for educational, AI tips):
```
Minimalist tech workspace with soft blue and white tones. Modern, clean, well-lit.
Shallow depth of field. No text or letters in the image.
Square format 1080x1080. Leave bottom 35% clean/simple for text overlay.
```

**Warm/Personal** (for storytelling, personal brand):
```
Warm, natural lighting with earth tones and soft shadows. Cozy workspace or cafe setting.
Shot on iPhone aesthetic, slightly candid feel. No text or letters in the image.
Square format 1080x1080. Leave bottom 35% with minimal detail for text overlay.
```

**Bold/Energetic** (for tips, listicles):
```
Clean flat background with vibrant accent colors (coral, electric blue, lime).
Modern graphic style, high contrast, minimal elements. No text or letters in the image.
Square format 1080x1080. Leave center or bottom 40% clean for text overlay.
```

**Premium/Sales** (for promotional):
```
Dark, premium background (deep navy or charcoal) with subtle gradient.
Golden or white accent lighting. Elegant, aspirational but approachable. No text or letters.
Square format 1080x1080. Leave bottom 35% as dark gradient for white text overlay.
```

---

## Prompt Templates by Slide Role

### HOOK Slide (Slide 1)
The most important slide - must stop the scroll.

```
[STYLE_ANCHOR]
A [person/object] that immediately catches attention. [SPECIFIC_SCENE].
Dynamic composition, slightly unusual angle or perspective.
The focal point should be in the upper 60% of the frame.
Vibrant, high contrast, eye-catching.
```

**Examples:**
- "Person looking directly at camera with surprised expression, holding a laptop showing a beautiful website. Natural office lighting."
- "Close-up of hands typing on a MacBook with colorful code reflected on the screen. Dramatic side lighting."
- "Split-screen visual: left side messy/chaotic desk, right side clean organized workspace with a glowing screen."

### CONTENT Slides (Slides 2-9)
Consistent look, varying elements per topic.

```
[STYLE_ANCHOR]
[SPECIFIC_ELEMENT_FOR_THIS_SLIDE]. Simple, focused composition.
Single focal point that illustrates the concept of [SLIDE_TOPIC].
Clean background, minimal distractions.
```

**Examples for tech tips:**
- "A single glowing AI chip on a clean desk, soft blue ambient light"
- "Minimalist illustration of a funnel converting visitors to customers, isometric view"
- "Close-up of a smartphone showing a beautiful landing page, blurred coffee shop background"

### CTA Slide (Slide 10)
Warm, inviting, action-oriented.

```
[STYLE_ANCHOR]
Inviting, warm composition. [PERSON_OR_ELEMENT] gesturing toward the viewer
or pointing at something relevant. Friendly, approachable feel.
Subtle directional elements (arrows, light beams) pointing toward
where the CTA text will be placed.
```

---

## Carousel Type Visual Patterns

### Educational Carousel
- Slides 3-8: Use a **numbered visual progression** - each slide adds or reveals something
- Keep background IDENTICAL, change only the foreground element
- Use icons or simple objects to represent each step
- Color: cool tones (blue, white, light gray)

### Promotional Carousel
- Slides 4-7: Show **real product screenshots** or mockups on devices
- Use premium dark backgrounds for text slides
- Include laptop/phone mockups showing the actual product
- Color: dark base + gold/white accents

### Tips/Listicle Carousel
- Each slide: **one bold icon or illustration** representing the tip
- Consistent layout with space for a large number (1, 2, 3...)
- High contrast, bold colors that pop
- Color: vibrant, high energy (coral, electric blue, green)

### Storytelling Carousel
- Use **authentic, candid-feeling** images
- Show real workspace, desk, coffee, laptop
- More personal/warm/human, less corporate
- Some slides can be darker/moodier for conflict, brighter for resolution
- Color: warm earth tones, natural lighting

---

## Composition Rules for Text Overlay

Since Hebrew text will be added manually on top of the generated images:

```
Bottom text area:     Leave bottom 35% simple/dark/blurred
Center text area:     Leave center band with low-detail background
Top text area:        Leave top 30% simple (rare, only for specific layouts)
Full overlay:         Generate abstract/textured background (entire image is bg)
```

**For each slide, specify which overlay zone to use based on the text length:**
- Short text (1 line): bottom 20% is enough
- Medium text (2-3 lines): bottom 35%
- Long text (4+ lines): full overlay background or center band

---

## Reference Asset Integration

When the user has uploaded assets to `/assets/`:

- **`/assets/me/`**: Reference for consistent person appearance across slides
  - "A person resembling the reference photo, [action], [setting]"
- **`/assets/logos/`**: Can be composited in post-production
- **`/assets/backgrounds/`**: Use as style reference
  - "In the style of the reference background image, generate..."

---

## Anti-Patterns (What NOT to Do)

- Do NOT include any text, letters, numbers, or words in the image prompt
- Do NOT request Hebrew/Arabic/RTL text rendering
- Do NOT make the entire image busy - always leave breathing room
- Do NOT change the style dramatically between slides (breaks visual consistency)
- Do NOT use clip-art or cartoon styles (unless specifically requested)
- Do NOT generate people with identifiable celebrity features
