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

## Files

| File | Description |
|------|-------------|
| `SKILL.md` | Main skill definition — design system, slide templates, navigation JS, and generation instructions |
| `red-hat-quick-deck.skill` | Packaged skill archive for distribution |
| `redhat-brand.md` | Red Hat brand reference — full color palette, typography rules, and design principles |
| `story-arcs.md` | Narrative structure guide — Problem/Tension/Resolution, Myth-Busting, and Journey arcs |

## Usage

Install the skill in Claude Code, then ask for a presentation:

- "Create a quick deck about Kubernetes operators"
- "Make me a presentation on AI at the edge for Red Hat"
- "Build a pitch deck about OpenShift for enterprise architects"

The skill will ask your preferred visual mode (dark/light), research the topic if web search is available, choose a story arc, and generate a complete HTML slide deck.

## Slide Types

Title, Content, Big Number/Stat, Comparison, Architecture Diagram, Quote, Call-to-Action, and Thank You slides — all styled to Red Hat brand standards.

## Exporting as PDF or Markdown

Decks are primarily interactive HTML, but you can hand someone a PDF leave-behind or a plain-text outline without any extra tooling.

### Save as PDF (browser-native)

1. Open the `.html` file in any modern browser.
2. Press `Cmd+P` (macOS) or `Ctrl+P` (Windows/Linux).
3. Set **Destination: Save as PDF**, **Layout: Landscape**, **Margins: Default**.
4. Save.

Every slide renders on its own page, navigation chrome is hidden, and entrance animations are flattened. **Dark-mode decks automatically switch to a light, ink-efficient palette for print** — Red Hat red accents are preserved. Light-mode decks print as-is.

Video slides render as the poster/thumbnail with the video URL printed as a caption underneath (PDFs can't play video).

### Markdown companion

Every generated deck is also saved as a `.md` outline next to the `.html`, using the same filename. The Markdown file mirrors the deck's narrative — headlines, bullets, stats, quotes, video links, and contextual notes — in plain text. Useful for:

- Pasting into a wiki or Notion page
- Copying into an email recap
- Keeping an editable record of the deck

### What's not (yet) exported

No PPTX export. PowerPoint would require a runtime dependency; the PDF + Markdown combo covers the common "leave-behind" use cases without adding weight to the skill.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this project. The original author, Todd Wardzinski, kindly asks that you provide attribution back to this project when using or redistributing it.
