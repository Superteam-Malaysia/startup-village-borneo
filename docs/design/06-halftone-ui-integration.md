# 06 — Halftone UI integration

> **Stack decision:** SVB product UI uses **Breakpoint elements** for layout and marketing chrome,
> and **Halftone UI** (`halftone-kit`) for textured data surfaces (meters, charts, stat cards).

| Layer | Source | Use in SVB |
| ----- | ------ | ---------- |
| **Structure & chrome** | Breakpoint reverse-engineering | Nav, sections, CTAs, ticket cards, accordion, event map, typography |
| **Data & texture** | [Halftone UI](https://halftone-ui.com/docs/) | Leaderboard trends, race progress meters, capacity gauges, pressed stat tiles |

Do **not** mix dither plugins, Paper Shaders, or other texture libraries in v1 — Halftone UI is the
sole print-screen asset layer.

---

## Why this split

- **Breakpoint** gives Solana-event credibility: mint CTAs, wisp/null palette, mono UI, venue map.
- **Halftone UI** gives crafted print texture on **numbers** without sacrificing accessibility —
  canvases are decorative; values live in `<progress>`, `<table>`, and native `<button>`.

Glitch and heavy motion stay on the landing hero only (constitution). Halftone drift is subtle and
honors `prefers-reduced-motion`.

---

## Repo layout

| Path | Role |
| ---- | ---- |
| `apps/web/src/halftone/core/` | Framework-free press engine (degit copy-in) |
| `apps/web/src/halftone/react/` | React Provider + Button, Meter, Card, BarChart, LineChart |
| `apps/web/src/components/halftone/` | `SvbHalftoneProvider`, showcase demos |
| `apps/web/src/components/ui/` | Breakpoint-derived CtaButton, ActionCard, etc. |
| `apps/web/src/styles/svb-theme.css` | SVB tokens + `--ink`, `--purple`, `--green` for Halftone palette |

Install / refresh kit:

```bash
cd apps/web
npx degit ecgang/halftone-ui/halftone-kit/core src/halftone/core
npx degit ecgang/halftone-ui/halftone-kit/react src/halftone/react
```

---

## SVB mapping

| Screen | Breakpoint | Halftone UI |
| ------ | ---------- | ----------- |
| Landing hero | Section intro, CtaButton, ticket ActionCards | Optional low-opacity Card wash — not required v1 |
| Leaderboard | StatDisplay row layout, table chrome | `BarChart` / `LineChart` for points trend; `Meter` for cutoff window |
| Team dashboard | StatusChip, SectionArticle | `Meter` for tasks done; `Card` for team summary |
| Amazing Race | EventMap, CtaButton | `Meter` for task completion fraction |
| Schedule | Accordion, mono timestamps | — (keep clean; no halftone on body lists) |

---

## Provider

Wrap halftone subtrees once per page (or app shell):

```tsx
import { SvbHalftoneProvider } from "@/components/halftone";

<SvbHalftoneProvider>
  <Meter value={6} max={12} color="green" />
</SvbHalftoneProvider>
```

`SvbHalftoneProvider` sets `seed={2026}` and `mode="dark"`. Ink colors come from CSS custom properties
in `svb-theme.css` (`--ink`, `--purple`, `--green`, …).

---

## Color tokens

Halftone `color="purple"` resolves to `--purple` on `:root`. Map SVB semantics:

| Halftone `color` | CSS var | SVB meaning |
| ---------------- | ------- | ----------- |
| `green` | `--green` | Mint — approved, race tasks, points up |
| `purple` | `--purple` | Brand highlight, content tasks |
| `orange` | `--orange` | Pending / cutoff urgency |
| `blue` | `--blue` | Azure accent (schedule, links) |

---

## Showcase

Live demos: `http://localhost:3000/design-system#halftone` after `npm run dev`.

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-08-06 | Adopt Halftone UI alongside Breakpoint; vendored halftone-kit; documented stack split |
