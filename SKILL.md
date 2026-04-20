---
name: red-hat-quick-deck
description: >
  Create beautiful, shareable HTML-based slide presentations styled to Red Hat brand standards.
  Generates single-file, self-contained HTML decks with click/keyboard navigation, story-arc-driven
  narrative structure, and cinematic dark-mode aesthetics. Supports embedded videos (YouTube, Vimeo,
  direct URLs) and linked media (memes, GIFs, images) with brand-consistent styling. Use this skill
  whenever the user wants to create a slide deck, presentation, quick deck, quick slides, pitch deck,
  talk, or briefing that should follow Red Hat branding. Also trigger when the user mentions "quick deck",
  "quick slides", "HTML slides", "shareable deck", "presentation for [audience]", "talk about [topic]",
  or asks to present technical content in Red Hat style. This skill is specifically for HTML output — if
  the user explicitly asks for .pptx, use the pptx skill instead, but suggest this skill as an alternative
  for easy sharing.
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

## Authoring Mode — Markdown (preferred) vs. HTML (fallback)

This skill produces the same cinematic HTML output via two authoring paths.
Choose based on your environment **before** you start designing slides:

### Markdown mode (preferred — when Bash/shell is available)

If you can execute shell commands (Claude Code, terminal-capable environments):

1. Author the deck as Marp markdown (`<deck-slug>.md`)
2. Render with `node scripts/render.mjs <deck-slug>.md` from the repo root
3. Deliver **both** the `.md` source (editable) and the `.html` (shareable)

**Why this is preferred**: users who want to tweak wording, reorder slides, or
regenerate the HTML later can edit the markdown and re-run the render script.
The HTML output is byte-for-byte equivalent to the HTML-direct path below.

**Read `references/markdown-authoring.md`** for the full markdown authoring
guide — YAML front-matter, slide-type directives, notes syntax, render
invocation, and the markdown-mode quality checklist.

### HTML mode (fallback — when shell is unavailable)

If shell is **not** available (Claude web, Gemini Gems, anywhere you can only
emit text into a chat response), follow the slide-type sections in the rest
of this file to emit a single self-contained `.html` file directly. Deliver
only the `.html`.

The HTML-direct path has been the default for the skill's history and remains
fully supported. Every design-system rule below — colors, tokens, typography,
logo, icons, spacing, slide types, navigation JS, quality checklist — applies
to both authoring modes.

**How to decide at generation time**:

- If you have a Bash or file-writing tool in this session → markdown mode.
- If you can only return HTML as a chat message → HTML mode.
- When in doubt, prefer markdown — falling back to HTML on render failure is
  trivial (emit the HTML directly instead of the `.md`).

## What This Skill Produces

A single `.html` file that:
- Is completely self-contained (inline CSS, inline JS; Google Fonts, Red Hat Design Tokens, and optionally Red Hat Icons loaded via CDN)
- Can be opened in any browser, emailed, or hosted on any web server
- Has keyboard navigation (arrow keys, spacebar) and click navigation
- Has a slide counter / progress indicator
- Looks cinematic and professional on screen, projector, or shared link
- Follows a deliberate story arc that builds a persuasive narrative
- Includes a contextual notes panel (toggled with 'N' key) for additional references, links, and deeper context on each slide
- Supports embedded videos (YouTube, Vimeo, direct URLs) with auto-pause on slide change
- Supports linked media (memes, GIFs, images) with responsive display and optional captions
- Is responsive and works on mobile for async viewing

## Design System

### Red Hat Design Tokens

This skill integrates the official **Red Hat Design Tokens** (`@rhds/tokens`) for spacing, typography sizing,
borders, and shadows. The tokens CSS is loaded via jsDelivr CDN alongside the existing Google Fonts and
`@rhds/icons` dependencies. All token references include hardcoded fallbacks so decks degrade gracefully offline.

**CDN URL:**
```
https://cdn.jsdelivr.net/npm/@rhds/tokens@3.0.2/css/global.min.css
```

**Important color note:** The RHDS v3 tokens use accessibility-adjusted color values (e.g.,
`--rh-color-brand-red-on-dark` resolves to `#FF442B`, not `#ee0000`). This skill intentionally keeps
the established Red Hat brand palette hex values (`#ee0000` for red-50, etc.) for visual consistency
with the classic brand aesthetic. Token names are annotated in comments for cross-reference.

**What we use from `@rhds/tokens`:**
- **Spacing**: `--rh-space-xs` (4px) through `--rh-space-7xl` (128px) — consistent 4px-base scale
- **Typography sizing**: `--rh-font-size-heading-*` and `--rh-font-size-body-text-*`
- **Font families**: `--rh-font-family-heading`, `--rh-font-family-body-text`, `--rh-font-family-code`
- **Border radius**: `--rh-border-radius-default` (3px), `--rh-border-radius-pill` (64px)
- **Border width**: `--rh-border-width-sm` (1px), `--rh-border-width-md` (2px), `--rh-border-width-lg` (3px)
- **Box shadows**: `--rh-box-shadow-sm/md/lg/xl` — for cards, architecture boxes, elevated surfaces
- **Opacity**: `--rh-opacity-*` — for overlays, muted elements, and glow effects

**Token reference:** https://ux.redhat.com/tokens/ · Package: https://www.npmjs.com/package/@rhds/tokens

### Color Palette Selection

Choose ONE color collection per deck from the Red Hat brand palette. The **default and recommended**
collection is **"Core Dark"** which matches the reference screenshot aesthetic.

Each mode sets `color-scheme` on `:root` so that any `light-dark()` token values resolve correctly.

**Core Dark (Default)**
```css
:root { color-scheme: dark; }

--bg-primary: #000000;        /* black · --rh-color-surface-darkest */
--bg-secondary: #1f1f1f;      /* gray-90 · --rh-color-surface-darker */
--bg-surface: #292929;         /* gray-80 · --rh-color-surface-dark */
--text-primary: #ffffff;       /* white · --rh-color-text-primary-on-dark */
--text-secondary: #c7c7c7;    /* gray-30 · --rh-color-text-secondary-on-dark */
--text-muted: #a3a3a3;         /* gray-40 */
--accent: #ee0000;             /* red-50 — Red Hat Red */
--accent-dark: #a60000;        /* red-60 */
--accent-light: #f56e6e;       /* red-40 */
--tag-border: #383838;         /* gray-70 · --rh-color-border-subtle-on-dark */
--icon-filter: brightness(0) invert(1);  /* white icons on dark bg */
--icon-filter-accent: invert(12%) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(95%); /* red-50 icons */
```

Other available collections (use when the user requests a different feel):

**Core Light** (clean, professional — best for print/email/documentation)
```css
:root { color-scheme: light; }

--bg-primary: #ffffff;         /* white · --rh-color-surface-lightest */
--bg-secondary: #f2f2f2;      /* gray-10 · --rh-color-surface-lighter */
--bg-surface: #e0e0e0;        /* gray-20 · --rh-color-surface-light */
--text-primary: #151515;      /* gray-95 · --rh-color-text-primary-on-light */
--text-secondary: #4d4d4d;    /* gray-60 · --rh-color-text-secondary-on-light */
--text-muted: #707070;        /* gray-50 */
--accent: #ee0000;             /* red-50 — Red Hat Red */
--accent-dark: #a60000;        /* red-60 */
--accent-light: #f56e6e;       /* red-40 */
--tag-border: #c7c7c7;        /* gray-30 · --rh-color-border-subtle-on-light */
--icon-filter: none;                     /* dark icons on light bg (SVGs are dark by default) */
--icon-filter-accent: invert(12%) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(95%); /* red-50 icons */
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
```css
:root { color-scheme: dark; }

--bg-primary: #1b0d33;         /* purple-80 */
--bg-secondary: #000000;       /* black */
--bg-surface: #21134d;         /* purple-70 */
--text-primary: #ffffff;       /* white · --rh-color-text-primary-on-dark */
--text-secondary: #d0c5f4;     /* purple-20 */
--text-muted: #b6a6e9;         /* purple-30 */
--accent: #ee0000;             /* red-50 — Red Hat Red */
--accent-dark: #a60000;        /* red-60 */
--accent-light: #f56e6e;       /* red-40 */
--highlight-teal: #37a3a3;     /* teal-50 */
--highlight-purple: #876fd4;   /* purple-40 */
--tag-border: #3d2785;         /* purple-60 */
--icon-filter: brightness(0) invert(1);  /* white icons on dark bg */
--icon-filter-accent: invert(12%) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(95%); /* red-50 icons */
```

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&family=Red+Hat+Text:wght@400;500;700&family=Red+Hat+Mono:wght@400;700&display=swap');

--font-display: var(--rh-font-family-heading, 'Red Hat Display', sans-serif);   /* Headlines */
--font-body: var(--rh-font-family-body-text, 'Red Hat Text', sans-serif);       /* Body text */
--font-mono: var(--rh-font-family-code, 'Red Hat Mono', monospace);             /* Code, tags, technical */
```

#### Typography Sizing (from `@rhds/tokens`)

Use these token-based sizes for consistent typographic scale across decks:

| Token | Size | Usage |
|-------|------|-------|
| `--rh-font-size-heading-2xl` | 3rem (48px) | Title slide headline |
| `--rh-font-size-heading-xl` | 2.5rem (40px) | Section headlines, big impact text |
| `--rh-font-size-heading-lg` | 2rem (32px) | Slide headlines |
| `--rh-font-size-heading-md` | 1.5rem (24px) | Sub-headlines |
| `--rh-font-size-heading-sm` | 1.25rem (20px) | Card titles, labels |
| `--rh-font-size-body-text-xl` | 1.25rem (20px) | Lead paragraphs, subtitles |
| `--rh-font-size-body-text-lg` | 1.125rem (18px) | Body text on slides |
| `--rh-font-size-body-text-md` | 1rem (16px) | Standard body |
| `--rh-font-size-body-text-sm` | 0.875rem (14px) | Captions, attributions |
| `--rh-font-size-body-text-xs` | 0.75rem (12px) | Tags, breadcrumbs, fine print |

Example usage:
```css
h1 { font-size: var(--rh-font-size-heading-2xl, 3rem); }
h2 { font-size: var(--rh-font-size-heading-lg, 2rem); }
.subtitle { font-size: var(--rh-font-size-body-text-xl, 1.25rem); }
.tag { font-size: var(--rh-font-size-body-text-xs, 0.75rem); }
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

### Red Hat Icons

Red Hat publishes an official icon library (`@rhds/icons`) with 1,135 SVGs across 4 sets. Use `<img>` tags
pointing to the jsDelivr CDN to add icons to slides. Icons are controlled via CSS `filter` variables
so they adapt to each color mode automatically.

**CDN URL pattern:**
```
https://cdn.jsdelivr.net/npm/@rhds/icons@2.1.0/{set}/{icon}.svg
```

#### Choosing Icons — Read `references/rhds-icons.md`

**Before using any icon, always read `references/rhds-icons.md`** — it is the single source of truth for:
- The full inventory of all 1,135 icons across 4 sets (`standard`, `ui`, `microns`, `social`)
- **Common alias mappings** — many intuitive names don't match the actual RHDS names (e.g., `database` → `data`, `integration` → `interoperability`, `build` → `circuit`, `network` → `network-automation`)
- **Semantic groupings** by topic (Cloud, Security, AI, DevOps, etc.) to quickly find the right icon for a slide's subject matter

Do **not** guess icon names. If you use a name that doesn't exist in the inventory, the icon will silently fail to load.

#### Icon CSS

```css
/* === ICON STYLES === */
.rh-icon {
  height: 48px;
  width: 48px;
  filter: var(--icon-filter);
  vertical-align: middle;
}
.rh-icon.small  { height: 24px; width: 24px; }
.rh-icon.medium { height: 48px; width: 48px; }
.rh-icon.large  { height: 64px; width: 64px; }
.rh-icon.xl     { height: 96px; width: 96px; }
.rh-icon.accent { filter: var(--icon-filter-accent); }
```

#### Icon Usage in HTML

```html
<!-- Basic icon -->
<img class="rh-icon" src="https://cdn.jsdelivr.net/npm/@rhds/icons@2.1.0/standard/cloud.svg" alt="Cloud">

<!-- Small accent-colored icon beside a headline -->
<h2><img class="rh-icon small accent" src="https://cdn.jsdelivr.net/npm/@rhds/icons@2.1.0/standard/shield.svg" alt=""> Security First</h2>

<!-- Large icon for a stat slide -->
<img class="rh-icon xl accent" src="https://cdn.jsdelivr.net/npm/@rhds/icons@2.1.0/standard/graph-line-up.svg" alt="">
<div class="big-number">3.2x</div>
```

#### Icon Usage Guidelines

- **Use sparingly**: 2-3 icons per slide maximum. Icons should clarify, not decorate.
- **Best uses**: Stat slide topic icons, feature list bullets, architecture diagram box labels, comparison column headers.
- **Don't**: Use icons as the sole content, mix too many sizes on one slide, use icons without supporting text.
- **Sizing**: Use `.small` (24px) inline with text, `.medium` (48px) for feature lists, `.large`/`.xl` for hero/stat accent.
- **Color**: Icons inherit the mode's filter by default. Use `.accent` class sparingly for emphasis (same restraint as red-50 text).

### Spacing Scale (from `@rhds/tokens`)

Use the official Red Hat spacing tokens for all padding, margins, and gaps. This ensures visual
consistency with the broader Red Hat design system. All values are multiples of 4px.

| Token | Value | Common Usage |
|-------|-------|-------------|
| `--rh-space-xs` | 4px | Tight inline gaps, icon-to-text spacing |
| `--rh-space-sm` | 8px | Compact element spacing |
| `--rh-space-md` | 16px | Standard element spacing, tag padding horizontal |
| `--rh-space-lg` | 24px | Section gaps, card padding |
| `--rh-space-xl` | 32px | Slide content gaps |
| `--rh-space-2xl` | 48px | Major section spacing |
| `--rh-space-3xl` | 64px | Slide side padding |
| `--rh-space-4xl` | 80px | Slide top/bottom padding |
| `--rh-space-5xl` | 96px | Large hero spacing |
| `--rh-space-6xl` | 112px | Extra large spacing |
| `--rh-space-7xl` | 128px | Maximum spacing |

Example usage:
```css
.slide { padding: var(--rh-space-4xl, 80px) var(--rh-space-3xl, 64px); }
.content-body { gap: var(--rh-space-lg, 24px); }
.breadcrumb svg + span { margin-left: var(--rh-space-sm, 8px); }
```

### Border & Shadow Tokens (from `@rhds/tokens`)

```css
/* Border widths */
--rh-border-width-sm: 1px;    /* Default borders, tag outlines */
--rh-border-width-md: 2px;    /* Emphasized borders, accent lines */
--rh-border-width-lg: 3px;    /* Heavy emphasis, decorative rules */

/* Border radii */
--rh-border-radius-sharp: 0px;       /* No rounding — architecture boxes */
--rh-border-radius-default: 3px;     /* Subtle rounding — cards, surfaces */
--rh-border-radius-pill: 64px;       /* Full pill — tags, badges */

/* Box shadows — use for elevated surfaces and architecture diagram depth */
--rh-box-shadow-sm: 0 2px 4px 0 rgba(21, 21, 21, 0.2);      /* Subtle lift */
--rh-box-shadow-md: 0 4px 6px 1px rgba(21, 21, 21, 0.25);    /* Cards */
--rh-box-shadow-lg: 0 6px 8px 2px rgba(21, 21, 21, 0.3);     /* Modals, panels */
--rh-box-shadow-xl: 0 8px 24px 3px rgba(21, 21, 21, 0.35);   /* Hero elements */
```

### Video Container Styling

```css
/* === VIDEO CONTAINER === */
.video-container {
  position: relative;
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  border-radius: var(--rh-border-radius-default, 3px);
  overflow: hidden;
  box-shadow: var(--rh-box-shadow-lg, 0 6px 8px 2px rgba(21, 21, 21, 0.3));
  background: var(--bg-secondary);
  align-self: center;
}
.video-container iframe,
.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
```

### Media Container Styling (Memes, GIFs, Linked Images)

```css
/* === MEDIA CONTAINER === */
.media-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  max-height: 65vh;
  padding: var(--rh-space-md, 16px) 0;
  align-self: center;
}
.slide-media {
  display: block;
  max-width: 90%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--rh-border-radius-default, 3px);
  box-shadow: var(--rh-box-shadow-lg, 0 6px 8px 2px rgba(21, 21, 21, 0.3));
}
.media-caption {
  font-family: var(--rh-font-family-body-text, 'Red Hat Text', sans-serif);
  font-size: var(--rh-font-size-body-text-lg, 1.125rem);
  color: var(--text-secondary);
  text-align: center;
  margin-top: var(--rh-space-md, 16px);
  max-width: 720px;
  align-self: center;
}
```

### Tag / Pill Styling

The reference uses outlined pills for categorization (e.g., "Local-First", "Air-Gap Ready"). Style them
using design tokens for sizing, spacing, and borders:

```css
.tag {
  display: inline-block;
  padding: var(--rh-space-xs, 4px) var(--rh-space-md, 16px);
  border: var(--rh-border-width-sm, 1px) solid var(--tag-border);
  border-radius: var(--rh-border-radius-pill, 64px);
  font-family: var(--font-mono);
  font-size: var(--rh-font-size-body-text-xs, 0.75rem);
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
  <!-- Red Hat Design Tokens (spacing, typography, borders, shadows) -->
  <link href="https://cdn.jsdelivr.net/npm/@rhds/tokens@3.0.2/css/global.min.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&family=Red+Hat+Text:wght@400;500;700&family=Red+Hat+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* === RESET & BASE === */
    :root { color-scheme: dark; } /* Set to 'light' for Core Light mode */
    /* === COLOR VARIABLES (dark or light, based on user choice) === */
    /* === TYPOGRAPHY (uses --rh-font-family-* and --rh-font-size-* tokens with fallbacks) === */
    /* === SPACING (uses --rh-space-* tokens with fallbacks) === */
    /* === LOGO STYLES === */
    /* === ICON STYLES === */
    /* === SLIDE CONTAINER === */
    /* === NAVIGATION === */
    /* === SLIDE TYPES === */
    /* === CONTEXTUAL NOTES PANEL === */
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
    <!-- VIDEO SLIDES use .video-container with iframe or video tag -->
    <!-- MEDIA SLIDES use .media-container with img tag (memes, GIFs, linked images) -->

    <!-- FINAL SLIDE: CTA (includes larger logo) -->
    <div class="slide">
      <!-- ... content ... -->
      <div class="logo-footer">
        <svg class="rh-logo large" ...>[appropriate logo paths]</svg>
      </div>
    </div>
  </div>
  <div class="controls">
    <div class="nav-hint">← → or click to navigate · N for additional context</div>
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
- Optional: a small icon (`.rh-icon.small`) beside the headline for topical accent
- Optional: icons as feature list markers instead of bullet characters
- Optional: source attribution at bottom

#### 3. Big Number / Stat Slide
- Optional: topic icon (`.rh-icon.xl.accent`) centered above the big number
- One large number (80-120px font size) in red-50 or white
- Brief context line below in gray-30
- Source attribution at bottom

#### 4. Comparison / Before-After Slide
- Two-column layout
- Optional: icons representing each side as column headers (e.g., `padlock-unlocked` vs `padlock-locked`)
- Clear visual distinction between old/new or with/without
- Use red-50 to highlight the preferred side

#### 5. Architecture / Diagram Slide
- CSS-based box diagrams with flexbox/grid (no images required)
- Boxes with borders and labels — use icons (`.rh-icon.small`) inside boxes alongside text labels for visual clarity
- Arrows represented with CSS or Unicode characters (→, ↓)
- Red-50 highlight on the key innovation

#### 6. Quote Slide
- Large pull quote in Red Hat Display, medium weight
- Attribution below
- Red-50 opening quotation mark as decorative element

#### 7. Call-to-Action / Closing Slide
- Clear next steps
- Contact info or resources
- QR code placeholder if relevant (note in contextual notes)

#### 8. Video Slide
- Use when the user provides a video URL or asks to embed a video
- Supports **YouTube**, **Vimeo** (via thumbnail + click-to-embed iframe), and **direct video URLs** (via `<video>` tag)
- Headline with optional accent word above the video
- 16:9 responsive container with brand-consistent framing (shadow, rounded corners)
- Optional caption below the video for context
- Source attribution at bottom
- Click the play button to start the video; controls are visible for pause/seek

**⚠ IMPORTANT — When a user adds a video slide, you MUST inform them:**

> **Inline video playback requires serving this deck via HTTP or HTTPS.**
> YouTube and Vimeo embeds do not work when opening the HTML file directly
> from your filesystem (`file://` protocol) — this is a browser security
> restriction that cannot be worked around.
>
> To enable inline video playback:
> - **Quick local server:** Run `python3 -m http.server` in the deck's folder,
>   then open `http://localhost:8000/deck-name.html`
> - **Or use:** `npx serve`, VS Code Live Server, or any static file host
> - **Or host it:** Upload to any web server, GitHub Pages, S3, etc.
>
> When opened as a local file, clicking a video will open it on YouTube in a
> new browser tab instead.

This message should be delivered **every time** a video slide is added to a deck. Do not skip it.

**URL conversion rules:**
- YouTube `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube-nocookie.com/embed/VIDEO_ID?enablejsapi=1&mute=1`
- YouTube `https://youtu.be/VIDEO_ID` → `https://www.youtube-nocookie.com/embed/VIDEO_ID?enablejsapi=1&mute=1`
- Vimeo `https://vimeo.com/VIDEO_ID` → `https://player.vimeo.com/video/VIDEO_ID?muted=1`
- Direct `.mp4`, `.webm`, `.ogg` URLs → use `<video>` tag with `muted` attribute

**YouTube/Vimeo implementation — thumbnail + open-in-new-tab pattern:**

YouTube iframes have multiple failure modes: `file://` protocol blocks them (Error 153), ad blockers
block YouTube's tracking requests (`ERR_BLOCKED_BY_CLIENT`), and CSP policies can prevent embedding.
To ensure decks work reliably everywhere, **always use the thumbnail + new-tab pattern**:

1. Show the YouTube thumbnail as an image with a branded red play button overlay
2. On click, open the video on youtube.com in a new browser tab
3. The presenter's slide stays visible — they can return to it after watching

This approach has zero dependencies on iframes, works from any protocol, and is immune to ad blockers.

The thumbnail URL pattern: `https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg`
(falls back to `hqdefault.jpg` if maxres isn't available)

**Required CSS for video slides:**
```css
.video-thumbnail {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
}
.video-play-btn {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 80px; height: 80px; background: rgba(238,0,0,0.9); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; z-index: 2;
  transition: background 0.2s ease;
}
.video-play-btn::after {
  content: ''; display: block; width: 0; height: 0;
  border-style: solid; border-width: 14px 0 14px 24px;
  border-color: transparent transparent transparent #fff; margin-left: 4px;
}
.video-container:hover .video-play-btn { background: rgba(238,0,0,1); }
```

**Required JavaScript** (inside the navigation IIFE, BEFORE the navigation click handler):
```javascript
// Click-to-play for video thumbnails
// HTTP/HTTPS: embed iframe inline for seamless playback
// file://: open in new tab (YouTube blocks iframe embeds from file:// protocol)
document.addEventListener('click', (e) => {
  const vc = e.target.closest('.video-container[data-video-id]');
  if (vc) {
    e.stopImmediatePropagation(); // prevent navigation handler from firing
    const vid = vc.dataset.videoId;
    if (window.location.protocol === 'file:') {
      window.open('https://www.youtube.com/watch?v=' + vid, '_blank');
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      vc.innerHTML = '';
      vc.appendChild(iframe);
    }
    return;
  }
});
```

**Why `e.stopImmediatePropagation()`**: When the click handler replaces the video container's
innerHTML, the clicked element (play button) becomes detached from the DOM. Without stopping
propagation, the navigation click handler can't find `.video-container` via `closest()` on the
detached target and accidentally advances the slide.

**Inline video playback note**: Include in the first slide's contextual notes and the nav hint
that videos play inline when served via HTTP (`python3 -m http.server`). When opened as a local
file, videos open on YouTube in a new tab instead.

```html
<!-- YouTube video (thumbnail + new-tab pattern) -->
<div class="slide" data-notes="[notes]">
  <div class="slide-label animate-in">—— LABEL</div>
  <h2 class="animate-in">Headline <span class="accent">with accent</span></h2>
  <div class="video-container animate-in" data-video-id="VIDEO_ID">
    <img class="video-thumbnail" src="https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg" alt="Video description">
    <div class="video-play-btn"></div>
  </div>
  <div class="media-caption animate-in">Optional context about the video</div>
  <div class="source animate-in">Source attribution</div>
</div>

<!-- Direct video file (works from file:// natively) -->
<div class="slide" data-notes="[notes]">
  <div class="slide-label animate-in">—— LABEL</div>
  <h2 class="animate-in">Headline <span class="accent">with accent</span></h2>
  <div class="video-container animate-in">
    <video controls muted preload="metadata">
      <source src="https://example.com/video.mp4" type="video/mp4">
    </video>
  </div>
  <div class="media-caption animate-in">Optional context</div>
  <div class="source animate-in">Source attribution</div>
</div>
```

#### 9. Media Slide (Memes, GIFs, Linked Images, Giphy)
- Use when the user provides an image/meme/GIF URL or asks to include visual media
- Supports any image format: JPG, PNG, GIF (including animated), WebP, SVG
- Supports **Giphy** GIFs (see URL conversion rules below)
- Responsive container that preserves the original aspect ratio
- Optional caption below for humor, context, or commentary — use a lighter tone for memes
- Source / credit line at bottom
- Works for memes, reaction GIFs, diagrams, screenshots, photos — any linked image
- **Important**: Use full-resolution image URLs, not thumbnails. For imgflip templates, use the
  `https://imgflip.com/s/meme/Template-Name.jpg` pattern (full-size) instead of
  `https://i.imgflip.com/2/xxxxx.jpg` (150x150 thumbnails)

**Media URL conversion rules:**
- Giphy page `https://giphy.com/gifs/SLUG-ID` → `https://media.giphy.com/media/ID/giphy.gif`
- Giphy short `https://gph.is/SHORTCODE` → resolve to full URL, then extract ID for `https://media.giphy.com/media/ID/giphy.gif`
- Giphy direct links (`media.giphy.com`, `media0-4.giphy.com`) → use as-is
- Imgflip templates → use `https://imgflip.com/s/meme/Template-Name.jpg` (full-size)
- Direct image URLs (`.jpg`, `.png`, `.gif`, `.webp`, `.svg`) → use as-is
- **Local files** (via `@file`, file path, or "use this image") → embed as base64 data URI (see below)

#### Local File / @file Image Support

When the user provides a local file path or references an image via `@file`, embed the image
directly into the HTML as a **base64 data URI**. This keeps the deck fully self-contained and
portable — the image travels with the HTML file.

**Encoding workflow:**

1. Determine the MIME type from the file extension:
   - `.png` → `image/png`
   - `.jpg` / `.jpeg` → `image/jpeg`
   - `.gif` → `image/gif`
   - `.webp` → `image/webp`
   - `.svg` → `image/svg+xml`

2. Base64-encode the file using a shell command:
   ```bash
   base64 -i /path/to/image.png | tr -d '\n'
   ```

3. Construct the data URI and use it as the `src`:
   ```html
   <img src="data:image/png;base64,iVBORw0KGgo..." alt="Description" class="slide-media">
   ```

**Important notes:**
- This works for any image the user can reference — screenshots, diagrams, downloaded memes,
  photos, exported charts, etc.
- Base64 increases file size by ~33%, so very large images (>5MB) may make the HTML file unwieldy.
  For large images, suggest the user resize or compress first.
- Animated GIFs can be embedded as base64 but will be large. For animated content, prefer Giphy
  links when possible.
- The user may provide images by:
  - Using `@file` syntax: `@screenshot.png` or `@/Users/name/Desktop/diagram.png`
  - Pasting a file path: `/tmp/my-meme.jpg`
  - Saying "use this image" with a file reference in context
  - Dragging an image into the conversation

```html
<!-- Standard image/meme -->
<div class="slide" data-notes="[notes]">
  <div class="slide-label animate-in">—— LABEL</div>
  <h2 class="animate-in">Headline <span class="accent">with accent</span></h2>
  <div class="media-container animate-in">
    <img src="https://example.com/meme.gif" alt="Descriptive alt text" class="slide-media">
  </div>
  <div class="media-caption animate-in">Optional witty caption or context</div>
  <div class="source animate-in">Source / credit</div>
</div>

<!-- Giphy GIF example -->
<div class="slide" data-notes="[notes]">
  <div class="slide-label animate-in">—— LABEL</div>
  <h2 class="animate-in">Headline <span class="accent">with accent</span></h2>
  <div class="media-container animate-in">
    <img src="https://media.giphy.com/media/GIPHY_ID/giphy.gif" alt="Descriptive alt text" class="slide-media">
  </div>
  <div class="media-caption animate-in">Caption</div>
  <div class="source animate-in">via Giphy</div>
</div>
```

#### 10. Thank You Slide (Required — always the final slide)
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
- Add contextual notes with references, links, deeper explanations, and related resources that let viewers dive deeper into the slide's topic

### Step 5: Note Video & Media Opportunities
As you build the narrative, identify slides where a video or meme could strengthen the story —
a demo video after an architecture slide, a reaction meme to break tension after a dense section,
etc. **Do not insert Video or Media slides during initial generation.** Instead, note opportunities
in the contextual notes like:

```
[VIDEO OPPORTUNITY] A short demo of [feature] here would reinforce the architecture on the previous slide.
[MEME OPPORTUNITY] A well-placed meme here could break the tension after the dense comparison slide.
```

After delivering the deck, the post-generation prompt (see "Post-Generation: Video & Media Placement")
will guide the user to add these if they choose.

### Step 6: AI Image Opportunities
As you build slides, identify moments where a custom AI-generated image would elevate the deck.
For each opportunity, add a note in the contextual notes like:

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

  function pauseAllMedia() {
    // Pause HTML5 video elements on inactive slides
    document.querySelectorAll('.slide:not(.active) video').forEach(v => v.pause());
    // Pause YouTube/Vimeo iframes on inactive slides
    document.querySelectorAll('.slide:not(.active) iframe').forEach(f => {
      f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      f.contentWindow.postMessage('{"method":"pause"}', '*');
    });
  }

  function playActiveMedia() {
    // Autoplay HTML5 video on the active slide
    document.querySelectorAll('.slide.active video').forEach(v => v.play());
    // Autoplay YouTube/Vimeo iframes on the active slide
    document.querySelectorAll('.slide.active iframe').forEach(f => {
      f.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      f.contentWindow.postMessage('{"method":"play"}', '*');
    });
  }

  function show(i) {
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.style.display = j === i ? 'flex' : 'none';
    });
    currentEl.textContent = i + 1;
    pauseAllMedia();
    playActiveMedia();
    // Update contextual notes if visible
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
    if (e.target.closest('.controls') || e.target.closest('.notes-panel') || e.target.closest('.video-container') || e.target.closest('.media-container')) return;
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
- [ ] Contextual notes are present with references, links, and additional context for deeper exploration
- [ ] Sources are attributed on data slides
- [ ] At least one AI image opportunity is noted in contextual notes
- [ ] Icons (if used) load from jsDelivr CDN and display correctly in chosen mode
- [ ] Icons are used sparingly (2-3 per slide max) and enhance rather than clutter
- [ ] Red Hat Design Tokens CSS is loaded via jsDelivr CDN (`@rhds/tokens@3.0.2/css/global.min.css`)
- [ ] `color-scheme` is set correctly on `:root` (`dark` for Core Dark / Expressive Dark, `light` for Core Light)
- [ ] Spacing uses `--rh-space-*` tokens with px fallbacks (e.g., `var(--rh-space-lg, 24px)`)
- [ ] Typography sizing uses `--rh-font-size-*` tokens with fallbacks where appropriate
- [ ] Tags use `--rh-border-radius-pill` and `--rh-space-*` for padding
- [ ] Video slides (if any) use the thumbnail + click-to-embed pattern with `data-video-id` attributes
- [ ] Video slides (if any) include the protocol-aware JS handler (inline iframe on HTTP, new tab on file://)
- [ ] **User was informed** that inline video requires serving via HTTP/HTTPS (mandatory notification)
- [ ] Media slides (if any) have descriptive alt text on `<img>` tags
- [ ] Media/video containers are excluded from click-to-navigate (click guard in JS)
- [ ] File is self-contained (no external dependencies besides Google Fonts, jsDelivr icons, jsDelivr design tokens, and user-provided video/image URLs)
- [ ] Progress indicator shows current/total slides
- [ ] The narrative follows a clear story arc with emotional rhythm
- [ ] **Thank You slide** is present as the final slide with author name, role, and Red Hat logo
- [ ] The accent word(s) in the title slide headline are colored red-50 for emphasis
- [ ] Video/media opportunities are noted in contextual notes (not inserted during initial generation)
- [ ] **Post-generation prompt** was shown to the user after delivering the deck, offering to add videos or memes

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

## Post-Generation: Video & Media Placement

Video and media slides are **not** part of the initial deck generation. They are added in a second
pass after the user has reviewed the generated deck structure. This keeps the initial creation
focused on narrative flow, and lets the user make informed decisions about where media fits.

### Workflow

After delivering the initial deck, **always prompt the user** with:

> "Would you like to add any **videos** or **memes / images** to the deck? If so, tell me:
> 1. The **URL** of the video or image — or a **local file path** / `@file` reference for images on your machine
> 2. **Where** it should go — **in** an existing slide, **before/after** a specific slide, or **replacing** a slide
>
> You can add as many as you'd like, one at a time or all at once."

### Placement Rules

When the user provides a URL and placement:

1. **Identify the media type** from the source:
   - YouTube / Vimeo links → Video embed (thumbnail-first pattern)
   - Direct `.mp4` / `.webm` / `.ogg` → Video embed
   - Giphy links (`giphy.com`, `gph.is`, `media.giphy.com`) → Media embed (convert to direct GIF URL)
   - Image URLs (`.jpg`, `.png`, `.gif`, `.webp`, `.svg`) or meme links → Media embed
   - Imgflip links → Media embed (convert to full-size template URL)
   - **Local file path or `@file` reference** → Media embed (base64-encode and inline as data URI)
   - If ambiguous, ask the user

2. **Placement modes** (default to "in" for content-rich slides, "after" for standalone media):

   - **"In slide 3"** → embed the video/media directly into the existing slide, below the headline
     and body text. Keep the slide's existing content and add a `.video-container` or
     `.media-container` after the body content. Reduce body text if needed to prevent overflow.
     Best for: adding a demo video to an architecture slide, a supporting image to a content slide,
     or a reaction meme alongside a quote.

   - **"After slide 3"** → insert a new dedicated Video/Media slide between current slides 3 and 4.
     Best for: standalone videos or memes that deserve their own moment in the narrative.

   - **"Before slide 5"** → insert a new dedicated slide before slide 5.

   - **"Replace slide 4"** → swap slide 4's content with a Video/Media slide, keeping the
     narrative position.

3. **For new standalone slides**, write a headline that fits the surrounding narrative context. Use
   the headlines of the adjacent slides to maintain story flow. Ask the user if you're unsure what
   headline to use.

4. **For in-slide embeds**, keep the existing headline and body content. Add the media below the
   body text. If the slide becomes too crowded, offer to move some body text into contextual notes
   or split into two slides.

5. **Preserve the navigation JS** — no changes needed; the `show()` function already handles
   autoplay/pause for any Video or Media slides in the deck.

6. **Update the slide count** in the progress indicator if slides were added (the JS handles this
   automatically via `slides.length`).

7. **Re-deliver the updated file** and ask if the user wants to add more or adjust placement.

### Iterative Refinement

The user may want to:
- Add multiple videos/memes in one pass — process all of them
- Move a video/meme to a different position — remove from old spot, insert at new spot
- Remove a video/meme they added — delete that slide
- Change the caption or headline on a media slide

Support all of these as natural follow-up edits after the initial placement.

## Tips for Viewers

Include these tips in the first contextual note:
- Arrow keys or click to navigate
- Press 'N' to toggle contextual notes — references, links, and additional context for each slide
- Works in any modern browser — share the HTML file directly
- For best results, use fullscreen (F11) or present in a browser tab
