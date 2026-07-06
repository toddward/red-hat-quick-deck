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
