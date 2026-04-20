# Red Hat Quick Deck

An [Agent Skill](https://github.com/anthropics/agent-skill) that generates stunning, self-contained HTML slide presentations styled to Red Hat brand standards. Ask for a "quick deck" on any topic and get a single `.html` file you can open in any browser, email, or host anywhere. Works in Claude Code, Cursor, OpenCode, and anything else that supports the Agent Skills open standard.

## What It Does

- Generates single-file, self-contained HTML decks (inline CSS, inline JS)
- Red Hat brand fonts (Red Hat Display, Text, Mono) hotlinked via Google Fonts CDN
- Integrates official [Red Hat Design Tokens](https://github.com/RedHat-UX/red-hat-design-tokens) (`@rhds/tokens`) via jsDelivr CDN for consistent spacing, typography sizing, borders, and shadows
- Applies Red Hat brand colors, typography, and logo
- Supports **Dark**, **Light**, and **Expressive Dark** color modes
- Uses story-arc-driven narrative structures to make technical content compelling
- Includes keyboard/click/touch navigation, slide counter, and contextual notes panel (press `N`) with references, links, and deeper context
- Suggests AI image opportunities in contextual notes for visual enhancement

### v2: Rich Media Support

- **Images via URL** — drop in any image URL and it renders on-brand, properly sized and positioned within the slide layout
- **Memes & GIFs** — reference a meme or animated GIF and it embeds inline, because sometimes a well-placed meme says more than three bullet points
- **Embedded video** — YouTube links and MP4 URLs embed directly into slides as playable video
- **Flexible media handling** — images, video, and animated content all respect the brand styling, color mode, and responsive layout automatically

### v2.1: Markdown authoring (optional)

Every generated deck can now be delivered as both a single-file `.html`
**and** an editable Marp markdown source. Users who want to tweak wording,
reorder slides, or tune visuals just edit the `.md` and re-run the render
script — the HTML output is byte-for-byte equivalent to direct authoring.

- Works anywhere Bash + Node 18+ are available (Claude Code, terminal, CI).
- Falls back transparently to direct HTML authoring on environments without
  shell access (Claude.ai web, Gemini Gems).
- See `references/markdown-authoring.md` for the full authoring guide.

Re-render from the repo root:

```bash
node scripts/render.mjs path/to/deck.md          # outputs deck.html
node scripts/render.mjs deck.md --mode light     # Core Light palette
node scripts/render.mjs deck.md --mode expressive  # Expressive Dark
```

One-time setup: `npm install` (installs `@marp-team/marpit` and `markdown-it`).

## Files

| File | Description |
|------|-------------|
| `SKILL.md` | Main skill definition — design system, slide templates, navigation JS, and generation instructions |
| `references/markdown-authoring.md` | Markdown authoring reference (front-matter, slide-type directives, notes syntax, render invocation) |
| `references/redhat-brand.md` | Red Hat brand reference — full color palette, typography rules, and design principles |
| `references/story-arcs.md` | Narrative structure guide — Problem/Tension/Resolution, Myth-Busting, and Journey arcs |
| `references/rhds-icons.md` | Full inventory of 1,135 Red Hat icons with common name aliases |
| `themes/red-hat-quick-deck.css` | Marpit theme — slide-type classes, entrance animations, tag pills, media containers |
| `templates/shell.html`, `shell-js.js`, `logos.mjs` | Output shell: notes panel, controls, navigation JS, inline Red Hat logo SVGs |
| `scripts/render.mjs` | Node render script — Marpit wrapper with logo injection, notes extraction, and base64 image embedding |
| `examples/*.md`, `*.html` | Canonical example decks (hello-world, platform-engineering, all-slide-types) with their rendered output |
| `red-hat-quick-deck.skill` | Packaged skill archive for distribution |

## Usage

Install the skill in Claude Code, then ask for a presentation:

- "Create a quick deck about Kubernetes operators"
- "Make me a presentation on AI at the edge for Red Hat"
- "Build a pitch deck about OpenShift for enterprise architects"

The skill will ask your preferred visual mode (dark/light), research the topic if web search is available, choose a story arc, and generate a complete HTML slide deck.

## Slide Types

Title, Content, Big Number/Stat, Comparison, Architecture Diagram, Quote, Call-to-Action, and Thank You slides — all styled to Red Hat brand standards.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this project. The original author, Todd Wardzinski, kindly asks that you provide attribution back to this project when using or redistributing it.
