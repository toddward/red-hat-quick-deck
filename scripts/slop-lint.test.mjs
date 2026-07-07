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

test('real deck fixture: zero ERROR findings (false-positive guard)', () => {
  const errors = lint(read('__fixtures__', 'real-deck.html'), { kind: 'html' })
    .filter((f) => f.severity === 'error');
  assert.equal(errors.length, 0, JSON.stringify(errors, null, 2));
});

test('curly (smart) apostrophes are caught - regression for apostrophe classes', () => {
  const a = String.fromCharCode(0x2019); // curly apostrophe, built at runtime so the source stays ASCII-safe
  const src = `<h1>Here${a}s why we leverage it</h1><p>It isn${a}t just hype</p>`;
  const ids = new Set(lint(src, { kind: 'html' }).map((f) => f.ruleId));
  assert.ok(ids.has('throat-clearing'), `curly "Here${a}s why" should be caught`);
  assert.ok(ids.has('binary-contrast-not-just'), `curly "isn${a}t just" should be caught`);
});

test('markdown code fences are skipped in md mode', () => {
  const md = [
    '# Real headline that reads clean',
    '',
    '```js',
    'const x = "leverage seamless game-changer"; // slop inside code must be ignored',
    '```',
    '',
    'A plain sentence about air-gapped inference.',
  ].join('\n');
  const findings = lint(md, { kind: 'md' });
  assert.equal(findings.length, 0, JSON.stringify(findings, null, 2));
});

test('script and style blocks are skipped (no false positives from CSS/JS)', () => {
  const html = [
    '<style>',
    '  /* leverage seamless robust game-changer */',
    '</style>',
    '<script>',
    "  // here's why we delve into synergy",
    '</script>',
    '<h1>Air-gapped inference on your own hardware</h1>',
  ].join('\n');
  const findings = lint(html, { kind: 'html' });
  assert.equal(findings.length, 0, JSON.stringify(findings, null, 2));
});

test('HTML entity em-dashes are decoded and flagged', () => {
  const ids = lint('<p>Air-gapped &mdash; on-prem &#8212; yours</p>', { kind: 'html' })
    .map((f) => f.ruleId);
  assert.ok(ids.includes('em-dash'), 'entity-encoded em-dash should be caught');
});
