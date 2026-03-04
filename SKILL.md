---
name: red-hat-quick-deck
description: >
  Create beautiful, shareable HTML-based slide presentations styled to Red Hat brand standards.
  Generates single-file, self-contained HTML decks with click/keyboard navigation, story-arc-driven
  narrative structure, and cinematic dark-mode aesthetics. Use this skill whenever the user wants to
  create a slide deck, presentation, quick deck, quick slides, pitch deck, talk, or briefing that should follow
  Red Hat branding. Also trigger when the user mentions "quick deck", "quick slides", "HTML slides", "shareable deck",
  "presentation for [audience]", "talk about [topic]", or asks to present technical content in Red Hat
  style. This skill is specifically for HTML output — if the user explicitly asks for .pptx, use the
  pptx skill instead, but suggest this skill as an alternative for easy sharing.
---

# Red Hat Quick Deck

Generate stunning, self-contained HTML presentations that follow Red Hat brand standards and use
narrative story arcs to make technical content compelling and memorable.

## Before You Begin

1. **Read the brand reference**: `references/redhat-brand.md` — contains the full color palette, typography, and design rules.
2. **Read the story arc guide**: `references/story-arcs.md` — contains narrative structures and slide design principles.
3. If the `redhat-brand` skill is also installed, consult it for additional brand application guidance.
4. **Ask the user** which mode they prefer for the deck before generating. Use the ask_user_input tool:
   - Question: "What visual mode should this deck use?"
   - Options: "Dark mode (cinematic, dark backgrounds — best for screens & presenting)", "Light mode (clean, white backgrounds — best for print & email sharing)"
   - Default to **Dark mode** if the user doesn't specify or says "either" or "don't care."

## What This Skill Produces

A single `.html` file that:
- Is completely self-contained (inline CSS, inline JS, Google Fonts loaded via CDN)
- Can be opened in any browser, emailed, or hosted on any web server
- Has keyboard navigation (arrow keys, spacebar) and click navigation
- Has a slide counter / progress indicator
- Looks cinematic and professional on screen, projector, or shared link
- Follows a deliberate story arc that builds a persuasive narrative
- Includes speaker notes (toggled with 'N' key) for presenter reference
- Is responsive and works on mobile for async viewing

## Design System

### Color Palette Selection

Choose ONE color collection per deck from the Red Hat brand palette. The **default and recommended**
collection is **"Core Dark"** which matches the reference screenshot aesthetic:

**Core Dark (Default)**
```
--bg-primary: #000000;        /* black */
--bg-secondary: #1f1f1f;      /* gray-90 */
--bg-surface: #292929;         /* gray-80 */
--text-primary: #ffffff;       /* white */
--text-secondary: #c7c7c7;    /* gray-30 */
--text-muted: #a3a3a3;         /* gray-40 */
--accent: #ee0000;             /* red-50 — Red Hat Red */
--accent-dark: #a60000;        /* red-60 */
--accent-light: #f56e6e;       /* red-40 */
--tag-border: #383838;         /* gray-70 */
```

Other available collections (use when the user requests a different feel):

**Core Light** (clean, professional — best for print/email/documentation)
```
--bg-primary: #ffffff;
--bg-secondary: #f2f2f2;
--bg-surface: #e0e0e0;
--text-primary: #151515;
--text-secondary: #4d4d4d;
--text-muted: #707070;
--accent: #ee0000;
--accent-dark: #a60000;
--accent-light: #f56e6e;
--tag-border: #c7c7c7;
```

When using Core Light:
- The ambient glow effect uses a very subtle red tint: `rgba(238,0,0,0.04)`
- Body and slide backgrounds alternate between `--bg-primary` and `--bg-secondary` for rhythm
- Use the **standard** (black wordmark) logo SVG
- Tag pill borders use `--tag-border` (#c7c7c7) with `--text-secondary` text
- The `.accent` tag variant uses `--accent` border and text color (same as dark mode)
- Architecture diagram boxes use `background: rgba(242,242,242,0.8)` and `border: 1px solid #c7c7c7`
- Quote marks use `--accent` at low opacity
- The progress indicator `.current` number is still red-50

**Expressive Dark** (for more colorful content — adds teal and purple accents)
```
--bg-primary: #1b0d33;         /* purple-80 */
--bg-secondary: #000000;
--bg-surface: #21134d;         /* purple-70 */
--text-primary: #ffffff;
--text-secondary: #d0c5f4;     /* purple-20 */
--text-muted: #b6a6e9;         /* purple-30 */
--accent: #ee0000;
--accent-dark: #a60000;
--accent-light: #f56e6e;
--highlight-teal: #37a3a3;     /* teal-50 */
--highlight-purple: #876fd4;   /* purple-40 */
--tag-border: #3d2785;         /* purple-60 */
```

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&family=Red+Hat+Text:wght@400;500;700&family=Red+Hat+Mono:wght@400;700&display=swap');

--font-display: 'Red Hat Display', sans-serif;   /* Headlines */
--font-body: 'Red Hat Text', sans-serif;          /* Body text */
--font-mono: 'Red Hat Mono', monospace;           /* Code, tags, technical */
```

### Visual Effects

The reference screenshot uses a subtle ambient glow in the upper-right corner. Achieve this with a
radial gradient overlay on the slide background:

```css
.slide::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(ellipse, rgba(238,0,0,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

This creates the distinctive "red atmosphere" effect. Vary the position and opacity per slide for visual
rhythm. On some slides, shift it to the left. On the title slide, make it more prominent.

### Red Hat Logo

Every deck must include the official Red Hat logo. Since these are self-contained HTML files, the logo
is embedded as an inline SVG. The skill provides two versions — use the correct one for the deck's mode.

The logo appears in two places:
1. **Breadcrumb area** (top-left of title slide) — small, subtle, as part of the navigation breadcrumb
2. **Footer / closing slide** — larger, standalone placement

Per brand guidelines:
- On dark backgrounds: hat is red, wordmark is white (reverse full-color)
- On light backgrounds: hat is red, wordmark is black (standard full-color)
- Always maintain minimum spacing around the logo
- Never distort, recolor the hat band, or add effects

#### Logo SVG — Reverse (for Dark Mode)

Use this on dark backgrounds. The hat is red (#e00), the wordmark is white (#fff).
This is the official `RedHat-Logo-A-Reverse` from `static.redhat.com/libs/redhat/brand-assets/2/corp/logo--on-dark.svg`.

```html
<svg class="rh-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 613 145" role="img" aria-label="Red Hat">
  <title>Red Hat</title>
  <path d="M127.47,83.49c12.51,0,30.61-2.58,30.61-17.46a14,14,0,0,0-.31-3.42l-7.45-32.36c-1.72-7.12-3.23-10.35-15.73-16.6C124.89,8.69,103.76.5,97.51.5,91.69.5,90,8,83.06,8c-6.68,0-11.64-5.6-17.89-5.6-6,0-9.91,4.09-12.93,12.5,0,0-8.41,23.72-9.49,27.16A6.43,6.43,0,0,0,42.53,44c0,9.22,36.3,39.45,84.94,39.45M160,72.07c1.73,8.19,1.73,9.05,1.73,10.13,0,14-15.74,21.77-36.43,21.77C78.54,104,37.58,76.6,37.58,58.49a18.45,18.45,0,0,1,1.51-7.33C22.27,52,.5,55,.5,74.22c0,31.48,74.59,70.28,133.65,70.28,45.28,0,56.7-20.48,56.7-36.65,0-12.72-11-27.16-30.83-35.78" fill="#e00"/>
  <path d="M160,72.07c1.73,8.19,1.73,9.05,1.73,10.13,0,14-15.74,21.77-36.43,21.77C78.54,104,37.58,76.6,37.58,58.49a18.45,18.45,0,0,1,1.51-7.33l3.66-9.06A6.43,6.43,0,0,0,42.53,44c0,9.22,36.3,39.45,84.94,39.45,12.51,0,30.61-2.58,30.61-17.46a14,14,0,0,0-.31-3.42Z"/>
  <path d="M579.74,92.8c0,11.89,7.15,17.67,20.19,17.67a52.11,52.11,0,0,0,11.89-1.68V95a24.84,24.84,0,0,1-7.68,1.16c-5.37,0-7.36-1.68-7.36-6.73V68.3h15.56V54.1H596.78v-18l-17,3.68V54.1H568.49V68.3h11.25Zm-53,.32c0-3.68,3.69-5.47,9.26-5.47a43.12,43.12,0,0,1,10.1,1.26v7.15a21.51,21.51,0,0,1-10.63,2.63c-5.46,0-8.73-2.1-8.73-5.57m5.2,17.56c6,0,10.84-1.26,15.36-4.31v3.37h16.82V74.08c0-13.56-9.14-21-24.39-21-8.52,0-16.94,2-26,6.1l6.1,12.52c6.52-2.74,12-4.42,16.83-4.42,7,0,10.62,2.73,10.62,8.31v2.73a49.53,49.53,0,0,0-12.62-1.58c-14.31,0-22.93,6-22.93,16.73,0,9.78,7.78,17.24,20.19,17.24m-92.44-.94h18.09V80.92h30.29v28.82H506V36.12H487.93V64.41H457.64V36.12H439.55ZM370.62,81.87c0-8,6.31-14.1,14.62-14.1A17.22,17.22,0,0,1,397,72.09V91.54A16.36,16.36,0,0,1,385.24,96c-8.2,0-14.62-6.1-14.62-14.09m26.61,27.87h16.83V32.44l-17,3.68V57.05a28.3,28.3,0,0,0-14.2-3.68c-16.19,0-28.92,12.51-28.92,28.5a28.25,28.25,0,0,0,28.4,28.6,25.12,25.12,0,0,0,14.93-4.83ZM320,67c5.36,0,9.88,3.47,11.67,8.83H308.47C310.15,70.3,314.36,67,320,67M291.33,82c0,16.2,13.25,28.82,30.28,28.82,9.36,0,16.2-2.53,23.25-8.42l-11.26-10c-2.63,2.74-6.52,4.21-11.14,4.21a14.39,14.39,0,0,1-13.68-8.83h39.65V83.55c0-17.67-11.88-30.39-28.08-30.39a28.57,28.57,0,0,0-29,28.81M262,51.58c6,0,9.36,3.78,9.36,8.31S268,68.2,262,68.2H244.11V51.58Zm-36,58.16h18.09V82.92h13.77l13.89,26.82H292l-16.2-29.45a22.27,22.27,0,0,0,13.88-20.72c0-13.25-10.41-23.45-26-23.45H226Z" fill="#fff"/>
</svg>
```

#### Logo SVG — Standard (for Light Mode)

Use this on light backgrounds. The hat is red (#e00), the wordmark is near-black (#151515).
This is the official logo extracted from the Red Hat brand standards page header.

```html
<svg class="rh-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 613 145" role="img" aria-label="Red Hat">
  <title>Red Hat</title>
  <path d="M127.47,83.49c12.51,0,30.61-2.58,30.61-17.46a14,14,0,0,0-.31-3.42l-7.45-32.36c-1.72-7.12-3.23-10.35-15.73-16.6C124.89,8.69,103.76.5,97.51.5,91.69.5,90,8,83.06,8c-6.68,0-11.64-5.6-17.89-5.6-6,0-9.91,4.09-12.93,12.5,0,0-8.41,23.72-9.49,27.16A6.43,6.43,0,0,0,42.53,44c0,9.22,36.3,39.45,84.94,39.45M160,72.07c1.73,8.19,1.73,9.05,1.73,10.13,0,14-15.74,21.77-36.43,21.77C78.54,104,37.58,76.6,37.58,58.49a18.45,18.45,0,0,1,1.51-7.33C22.27,52,.5,55,.5,74.22c0,31.48,74.59,70.28,133.65,70.28,45.28,0,56.7-20.48,56.7-36.65,0-12.72-11-27.16-30.83-35.78" fill="#e00"/>
  <path d="M160,72.07c1.73,8.19,1.73,9.05,1.73,10.13,0,14-15.74,21.77-36.43,21.77C78.54,104,37.58,76.6,37.58,58.49a18.45,18.45,0,0,1,1.51-7.33l3.66-9.06A6.43,6.43,0,0,0,42.53,44c0,9.22,36.3,39.45,84.94,39.45,12.51,0,30.61-2.58,30.61-17.46a14,14,0,0,0-.31-3.42Z"/>
  <path d="M579.74,92.8c0,11.89,7.15,17.67,20.19,17.67a52.11,52.11,0,0,0,11.89-1.68V95a24.84,24.84,0,0,1-7.68,1.16c-5.37,0-7.36-1.68-7.36-6.73V68.3h15.56V54.1H596.78v-18l-17,3.68V54.1H568.49V68.3h11.25Zm-53,.32c0-3.68,3.69-5.47,9.26-5.47a43.12,43.12,0,0,1,10.1,1.26v7.15a21.51,21.51,0,0,1-10.63,2.63c-5.46,0-8.73-2.1-8.73-5.57m5.2,17.56c6,0,10.84-1.26,15.36-4.31v3.37h16.82V74.08c0-13.56-9.14-21-24.39-21-8.52,0-16.94,2-26,6.1l6.1,12.52c6.52-2.74,12-4.42,16.83-4.42,7,0,10.62,2.73,10.62,8.31v2.73a49.53,49.53,0,0,0-12.62-1.58c-14.31,0-22.93,6-22.93,16.73,0,9.78,7.78,17.24,20.19,17.24m-92.44-.94h18.09V80.92h30.29v28.82H506V36.12H487.93V64.41H457.64V36.12H439.55ZM370.62,81.87c0-8,6.31-14.1,14.62-14.1A17.22,17.22,0,0,1,397,72.09V91.54A16.36,16.36,0,0,1,385.24,96c-8.2,0-14.62-6.1-14.62-14.09m26.61,27.87h16.83V32.44l-17,3.68V57.05a28.3,28.3,0,0,0-14.2-3.68c-16.19,0-28.92,12.51-28.92,28.5a28.25,28.25,0,0,0,28.4,28.6,25.12,25.12,0,0,0,14.93-4.83ZM320,67c5.36,0,9.88,3.47,11.67,8.83H308.47C310.15,70.3,314.36,67,320,67M291.33,82c0,16.2,13.25,28.82,30.28,28.82,9.36,0,16.2-2.53,23.25-8.42l-11.26-10c-2.63,2.74-6.52,4.21-11.14,4.21a14.39,14.39,0,0,1-13.68-8.83h39.65V83.55c0-17.67-11.88-30.39-28.08-30.39a28.57,28.57,0,0,0-29,28.81M262,51.58c6,0,9.36,3.78,9.36,8.31S268,68.2,262,68.2H244.11V51.58Zm-36,58.16h18.09V82.92h13.77l13.89,26.82H292l-16.2-29.45a22.27,22.27,0,0,0,13.88-20.72c0-13.25-10.41-23.45-26-23.45H226Z" fill="#151515"/>
</svg>
```

#### Logo CSS

```css
.rh-logo {
  height: 28px;
  width: auto;
}
.rh-logo.small { height: 20px; }
.rh-logo.large { height: 40px; }
```

#### Logo Placement Rules

**Title slide**: Place the logo in the breadcrumb row, left-aligned, before any breadcrumb text:
```html
<div class="breadcrumb">
  <svg class="rh-logo small" ...>[logo SVG]</svg>
  <span style="margin-left: 12px;">› NAPS STP</span>
</div>
```

**Closing / CTA slide**: Place the logo centered or left-aligned near the bottom of the slide,
above or beside the attribution, at `.rh-logo.large` size.

**Every other slide**: The logo should NOT appear on every content slide — this avoids clutter.
Instead, include a minimal red accent bar or the Red Hat red (#ee0000) in the progress indicator
to maintain brand presence throughout.

### Tag / Pill Styling

The reference uses outlined pills for categorization (e.g., "Local-First", "Air-Gap Ready"). Style them:

```css
.tag {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid var(--tag-border);
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.tag.accent {
  border-color: var(--accent);
  color: var(--accent);
}
```

## Slide Structure Template

### HTML Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Deck Title]</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&family=Red+Hat+Text:wght@400;500;700&family=Red+Hat+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* === RESET & BASE === */
    /* === COLOR VARIABLES (dark or light, based on user choice) === */
    /* === TYPOGRAPHY === */
    /* === LOGO STYLES === */
    /* === SLIDE CONTAINER === */
    /* === NAVIGATION === */
    /* === SLIDE TYPES === */
    /* === SPEAKER NOTES === */
    /* === ANIMATIONS === */
  </style>
</head>
<body>
  <div class="deck">
    <!-- SLIDE 1: TITLE (includes logo in breadcrumb) -->
    <div class="slide">
      <div class="breadcrumb">
        <!-- Inline Red Hat logo SVG (reverse for dark, standard for light) -->
        <svg class="rh-logo small" ...>[appropriate logo paths]</svg>
        <span>› [Team / Group]</span>
      </div>
      <!-- ... rest of title slide ... -->
    </div>

    <!-- CONTENT SLIDES (no logo — brand presence via red accents) -->

    <!-- FINAL SLIDE: CTA (includes larger logo) -->
    <div class="slide">
      <!-- ... content ... -->
      <div class="logo-footer">
        <svg class="rh-logo large" ...>[appropriate logo paths]</svg>
      </div>
    </div>
  </div>
  <div class="controls">
    <div class="nav-hint">← → or click to navigate · N for notes</div>
    <div class="progress"><span class="current">1</span> / <span class="total">10</span></div>
  </div>
  <script>
    // Navigation logic
  </script>
</body>
</html>
```

### Required Slide Types

Every deck should include these slide types (adapt as needed):

#### 1. Title Slide
- Breadcrumb / source label (e.g., "RED HAT › NAPS STP") in small monospace, top-left
- Working group or team label + date in red monospace, left-aligned
- Large bold headline in Red Hat Display Black weight
- Accent word(s) in the headline colored red-50
- Subtitle / description in lighter text below
- Tag pills for key concepts
- Author attribution at bottom: "Name · Role · Organization"

#### 2. Content Slide
- Slide headline as an assertion (not a label)
- Body content: paragraphs, bullet points (use sparingly), or key-value pairs
- Optional: source attribution at bottom

#### 3. Big Number / Stat Slide
- One large number (80-120px font size) in red-50 or white
- Brief context line below in gray-30
- Source attribution at bottom

#### 4. Comparison / Before-After Slide
- Two-column layout
- Clear visual distinction between old/new or with/without
- Use red-50 to highlight the preferred side

#### 5. Architecture / Diagram Slide
- CSS-based box diagrams with flexbox/grid (no images required)
- Boxes with borders and labels
- Arrows represented with CSS or Unicode characters (→, ↓)
- Red-50 highlight on the key innovation

#### 6. Quote Slide
- Large pull quote in Red Hat Display, medium weight
- Attribution below
- Red-50 opening quotation mark as decorative element

#### 7. Call-to-Action / Closing Slide
- Clear next steps
- Contact info or resources
- QR code placeholder if relevant (note in speaker notes)

#### 8. Thank You Slide (Required — always the final slide)
- Large "Thank You" headline in Red Hat Display, Black weight
- Accent word ("You") in red-50
- Author name, role, and organization centered below
- Red Hat logo (large) centered beneath attribution
- Optionally include contact email, social handle, or team URL in small muted text
- Keep it clean — no tags, no body text, generous whitespace
- The ambient glow effect should be prominent on this slide for a strong visual close

## Building the Narrative

When the user gives you a topic, follow this process:

### Step 1: Research (if web search available)
Search for current statistics, quotes, and developments related to the topic. Look for:
- Recent industry reports or surveys with quotable numbers
- Expert quotes that support the thesis
- Competitive landscape data
- Adoption metrics or trends

### Step 2: Choose a Story Arc
Read `references/story-arcs.md` and select the best arc for the content:
- **Problem → Tension → Resolution**: Best for introducing a new tool, approach, or technology
- **Myth-Busting**: Best for challenging conventional thinking
- **Journey**: Best for case studies or retrospectives

### Step 3: Outline the Deck
Write the slide headlines FIRST. The headlines alone should tell the complete story. Show the user
the outline before generating the full HTML if the topic is complex.

### Step 4: Write Each Slide
For each slide:
- Write the headline as an assertion
- Write concise supporting content (fewer words = more impact)
- Choose the appropriate slide type
- Add source attributions where data is cited
- Add speaker notes with talking points, transitions, and timing cues

### Step 5: AI Image Opportunities
As you build slides, identify moments where a custom AI-generated image would elevate the deck.
For each opportunity, add a note in the speaker notes like:

```
[IMAGE OPPORTUNITY] Prompt for Nano Banana Pro 2:
"[detailed image generation prompt describing the desired visual,
style, composition, colors, and mood — incorporating Red Hat brand
colors where appropriate]"
```

Good candidates for AI images:
- Title slide hero visuals (abstract, on-brand)
- Concept illustrations (e.g., "air gap" as a visual metaphor)
- Background textures or atmospheric elements
- Infographic-style data visualizations
- Metaphorical illustrations for complex concepts

When writing prompts, specify:
- Dark background compatible (for Core Dark decks)
- Red Hat color palette (reds, dark grays, subtle teals/purples)
- No text in the image (text will be overlaid in HTML)
- Aspect ratio suited for the slide layout (usually 16:9 or specific region)

## Navigation JavaScript

Include this navigation system in every deck:

```javascript
(function() {
  const slides = document.querySelectorAll('.slide');
  const currentEl = document.querySelector('.current');
  const totalEl = document.querySelector('.total');
  const notesPanel = document.querySelector('.notes-panel');
  let idx = 0;
  let notesVisible = false;

  totalEl.textContent = slides.length;

  function show(i) {
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.style.display = j === i ? 'flex' : 'none';
    });
    currentEl.textContent = i + 1;
    // Update notes if visible
    if (notesVisible && notesPanel) {
      const note = slides[i].dataset.notes || '';
      notesPanel.innerHTML = note;
    }
  }

  function next() { if (idx < slides.length - 1) { idx++; show(idx); } }
  function prev() { if (idx > 0) { idx--; show(idx); } }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { prev(); }
    if (e.key === 'n' || e.key === 'N') {
      notesVisible = !notesVisible;
      if (notesPanel) notesPanel.classList.toggle('visible', notesVisible);
      show(idx);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.controls') || e.target.closest('.notes-panel')) return;
    const x = e.clientX / window.innerWidth;
    x > 0.5 ? next() : prev();
  });

  // Touch support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) { diff < 0 ? next() : prev(); }
  });

  show(0);
})();
```

## Animations

Use subtle entrance animations for slide content. Stagger child elements for a cinematic reveal:

```css
.slide.active .animate-in {
  animation: fadeSlideUp 0.6s ease-out forwards;
}
.slide.active .animate-in:nth-child(2) { animation-delay: 0.1s; }
.slide.active .animate-in:nth-child(3) { animation-delay: 0.2s; }
.slide.active .animate-in:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Quality Checklist

Before delivering the HTML file, verify:

- [ ] **User was asked** about dark or light mode preference before generation
- [ ] All text uses Red Hat font family (Display, Text, or Mono)
- [ ] Red-50 (#ee0000) appears on every slide (even if just in the nav or a small accent)
- [ ] **Red Hat logo** appears on the title slide (breadcrumb area, small) and closing slide (larger)
- [ ] Logo uses the correct variant: reverse (white wordmark) for dark, standard (black wordmark) for light
- [ ] Logo is inline SVG (no external image dependencies)
- [ ] Color palette matches the chosen mode (Core Dark or Core Light or Expressive Dark)
- [ ] Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large headlines)
- [ ] Headlines tell a complete story when read in sequence
- [ ] Keyboard navigation works (← → Space N)
- [ ] Click/tap navigation works
- [ ] Speaker notes are present with talking points
- [ ] Sources are attributed on data slides
- [ ] At least one AI image opportunity is noted in speaker notes
- [ ] File is self-contained (no external dependencies besides Google Fonts)
- [ ] Progress indicator shows current/total slides
- [ ] The narrative follows a clear story arc with emotional rhythm
- [ ] **Thank You slide** is present as the final slide with author name, role, and Red Hat logo
- [ ] The accent word(s) in the title slide headline are colored red-50 for emphasis

## Example: Mapping the OpenCode Screenshot to This System

The reference screenshot ("Your AI Assistant Should Live Where You Work") demonstrates:

```
Breadcrumb:    [RH Logo SVG] › NAPS STP               [logo small + font-mono, small, muted]
Label:         —— NAPS STP WORKING GROUP · FEB 27, 2026   [font-mono, red-50, small, tracking-wide]
Headline:      Your AI Assistant                       [Red Hat Display, Black, white, ~64px]
               Should Live Where You Work              ["Live Where You Work" in red-50, italic]
Subtitle:      A fully local, air-gap-ready AI...      [font-body, gray-40, ~18px]
Tags:          [Local-First] [Air-Gap Ready] ...       [pill style, monospace, outlined]
Attribution:   Todd Wardzinski · Architect · Red Hat    [font-body, gray-40, small]
Background:    Black with subtle red radial glow       [upper-right corner, very low opacity]
```

This is the target aesthetic. Every title slide should feel this cinematic and intentional.

## File Delivery

Save the generated HTML to `/mnt/user-data/outputs/[deck-name].html` and present it to the user.
The filename should be kebab-case derived from the deck title.

## Tips for Presenters

Include these tips in the first speaker note:
- Arrow keys or click to navigate
- Press 'N' to toggle speaker notes
- Works in any modern browser — share the HTML file directly
- For best results, use fullscreen (F11) or present in a browser tab
