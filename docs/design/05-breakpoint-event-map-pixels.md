# 05 — Breakpoint Event Map & Floor Plans (Pixel Specs)

> **Important:** The URL you shared
> ([`web/20251127225334`](https://web.archive.org/web/20251127225334/https://solana.com/breakpoint))
> is a **pre-event** snapshot (Nov 27, 2025) — identical to the marketing site with
> no interactive map. The **Event Map** shipped during the conference.
>
> **Source used for extraction:**
> [web.archive.org/web/20251211145857/https://solana.com/breakpoint](https://web.archive.org/web/20251211145857/https://solana.com/breakpoint)
> (Dec 11, 2025 — event day 1, Etihad Arena).
>
> Component: `@/components/EventMap` (Sanity CMS–driven location data).

---

## 1. Section shell

```html
<div id="map"></div>
<article class="p-xs w-full md:px-s md:py-m text-primary bg-null">
  <div class="flex flex-col gap-2xl sm:gap-l">
    <p class="text-eyebrow">Event Map</p>
    <h2>Etihad Arena</h2>
  </div>
  ...
</article>
```

| Property | Value |
| -------- | ----- |
| Eyebrow | EL-27 pattern — "EVENT MAP" |
| Title | `h2` default — venue name |
| Background | `bg-null` `#11081b` |
| Padding | 16px mobile / 24px md |
| Nav link | `#map` with inset-shadow hover (EL-29) |

During the event, primary nav includes **Map** alongside Speakers and Sponsors
(pre-event nav had Overview, Schedule, Travel, FAQ).

---

## 2. Layout grid (desktop)

```
grid gap-4 md:grid-cols-12
├── md:col-span-8  → interactive map (EL-55)
└── md:col-span-4  → sidebar (search + levels + callout) — hidden on mobile stack
```

Mobile: map full width first, then floor tabs, then callout card below map.

---

## 3. Floor plan assets

| File | URL path | Role |
| ---- | -------- | ---- |
| `ground.webp` | `/breakpoint/map/ground.webp` | Ground level isometric plan |
| `mezz.webp` | `/breakpoint/map/mezz.webp` | Mezzanine seating bowl |
| `floor-1.webp` | `/breakpoint/map/floor-1.webp` | Floor 1 interior |

Reference copies (archive): `docs/design/assets/bp-map-*.webp`

### Image layer stack (EL-56)

All three images stacked `absolute inset-0`, `object-contain object-center`:

| Property | Value |
| -------- | ----- |
| Transition | `opacity 500ms ease-in-out` |
| Active floor | `opacity: 1`, `z-index: 10` |
| Inactive floors | `opacity: 0.1`, `z-index: 2–3` |
| Draggable | `draggable="false"` |

Floor plans: isometric 3D architectural renders on light gray `#f5f5f5` background;
booths color-coded (purple, green, orange accents on ground level).

---

## 4. Map container (EL-55)

```html
<div class="event-map-container relative w-full aspect-video box-border overflow-hidden">
```

| Property | Value |
| -------- | ----- |
| Aspect ratio | `aspect-video` (16:9) |
| Touch | `touch-action: pan-x pan-y pinch-zoom` |
| Pan/zoom | `react-transform-wrapper` + `react-transform-component` |
| Canvas layer | `absolute inset-0 z-0` — full size `<canvas>` under transform |
| SVG overlay | `absolute inset-0`, `viewBox="0 0 100 100"`, `preserveAspectRatio="xMidYMid meet"`, `z-index: 20` |

---

## 5. Search input (EL-52)

Desktop sidebar + mobile above map (`md:hidden` duplicate).

| Property | Value |
| -------- | ----- |
| Height | `h-12` (48px) |
| Padding | `px-4 pr-10` (16px left, 40px right for icon) |
| Background | `#11081b` |
| Border | `1px border-wisp/20` (`#e7d2f933`) |
| Text | white, `font-abc-diatype` |
| Placeholder | `Search locations...`, `placeholder-wisp/40` |
| Focus | `outline-none`, `border-byte/50` (`#ab66fd` 50%) |
| Icon | 20×20 search SVG, `absolute right-3 top-1/2 -translate-y-1/2`, `text-wisp/40` |

---

## 6. Floor level selector

### Mobile — 3-column tabs (EL-53)

```
grid grid-cols-3 gap-1 p-1
bg-[#11081b] border border-wisp/20
```

| State | Classes |
| ----- | ------- |
| Active | `bg-byte text-[#11081b]`, `py-2`, `text-xs`, `font-abc-diatype` |
| Inactive | `text-wisp hover:bg-wisp/10` |

Labels: **Ground** · **Mezzanine** · **Floor 1**

### Desktop — vertical list (EL-54)

Heading: `h5 text-wisp/60 text-sm font-medium mb-1` — "Levels"

| State | Background | Border | Text | Count badge |
| ----- | ---------- | ------ | ---- | ----------- |
| Active | `bg-byte/20` | `border-b border-t border-byte/50` | `text-byte` | `bg-byte/30`, `text-[12px]`, `px-2 py-0.5` |
| Inactive | `bg-[#11081b]` | `border-b border-t border-wisp/20` | `text-wisp` | `bg-wisp/10` |
| Hover | `hover:bg-wisp/10` | — | — | — |

Row padding: `px-4 py-3` (16px × 12px). Layout: `flex justify-between`.

**Location counts (Ground day 1):** Ground 8 · Mezzanine 2 · Floor 1 4

---

## 7. SVG map markers (EL-57, EL-58)

### Numbered zone pin (primary pattern)

```svg
<g class="pointer-events-auto cursor-pointer">
  <circle r="3" fill="none" stroke="#14f195" stroke-width="0.3"
    style="animation: pulse-ring 1.5s ease-out infinite"/>  <!-- ping -->
  <circle r="3" fill="#14f195" stroke="#14f19566" stroke-width="0.3"/>
  <text font-size="2.2" font-weight="bold" font-family="var(--font-abc-diatype)"
    text-anchor="middle" dominant-baseline="central"
    fill="#11081b">1</text>  <!-- or fill #FFF on dark pin fill -->
</g>
```

| Property | Value |
| -------- | ----- |
| Pin radius | 3 units in 100×100 viewBox (~6% of map width) |
| Mint stroke | `#14f195` |
| Mint fill 40% | `#14f19566` for leader lines |
| Pulse animation | `pulse-ring`: scale 1→2, opacity 0.8→0, 1.5s ease-out infinite |
| Number font size | 2.2 viewBox units |
| Active pin fill | `#14f195` mint with `#11081b` text |
| Default pin fill | `#11081b` with `#FFF` text |

### Icon pin (single locations)

Smaller circle `r="2.5"` + embedded 16×16 icon SVG at `3.3×3.3` viewBox units.
Icons observed: info dot, utensils/food, drink, book — white on dark pin.

### Leader lines (EL-59)

Orthogonal paths from pin to map edge:

```
path fill="none" stroke="#14f19566" stroke-width="0.35"
stroke-linecap="square" stroke-linejoin="miter"
class="transition-all duration-300"
```

Terminal dot: `circle r="0.5" fill="#14f195"`

---

## 8. Zone callout panel (EL-60)

Shown when a numbered zone is selected. Desktop: sidebar below level list.
Mobile: below floor tabs.

### Container

| Property | Mobile | Desktop |
| -------- | ------ | ------- |
| Background | `#11081b` | `#11081b` |
| Border | `border-byte/50` | `border-byte/50` |
| Padding | `p-4` (16px) | `p-4` |
| Max height | — | `max-h-80 overflow-y-auto flex-1` |
| Gap | `gap-3` | `gap-3` |

### Header row

```
flex items-center justify-between
  [badge w-6 h-6 mobile / w-7 h-7 desktop] rounded-full bg-byte text-[#11081b]
  h5 text-byte font-medium text-sm (mobile) / default (desktop)
  [Close] 20×20 X icon, text-wisp/60 hover:text-white
```

Example zone title: **Touch Grass** (badge `1`).

### Location chips (EL-61)

```
px-3 py-2 bg-wisp/5 rounded-md text-xs (mobile) / text-sm (desktop) text-wisp/80
```

Examples from Ground floor zone 1:
- Merch | Solana Press Lab
- KAST - Coffee / Barista
- Squads - Booth
- Unitas - Arabian Lounge
- 0xMatcha - Matcha Station & Majlis
- Phantom - Majlis
- Solayer - Majlis
- Streamflow - Majlis

Chip stack: `flex flex-col gap-2`.

---

## 9. Zoom controls (EL-62)

Position: `absolute bottom-4 right-4 flex flex-col gap-2 z-30`

| Button | Size | Style |
| ------ | ---- | ----- |
| Zoom in | 28×28px (`w-7 h-7`) | `bg-[#11081b]/50`, `border border-wisp/10` |
| Zoom out | 28×28px | same |
| Reset | 28×28px | same |

| State | Text/icon |
| ----- | --------- |
| Default | `text-white/70` |
| Hover | `text-white`, `bg-wisp/10` |
| Icon | 14×14 SVG stroke, `stroke-width: 2` |
| Aria | `Zoom in`, `Zoom out`, `Reset zoom` |

---

## 10. Schedule block (below map)

Same article pattern as pre-event but **day tabs reflect event day**:
- Dec 11 archive: **11 Dec** selected (mint time `9AM - 7PM`)
- Session row uses EL-40 timeline pattern
- CTA below sessions: full-width register button

Map section is immediately followed by Schedule (`#schedule` content in same page flow).

---

## 11. CSS animations (from 2026 bundle, shared)

```css
.event-map-container { touch-action: pan-x pan-y pinch-zoom; }

.event-map-callout-pulse {
  animation: callout-pulse 2s ease-in-out infinite;
}
@keyframes callout-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.event-map-line-animate {
  animation: line-dash 1s linear infinite;
}
@keyframes line-dash {
  to { stroke-dashoffset: -10px; }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}
```

---

## 12. SVB adaptation notes

| Breakpoint | Startup Village Borneo |
| ---------- | ---------------------- |
| Etihad Arena 3 floors | Sheraton Kuching + workshop venues (Voco Day 2) |
| Booth zones | Amazing Race station clusters, partner office hours |
| Search locations | Search race tasks, rooms, food spots |
| Numbered zones | Group nearby tasks (e.g. Waterfront cluster) |
| Mint pins | Use mint for active task; teal for schedule rooms |
| Floor tabs | Day 1–5 or venue zones instead of building levels |

Candidate epic: **Venue map** for Sheraton + race geography — reuse EL-51–EL-62.

---

## 13. Archive reference assets

| Asset | Path in repo |
| ----- | ------------ |
| Ground floor | `docs/design/assets/bp-map-ground.webp` |
| Mezzanine | `docs/design/assets/bp-map-mezz.webp` |
| Floor 1 | `docs/design/assets/bp-map-floor-1.webp` |

These are Breakpoint/Etihad reference renders — do not ship in SVB production;
use as style reference for commissioning Kuching venue art.
