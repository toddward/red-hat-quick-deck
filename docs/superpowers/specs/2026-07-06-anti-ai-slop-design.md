# Anti-AI-Slop Enforcement — Design

**Branch:** `bugfix/ai-slop`
**Date:** 2026-07-06
**Status:** Design — awaiting review before implementation planning

## Problem

The Red Hat Quick Deck skill generates slide copy that reads as "AI slop" — the
predictable phrasings, rhetorical structures, and cadences that signal a machine
wrote it. The skill has **no voice guidance today**. `references/story-arcs.md`
governs narrative *structure* (assertion headlines, one-idea-per-slide) but says
nothing about *prose voice*, so whether a deck comes out clean depends on the
model's mood rather than any enforced rule.

The slop is mostly the **subtle, structural** kind, not obvious buzzwords. A scan
of the one real deck in the repo (`codex-vs-claude-quick-deck.html`) found zero
"leverage/seamless"-class tells, zero em-dashes, and concrete assertion headlines
— yet the concern about slop is real. A naive word-blocklist would not have caught
anything in that deck. The fix has to target rhetorical structure, not just vocabulary.

The user's requirement, verbatim: the skill should be "very sensitive to these
repetitive ai speech patterns … always enforced and validated."

## Goals

1. Give the skill an explicit, adapted voice/anti-slop catalog it applies *while
   writing* — during arc selection, outlining, and slide copy.
2. Add a **non-negotiable pre-delivery gate**: the model self-reviews every text
   element against a checklist and a scoring rubric, and revises before emitting HTML.
3. Add a **deterministic linter** as a backstop for the machine-checkable subset
   (lexical tells + a few regex-detectable structures).
4. Embed the `stop-slop` skill (https://github.com/hardikpandya/stop-slop, MIT) as
   the source catalog, **adapted for the slide medium**, with proper attribution.
5. Land everything on the canonical distribution surface so every Red Hatter who
   installs the skill inherits it.

## Non-Goals

- **Full NLP / guaranteed detection.** The linter covers lexical tells and a small
  set of regex-detectable structures. Structural/rhetorical slop is the model's job
  via the gate. The docs state this plainly — no false "the linter guarantees clean."
- **Git hook / CI integration.** The linter is model-invoked as part of the gate.
  Decks are generated ad hoc; a commit hook is the wrong shape.
- **Retroactively rewriting existing decks.** The one clean deck is reused as a
  regression fixture; we do not sweep old output.
- **Gemini Gem parity.** `gemini-gem-prompt.md` is now best-effort/optional (user:
  "I really don't care about the gemini prompt anymore"). Not in core scope.

## Decisions Locked (from brainstorming)

- **Enforcement strength:** full — self-review gate **plus** linter script.
- **Embed fidelity:** adapt stop-slop for slides (not verbatim, not lexical-only).
- **Rule of Three:** soften/reframe — keep as one option, kill the default reflex +
  padding + staccato tricolon, bless deliberate sparing use. (Not retired, not kept.)
- **Distribution:** `SKILL.md` + `references/` + rebuilt `.skill` are canonical;
  Gemini optional.

## Architecture — Three Enforcement Layers

Defense in depth across the three moments the user named ("sensitive during design"
+ "enforced" + "validated"):

| Layer | When | What | Home |
|---|---|---|---|
| **1. Woven guidance** | Choosing arc + writing copy | Model writes anti-slop by default: arc is a spine not a template, headlines are concrete assertions, no hype register | `SKILL.md` "Building the Narrative" edits + `story-arcs.md` |
| **2. Self-review gate** *(non-negotiable)* | After draft, before HTML | Run 12-point Quick Checks on every headline / eyebrow / bullet / stat caption / notes paragraph; score deck on 5 dimensions; **revise if < 35/50** | New hard-gate section in `SKILL.md` |
| **3. Linter backstop** *(deterministic)* | Inside the gate | `node scripts/slop-lint.mjs deck.html deck.md` → reports `file:line` + rule, non-zero exit on hits; model fixes all hits | New `scripts/` |

Layer 2 is the primary defense — it is the only layer that catches structural slop.
Layer 3 is an honest backstop for the low-hanging lexical fruit.

## New Files

### `references/anti-ai-slop.md`

Vendored from stop-slop, adapted for slides. MIT attribution to Hardik Pandya in the
header (copyright + permission notice, satisfying MIT for substantial portions).
Sections:

- **Banned phrases** — throat-clearing openers, emphasis crutches, business-jargon
  table (avoid → use instead), adverbs, meta-commentary, vague declaratives. (from
  stop-slop `phrases.md`)
- **Banned structures** — binary contrasts ("not X, it's Y"), negative listing,
  rhetorical setups, false agency, narrator-from-a-distance, passive voice, Wh-
  openers. (from stop-slop `structures.md`)
- **Slide adaptations** — the four deltas below, clearly marked as the divergence
  from verbatim stop-slop.
- **Scoring rubric** — 5 dimensions (Directness, Rhythm, Trust, Authenticity,
  Density), rate 1–10, revise if < 35/50, slide-lensed.
- **Before/after examples** — rewritten as slide copy (headline + bullets), not
  essay paragraphs.

A header note points to `scripts/slop-patterns.mjs` as the machine-checkable subset
and says to keep the two in sync.

### `scripts/slop-patterns.mjs`

Single source of truth for the linter's patterns. Exports arrays of
`{ id, regex, message, severity }`. The linter imports this; the reference doc
mirrors it in prose. Categories: lexical phrases, adverbs, jargon, binary-contrast
family, em-dash, "here's what/this/that", Wh- headline starters, staccato triads,
lazy extremes.

### `scripts/slop-lint.mjs`

Node ESM, **built-ins only** (fs, path, process) so it runs anywhere Node exists —
no dependency install. Behavior:

- **Usage:** `node scripts/slop-lint.mjs <file…>` — accepts `.html` and `.md`.
- **HTML:** scan line-by-line; strip `<script>`/`<style>` blocks and tags to get
  visible text per line; match patterns on the stripped text; report the original
  line number + matched snippet + rule id.
- **MD:** scan lines directly; skip fenced code blocks.
- **Output:** grouped by file — `path:line  [rule-id]  "…snippet…"  message`, then a
  summary count. `process.exit(errorHits > 0 ? 1 : 0)`.
- **Flags:** `--quiet` (summary only). Keep the surface minimal.
- Severity field exists for future tuning; only `error`-severity hits force non-zero
  exit.

### `scripts/slop-lint.test.mjs` + `scripts/__fixtures__/`

`node --test` suite:

- `__fixtures__/sloppy.html` (deliberately slop-ridden) → asserts non-zero exit and
  that specific rule ids fire (em-dash, binary-contrast, a buzzword, a Wh- opener).
- `__fixtures__/clean.html` → asserts zero hits.
- **Regression:** assert the real `codex-vs-claude-quick-deck.html` passes with zero
  errors — guards against false positives on genuinely good copy.

## The Four Slide Adaptations (delta from verbatim stop-slop)

1. **Rule of Three → reframed (not banned).** `story-arcs.md`'s "three benefits,
   three use cases, three proof points" loses its default/privileged status. New rule:
   three is one option among counts (1–4); use the count the content genuinely
   supports; **never pad to a target count for rhythm**; **never use the staccato
   tricolon** ("Faster. Smarter. Better." / "Speed. Quality. Cost. That's it.").
   Deliberate tricolon stays **blessed — sparingly** — for a single high-emphasis beat
   (a title line or the close), not a per-slide default. Keeps the rhetorical power,
   kills only the mechanical reflex.
2. **Fragments → allowed for bullets, banned when performative.** "Air-gapped.
   On-prem. Yours." (a stat slide) is fine. "Speed. Quality. Cost. That's it. That's
   the tradeoff." is slop.
3. **Quote slides → kept, but must be real + attributed.** A named human's actual
   quote is legitimate; manufactured aphorisms as body copy are not.
4. **Em-dashes → banned in all slide copy** (headlines, bullets, body, notes).
   Deterministic; stop-slop is right about it.

## Edits to Existing Files

- **`SKILL.md`**
  - New `## Anti-AI-Slop (Non-Negotiable)` section, styled like the existing print
    "fidelity requirement" hard gate. States the principle, points to
    `references/anti-ai-slop.md`, and specifies the mandatory pre-delivery gate
    (Quick Checks → rubric score → run linter → fix all → deliver).
  - `Building the Narrative`: Step 2 (arc = spine, not a fill-in template), Step 3
    (run headline anti-slop checks), Step 4 (write each slide against the catalog).
- **`references/story-arcs.md`**
  - **Reframe** "The Rule of Three": strip its default status; keep it as one option
    among counts (1–4); ban padding-to-three and the staccato tricolon; **bless**
    deliberate tricolon used sparingly for one high-emphasis beat.
  - Add "the arc is a spine, not a template — vary structure so decks don't feel
    formulaic."
  - Cross-link `references/anti-ai-slop.md`.
- **`README.md`**
  - Files table: add `references/anti-ai-slop.md` and `scripts/slop-lint.mjs`.
  - Short "Voice & Anti-Slop" blurb.
  - Credit stop-slop (MIT) in acknowledgements.
- **`red-hat-quick-deck.skill`** — the archive is a plain zip built from repo root
  (currently: `SKILL.md`, `README.md`, `references/*.md`; no build script). Rebuild
  to add the new **shipped** files:
  `zip -r red-hat-quick-deck.skill SKILL.md README.md references/ scripts/slop-lint.mjs scripts/slop-patterns.mjs`.
  **Dev-only, not shipped:** `scripts/slop-lint.test.mjs`, `scripts/__fixtures__/`,
  `docs/`. The linter path (`scripts/slop-lint.mjs`) resolves relative to the skill
  root, so it must ship for the gate's linter step to run on an installed skill.
- **`gemini-gem-prompt.md`** — *optional/deferred.* If ever done, inline the condensed
  catalog + Quick Checks + rubric and note the linter is Claude-only.

## Licensing / Attribution

stop-slop is MIT. We embed substantial portions, so `references/anti-ai-slop.md`
carries the MIT copyright line ("Copyright (c) 2025 Hardik Pandya") and permission
notice, plus a link to the source repo. README acknowledges it. The repo's own
LICENSE is MIT (Todd Wardzinski) — compatible.

## Validation of the Feature Itself

- Linter unit tests (sloppy vs. clean fixtures) via `node --test`.
- Regression: linter passes on the existing clean deck.
- Manual eval: generate a fresh deck after the change; confirm the model ran the gate
  and the output is clean and reads human.

## Open Questions

None blocking. Micro-defaults chosen (redirect on review if wanted):
- Names: `references/anti-ai-slop.md`, `scripts/slop-lint.mjs`, `scripts/slop-patterns.mjs`.
- Linter is model-invoked in the gate, not a commit hook.
- Patterns live in a JS module; the doc mirrors them in prose.

## Rough Sequence (detailed plan comes next, via writing-plans)

1. `scripts/slop-patterns.mjs` + `scripts/slop-lint.mjs` + tests/fixtures (TDD).
2. `references/anti-ai-slop.md` (vendored + adapted + attributed).
3. `SKILL.md` gate section + `Building the Narrative` edits.
4. `references/story-arcs.md` reconciliation (reframe Rule of Three).
5. `README.md` updates.
6. Rebuild `red-hat-quick-deck.skill`.
7. Manual eval deck + linter regression run.
