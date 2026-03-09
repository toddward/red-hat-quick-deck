# Red Hat Brand Reference

This file contains the official Red Hat brand colors, typography, and design principles.
It is derived from the public Red Hat brand standards (https://www.redhat.com/en/about/brand/standards).

Also reference the `redhat-brand` skill by noelo (https://github.com/noelo/brand-skill/tree/main/redhat-brand)
for additional brand application guidance in Claude artifacts.

## Red Hat Design Tokens

The official **@rhds/tokens** package (https://github.com/RedHat-UX/red-hat-design-tokens) provides
CSS custom properties for colors, spacing, typography, borders, shadows, and more. The Quick Deck skill
loads the tokens CSS via jsDelivr CDN and uses them for spacing, typography sizing, borders, and shadows.

- **Package**: `@rhds/tokens` v3.0.2 on npm
- **CDN**: `https://cdn.jsdelivr.net/npm/@rhds/tokens@3.0.2/css/global.min.css`
- **Token docs**: https://ux.redhat.com/tokens/
- **Interactive browser**: https://red-hat-design-tokens.netlify.app/
- **Naming convention**: `--rh-[category]-[type]-[variant]` (e.g., `--rh-space-lg`, `--rh-font-size-heading-xl`)

**Note on colors:** The RHDS v3 token colors use `light-dark()` CSS functions and accessibility-adjusted
values that differ from the traditional brand palette hex values listed below. For example,
`--rh-color-brand-red-on-dark` is `#FF442B` (adjusted for dark-background legibility), not the classic
`#ee0000` (red-50). This skill uses the traditional hex values for visual consistency with the established
brand aesthetic, while using tokens for non-color properties.

## Core Color Palette

### Red (Brand Core)
| Token       | Hex       | Usage |
|-------------|-----------|-------|
| red-10      | #fce3e3   | Light red tint, subtle backgrounds |
| red-20      | #fbc5c5   | Light accent |
| red-30      | #f9a8a8   | Medium-light accent |
| red-40      | #f56e6e   | Medium accent |
| red-50      | #ee0000   | **Red Hat Red — primary brand color** |
| red-60      | #a60000   | Dark red |
| red-70      | #5f0000   | Very dark red |
| red-80      | #3f0000   | Deepest red |

### Neutral / Gray
| Token       | Hex       | Usage | RHDS Token Reference |
|-------------|-----------|-------|---------------------|
| white       | #ffffff   | Primary light background | `--rh-color-surface-lightest` |
| gray-10     | #f2f2f2   | Light background | `--rh-color-surface-lighter` |
| gray-20     | #e0e0e0   | Borders, dividers | `--rh-color-surface-light` |
| gray-30     | #c7c7c7   | Disabled states | `--rh-color-border-subtle-on-light` |
| gray-40     | #a3a3a3   | Secondary text (light bg) | |
| gray-50     | #707070   | Muted text | |
| gray-60     | #4d4d4d   | Body text alternative | `--rh-color-text-secondary-on-light` |
| gray-70     | #383838   | Dark surface | `--rh-color-border-subtle-on-dark` |
| gray-80     | #292929   | Dark background | `--rh-color-surface-dark` |
| gray-90     | #1f1f1f   | Very dark background | `--rh-color-surface-darker` |
| gray-95     | #151515   | UX Black — near-black | `--rh-color-text-primary-on-light` |
| black       | #000000   | True black | `--rh-color-surface-darkest` |

### Secondary Colors

#### Orange
| Token       | Hex       |
|-------------|-----------|
| orange-10   | #ffe8cc   |
| orange-20   | #fccb8f   |
| orange-30   | #f8ae54   |
| orange-40   | #f5921b   |
| orange-50   | #ca6c0f   |
| orange-60   | #9e4a06   |
| orange-70   | #732e00   |
| orange-80   | #4d1f00   |

#### Yellow
| Token       | Hex       |
|-------------|-----------|
| yellow-10   | #fff4cc   |
| yellow-20   | #ffe072   |
| yellow-30   | #ffcc17   |
| yellow-40   | #dca614   |
| yellow-50   | #b98412   |
| yellow-60   | #96640f   |
| yellow-70   | #73480b   |
| yellow-80   | #54330b   |

#### Teal
| Token       | Hex       |
|-------------|-----------|
| teal-10     | #daf2f2   |
| teal-20     | #b9e5e5   |
| teal-30     | #9ad8d8   |
| teal-40     | #63bdbd   |
| teal-50     | #37a3a3   |
| teal-60     | #147878   |
| teal-70     | #004d4d   |
| teal-80     | #003333   |

#### Purple
| Token       | Hex       |
|-------------|-----------|
| purple-10   | #ece6ff   |
| purple-20   | #d0c5f4   |
| purple-30   | #b6a6e9   |
| purple-40   | #876fd4   |
| purple-50   | #5e40be   |
| purple-60   | #3d2785   |
| purple-70   | #21134d   |
| purple-80   | #1b0d33   |

### Information Colors (utility only)
| Token                | Hex       | Meaning |
|----------------------|-----------|---------|
| interaction-blue-50  | #0066cc   | Links, interactivity |
| success-green-50     | #63993d   | Success, increase |
| danger-orange-50     | #f0561d   | Error, failure |

## Typography

### Font Families
| Font | Usage | RHDS Token |
|------|-------|-----------|
| **Red Hat Display** | Headlines, titles, large text. Bold, expressive, high-impact. | `--rh-font-family-heading` |
| **Red Hat Text** | Body copy, paragraphs, readable content. | `--rh-font-family-body-text` |
| **Red Hat Mono** | Code, technical content, monospace needs. | `--rh-font-family-code` |

All three are available on Google Fonts:
- `https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap`
- `https://fonts.googleapis.com/css2?family=Red+Hat+Text:ital,wght@0,300..700;1,300..700&display=swap`
- `https://fonts.googleapis.com/css2?family=Red+Hat+Mono:ital,wght@0,300..700;1,300..700&display=swap`

### Font Sizing Tokens
| Token | Size |
|-------|------|
| `--rh-font-size-heading-2xl` | 3rem (48px) |
| `--rh-font-size-heading-xl` | 2.5rem (40px) |
| `--rh-font-size-heading-lg` | 2rem (32px) |
| `--rh-font-size-heading-md` | 1.5rem (24px) |
| `--rh-font-size-heading-sm` | 1.25rem (20px) |
| `--rh-font-size-body-text-xl` | 1.25rem (20px) |
| `--rh-font-size-body-text-lg` | 1.125rem (18px) |
| `--rh-font-size-body-text-md` | 1rem (16px) |
| `--rh-font-size-body-text-sm` | 0.875rem (14px) |
| `--rh-font-size-body-text-xs` | 0.75rem (12px) |

### Font Weight Tokens
| Token | Value |
|-------|-------|
| `--rh-font-weight-regular` | 400 |
| `--rh-font-weight-medium` | 500 |
| `--rh-font-weight-bold` | 700 |

### Typography Rules
- Headlines: Red Hat Display, Bold or Black weight
- Body text: Red Hat Text, Regular weight
- Code/technical: Red Hat Mono
- Color for text: black or white for body; red-50 for accent headlines/pull quotes only
- Never use red for long paragraphs
- Emphasis: bold OR color change, never both simultaneously
- No italics, underline, or ALL CAPS for emphasis

## Color Collections for Presentations

### Core Dark (Primary for slides — matches the screenshot reference)
- **Backgrounds**: black (#000000) or gray-80 (#292929) or gray-90 (#1f1f1f)
- **Text**: white (#ffffff) or red-50 (#ee0000)
- **Graphics**: tints/shades of red, black, white

### Core Light
- **Backgrounds**: gray-10 (#f2f2f2) or white (#ffffff)
- **Text**: black (#000000) or red-50 (#ee0000)
- **Graphics**: tints/shades of red, black, white

### Expressive Dark
- **Backgrounds**: black (#000000) or purple-80 (#1b0d33)
- **Text**: white or red-50
- **Graphics**: tints/shades of red, purple, teal, orange, yellow, black, white

## Iconography

Red Hat publishes an official icon library: **@rhds/icons** (https://github.com/RedHat-UX/red-hat-icons).

- **1,135 SVGs** across 4 sets: `standard` (538 pictograms), `ui` (542 interface icons), `microns` (19 tiny), `social` (36 platform logos)
- **Browse all icons**: https://red-hat-icons.netlify.app/
- **CDN source**: Available via jsDelivr at `https://cdn.jsdelivr.net/npm/@rhds/icons@2.1.0/{set}/{icon}.svg`
- Icons are monochrome SVGs designed to be recolored via CSS `filter` properties
- Use the `standard` set for presentation pictograms; `ui` set for interface-style icons

## Design Token Reference

### Spacing Tokens (`--rh-space-*`)
All values are multiples of 4px. Use these for consistent padding, margins, and gaps.

| Token | Value |
|-------|-------|
| `--rh-space-xs` | 4px |
| `--rh-space-sm` | 8px |
| `--rh-space-md` | 16px |
| `--rh-space-lg` | 24px |
| `--rh-space-xl` | 32px |
| `--rh-space-2xl` | 48px |
| `--rh-space-3xl` | 64px |
| `--rh-space-4xl` | 80px |
| `--rh-space-5xl` | 96px |
| `--rh-space-6xl` | 112px |
| `--rh-space-7xl` | 128px |

### Border Tokens
| Token | Value |
|-------|-------|
| `--rh-border-width-sm` | 1px |
| `--rh-border-width-md` | 2px |
| `--rh-border-width-lg` | 3px |
| `--rh-border-radius-sharp` | 0px |
| `--rh-border-radius-default` | 3px |
| `--rh-border-radius-pill` | 64px |

### Box Shadow Tokens
| Token | Value |
|-------|-------|
| `--rh-box-shadow-sm` | `0 2px 4px 0 rgba(21,21,21,0.2)` |
| `--rh-box-shadow-md` | `0 4px 6px 1px rgba(21,21,21,0.25)` |
| `--rh-box-shadow-lg` | `0 6px 8px 2px rgba(21,21,21,0.3)` |
| `--rh-box-shadow-xl` | `0 8px 24px 3px rgba(21,21,21,0.35)` |

### Opacity Tokens (`--rh-opacity-*`)
Values from `--rh-opacity-0` (0%) through `--rh-opacity-100` (100%) in increments of 10.

## Key Brand Principles
1. **Use red with intention** — pops of red-50 to highlight, never flood
2. **Keep it simple** — generous white space, restrained color
3. **Create balance** — lightest tints and darkest shades for large areas; saturated colors sparingly
4. **Accessibility** — 4.5:1 contrast for small text, 3:1 for large text/graphics (WCAG AA)
5. **Don't generate AI images of the Red Hat logo or fedoras**
6. Red means Red Hat — never use red to represent negative things
