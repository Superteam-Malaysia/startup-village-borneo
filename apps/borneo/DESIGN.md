# SVB webapp — design contract

Deliberate choices for Startup Village Borneo. Audited with [unslop-ui v2](https://github.com/JCarterJohnson/vibecoded-design-tells).

## Reference

Solana Breakpoint 2025 archive (dark null field, byte purple, halftone data surfaces) — not a generic SaaS template.

## Color

- **Null** `#11081b` — page background (Breakpoint dark, not cream/beige)
- **Wisp** `#e7d2f9` — primary text on dark
- **Byte** `#ab66fd` — Breakpoint purple accent (brand token, not Tailwind violet default `#a855f7`) <!-- unslop-ignore: intentional Breakpoint brand -->
- **Azure / lime** — secondary accents from archive

## Typography

- **Display:** Syne 700–800 — geometric, event-scale headlines
- **Body:** Newsreader — editorial readability on long program copy (dark theme; not cream+sage pairing)
- **Data:** IBM Plex Mono — stats, schedule times, halftone labels

## Layout

- Left-aligned program pages with `PageHeader` (title + optional lead; no eyebrow stack)
- Home hero: Halftone wordmark + stat tiles, asymmetric CTA row
- Breakpoint ticket cards (`bp-card`) for action surfaces

## Components

- **CTAs:** Uppercase mono from Breakpoint EL-28 archive (`.cta`) <!-- unslop-ignore: reverse-engineered archive -->
- **Labels:** Sentence case via `.text-label` utilities (not spaced-caps kickers)
- **Radius:** 2–4px on data tiles; no pill-everything

## Motion

- Minimal; `prefers-reduced-motion` respected in theme tokens

## Scan

```bash
python3 ../../.cursor/skills/unslop-ui/scripts/devibe_scan.py src --severity high
```
