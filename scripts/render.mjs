#!/usr/bin/env node
/**
 * Red Hat Quick Deck — Marpit render pipeline.
 *
 * Reads a Marp markdown file, renders it through Marpit with the custom
 * rhqd theme, and composes a self-contained single-file HTML output that
 * preserves the shell (notes panel, nav, controls) and protocol-aware
 * video handling from the original HTML-direct skill output.
 *
 * Usage:
 *   node scripts/render.mjs <input.md> [--out output.html]
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename, extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { Marpit } from '@marp-team/marpit';
import MarkdownIt from 'markdown-it';
import { smallLogo, largeLogo } from '../templates/logos.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

const THEME_PATH = join(REPO_ROOT, 'themes/red-hat-quick-deck.css');
const SHELL_PATH = join(REPO_ROOT, 'templates/shell.html');
const SHELL_JS_PATH = join(REPO_ROOT, 'templates/shell-js.js');

const md = new MarkdownIt({ html: false, breaks: false, linkify: true });

function parseCliArgs() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      out: { type: 'string', short: 'o' },
      mode: { type: 'string', short: 'm' },
    },
    allowPositionals: true,
  });
  if (positionals.length !== 1) {
    console.error('Usage: node scripts/render.mjs <input.md> [--out output.html] [--mode dark|light|expressive]');
    process.exit(2);
  }
  return { input: resolve(positionals[0]), out: values.out, mode: values.mode };
}

function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Extract contextual notes from a comment array for one slide.
 * Marpit returns comments as a 2D array: comments[slideIndex] = string[].
 * We only pick up comments whose first non-whitespace token is "notes:".
 * The rest (TODOs, random notes) are ignored.
 */
function extractNotes(commentsForSlide) {
  if (!Array.isArray(commentsForSlide)) return '';
  const chunks = [];
  for (const raw of commentsForSlide) {
    const trimmed = String(raw).trim();
    const match = trimmed.match(/^notes:\s*([\s\S]*)$/i);
    if (match) chunks.push(match[1].trim());
  }
  if (chunks.length === 0) return '';
  return md.render(chunks.join('\n\n'));
}

/**
 * Inject data-notes attributes onto each rendered <section> element.
 * Marpit's output is a flat HTML string; we walk it section-by-section and
 * annotate each with the corresponding notes.
 *
 * We insert the attribute right after the opening tag's class list. If a
 * section already has data-notes (author-written), it's preserved.
 */
function injectNotesAttrs(slidesHtml, commentsPerSlide) {
  let i = 0;
  return slidesHtml.replace(/<section\b([^>]*)>/g, (fullMatch, attrs) => {
    const noteHtml = extractNotes(commentsPerSlide[i++] || []);
    if (!noteHtml) return fullMatch;
    if (/\sdata-notes=/.test(attrs)) return fullMatch;
    return `<section${attrs} data-notes="${escapeHtmlAttr(noteHtml)}">`;
  });
}

/**
 * Auto-inject the Red Hat logo into title and thankyou slides.
 *
 * - Title slides (class contains "title"): the logo is prepended into the
 *   existing `.breadcrumb` div. Author writes just the breadcrumb text.
 * - Thankyou slides (class contains "thankyou"): a `<div class="logo-footer">`
 *   is appended at the end of the section, below author content.
 *
 * If a slide already contains a `.rh-logo`, injection is skipped (author
 * opt-out).
 */
function injectLogos(slidesHtml, mode) {
  const small = smallLogo(mode);
  const large = largeLogo(mode);

  return slidesHtml.replace(/<section\b([^>]*)>([\s\S]*?)<\/section>/g, (_, attrs, body) => {
    const classMatch = attrs.match(/\bclass="([^"]*)"/);
    const classes = classMatch ? classMatch[1].split(/\s+/) : [];
    const isTitle = classes.includes('title');
    const isThankyou = classes.includes('thankyou');
    if (!isTitle && !isThankyou) return `<section${attrs}>${body}</section>`;
    if (/\brh-logo\b/.test(body)) return `<section${attrs}>${body}</section>`; // author opt-out

    let newBody = body;
    if (isTitle) {
      newBody = newBody.replace(
        /<div class="breadcrumb">/,
        `<div class="breadcrumb">${small}`,
      );
    }
    if (isThankyou) {
      newBody = newBody + `\n<div class="logo-footer">${large}</div>\n`;
    }
    return `<section${attrs}>${newBody}</section>`;
  });
}

function substitute(template, map) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in map)) throw new Error(`Template variable {{${key}}} has no substitution`);
    return map[key];
  });
}

async function main() {
  const args = parseCliArgs();

  await stat(args.input).catch(() => {
    console.error(`Input file not found: ${args.input}`);
    process.exit(1);
  });

  const [markdown, themeCss, shellHtml, shellJs] = await Promise.all([
    readFile(args.input, 'utf8'),
    readFile(THEME_PATH, 'utf8'),
    readFile(SHELL_PATH, 'utf8'),
    readFile(SHELL_JS_PATH, 'utf8'),
  ]);

  const marpit = new Marpit({
    inlineSVG: false,
    markdown: { html: true, breaks: false, linkify: true },
  });
  marpit.themeSet.default = marpit.themeSet.add(themeCss);

  const { html: slidesHtml, css: marpitCss, comments } = marpit.render(markdown, { htmlAsArray: false });

  // Detect palette mode from front-matter's `class: mode-dark|light|expressive` directive.
  // Default: dark. Drives logo variant selection (reverse wordmark on dark, standard on light).
  const modeMatch = markdown.match(/^class:\s*.*\bmode-(dark|light|expressive)\b/m);
  const mode = args.mode || (modeMatch ? modeMatch[1] : 'dark');

  const withLogos = injectLogos(slidesHtml, mode);
  const slidesWithNotes = injectNotesAttrs(withLogos, comments);

  const titleMatch = markdown.match(/^title:\s*(.+)$/m);
  const deckTitle = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : 'Red Hat Quick Deck';

  const composed = substitute(shellHtml, {
    TITLE: escapeHtmlAttr(deckTitle),
    MARPIT_CSS: marpitCss,
    SLIDES_HTML: slidesWithNotes,
    SHELL_JS: shellJs,
  });

  const outPath = args.out
    ? resolve(args.out)
    : join(dirname(args.input), `${basename(args.input, extname(args.input))}.html`);
  await writeFile(outPath, composed, 'utf8');

  console.log(`✓ Rendered ${args.input} → ${outPath}`);
  console.log(`  Slides: ${(slidesHtml.match(/<section\b/g) || []).length}, with notes: ${comments.filter((c) => (c || []).some((x) => /^\s*notes:/i.test(x))).length}`);
}

main().catch((err) => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
