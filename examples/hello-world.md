---
marp: true
theme: rhqd
title: Phase 0 Spike — Marpit Pipeline Works
author: Quick Deck
paginate: false
---

<!-- _class: title -->

<div class="breadcrumb">› PHASE 0 · SPIKE</div>

<div class="slide-label">—— MARP INCLUSION · APR 20, 2026</div>

# Phase 0 Spike: _Marpit_ Pipeline Works

Proving the render architecture end-to-end before committing to full theme parity.

<div class="tags">
  <span class="tag">Marpit</span>
  <span class="tag">Core Dark</span>
  <span class="tag accent">Spike</span>
</div>

<div class="attribution">Phase 0 · Architecture Validation</div>

<!-- notes:
This is the Phase 0 validation deck. Three slides prove:

1. Marpit renders markdown to `<section>` elements
2. Theme CSS loads and palette applies
3. HTML-comment notes are extracted and injected as `data-notes` attributes
4. The shell's 'N' key toggle reads those attributes correctly

If you can read this note after pressing **N**, the notes pipeline works.
-->

---

<!-- _class: content -->

<div class="slide-label">—— PROOF POINTS</div>

## What the _Spike_ Validates

- Marpit `render()` returns the expected `{html, css, comments}` triple
- Custom theme CSS compiles without a CSS reset fight
- `<!-- notes: -->` extraction is working per-slide
- Navigation JS queries `section` selectors correctly
- The ambient red glow renders on every slide

<div class="source">Later phases expand palettes, slide types, and media handling.</div>

<!-- notes:
References:
- Marpit API docs: https://marpit.marp.app/
- Render script: scripts/render.mjs
- Theme: themes/red-hat-quick-deck.css

[VIDEO OPPORTUNITY] A 20-second clip showing an author editing this
markdown, rerunning the render script, and seeing the HTML update would
sell the "easy post-edit" value prop cleanly.
-->

---

<!-- _class: thankyou -->

# Spike _Complete_

If you can see this slide, the architecture is viable.

<!-- notes:
Next: Phase 1 — full Core Dark feature parity for simple decks.
-->
