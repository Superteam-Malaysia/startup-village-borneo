# Design System — Startup Village Borneo

This directory holds the **UI brand plan**, the **Breakpoint reverse-engineering
analysis**, and the **element library** for the event companion dApp.

The visual language is derived from [Solana Breakpoint](https://solana.com/breakpoint)
(Solana's flagship conference site) and adapted for Startup Village Borneo: same
Solana ecosystem credibility, warmer Borneo/Kuching regional identity, and
hackathon-first utility (leaderboard, submissions, judging).

## Reading order

| # | Document | What it covers |
| - | -------- | -------------- |
| 1 | [`01-breakpoint-reverse-engineering.md`](./01-breakpoint-reverse-engineering.md) | What Breakpoint does visually: tokens, typography, components, motion — extracted from live CSS/HTML. |
| 2 | [`02-brand-design-plan.md`](./02-brand-design-plan.md) | How we adapt Breakpoint patterns for SVB: brand pillars, color strategy, regional accents, page templates. |
| 3 | [`03-element-library.md`](./03-element-library.md) | Catalog of reusable UI elements with specs, states, and implementation notes. |
| 4 | [`04-breakpoint-2025-archive-pixels.md`](./04-breakpoint-2025-archive-pixels.md) | Pixel-level specs from the 2025 Abu Dhabi archive (wisp/azure CTA system, carousels, accordions). |

## Tokens (implementation-ready)

| File | Purpose |
| ---- | ------- |
| [`tokens/breakpoint-reference.css`](./tokens/breakpoint-reference.css) | Extracted Breakpoint design tokens (reference only — proprietary fonts not included). |
| [`tokens/svb-theme.css`](./tokens/svb-theme.css) | Startup Village Borneo theme: adapted palette, spacing, typography fallbacks. |

Import `svb-theme.css` in the web client when the Next.js app is scaffolded.

## Relationship to Spec Kit

- Run `/speckit-specify` for UI-heavy features (e.g. leaderboard, schedule) and
  link back to `03-element-library.md` for component constraints.
- Brand changes start here, then update blueprint docs if they affect product vision.

## Font licensing note

Breakpoint uses **ABC Favorit** (body/mono) and a custom **BP26** display face.
These are not redistributed in this repo. `svb-theme.css` uses open fallbacks
(**Space Grotesk**, **DM Sans**, **JetBrains Mono**) until licensed fonts are procured.
