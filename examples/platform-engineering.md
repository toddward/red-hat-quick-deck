---
marp: true
theme: rhqd
title: Platform Engineering Isn't a Team — It's a Promise
author: Red Hat Quick Deck
paginate: false
---

<!-- _class: title -->

<div class="breadcrumb">› PLATFORM ENGINEERING WORKING GROUP</div>

<div class="slide-label">—— INTERNAL DEVELOPER PLATFORMS · APR 20, 2026</div>

# Platform Engineering _Isn't a Team_ — It's a Promise

A shared contract that developers can ship safely, quickly, and without waiting on humans.

<div class="tags">
  <span class="tag">Internal Platforms</span>
  <span class="tag">Golden Paths</span>
  <span class="tag accent">Self-Service</span>
</div>

<div class="attribution">Red Hat · Platform Engineering · Quick Deck</div>

<!-- notes:
References:
- [CNCF State of Platform Engineering 2025](https://www.cncf.io/reports/state-of-platform-engineering-2025/)
- [Team Topologies: Organizing for Fast Flow](https://teamtopologies.com/)
- [Gartner 2025: Platform Engineering Adoption](https://www.gartner.com/)

Tips for viewers:
- Arrow keys or click to navigate
- Press 'N' to toggle these contextual notes
- Works in any modern browser — share the HTML file directly

[IMAGE OPPORTUNITY] Nano Banana Pro 2 prompt:
"abstract dark red architectural blueprint with glowing connection
nodes on pure black background, cinematic 16:9, no text, Red Hat red
(#ee0000) accents"
-->

---

<!-- _class: content -->

<div class="slide-label">—— THE PROBLEM</div>

## Most "Platforms" Are _Just Tickets_ With a Dashboard

When every workflow routes through a human, the platform becomes the bottleneck it was meant to eliminate.

- **Tickets don't scale.** One SRE per fifty developers means four-day queues.
- **"Self-service" with ten approvals isn't self-service.** It's gatekeeping with a prettier UI.
- **Documentation isn't a platform.** It's instructions for doing work the platform should have done.

<div class="source">Source: Red Hat State of Enterprise Open Source 2025</div>

<!-- notes:
The classic anti-pattern: teams rebrand the ops team as "platform team,"
add a Backstage UI, and declare victory — while every PR still waits on
a human to click approve.

The real test: can a new service go from `git init` to production with
zero tickets? If not, the platform is incomplete.

[VIDEO OPPORTUNITY] A 30-second clip of a developer shipping a service
end-to-end without a single Slack DM would land this viscerally.
-->

---

<!-- _class: stat -->

<div class="slide-label">—— THE IMPACT</div>

# <span class="big-number">73%</span>

of engineering orgs with mature internal platforms ship _more than 2x_ faster than those without.

<div class="source">Source: CNCF State of Platform Engineering 2025 · n=1,847</div>

<!-- notes:
The 73% figure comes from the CNCF's 2025 survey. The 2x multiplier on
deploy frequency is the median; top-quartile orgs report 5-8x.

The gap widens with scale. Small teams see modest gains; orgs over
500 engineers see the biggest multipliers because coordination cost
compounds.

Caveat: "mature" is doing a lot of work in that sentence. The survey
defines mature as: golden paths for ≥3 runtimes, <15min onboarding to
first deploy, platform SLOs published.
-->

---

<!-- _class: content -->

<div class="slide-label">—— GOLDEN PATHS</div>

## A Good Platform Has _Opinions_

Paved roads are faster than dirt tracks. Make the default choice the right choice.

- **Runtime templates** — pre-wired observability, secrets, and tracing
- **Blessed CI/CD** — security scanning and SBOM generation built in
- **Deployment contracts** — explicit SLOs, rollback behavior, blast radius
- **Escape hatches** — opinions should be overridable, never locked in

<div class="source">Every paved road should have a clearly-marked off-ramp.</div>

<!-- notes:
The tension here is between enforcement and enablement. A platform that
forbids deviation becomes a new kind of bureaucracy. A platform with
no defaults forces every team to rebuild the same scaffolding.

The sweet spot: defaults that are the right choice 80% of the time,
with a clear process for the 20% who need something different —
including a path back to the paved road when the custom thing
becomes a burden.
-->

---

<!-- _class: quote -->

<div class="slide-label">—— PRINCIPLE</div>

> You can't buy a platform. You can only buy _components_. The platform is what you build from those components to serve *your* developers.

<div class="attribution">— Manuel Pais, co-author of <em>Team Topologies</em></div>

<!-- notes:
This is the most important slide in the deck. The vendor pitch — "buy
our platform" — misunderstands what a platform is.

Tools are necessary but not sufficient. The platform emerges from the
combination of tools + contracts + on-call commitments + evolution
cadence. It's a product, not a purchase.

Related reading:
- Team Topologies, Chapter 5 (Platform Team patterns)
- Evan Bottcher: "What I Talk About When I Talk About Platforms"
-->

---

<!-- _class: cta -->

<div class="slide-label">—— NEXT STEPS</div>

# Start With _One_ Paved Road

Pick the most common service shape, build a proper golden path for it, and measure the time from `git init` to production.

- **Week 1** — Identify the three most-shipped service archetypes
- **Month 1** — Productionize one golden path end-to-end (template → deploy)
- **Quarter 1** — Publish platform SLOs and retire the ticket queue for path users

<div class="source">One solid paved road beats ten unfinished ones.</div>

<!-- notes:
Contact:
- Red Hat Platform Engineering: redhat.com/platform
- Internal working group: #platform-eng on Slack
- Quarterly roadmap: docs.platform.redhat.com/roadmap

[IMAGE OPPORTUNITY] Nano Banana Pro 2 prompt:
"single glowing red paved road cutting through a dark abstract
landscape of tangled dirt trails, cinematic lighting, 16:9, no text"
-->

---

<!-- _class: thankyou -->

# Thank _You_

Questions, corrections, and war stories welcome.

<div class="attribution">Red Hat · Platform Engineering · Quick Deck</div>

<!-- notes:
Deck generated via red-hat-quick-deck skill on the feature/marp-inclusion
branch. Edit the source at examples/platform-engineering.md and re-render
with `node scripts/render.mjs examples/platform-engineering.md`.
-->
