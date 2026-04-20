---
marp: true
theme: rhqd
title: Every Slide Type — A Phase 2 Showcase
author: Red Hat Quick Deck
paginate: false
class: mode-dark
---

<!-- _class: title -->

<div class="breadcrumb">› PHASE 2 · VISUAL SHOWCASE</div>

<div class="slide-label">—— EVERY SLIDE TYPE · APR 20, 2026</div>

# Every Slide Type, _One Deck_

Comparison, architecture, video, media, stat, quote, CTA — all cinematic, all brand-safe.

<div class="tags">
  <span class="tag">Core Dark</span>
  <span class="tag">Phase 2</span>
  <span class="tag accent">Showcase</span>
</div>

<div class="attribution">Red Hat Quick Deck · MARP Integration</div>

<!-- notes:
This deck covers every supported slide type in the MARP-based pipeline.
Use it as a visual reference when choosing a layout for your own content.

Viewer tips:
- Arrow keys or click to navigate
- Press 'N' to toggle these contextual notes
- Share the .html file directly, or edit the .md and re-render

[IMAGE OPPORTUNITY] Nano Banana prompt: "abstract red cosmic nebula
with glowing filaments, cinematic, pure black background, 16:9, no text"
-->

---

<!-- _class: content -->

<div class="slide-label">—— CONTENT</div>

## Assertions, _Not_ Labels

Write every headline as a claim. The headline alone should carry the slide.

- **Body text uses Red Hat Text** — readable at projector distances.
- **Bold marks the hinge word** — scanning readers catch the meaning.
- **Inline code like `kubectl apply -f`** gets a subtle surface + mono font.
- **Bullets are rare by design** — prose reads better than fragments.

<div class="source">Principle: one idea per slide; the headline carries it.</div>

<!-- notes:
Content slides are the workhorse. Use them for most of your deck —
analysis, observations, arguments. Keep bullets to 3-5 items; prefer
full sentences to fragments.

[VIDEO OPPORTUNITY] A B-roll of a dev workstation here could warm up
the section.
-->

---

<!-- _class: comparison -->

<div class="slide-label">—— COMPARISON</div>

## The _Old Way_ vs. The _Paved Road_

<div class="compare">
  <div class="compare-col">
    <h3>Without a platform</h3>
    <ul>
      <li>Tickets queue for days before first deploy</li>
      <li>Every team reinvents CI scaffolding</li>
      <li>Secrets handling is "ask the SRE"</li>
      <li>No shared SLOs — everyone improvises</li>
    </ul>
  </div>
  <div class="compare-vs">VS</div>
  <div class="compare-col preferred">
    <h3>With a paved road</h3>
    <ul>
      <li>First deploy in under 15 minutes</li>
      <li>CI and observability are templated</li>
      <li>Secrets flow through blessed primitives</li>
      <li>Platform SLOs are published and enforced</li>
    </ul>
  </div>
</div>

<!-- notes:
The comparison slide works best when the two columns have the same
number of points. The `preferred` class on a column adds the red
border and heading color to mark the recommended side.
-->

---

<!-- _class: architecture -->

<div class="slide-label">—— ARCHITECTURE</div>

## A _Three-Layer_ Platform

<div class="arch-flow">
  <div class="arch-box">
    <h3>Developer Portal</h3>
    <p>Self-service catalog of runtime templates, observability, and deploy targets.</p>
  </div>
  <div class="arch-arrow">→</div>
  <div class="arch-box highlight">
    <h3>Golden Paths</h3>
    <p>Opinionated templates with CI, SBOM, and blessed secrets baked in.</p>
  </div>
  <div class="arch-arrow">→</div>
  <div class="arch-box">
    <h3>Platform Runtime</h3>
    <p>Kubernetes, Argo, Kyverno — the shared substrate every team targets.</p>
  </div>
</div>

<div class="source">The middle layer is the platform. Everything else is infrastructure.</div>

<!-- notes:
Architecture slides use the `.arch-flow` container with `.arch-box`
children and optional `.arch-arrow` separators. Add `.highlight` to
the key innovation box for a red border and subtle red tint.
-->

---

<!-- _class: stat -->

<div class="slide-label">—— IMPACT</div>

# <span class="big-number">15×</span>

faster onboarding to first production deploy — paved roads measured _end-to-end_ from `git init` to traffic.

<div class="source">Internal benchmark · Red Hat Platform Engineering 2026</div>

<!-- notes:
Big-number slides work best with stats where the magnitude itself is
the story. Use the `<span class="big-number">` wrapper inside the
`#` heading so the 100px red number renders correctly.
-->

---

<!-- _class: video -->

<div class="slide-label">—— DEMO</div>

## See It _Live_

<div class="video-container" data-video-id="dQw4w9WgXcQ">
  <img class="video-thumbnail" src="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="Demo video thumbnail">
  <div class="video-play-btn"></div>
</div>

<div class="media-caption">Click play — on HTTP inline; on file:// opens in a new tab.</div>

<!-- notes:
Video slides use a raw HTML block with `.video-container` and a
`data-video-id` attribute set to the YouTube ID. The shell JS detects
protocol: HTTP/HTTPS embeds the iframe inline; file:// opens YouTube
in a new tab (browsers block iframe embeds from file://).

Tell the viewer: inline video requires serving the HTML over HTTP,
e.g. `python3 -m http.server`.
-->

---

<!-- _class: media -->

<div class="slide-label">—— REACTION</div>

## When the _First_ Paved Road Ships

<div class="media-container">
  <img class="slide-media" src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Celebration reaction GIF">
</div>

<div class="media-caption">A well-placed meme breaks tension and signals emotional rhythm.</div>

<!-- notes:
Media slides support images, memes, and animated GIFs. Use
`.media-container` wrapping an `<img>` with `.slide-media`. For local
files, the render script will base64-encode them into the HTML
automatically — just reference the path.

Imgflip, Giphy, and direct image URLs all work. The render script
leaves remote URLs alone and only embeds local files.
-->

---

<!-- _class: quote -->

<div class="slide-label">—— PRINCIPLE</div>

> Tools are necessary but _not sufficient_. A platform is what emerges from the combination of components, contracts, and on-call commitment.

<div class="attribution">— Working-group summary, Red Hat Platform Eng, 2026</div>

<!-- notes:
Quote slides render a markdown blockquote with a decorative red
opening quote mark via `::before`. Attribute below with
`<div class="attribution">`. Keep the quote short enough to read at
projector distance — under 30 words is ideal.
-->

---

<!-- _class: cta -->

<div class="slide-label">—— NEXT STEPS</div>

# Pick _One_ Golden Path

Commit to productionizing a single service archetype end-to-end before you scale.

- **This week** — identify the three most-shipped service shapes
- **This month** — ship a working template + CI + deploy pipeline
- **This quarter** — retire the ticket queue for that shape

<div class="source">Platform maturity is a sequence of small, boring wins.</div>

<!-- notes:
CTA slides cap the narrative with concrete actions. Three time-boxed
commitments tends to work well. Use `_italic_` in the headline for a
red-accent emphasis on the hinge word.
-->

---

<!-- _class: thankyou -->

# Thank _You_

Questions, corrections, and war stories welcome.

<div class="attribution">Red Hat Quick Deck · Phase 2 Showcase</div>

<!-- notes:
The thankyou slide auto-injects the large Red Hat logo at the bottom
via the render script. Don't embed the SVG manually.
-->
