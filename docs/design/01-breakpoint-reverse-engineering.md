# 01 — Breakpoint Reverse Engineering

> **Sources:**
> - Live 2026 London: [solana.com/breakpoint](https://solana.com/breakpoint) — black/mint/glitch system
> - 2025 Abu Dhabi archive:
>   [web.archive.org/web/20251127225341](https://web.archive.org/web/20251127225341/https://solana.com/breakpoint)
>   — wisp/azure CTA system, carousels, stat display typography.
>   Pixel specs: [`04-breakpoint-2025-archive-pixels.md`](./04-breakpoint-2025-archive-pixels.md)

This document records what Breakpoint does visually so we can reuse patterns in the
Startup Village Borneo companion app without copying proprietary assets.

---

## 1. Design DNA (summary)

| Trait | Breakpoint expression |
| ----- | --------------------- |
| Mood | Dark, high-contrast, crypto-native, conference-scale energy |
| Primary surface | Near-black (`#0e0e10`, `#111214`) full-bleed sections |
| Accent | Solana mint (`#14f195`) for hero CTAs + featured cards; purple (`#aa67fb`) for footer + highlights |
| Typography | Display face (BP26) for headlines; ABC Favorit sans + mono for body/UI |
| Motion | Step-based reveals (clip-path wipes), glitch jitter on display text, scanlines |
| Layout | Full-bleed photography, 12-col desktop grid, generous vertical rhythm (80–120px section gaps) |
| UI chrome | Mono uppercase buttons, outlined secondary actions, accordion FAQ |

---

## 2. Color system

### Core palette (from `--color-core-*`)

| Token | Hex | Usage on Breakpoint |
| ----- | --- | ------------------- |
| Black | `#000` | Pure black overlays, text on mint cards |
| White | `#fff` | Primary text, button fills, card surfaces |
| Green (mint) | `#14f195` | Featured ticket card, Solana brand tie-in |
| Purple | `#aa67fb` | Footer background, heading highlights, glitch |
| Blue | `#3c91ff` | Secondary accent (data viz sections) |
| Yellow | `#c0e021` | Lime secondary |
| Pink | `#e65ddb` | Accent variant |

### Neutral scale (`--color-utility-neutral-*`)

`#f5f5f5` → `#dfdfdf` → `#a2a2a2` → `#858585` → `#4a4a4a` → `#333` → `#1a1a1a` → `#0e0e10`

### Semantic mapping

- **Background primary:** neutral-900
- **Background secondary:** neutral-800
- **Text primary:** neutral-50 on dark
- **Text secondary:** neutral-300
- **Stroke primary/secondary:** neutral-700 / neutral-600
- **Button fill:** white → hover neutral-200

Full token list: [`tokens/breakpoint-reference.css`](./tokens/breakpoint-reference.css).

---

## 3. Typography

### Font roles

| Role | Breakpoint font | Open fallback (SVB) |
| ---- | --------------- | ------------------- |
| Display / hero | `font-bp26` (custom woff2) | Space Grotesk |
| Body | `font-abc-favorit` | DM Sans |
| UI / labels / buttons | `font-abc-favorit-mono` | JetBrains Mono |

### Type scale (desktop)

| Style | Size | Letter-spacing | Line-height | Notes |
| ----- | ---- | -------------- | ----------- | ----- |
| Display / H1 | 5rem (80px) | -0.3rem / 0.05rem | 0.98–1.18 | Tight, monumental |
| H2 | 4rem | 0.16rem | 1.18 | Section titles |
| H3 | 3rem | -0.06rem | 1.15 | |
| H4 | 2.5rem | -0.05rem | 1.15 | |
| P-large | 1.5rem | -0.06rem | 1.18 | Accordion titles |
| Paragraph | 1.125rem | 0 | 1.45 | Body copy |
| Eyebrow | 1rem | 0.08rem | 1.3 | UPPERCASE mono |
| Button | 0.875rem | 0.07rem | 0.9 | UPPERCASE mono bold |
| Caption | 0.6875rem | 0.06875rem | 0.9375rem | Meta labels |
| Menu title | 6.5rem | 0.02em | 0.95 | Mobile nav overlay |

### Typography patterns

- **Eyebrow + headline:** small mono label (`GET INVOLVED`) above large white headline.
- **Split-color headings:** purple word + white remainder (`Breakpoint 2026` intro).
- **All-caps mono** for dates, locations, stats labels, footer links.
- **Stat blocks:** oversized numbers with small caps labels underneath.

---

## 4. Spacing & layout

### Spacing scale

`4xs` 4px → `3xs` 8px → `2xs` 12px → `xs` 16px → `s` 24px → `m` 32px → `l` 48px → `xl` 64px → `2xl` 80px → `3xl` 120px → `4xl` 160px

### Section rhythm

- Mobile section top padding: `pt-2xl` (80px) or `pt-20` (80px)
- Desktop section padding: `pt-[120px]`, `py-[120px]`
- Container horizontal padding: `px-[16px]` mobile, `px-[32px]` desktop
- Hero height: `667px` mobile, `566px` desktop

### Grid

- Desktop: `md:grid-cols-bp-desktop` (12-column custom grid)
- Ticket section: asymmetric 2-column — featured mint card left, stacked dark cards right
- Stats row: 3-column equal

### Full bleed

`.bp-full-bleed` — `width: 100vw; margin-left: calc(50% - 50vw)` for edge-to-edge media.

---

## 5. Motion & effects

### Breakpoint-specific animations

| Class | Effect | Timing |
| ----- | ------ | ------ |
| `bp-block-wipe` | Clip-path wipe reveal (right → full) | 1.5s steps(6) |
| `bp-block-reveal` | Polygon clip reveal | 0.9s steps(5) |
| `bp-glitch-jitter` | Horizontal jitter on display text | 0.52–0.6s steps(8) |
| `bp-glitch-scanlines` | CRT scanline overlay | alpha 45%, pitch 2px |
| `bp-glitch-slice` | RGB slice glitch layers | mix-blend-mode multiply |
| `bp-icon-blink` | Step opacity blink | 0.9s step-end |
| `bp-nav-expand` | Nav label width expand | 0.9s steps(4) |
| `photo-strip-track` | Infinite horizontal pan | 50s linear |

### Easing

`--bp-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — used for nav transitions.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` disables photo-strip animation.

### Modal overlay

`backdrop-filter: blur(8px)` + `--color-utility-transparent-black-80`.

---

## 6. Components (reverse-engineered)

See [`03-element-library.md`](./03-element-library.md) for full catalog. Key Breakpoint components:

### Navigation (`nav[aria-label="Primary"]`)

- Centered floating bar, `z-40`, transforms on scroll
- Logo: `≡BP26` compact mark
- Sticky state adds `REGISTER` CTA (`bp26-button`, white fill, dark text)
- Hamburger → full-screen menu with `text-menu-title` scale links

### Primary button (`bp26-button`)

```html
<a class="bp26-button group/button relative inline-flex items-center justify-center
  font-mono text-button uppercase transition-colors ...">
  Get Updates
</a>
```

- Mono, uppercase, `text-button` size
- White fill on dark sections; invert on sticky nav
- Focus: pseudo `::after` outline inset -4px, 1px neutral-50 border
- Often paired with arrow `➔` in label

### Secondary / outline button

- `border border-stroke-secondary text-white`
- Square icon buttons: `size-12` with border

### Ticket / pricing card

**Featured (mint):**
- `bg-[#14f195]` or similar mint
- Large price in display/mono font
- Arrow icon top-right
- Black text on mint

**Standard (dark):**
- `bg` neutral-800/900
- White label + price
- Same arrow affordance

### Accordion (`accordion-control`)

- `type-p-large` title, bold when active
- Full-width click target, focus-visible outline
- Body: `type-paragraph` descriptive text
- Used in "Why Breakpoint" section

### Stat block

- Giant number (display font)
- Eyebrow label below in mono small caps
- Row of 3 on desktop

### Testimonial / quote card

- White card on dark section
- Quote text + handle + name + role
- Optional glitch decoration nearby

### Event list item

- Date/time in mono
- Title + external link arrow
- Used in "Explore events" sidebar list

### FAQ section (`#faq`)

- `pt-xl md:pt-3xl`
- Accordion pattern, schema.org FAQPage markup

### Footer

- **Top wave:** SVG path divider, `fill: var(--footer-background-color)` (purple)
- **Body:** purple gradient background, social icons row, countdown timer
- **Mega wordmark:** `≡BREAKPOINT` display at bottom
- Links: mono uppercase + arrow

### Video / media modal

- `video-modal-overlay` fixed inset, blur backdrop
- `video-modal-content` max-width 64rem, 90vw

### Photo strip

- Infinite scroll marquee of event photos
- Color-filtered overlays (green, purple, blue)

---

## 7. Imagery & texture

- Hero: full-bleed landmark photography (Big Ben) + purple gradient wash
- Geometric angular purple shapes at section transitions
- Glitch text strings as decorative layer (not readable content)
- Event photos with brand-color duotone filters
- Social card: 1200×630 JPEG, purple skyline motif

---

## 8. Accessibility patterns observed

- Skip link: `sr-only` until focus (`focus:not-sr-only focus:bg-white`)
- `aria-label` on icon-only buttons and external links
- `focus-visible:outline` with offset on interactive elements
- `prefers-reduced-motion` respected for marquee
- Semantic landmarks: `nav`, `section`, `footer`, FAQ schema

---

## 9. What to adopt vs adapt for SVB

| Adopt | Adapt |
| ----- | ----- |
| Dark-first high-contrast layout | Warmer Borneo accents (teal, amber) alongside mint/purple |
| Mint accent for primary CTAs | Use mint for race points / success, not ticket sales |
| Mono uppercase UI labels | Labels for tasks, deadlines, team codes |
| Section vertical rhythm (80/120px) | Slightly tighter for mobile hackathon use |
| Accordion for FAQ / task details | Race task rules + FAQ |
| Stat blocks | Leaderboard standings, team points |
| Card grid patterns | Ticket cards → task cards, team cards |
| Glitch/display motion (subtle) | Hero only — avoid on leaderboard (clarity) |
| Footer wave + brand block | SVB wordmark + Sheraton/Kuching context |
| Step-based reveals on load | Page enter animations |
| **2025 archive:** wisp/azure palette | Landing bands, participation cards |
| **2025 archive:** `text-stat-display` | Leaderboard totals, task points |
| **2025 archive:** `.cta` button matrix | All primary actions |
| **2025 archive:** image filter + carousel | Speaker/partner rows, photo galleries |
| **2025 archive:** Radix FAQ accordion | FAQ + expandable task rules |

| Do not copy | Reason |
| ----------- | ------ |
| BP26 / ABC Favorit fonts | Licensing — use open fallbacks until licensed |
| London/Big Ben imagery | Regional — use Kuching waterfront, Sarawak motifs |
| Conference ticket pricing UI | SVB is free hackathon; cards = tasks/teams |
| Countdown to conference | Optional: countdown to Day 4 cutoff instead |
