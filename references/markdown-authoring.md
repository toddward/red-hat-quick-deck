# Markdown Authoring Reference

> This reference describes how to author Red Hat Quick Deck presentations as
> **Marp markdown** (the preferred mode when Bash/shell is available).
>
> For the HTML-direct fallback (used when no shell is available — Claude web,
> Gemini Gems), see the slide-type sections in `SKILL.md` itself. The visual
> output is identical between the two modes.

## When to use markdown mode

Use markdown authoring when **Bash/shell is available** in your environment.
Signals that shell is available:

- Claude Code CLI or desktop app
- Terminal access via MCP / Cursor / OpenCode
- Any environment where you can run `node scripts/render.mjs ...`

Use HTML authoring (see `SKILL.md`) when shell is **not** available:

- Claude.ai web chat (no sandboxed shell)
- Google Gemini Gems
- Environments where the only output is a chat message

When in doubt, try markdown mode and fall back to HTML if the render fails.

## Deliverables

Markdown mode produces **two files** per request:

1. `<deck-slug>.md` — the editable Marp source. Give this to users who want to
   tweak wording, reorder slides, or re-render.
2. `<deck-slug>.html` — the self-contained shareable deck. Same visual output
   as the HTML-authored path. Can be emailed, hosted, or opened offline.

Save both to `/mnt/user-data/outputs/` (or the session output dir) and present
both to the user. Remind them that the `.md` is the source of truth — edits
to the `.html` will be overwritten on re-render.

## YAML front-matter

Every deck starts with front-matter:

```yaml
---
marp: true
theme: rhqd
title: Platform Engineering Isn't a Team — It's a Promise
author: Red Hat Quick Deck
paginate: false
class: mode-dark          # or mode-light, mode-expressive (Phase 2)
---
```

- `theme: rhqd` is **required** — selects the Red Hat Quick Deck theme.
- `class: mode-dark` is the default; omit or set to `mode-light` / `mode-expressive`.
- `title:` drives the `<title>` tag in the rendered HTML.
- `paginate: false` hides Marpit's default pagination (we draw our own).

## Slide separators

Slides are separated by `---` on its own line (same as normal markdown).

## Slide-type directives

Each slide's type is declared with a local directive comment:

```markdown
<!-- _class: title -->
```

Valid classes (Phase 1): `title`, `content`, `stat`, `quote`, `cta`, `thankyou`.
Phase 2 adds: `comparison`, `architecture`, `video`, `media`.

If you omit `_class`, the slide renders as generic content.

## Contextual notes

Notes use HTML comments prefixed with `notes:` — the render script extracts
them and injects as `data-notes` attributes. The existing press-'N' notes
panel reads them at runtime.

```markdown
<!-- notes:
References:
- [State of Platform Engineering 2025](https://...)
- [Team Topologies](https://teamtopologies.com/)

[VIDEO OPPORTUNITY] 30-second demo of the platform workflow here.
[IMAGE OPPORTUNITY] Nano Banana prompt: "abstract red nebula, no text, 16:9"
-->
```

Only comments starting with `notes:` are picked up. Other HTML comments
(`<!-- TODO -->`, etc.) are ignored.

Include the first slide's notes with viewer tips:
- Arrow keys or click to navigate
- Press 'N' to toggle contextual notes
- Works in any modern browser — share the HTML file directly

## Slide type patterns

### 1. Title

The Red Hat logo is auto-injected into `.breadcrumb` by the render script. Do
**not** embed the logo SVG manually unless you want to opt out of injection.

```markdown
<!-- _class: title -->

<div class="breadcrumb">› RED HAT · NAPS STP WORKING GROUP</div>

<div class="slide-label">—— INTERNAL DEVELOPER PLATFORMS · APR 20, 2026</div>

# Your AI Assistant Should _Live Where You Work_

A fully local, air-gap-ready AI stack for teams that cannot trust the cloud.

<div class="tags">
  <span class="tag">Local-First</span>
  <span class="tag">Air-Gap Ready</span>
  <span class="tag accent">Red Hat Native</span>
</div>

<div class="attribution">Todd Wardzinski · Architect · Red Hat</div>

<!-- notes:
Tips for viewers:
- Arrow keys or click to navigate
- Press 'N' to toggle contextual notes
- Share the HTML file directly; no build step required
-->
```

Italics in the headline (`_word_`) render as red-accented italic text.

### 2. Content

```markdown
<!-- _class: content -->

<div class="slide-label">—— THE PROBLEM</div>

## Cloud AI Can't Reach _Every_ Workbench

- **Secure facilities** block outbound traffic.
- **Regulated industries** can't send code to third parties.
- **Intermittent connectivity** breaks agent flows.

<div class="source">Source: Red Hat State of Enterprise Open Source 2025</div>
```

### 3. Big Number / Stat

```markdown
<!-- _class: stat -->

<div class="slide-label">—— THE IMPACT</div>

# <span class="big-number">73%</span>

of engineering orgs with mature internal platforms ship _more than 2x_ faster than those without.

<div class="source">Source: CNCF State of Platform Engineering 2025 · n=1,847</div>
```

The `<span class="big-number">` wrapper is what triggers the giant-red-number
styling. The `#` is a visual anchor for markdown structure and is styled down
to match the big-number size.

### 4. Quote

```markdown
<!-- _class: quote -->

<div class="slide-label">—— PRINCIPLE</div>

> You can't buy a platform. You can only buy _components_. The platform is what you build from those components to serve *your* developers.

<div class="attribution">— Manuel Pais, co-author of <em>Team Topologies</em></div>
```

The large decorative `"` quote mark is auto-rendered via `::before` on the
blockquote.

### 5. CTA / Call-to-Action

```markdown
<!-- _class: cta -->

<div class="slide-label">—— NEXT STEPS</div>

# Start With _One_ Paved Road

Pick the most common service shape, build a proper golden path, and measure the time from `git init` to production.

- **Week 1** — Identify the three most-shipped service archetypes
- **Month 1** — Productionize one golden path end-to-end (template → deploy)
- **Quarter 1** — Publish platform SLOs and retire the ticket queue

<div class="source">One solid paved road beats ten unfinished ones.</div>
```

### 6. Thank You (required — always the last slide)

The large Red Hat logo is auto-injected. Do not embed the SVG manually.

```markdown
<!-- _class: thankyou -->

# Thank _You_

Questions, corrections, and war stories welcome.

<div class="attribution">Red Hat · Platform Engineering · Quick Deck</div>
```

### 7. Comparison (two-column)

Use `<div class="compare">` with two `<div class="compare-col">` children and
an optional middle `<div class="compare-vs">` separator. Add `.preferred` to
the recommended column for the red border + red heading.

```markdown
<!-- _class: comparison -->

<div class="slide-label">—— COMPARISON</div>

## The _Old Way_ vs. The _New Way_

<div class="compare">
  <div class="compare-col">
    <h3>Without a platform</h3>
    <ul>
      <li>Tickets queue for days</li>
      <li>Every team reinvents CI</li>
    </ul>
  </div>
  <div class="compare-vs">VS</div>
  <div class="compare-col preferred">
    <h3>With a paved road</h3>
    <ul>
      <li>First deploy in 15 minutes</li>
      <li>CI and observability templated</li>
    </ul>
  </div>
</div>
```

### 8. Architecture / Diagram

Use `<div class="arch-flow">` wrapping `<div class="arch-box">` components
with optional `<div class="arch-arrow">→</div>` separators. Add `.highlight`
to the key innovation box.

```markdown
<!-- _class: architecture -->

## A _Three-Layer_ Platform

<div class="arch-flow">
  <div class="arch-box">
    <h3>Developer Portal</h3>
    <p>Self-service catalog of templates.</p>
  </div>
  <div class="arch-arrow">→</div>
  <div class="arch-box highlight">
    <h3>Golden Paths</h3>
    <p>Opinionated templates with CI baked in.</p>
  </div>
  <div class="arch-arrow">→</div>
  <div class="arch-box">
    <h3>Platform Runtime</h3>
    <p>The shared substrate teams target.</p>
  </div>
</div>
```

Arrows render in red. Boxes use subtle surface color with a dark border;
the `.highlight` class adds the red border and a faint red background.

### 9. Video

YouTube / Vimeo / direct MP4. Use `.video-container` with `data-video-id`
for YouTube. The shell's JS handles the click: HTTP/HTTPS embeds the
iframe inline; `file://` opens YouTube in a new tab.

```markdown
<!-- _class: video -->

<div class="slide-label">—— DEMO</div>

## See It _Live_

<div class="video-container" data-video-id="VIDEO_ID">
  <img class="video-thumbnail" src="https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg" alt="Demo">
  <div class="video-play-btn"></div>
</div>

<div class="media-caption">Click play — inline on HTTP, new tab on file://.</div>
```

**Required reminder to the user**: tell them inline playback requires
serving via HTTP (`python3 -m http.server`). On `file://`, clicking the
thumbnail opens YouTube in a new tab.

URL conversion rules (apply when the user provides a URL):
- `https://www.youtube.com/watch?v=ID` → use `ID` in `data-video-id`
- `https://youtu.be/ID` → same
- `https://vimeo.com/ID` → adapt the embed URL pattern
- Direct `.mp4/.webm/.ogg` → use `<video controls muted>` in place of the
  thumbnail + play button

### 10. Media (memes, GIFs, images, Giphy)

```markdown
<!-- _class: media -->

<div class="slide-label">—— REACTION</div>

## When the _First_ Ship Lands

<div class="media-container">
  <img class="slide-media" src="https://media.giphy.com/media/ID/giphy.gif" alt="Reaction GIF">
</div>

<div class="media-caption">A well-placed meme breaks tension.</div>
```

URL conversion rules:
- Giphy `https://giphy.com/gifs/SLUG-ID` → `https://media.giphy.com/media/ID/giphy.gif`
- Imgflip templates → `https://imgflip.com/s/meme/Template-Name.jpg` (full size)
- Local files (`@file`, relative paths, `/absolute/path`, or `file://`) →
  the render script base64-encodes them automatically. Just reference the
  path in the `src` attribute. Supported: `.png .jpg .jpeg .gif .webp .svg`.

## Rendering

From the repo root:

```bash
node scripts/render.mjs path/to/deck.md              # outputs deck.html next to it
node scripts/render.mjs deck.md --out /mnt/user-data/outputs/deck.html
node scripts/render.mjs deck.md --mode light         # override front-matter mode
```

The renderer:

- Loads `themes/red-hat-quick-deck.css`
- Runs Marpit over the markdown
- Extracts `notes:` comments → `data-notes` attributes
- Auto-injects the Red Hat logo into title + thankyou slides
- Composes the final HTML with the shell from `templates/shell.html` and
  `templates/shell-js.js`
- Writes a single self-contained HTML file

## Quality checklist (markdown mode)

Before delivering, verify:

- [ ] Front-matter has `theme: rhqd`
- [ ] Mode directive set (`class: mode-dark` or similar)
- [ ] All slides have a `<!-- _class: ... -->` directive (except default content)
- [ ] Title slide's breadcrumb is present (logo auto-injects into it)
- [ ] Thank-You slide is the last slide
- [ ] Each slide's `notes:` comment block is populated with references,
      [VIDEO OPPORTUNITY] / [MEME OPPORTUNITY] / [IMAGE OPPORTUNITY] markers,
      or deeper context
- [ ] The HTML was re-rendered from the markdown (not hand-edited after render)
- [ ] Both `.md` and `.html` files are delivered to the user

All other checks from `SKILL.md`'s Quality Checklist still apply.

## Re-rendering after edits

When a user edits the markdown and wants a fresh HTML:

```bash
node scripts/render.mjs path/to/edited-deck.md
```

The render overwrites the `.html` in place. Remind users: edit the `.md`, not
the `.html` — HTML edits are destroyed on re-render.
