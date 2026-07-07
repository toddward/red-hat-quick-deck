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
  { id: 'jargon-robust',        regex: /\brobust\b/i,                  severity: 'warning', message: 'Buzzword "robust" — often legitimate in technical prose; consider naming the specific behavior.' },
  { id: 'jargon-delve',         regex: /\bdelve\b/i,                   severity: 'warning', message: 'Buzzword "delve" — consider "look at" or cutting it.' },
  { id: 'jargon-supercharge',   regex: /\bsupercharg(e|es|ed|ing)\b/i, severity: 'error', message: 'Buzzword "supercharge" — quantify the gain.' },
  { id: 'jargon-revolutionize', regex: /\brevolutioniz(e|es|ed|ing)\b|\brevolutionary\b/i, severity: 'error', message: 'Hype word "revolutionize/revolutionary".' },
  { id: 'jargon-game-changer',  regex: /\bgame[- ]chang(er|ing|ers)\b/i, severity: 'error', message: 'Cliché "game-changer" — state the specific change.' },
  { id: 'jargon-superlative',   regex: /\bcutting[- ]edge\b|\bstate[- ]of[- ]the[- ]art\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bnext[- ]level\b/i, severity: 'error', message: 'Empty superlative — replace with a fact.' },
  { id: 'jargon-corporate',     regex: /\bparadigm\b|\bsynerg(y|ies|istic)\b|\bturnkey\b|\bfrictionless\b/i, severity: 'error', message: 'Corporate buzzword — use plain language.' },

  // Filler / throat-clearing openers.
  { id: 'filler-today',   regex: /\bin today['\u2019]?s\b|\bever[- ]evolving\b|\bfast[- ]paced\b|\bin a world where\b/i, severity: 'error', message: 'Filler opener — start with the point.' },
  { id: 'filler-phrase',  regex: /\bat the end of the day\b|\bwhen it comes to\b|\bthe reality is\b|\bit['\u2019]s worth noting\b|\bneedless to say\b/i, severity: 'error', message: 'Filler phrase — delete and state the content.' },
  { id: 'throat-clearing', regex: /\bhere['\u2019]s (what|why|the thing|this|that)\b|\bthe uncomfortable truth\b|\blet me be clear\b|\bmake no mistake\b|\blet that sink in\b/i, severity: 'error', message: 'Throat-clearing — cut it and make the point.' },

  // Binary-contrast structures ("not X, it's Y").
  { id: 'binary-contrast-not-just',    regex: /\b(not|isn['\u2019]t|it['\u2019]s not)\s+just\b/i,       severity: 'error', message: 'Binary-contrast cliché "not just…" — state the point directly.' },
  { id: 'binary-contrast-its-not',     regex: /\bit['\u2019]s not\b[^.?!]*\bit['\u2019]s\b/i,            severity: 'error', message: '"It\'s not X, it\'s Y" reversal — say Y directly.' },
  { id: 'binary-contrast-not-because', regex: /\bnot because\b[^.?!]*\bbut because\b/i,         severity: 'error', message: '"Not because X, but because Y" — state Y.' },

  // Meta-commentary.
  { id: 'meta-commentary', regex: /\bplot twist\b|\bspoiler\b|\blet me walk you through\b|\bin this section\b|\bas we['\u2019]ll see\b/i, severity: 'error', message: 'Meta-commentary — let the deck move, do not narrate it.' },

  // Lower-signal / context-dependent — report only, never fail the run.
  { id: 'staccato-tricolon', regex: /\b[A-Z][a-z]+\.\s+[A-Z][a-z]+\.\s+[A-Z][a-z]+\./, severity: 'warning', message: 'Possible staccato tricolon ("Faster. Smarter. Better.") — allowed once for a title/close, not as filler.' },
  { id: 'lazy-extreme',      regex: /\b(everyone|everybody|nobody|always|never)\b/i, severity: 'warning', message: 'Lazy extreme — prefer a specific claim.' },
  { id: 'adverb',            regex: /\b(effortlessly|simply|really|truly|literally|genuinely|honestly|actually|basically|essentially)\b/i, severity: 'warning', message: 'Empty adverb — usually cuttable.' },
  { id: 'soft-buzzword',     regex: /\b(unlock|unlocks|unlocking|empower|empowers|elevate|elevates|harness|streamline|streamlines|holistic|bespoke)\b/i, severity: 'warning', message: 'Soft buzzword — verify it earns its place or cut it.' },
];
