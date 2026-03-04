# Red Hat Quick Deck

A Claude Code skill that generates stunning, self-contained HTML slide presentations styled to Red Hat brand standards. Ask for a "quick deck" on any topic and get a single `.html` file you can open in any browser, email, or host anywhere.

## What It Does

- Generates single-file, self-contained HTML decks (inline CSS, inline JS)
- Red Hat brand fonts (Red Hat Display, Text, Mono) are hotlinked directly in the HTML via Google Fonts CDN — no local font installation required
- Applies Red Hat brand colors, typography, and logo
- Supports **Dark**, **Light**, and **Expressive Dark** color modes
- Uses story-arc-driven narrative structures to make technical content compelling
- Includes keyboard/click/touch navigation, slide counter, and speaker notes (press `N`)
- Suggests AI image opportunities in speaker notes for visual enhancement

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
