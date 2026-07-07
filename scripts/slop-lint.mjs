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

// NOTE: matching is line-scoped — each visible line is tested independently. Slop split
// across two lines, or visible text sharing a line with a <script>/<style> open/close
// tag, can be missed. Generated decks keep headlines and script/style on their own lines,
// and the model's self-review gate (Layer 2) is the real structural defense; this linter
// is a lexical backstop.
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
