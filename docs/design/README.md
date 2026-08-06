# Design System — Startup Village Borneo

This directory holds the **UI brand plan**, the **Breakpoint reverse-engineering
analysis**, and the **element library** for the event companion dApp.

The visual language combines [Solana Breakpoint](https://solana.com/breakpoint) layout patterns
with [Halftone UI](https://halftone-ui.com/docs/) print-screen surfaces for data (leaderboard,
race progress). Same Solana ecosystem credibility, warmer Borneo/Kuching regional identity, and
hackathon-first utility (leaderboard, submissions, judging).

## Visual stack (v1)

| Layer | Tool | Repo |
| ----- | ---- | ---- |
| Chrome & layout | Breakpoint elements | `apps/web/src/components/ui/`, `breakpoint-components.css` |
| Data surfaces | Halftone UI kit | `apps/web/src/halftone/`, `components/halftone/` |

See [`06-halftone-ui-integration.md`](./06-halftone-ui-integration.md) for how the two layers compose.

## Reading order

| # | Document | What it covers |
| - | -------- | -------------- |
| 1 | [`01-breakpoint-reverse-engineering.md`](./01-breakpoint-reverse-engineering.md) | What Breakpoint does visually: tokens, typography, components, motion — extracted from live CSS/HTML. |
| 2 | [`02-brand-design-plan.md`](./02-brand-design-plan.md) | How we adapt Breakpoint patterns for SVB: brand pillars, color strategy, regional accents, page templates. |
| 3 | [`03-element-library.md`](./03-element-library.md) | Catalog of reusable UI elements with specs, states, and implementation notes. |
| 4 | [`04-breakpoint-2025-archive-pixels.md`](./04-breakpoint-2025-archive-pixels.md) | Pixel-level specs from the 2025 Abu Dhabi archive (wisp/azure CTA system, carousels, accordions). |
| 5 | [`05-breakpoint-event-map-pixels.md`](./05-breakpoint-event-map-pixels.md) | Interactive event map, floor plans, pins, callouts (Dec 11 event-day archive). |
| 6 | [`06-halftone-ui-integration.md`](./06-halftone-ui-integration.md) | Halftone UI stack: meters, charts, copy-in kit, SVB screen mapping. |

## Tokens (implementation-ready)

| File | Purpose |
| ---- | ------- |
| [`tokens/breakpoint-reference.css`](./tokens/breakpoint-reference.css) | Extracted Breakpoint design tokens (reference only — proprietary fonts not included). |
| [`tokens/svb-theme.css`](./tokens/svb-theme.css) | Startup Village Borneo theme: adapted palette, spacing, typography fallbacks. |
| [`assets/bp-map-*.webp`](./assets/) | Reference floor plan renders from Breakpoint 2025 (Etihad Arena) — design reference only. |

Import `svb-theme.css` in the web client global CSS.

## Implementation (React components)

The element library is **implemented in code**, not only documented:

| Path | Contents |
| ---- | -------- |
| `apps/web/src/components/ui/` | CtaButton, Section, StatDisplay, ActionCard, Accordion, StatusChip |
| `apps/web/src/components/halftone/` | SvbHalftoneProvider, HalftoneShowcase (Halftone UI) |
| `apps/web/src/halftone/` | Vendored halftone-kit (`core` + `react`) |
| `apps/web/src/components/venue/` | EventMap (pan/zoom, floor layers, SVG pins) |
| `apps/web/src/styles/` | `svb-theme.css`, `breakpoint-components.css` |
| `apps/web/public/map/` | Reference floor plan WebP assets |
| `apps/web/src/app/design-system/` | Live showcase page |

```bash
cd apps/web && npm install && npm run dev
# → http://localhost:3000/design-system  (Breakpoint chrome + Halftone data surfaces)
```

## Relationship to Spec Kit

- Run `/speckit-specify` for UI-heavy features (e.g. leaderboard, schedule) and
  link back to `03-element-library.md` for component constraints.
- Brand changes start here, then update blueprint docs if they affect product vision.

## Font licensing note

Breakpoint uses **ABC Favorit** (body/mono) and a custom **BP26** display face.
These are not redistributed in this repo. `svb-theme.css` uses open fallbacks
(**Space Grotesk**, **DM Sans**, **JetBrains Mono**) until licensed fonts are procured.
