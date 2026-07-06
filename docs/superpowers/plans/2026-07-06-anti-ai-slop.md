# Anti-AI-Slop Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Red Hat Quick Deck skill an enforced, validated anti-AI-slop layer — woven voice guidance, a non-negotiable self-review gate, and a deterministic linter — adapted from `stop-slop`.

**Architecture:** Three layers. (1) A vendored+adapted reference (`references/anti-ai-slop.md`) the model reads while writing. (2) A mandatory pre-delivery gate in `SKILL.md` (Quick Checks → 5-dimension rubric → linter → revise). (3) A dependency-free Node linter (`scripts/slop-lint.mjs`) whose patterns live in `scripts/slop-patterns.mjs` and mirror the reference doc. `story-arcs.md` is reconciled (Rule of Three reframed), and the `.skill` archive is rebuilt to ship the new reference + linter.

**Tech Stack:** Node ≥18 (repo has v22.23.1), native ESM `.mjs`, `node --test`, Node built-ins only (no npm deps, no `package.json`). Markdown docs. `zip` for the skill archive.

## Global Constraints

- **No new dependencies.** Linter uses Node built-ins only (`node:fs`, `node:path`, `node:url`). No `package.json` is added.
- **ESM only.** All scripts are `.mjs`.
- **Regex hygiene.** Patterns in `slop-patterns.mjs` are **non-global** (used with `.exec` once per line) and tolerate straight and curly apostrophes via `['’]`.
- **Regression invariant (non-negotiable).** `codex-vs-claude-quick-deck.html` must yield **0 error-severity** findings. Verified: it has 0 em-dashes, 0 buzzwords, and 0 error-tier phrase hits today.
- **Attribution (verbatim).** `references/anti-ai-slop.md` must include the line `Copyright (c) 2025 Hardik Pandya` and a link to `https://github.com/hardikpandya/stop-slop`. stop-slop is MIT; we embed substantial portions.
- **Em-dash ban applies to generated slide copy**, not to repo docs/plans.
- **Rule of Three = reframe** (not retired, not kept): keep as one option among counts (1–4); ban padding-to-a-count and the staccato tricolon; bless deliberate tricolon used once for a title/close.
- **Ships inside `.skill`:** `SKILL.md`, `README.md`, `references/*.md`, `scripts/slop-lint.mjs`, `scripts/slop-patterns.mjs`. **Dev-only, never shipped:** `scripts/slop-lint.test.mjs`, `scripts/__fixtures__/`, `docs/`.
- **Gemini parity out of scope** (`gemini-gem-prompt.md` is optional/deferred).
- **Git discipline.** Branch is `bugfix/ai-slop`. The repo has unrelated untracked files (PDFs, sample HTML, `.textClipping`). **Never `git add -A`/`git add .`** — stage only the exact paths each task lists.

---

### Task 1: Slop linter (patterns + engine + tests + fixtures)

Self-contained, TDD. Produces the deterministic backstop (Layer 3).

**Files:**
- Create: `scripts/slop-patterns.mjs`
- Create: `scripts/slop-lint.mjs`
- Create: `scripts/slop-lint.test.mjs`
- Create: `scripts/__fixtures__/sloppy.html`
- Create: `scripts/__fixtures__/clean.html`

**Interfaces:**
- Produces: `patterns` — array of `{ id: string, regex: RegExp, message: string, severity: 'error'|'warning' }` (from `slop-patterns.mjs`).
- Produces: `extractLines(source: string, kind?: 'html'|'md') → Array<{lineNo:number, text:string}>` and `lint(source: string, opts?: {kind?: 'html'|'md'}) → Array<{lineNo, ruleId, severity, message, snippet}>` (from `slop-lint.mjs`).
- CLI: `node scripts/slop-lint.mjs <file…> [--quiet]`; exit 1 on any error finding, 2 on read/usage error, else 0.

- [ ] **Step 1: Write the two fixtures**

Create `scripts/__fixtures__/sloppy.html` (deliberately slop-ridden):

```html
<!doctype html>
<section class="slide">
  <h1>In today's fast-paced world, we leverage seamless AI</h1>
  <p class="eyebrow">Here's why this matters</p>
  <ul>
    <li>This is not just a tool — it's a game-changer.</li>
    <li>Speed. Quality. Cost.</li>
  </ul>
</section>
```

Create `scripts/__fixtures__/clean.html` (must produce zero findings — errors AND warnings):

```html
<!doctype html>
<section class="slide">
  <h1>Air-gapped inference keeps model weights on your own hardware</h1>
  <p class="eyebrow">Local AI</p>
  <ul>
    <li>Runs offline on a single workstation.</li>
    <li>No data leaves the building.</li>
  </ul>
</section>
```

- [ ] **Step 2: Write the failing test**

Create `scripts/slop-lint.test.mjs`:

```js
// Run: node --test scripts/slop-lint.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lint } from './slop-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, ...p), 'utf8');

test('sloppy fixture: raises errors including the marquee tells', () => {
  const findings = lint(read('__fixtures__', 'sloppy.html'), { kind: 'html' });
  const ids = new Set(findings.map((f) => f.ruleId));
  const errors = findings.filter((f) => f.severity === 'error');
  assert.ok(errors.length >= 4, `expected >=4 errors, got ${errors.length}`);
  assert.ok(ids.has('em-dash'), 'should flag em-dash');
  assert.ok(ids.has('jargon-leverage'), 'should flag "leverage"');
  assert.ok(ids.has('binary-contrast-not-just'), 'should flag "not just"');
  assert.ok(ids.has('throat-clearing'), "should flag \"here's why\"");
});

test('clean fixture: zero findings', () => {
  const findings = lint(read('__fixtures__', 'clean.html'), { kind: 'html' });
  assert.equal(findings.length, 0, JSON.stringify(findings, null, 2));
});

test('real deck codex-vs-claude: zero ERROR findings (false-positive guard)', () => {
  const errors = lint(read('..', 'codex-vs-claude-quick-deck.html'), { kind: 'html' })
    .filter((f) => f.severity === 'error');
  assert.equal(errors.length, 0, JSON.stringify(errors, null, 2));
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test scripts/slop-lint.test.mjs`
Expected: FAIL — `Cannot find module './slop-lint.mjs'` (engine not written yet).

- [ ] **Step 4: Write the pattern catalog**

Create `scripts/slop-patterns.mjs`:

```js
// Machine-checkable subset of references/anti-ai-slop.md. KEEP IN SYNC.
// This is the linter's source of truth for lexical + regex-detectable structural
// tells. Structure that a regex cannot reliably catch (passive voice, false agency,
// narrator-from-a-distance) is intentionally absent — that is the model's job via
// the self-review gate. Adding noisy patterns here erodes trust in the linter.
//
// Each entry: { id, regex (NON-global), message, severity: 'error' | 'warning' }.
// 'error' fails the run (exit 1); 'warning' reports only.

export const patterns = [
  // Em-dash — banned in all slide copy.
  { id: 'em-dash', regex: /—/, severity: 'error',
    message: 'Em-dash is banned in slide copy. Use a period or comma.' },

  // Business jargon / buzzwords (almost always slop).
  { id: 'jargon-leverage',      regex: /\bleverage\b/i,                severity: 'error', message: 'Buzzword "leverage" — use "use".' },
  { id: 'jargon-seamless',      regex: /\bseamless(ly)?\b/i,           severity: 'error', message: 'Buzzword "seamless" — name the concrete behavior.' },
  { id: 'jargon-robust',        regex: /\brobust\b/i,                  severity: 'error', message: 'Buzzword "robust" — say what it actually does.' },
  { id: 'jargon-delve',         regex: /\bdelve\b/i,                   severity: 'error', message: 'Buzzword "delve" — use "look at" or cut it.' },
  { id: 'jargon-supercharge',   regex: /\bsupercharg(e|es|ed|ing)\b/i, severity: 'error', message: 'Buzzword "supercharge" — quantify the gain.' },
  { id: 'jargon-revolutionize', regex: /\brevolutioniz(e|es|ed|ing)\b|\brevolutionary\b/i, severity: 'error', message: 'Hype word "revolutionize/revolutionary".' },
  { id: 'jargon-game-changer',  regex: /\bgame[- ]chang(er|ing|ers)\b/i, severity: 'error', message: 'Cliché "game-changer" — state the specific change.' },
  { id: 'jargon-superlative',   regex: /\bcutting[- ]edge\b|\bstate[- ]of[- ]the[- ]art\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bnext[- ]level\b/i, severity: 'error', message: 'Empty superlative — replace with a fact.' },
  { id: 'jargon-corporate',     regex: /\bparadigm\b|\bsynerg(y|ies|istic)\b|\bturnkey\b|\bfrictionless\b/i, severity: 'error', message: 'Corporate buzzword — use plain language.' },

  // Filler / throat-clearing openers.
  { id: 'filler-today',   regex: /\bin today['’]?s\b|\bever[- ]evolving\b|\bfast[- ]paced\b|\bin a world where\b/i, severity: 'error', message: 'Filler opener — start with the point.' },
  { id: 'filler-phrase',  regex: /\bat the end of the day\b|\bwhen it comes to\b|\bthe reality is\b|\bit['’]s worth noting\b|\bneedless to say\b/i, severity: 'error', message: 'Filler phrase — delete and state the content.' },
  { id: 'throat-clearing', regex: /\bhere['’]s (what|why|the thing|this|that)\b|\bthe uncomfortable truth\b|\blet me be clear\b|\bmake no mistake\b|\blet that sink in\b/i, severity: 'error', message: 'Throat-clearing — cut it and make the point.' },

  // Binary-contrast structures ("not X, it's Y").
  { id: 'binary-contrast-not-just',    regex: /\b(not|isn['’]t|it['’]s not)\s+just\b/i,       severity: 'error', message: 'Binary-contrast cliché "not just…" — state the point directly.' },
  { id: 'binary-contrast-its-not',     regex: /\bit['’]s not\b[^.?!]*\bit['’]s\b/i,            severity: 'error', message: '"It\'s not X, it\'s Y" reversal — say Y directly.' },
  { id: 'binary-contrast-not-because', regex: /\bnot because\b[^.?!]*\bbut because\b/i,         severity: 'error', message: '"Not because X, but because Y" — state Y.' },

  // Meta-commentary.
  { id: 'meta-commentary', regex: /\bplot twist\b|\bspoiler\b|\blet me walk you through\b|\bin this section\b|\bas we['’]ll see\b/i, severity: 'error', message: 'Meta-commentary — let the deck move, do not narrate it.' },

  // Lower-signal / context-dependent — report only, never fail the run.
  { id: 'staccato-tricolon', regex: /\b[A-Z][a-z]+\.\s+[A-Z][a-z]+\.\s+[A-Z][a-z]+\./, severity: 'warning', message: 'Possible staccato tricolon ("Faster. Smarter. Better.") — allowed once for a title/close, not as filler.' },
  { id: 'lazy-extreme',      regex: /\b(everyone|everybody|nobody|always|never)\b/i, severity: 'warning', message: 'Lazy extreme — prefer a specific claim.' },
  { id: 'adverb',            regex: /\b(effortlessly|simply|really|truly|literally|genuinely|honestly|actually|basically|essentially)\b/i, severity: 'warning', message: 'Empty adverb — usually cuttable.' },
  { id: 'soft-buzzword',     regex: /\b(unlock|unlocks|unlocking|empower|empowers|elevate|elevates|harness|streamline|streamlines|holistic|bespoke)\b/i, severity: 'warning', message: 'Soft buzzword — verify it earns its place or cut it.' },
];
```

- [ ] **Step 5: Write the linter engine**

Create `scripts/slop-lint.mjs`:

```js
// Deterministic backstop for the lexical + regex-detectable slop tells catalogued
// in references/anti-ai-slop.md. NOT a replacement for the model's self-review gate
// — it catches obvious words, not rhetorical structure. Node built-ins only.
//
//   node scripts/slop-lint.mjs deck.html deck.md [--quiet]
//
// Exit: 1 if any 'error' finding, 2 on read/usage error, else 0.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { patterns } from './slop-patterns.mjs';

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  '&#39;': "'", '&rsquo;': '’', '&lsquo;': '‘', '&nbsp;': ' ',
  '&mdash;': '—', '&#8212;': '—', '&#x2014;': '—',
  '&ndash;': '–', '&#8211;': '–',
};

function decodeEntities(s) {
  return s.replace(/&#?[a-z0-9]+;/gi, (m) => ENTITIES[m] ?? ENTITIES[m.toLowerCase()] ?? m);
}

// Reduce one source line to human-visible text (tags stripped, entities decoded).
function visibleText(line) {
  const stripped = line
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeEntities(stripped).replace(/\s+/g, ' ').trim();
}

// Extract [{ lineNo, text }] of visible content, skipping script/style/code blocks.
export function extractLines(source, kind = 'html') {
  const lines = source.split(/\r?\n/);
  const out = [];
  let skip = null; // 'script' | 'style' | 'code'
  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const raw = lines[i];
    if (kind === 'md') {
      if (/^\s*```/.test(raw)) { skip = skip === 'code' ? null : 'code'; continue; }
      if (skip === 'code') continue;
      const text = raw.replace(/\s+/g, ' ').trim();
      if (text) out.push({ lineNo, text });
      continue;
    }
    if (skip === 'script') { if (/<\/script>/i.test(raw)) skip = null; continue; }
    if (skip === 'style')  { if (/<\/style>/i.test(raw))  skip = null; continue; }
    if (/<script\b/i.test(raw) && !/<\/script>/i.test(raw)) { skip = 'script'; continue; }
    if (/<style\b/i.test(raw)  && !/<\/style>/i.test(raw))  { skip = 'style';  continue; }
    const text = visibleText(raw);
    if (text) out.push({ lineNo, text });
  }
  return out;
}

// Return [{ lineNo, ruleId, severity, message, snippet }] for a source string.
export function lint(source, { kind = 'html' } = {}) {
  const findings = [];
  for (const { lineNo, text } of extractLines(source, kind)) {
    for (const p of patterns) {
      const m = p.regex.exec(text);
      if (m) {
        const start = Math.max(0, m.index - 24);
        const end = Math.min(text.length, m.index + m[0].length + 24);
        findings.push({
          lineNo, ruleId: p.id, severity: p.severity, message: p.message,
          snippet: (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : ''),
        });
      }
    }
  }
  return findings;
}

function kindFor(path) { return path.toLowerCase().endsWith('.md') ? 'md' : 'html'; }

function main(argv) {
  const args = argv.slice(2);
  const quiet = args.includes('--quiet');
  const files = args.filter((a) => !a.startsWith('--'));
  if (files.length === 0) {
    console.error('usage: node scripts/slop-lint.mjs <file.html|file.md> [...] [--quiet]');
    process.exit(2);
  }
  let errors = 0, warnings = 0, readErr = false;
  for (const file of files) {
    let source;
    try { source = readFileSync(file, 'utf8'); }
    catch { console.error(`slop-lint: cannot read ${file}`); readErr = true; continue; }
    for (const f of lint(source, { kind: kindFor(file) })) {
      if (f.severity === 'error') errors++; else warnings++;
      if (!quiet) console.log(`${file}:${f.lineNo}  [${f.severity}] ${f.ruleId}  ${f.snippet}  — ${f.message}`);
    }
  }
  console.log(`slop-lint: ${errors} error(s), ${warnings} warning(s) across ${files.length} file(s)`);
  process.exit(errors > 0 ? 1 : readErr ? 2 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv);
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `node --test scripts/slop-lint.test.mjs`
Expected: PASS — 3 tests, 0 failures.

- [ ] **Step 7: Manually exercise the CLI on both fixtures**

Run: `node scripts/slop-lint.mjs scripts/__fixtures__/sloppy.html`
Expected: several `[error]` lines (em-dash, jargon-leverage, filler-today, throat-clearing, binary-contrast-not-just, jargon-game-changer, jargon-seamless), a `[warning]` staccato-tricolon line, then `slop-lint: N error(s) …`, exit code 1 (`echo $?` → 1).

Run: `node scripts/slop-lint.mjs scripts/__fixtures__/clean.html`
Expected: `slop-lint: 0 error(s), 0 warning(s) …`, exit code 0.

- [ ] **Step 8: Commit**

```bash
git add scripts/slop-patterns.mjs scripts/slop-lint.mjs scripts/slop-lint.test.mjs scripts/__fixtures__/sloppy.html scripts/__fixtures__/clean.html
git commit -m "feat: add deterministic slop linter with patterns, tests, and fixtures"
```

---

### Task 2: Anti-slop reference doc (`references/anti-ai-slop.md`)

The catalog the model reads while writing + the gate's rubric. Vendored from stop-slop, adapted for slides, MIT-attributed.

**Files:**
- Create: `references/anti-ai-slop.md`

**Interfaces:**
- Consumes: rule ids/severities conceptually mirror `scripts/slop-patterns.mjs` (Task 1).
- Produces: the canonical prose reference that `SKILL.md` (Task 3) and `story-arcs.md` (Task 4) link to.

- [ ] **Step 1: Create the reference doc**

Create `references/anti-ai-slop.md` with exactly this content:

````markdown
# Anti-AI-Slop — Voice Rules for Slide Copy

Slide copy must not read as machine-written. This is the catalog the deck author
applies **while writing** and the gate validates **before delivery**. It is adapted
for the slide medium from the excellent `stop-slop` skill.

> Adapted from **stop-slop** by Hardik Pandya — https://github.com/hardikpandya/stop-slop
> Copyright (c) 2025 Hardik Pandya. MIT License.
> Slide-specific adaptations (Rule of Three, fragments, attributed quotes) are this
> project's additions.

The machine-checkable subset of these rules lives in `scripts/slop-patterns.mjs`
(run by `scripts/slop-lint.mjs`). **Keep the two in sync** — when you add a lexical
rule here, add the pattern there.

## The Voice Target (what good deck copy sounds like)

Concrete, direct, technical, understated. A credible engineer talking to peers —
not a marketing landing page. Name the specific thing. Let facts carry weight
without hype. Red Hat's register is confident and plain, never breathless.

## Banned Phrases

**Throat-clearing openers** — cut, state the point: "Here's what/why/the thing",
"The uncomfortable truth is", "It turns out", "Let me be clear", "The reality is".

**Emphasis crutches** — delete, they add nothing: "Let that sink in", "Make no
mistake", "This matters because", "Full stop", "Period."

**Business jargon** — replace with plain language:

| Avoid | Use |
|---|---|
| leverage | use |
| seamless(ly) | (name the behavior) |
| robust | (say what it does) |
| game-changer | (the specific change) |
| deep dive / delve | analysis, look at |
| unlock / supercharge / elevate | (quantify the gain) |
| cutting-edge / best-in-class / world-class | (a fact) |
| paradigm / synergy / turnkey / frictionless | plain words |

**Filler** — cut: "In today's …", "In a world where", "At the end of the day",
"When it comes to", "It's worth noting", "Needless to say".

**Adverbs** — kill empty ones: really, simply, truly, literally, genuinely,
honestly, actually, basically, essentially, effortlessly.

**Vague declaratives** — name the specific thing instead: "The implications are
significant", "The reasons are structural", "The stakes are high".

**Meta-commentary** — the deck moves, it doesn't narrate itself: "Let me walk you
through", "In this section", "As we'll see", "Plot twist", "Spoiler".

## Banned Structures

**Binary contrasts** — state Y directly, drop the negation: "not just X but Y",
"It's not X, it's Y", "The answer isn't X. It's Y", "Not because X, but because Y".

**Negative listing** — don't run the "Not a X… Not a Y… A Z" striptease. State Z.

**Rhetorical setups** — make the point, don't announce it: "What if …?", "Here's
what I mean:", "Think about it:", "And that's okay."

**False agency** — name the human actor; things don't do human verbs: "the data
tells us" → "the team read the data and…", "the decision emerges" → "we decided".

**Narrator-from-a-distance** — put the reader in the room: "You" beats "People".
Avoid "Nobody designed this", "People tend to…".

**Passive voice** — find the actor, lead with them. ("X was created" → who created it.)

**Wh- / filler sentence starters** — restructure to lead with subject or verb.
Avoid opening lines with What/When/Why/How as a crutch, or "So,"/"Look,".

**Em-dashes** — none in slide copy (headlines, bullets, body, notes). Use a period
or comma.

## Slide Adaptations (the delta from stop-slop)

stop-slop is tuned for essays. Four rules are adapted for slides:

1. **Rule of Three — reframed, not banned.** Three is one option among counts (1–4).
   Use the count the content genuinely supports. **Never pad to a count for rhythm**
   (no invented weak third). **Never use the staccato tricolon** ("Faster. Smarter.
   Better." / "Speed. Quality. Cost. That's it."). Deliberate tricolon is **fine —
   used once** for a title line or the close, not as a per-slide default.
2. **Fragments — allowed for bullets, banned when performative.** "Air-gapped.
   On-prem. Yours." on a stat slide is fine. "That's it. That's the tradeoff." is slop.
3. **Quote slides — kept, but real and attributed.** A named person's actual quote is
   legitimate. Manufactured aphorisms as body copy are not.
4. **Headlines are assertions.** Active voice, human/system subject doing something,
   concrete, no hype adjective, no "Label: restated label" colon padding.

## Scoring Rubric (the validation gate)

Rate the deck's copy 1–10 on each dimension. **Total below 35/50 → revise and re-score.**

| Dimension | Question |
|---|---|
| Directness | Statements, or announcements about statements? |
| Rhythm | Varied sentence/bullet lengths, or metronomic? |
| Trust | Respects the reader's intelligence (no hand-holding)? |
| Authenticity | Sounds like a human engineer, not a landing page? |
| Density | Anything cuttable still present? |

## Before / After (slide copy)

**Headline** — Before: "Unlocking the Power of Seamless Kubernetes Automation".
After: "Operators run your database the way an SRE would".

**Bullet** — Before: "Not just faster — it's a game-changer for your workflow".
After: "Cuts deploy time from 40 minutes to 4".

**Stat caption** — Before: "In today's fast-paced world, downtime is costly".
After: "One hour of downtime costs the team $50k".

**Big-number slide** — Before: "Speed. Quality. Cost. You can only pick two.".
After: "Pick two: speed, quality, cost".
````

- [ ] **Step 2: Verify attribution and sync note are present**

Run: `grep -c 'Copyright (c) 2025 Hardik Pandya' references/anti-ai-slop.md` → expect `1`.
Run: `grep -c 'scripts/slop-patterns.mjs' references/anti-ai-slop.md` → expect `≥1`.
Run: `grep -ci 'rubric' references/anti-ai-slop.md` → expect `≥1`.

- [ ] **Step 3: Commit**

```bash
git add references/anti-ai-slop.md
git commit -m "docs: add slide-adapted anti-AI-slop reference (from stop-slop, MIT)"
```

---

### Task 3: SKILL.md — gate section + Building the Narrative edits

Wires Layers 1 & 2 into the generation workflow.

**Files:**
- Modify: `SKILL.md` (Building the Narrative steps ~838–854; insert new section before `## Navigation JavaScript` ~894)

**Interfaces:**
- Consumes: `references/anti-ai-slop.md` (Task 2), `scripts/slop-lint.mjs` (Task 1).

- [ ] **Step 1: Edit Step 2 (Choose a Story Arc)** — add the "spine not template" line.

Replace:

```
### Step 2: Choose a Story Arc
Read `references/story-arcs.md` and select the best arc for the content:
```

with:

```
### Step 2: Choose a Story Arc
The arc is a spine, not a fill-in-the-blank template — vary structure so decks don't
feel formulaic. Read `references/story-arcs.md` and select the best arc for the content:
```

- [ ] **Step 2: Edit Step 3 (Outline the Deck)** — add the headline check.

Replace:

```
### Step 3: Outline the Deck
Write the slide headlines FIRST. The headlines alone should tell the complete story. Show the user
the outline before generating the full HTML if the topic is complex.
```

with:

```
### Step 3: Outline the Deck
Write the slide headlines FIRST. The headlines alone should tell the complete story. Show the user
the outline before generating the full HTML if the topic is complex. Run each headline through the
anti-slop checks in `references/anti-ai-slop.md` before proceeding — assertions, active voice,
concrete, no hype, no em-dashes.
```

- [ ] **Step 3: Edit Step 4 (Write Each Slide)** — add the anti-slop bullet.

Replace:

```
- Write concise supporting content (fewer words = more impact)
```

with:

```
- Write concise supporting content (fewer words = more impact)
- Apply `references/anti-ai-slop.md` as you write — no buzzwords, no binary-contrast
  clichés, no padded triads, no em-dashes; name the specific thing
```

- [ ] **Step 4: Insert the gate section** immediately before `## Navigation JavaScript`.

Insert this block (a new top-level section) directly above the line `## Navigation JavaScript`:

```
## Anti-AI-Slop (Non-Negotiable)

Decks must not read as AI-written. The failure mode is not just buzzwords — it is
rhetorical sameness: padded triads, binary-contrast clichés ("not just X, it's Y"),
throat-clearing, hype adjectives, and metronomic rhythm. The full catalog, the voice
target, and the scoring rubric live in `references/anti-ai-slop.md`. Read it before
writing copy.

**Mandatory pre-delivery gate.** Before you emit the final HTML, run this gate and do
not skip it:

1. **Quick Checks** — pass every headline, eyebrow/tag, bullet, stat caption, and
   contextual-notes paragraph against the banned phrases and structures in
   `references/anti-ai-slop.md`. Rewrite every hit.
2. **Score** — rate the deck copy on the five rubric dimensions (Directness, Rhythm,
   Trust, Authenticity, Density). If the total is **below 35/50, revise and re-score.**
3. **Lint** — run the deterministic backstop on the generated files:
   `node scripts/slop-lint.mjs <deck>.html <deck>.md`
   Fix every `[error]`. Review each `[warning]` and fix unless it is a deliberate,
   defensible choice (e.g. one intentional tricolon on the closing slide).
4. **Only then deliver.** The linter catches lexical tells; the structural/rhetorical
   slop is yours to catch in steps 1–2. A clean linter run is necessary, not sufficient.

```

- [ ] **Step 5: Verify the edits landed**

Run: `grep -c 'Anti-AI-Slop (Non-Negotiable)' SKILL.md` → expect `1`.
Run: `grep -c 'slop-lint.mjs' SKILL.md` → expect `≥1`.
Run: `grep -c 'spine, not a fill-in-the-blank template' SKILL.md` → expect `1`.

- [ ] **Step 6: Commit**

```bash
git add SKILL.md
git commit -m "feat: enforce anti-slop gate in SKILL.md narrative workflow"
```

---

### Task 4: story-arcs.md — reframe the Rule of Three

Reconcile the existing guidance that manufactures slop.

**Files:**
- Modify: `references/story-arcs.md` (Rule of Three block ~83–84; principles header ~63)

- [ ] **Step 1: Replace the Rule of Three block.**

Replace:

```
### The Rule of Three
Group supporting points in threes. Three benefits. Three use cases. Three proof points. The human brain finds triads satisfying and memorable.
```

with:

```
### Vary Your Groupings (the Rule of Three, reframed)
Three is one option, not the default. Use the count the content genuinely supports —
two or four is equally fine. **Never pad to a count for rhythm** (a manufactured weak
third is the most common AI tell in decks). **Never use the staccato tricolon**
("Faster. Smarter. Better."). A deliberate tricolon is fine used **once**, for a title
or the closing line — never as a per-slide habit. See `references/anti-ai-slop.md`.
```

- [ ] **Step 2: Add a cross-link under the storytelling principles header.**

Replace:

```
## Slide Design Principles for Storytelling
```

with:

```
## Slide Design Principles for Storytelling

Voice matters as much as structure. Apply `references/anti-ai-slop.md` to every line —
the arc gives the deck its shape, the voice rules keep it from sounding machine-written.
```

- [ ] **Step 3: Verify**

Run: `grep -c 'Rule of Three, reframed' references/story-arcs.md` → expect `1`.
Run: `grep -c 'Three benefits. Three use cases. Three proof points.' references/story-arcs.md` → expect `0` (old text gone).

- [ ] **Step 4: Commit**

```bash
git add references/story-arcs.md
git commit -m "docs: reframe Rule of Three to kill mechanical triads"
```

---

### Task 5: README + rebuild the `.skill` archive

Document the feature and ship it.

**Files:**
- Modify: `README.md` (Files table ~25–31; add a Voice section; add credit)
- Modify: `red-hat-quick-deck.skill` (rebuilt zip)

- [ ] **Step 1: Add the two new files to the Files table.**

Replace:

```
| `story-arcs.md` | Narrative structure guide — Problem/Tension/Resolution, Myth-Busting, and Journey arcs |
```

with:

```
| `story-arcs.md` | Narrative structure guide — Problem/Tension/Resolution, Myth-Busting, and Journey arcs |
| `references/anti-ai-slop.md` | Voice rules + scoring rubric that keep generated copy from reading as AI-written (adapted from stop-slop) |
| `scripts/slop-lint.mjs` | Deterministic linter that flags lexical slop tells in a generated deck |
```

- [ ] **Step 2: Add a Voice & Anti-Slop section** immediately before `## License`.

Insert before the line `## License`:

````
## Voice & Anti-Slop

Generated decks are held to an enforced voice standard so they read like a credible
engineer wrote them, not a landing page. The skill applies `references/anti-ai-slop.md`
while writing, runs a non-negotiable self-review gate (banned phrases/structures + a
5-dimension score) before delivery, and backstops it with `scripts/slop-lint.mjs`, a
zero-dependency linter you can also run yourself:

```bash
node scripts/slop-lint.mjs your-deck.html your-deck.md
```

The voice catalog is adapted for slides from [stop-slop](https://github.com/hardikpandya/stop-slop)
by Hardik Pandya (MIT).

````

- [ ] **Step 3: Verify the README edits.**

Run: `grep -c 'anti-ai-slop.md' README.md` → expect `≥1`.
Run: `grep -c 'stop-slop' README.md` → expect `≥1`.

- [ ] **Step 4: Rebuild the `.skill` archive (ship reference + linter, exclude dev files).**

```bash
cd /Users/toddwardzinski/development/redhat/red-hat-quick-deck
rm -f red-hat-quick-deck.skill
zip -r red-hat-quick-deck.skill SKILL.md README.md references scripts/slop-lint.mjs scripts/slop-patterns.mjs -x '*.DS_Store'
unzip -l red-hat-quick-deck.skill
```

Expected `unzip -l` listing includes: `SKILL.md`, `README.md`, `references/anti-ai-slop.md`, `references/story-arcs.md`, `references/redhat-brand.md`, `references/rhds-icons.md`, `scripts/slop-lint.mjs`, `scripts/slop-patterns.mjs`. It must **NOT** include `scripts/slop-lint.test.mjs`, `scripts/__fixtures__/`, or `docs/`.

- [ ] **Step 5: Commit**

```bash
git add README.md red-hat-quick-deck.skill
git commit -m "docs: document anti-slop; rebuild .skill archive with reference + linter"
```

---

### Task 6: Acceptance — regression + manual eval

Confirm the whole thing works end to end.

**Files:** none (verification only)

- [ ] **Step 1: Full test + regression run.**

Run: `node --test scripts/slop-lint.test.mjs`
Expected: 3 tests pass (includes the `codex-vs-claude` zero-error guard).

Run: `node scripts/slop-lint.mjs codex-vs-claude-quick-deck.html`
Expected: `0 error(s)` (warnings acceptable), exit code 0.

- [ ] **Step 2: Manual eval — generate a fresh deck and gate it.**

In a Claude Code session with the skill installed, ask for a short deck (e.g.
"Create a quick deck about Kubernetes operators"). Confirm the model:
- Ran the gate (it should mention the anti-slop check / rubric score before delivering).
- Produced headlines that are concrete assertions with no buzzwords or em-dashes.

Then run the linter on the produced files:
`node scripts/slop-lint.mjs <new-deck>.html <new-deck>.md`
Expected: `0 error(s)`. If any error appears, the gate wording in `SKILL.md` (Task 3)
needs strengthening — fix and re-run.

- [ ] **Step 3: No commit needed** (verification only). If Step 2 required a SKILL.md fix, commit that under Task 3's message convention.

---

## Self-Review

**Spec coverage:**
- Layer 1 (woven guidance) → Task 3 Steps 1–3, Task 4. ✓
- Layer 2 (self-review gate + 35/50 rubric) → Task 3 Step 4, Task 2 rubric. ✓
- Layer 3 (linter) → Task 1. ✓
- Embed stop-slop adapted + MIT attribution → Task 2. ✓
- Four slide adaptations → Task 2 Step 1, Task 4. ✓
- Distribution (SKILL.md + references + rebuilt .skill; Gemini deferred) → Tasks 3, 5; Gemini explicitly out of scope. ✓
- Single source of truth + sync note → Task 1 (`slop-patterns.mjs`), Task 2 (sync note). ✓
- Regression on clean deck → Task 1 Step 2 (test) + Task 6 Step 1. ✓
- Shipped vs dev-only files → Task 5 Step 4. ✓

**Placeholder scan:** No TBD/TODO; all file contents and commands are literal. ✓

**Type consistency:** `patterns` shape and `lint()`/`extractLines()` signatures are defined in Task 1 and referenced consistently in the Task 1 test and Task 6. Rule ids asserted in tests (`em-dash`, `jargon-leverage`, `binary-contrast-not-just`, `throat-clearing`) all exist in `slop-patterns.mjs`. ✓
