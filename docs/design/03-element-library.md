# 03 — Element Library

Catalog of reusable UI elements for Startup Village Borneo. Each entry maps to
Breakpoint patterns documented in
[`01-breakpoint-reverse-engineering.md`](./01-breakpoint-reverse-engineering.md)
and SVB adaptations in [`02-brand-design-plan.md`](./02-brand-design-plan.md).

**Status key:** `reference` = spec only (not implemented) · `token` = CSS tokens exist

---

## Library index

| ID | Element | Breakpoint source | SVB use |
| -- | ------- | ----------------- | ------- |
| EL-01 | App navigation | Sticky `nav` + `bp26-button` | Global shell |
| EL-02 | Primary button | `bp26-button` | CTAs |
| EL-03 | Secondary button | Outlined + arrow | Secondary actions |
| EL-04 | Icon button | `size-12` bordered | Nav icons, carousel |
| EL-05 | Eyebrow label | `type-eyebrow` | Section context |
| EL-06 | Display heading | `font-bp26` / display scale | Page heroes |
| EL-07 | Section heading | H2 white | Section titles |
| EL-08 | Stat block | Stats row | Points, team count |
| EL-09 | Featured card (mint) | Ticket featured card | High-value task |
| EL-10 | Standard card (dark) | Ticket dark card | Tasks, teams |
| EL-11 | Status chip | — (derived) | Submission state |
| EL-12 | Accordion | `accordion-control` | FAQ, task rules |
| EL-13 | Leaderboard row | Stats + table patterns | Standings |
| EL-14 | Submission form | Button + input patterns | Thread URL intake |
| EL-15 | Cutoff banner | — (derived) | Day 4 deadline |
| EL-16 | Schedule day tab | Nav tabs pattern | Day 1–5 agenda |
| EL-17 | Timeline item | Event list item | Workshops |
| EL-18 | Quote / testimonial card | White card on dark | Social proof |
| EL-19 | Footer | Purple wave footer | Site footer |
| EL-20 | Modal overlay | `video-modal-overlay` | Wallet connect, confirm |
| EL-21 | Glitch display text | `bp-glitch-*` | Landing hero only |
| EL-22 | Block reveal | `bp-block-wipe` | Section enter |
| EL-23 | Photo strip | `photo-strip-track` | Community gallery |
| EL-24 | Empty state | — (derived) | No team, no submissions |
| EL-25 | Toast / alert | — (derived) | Score updates, errors |

---

## EL-01 — App navigation

**Breakpoint reference:** Centered floating `nav[aria-label="Primary"]`, `z-40`,
scroll-triggered width/transform transition, compact `≡BP26` logo, white REGISTER CTA.

### Anatomy

```
[ ≡ SVB ]  ·············  Schedule  Race  Team  [ CONNECT WALLET ]
```

### Specs

| Property | Value |
| -------- | ----- |
| Height | 48px compact / 56px expanded |
| Background | `transparent` → `color-bg-secondary` on scroll |
| Position | `sticky top-0`, `z-index: var(--z-nav)` |
| Logo | Mono `≡SVB` or SVG wordmark |
| Links | Sans 0.875rem, white, hover opacity 70% |
| CTA | EL-02 primary button, compact (`h-8`) when sticky |

### States

- **Default:** transparent over hero
- **Scrolled:** dark bg, border-bottom `stroke-primary`
- **Mobile:** hamburger → full-screen menu (`text-menu-title` scale links)

### A11y

- `aria-label="Primary"` on nav
- Skip link before nav
- Focus visible on all items

**Status:** `reference`

---

## EL-02 — Primary button (`bp26-button` pattern)

**Breakpoint reference:** `bp26-button group/button inline-flex font-mono text-button uppercase`

### Variants

| Variant | Background | Text | Border |
| ------- | ---------- | ---- | ------ |
| `primary` | `color-bg-invert` (#fff) | `color-text-invert` | none |
| `accent` | `color-bg-accent` (mint) | `color-text-on-accent` | none |
| `ghost` | transparent | `color-text-primary` | `stroke-secondary` |

### Specs

| Property | Value |
| -------- | ----- |
| Font | `font-mono`, `text-button` (0.875rem) |
| Weight | 700 |
| Transform | uppercase |
| Letter-spacing | `tracking-button` (0.07rem) |
| Padding | 12px 20px (default), 8px 16px (sm) |
| Min height | 40px |
| Transition | `color/background 150ms var(--ease-out-expo)` |

### States

- **Hover:** `primary` → neutral-200 fill; `accent` → slightly darker mint
- **Focus-visible:** `::after` pseudo inset -4px, 1px `stroke-focus` border (Breakpoint pattern)
- **Disabled:** `neutral-600` fill, no pointer

### Label pattern

Include arrow for external/navigation actions: `SUBMIT THREAD ➔`

**Status:** `token` + `reference`

---

## EL-03 — Secondary button

**Breakpoint reference:** Outlined row buttons — `border border-stroke-secondary text-white`

### Specs

- Border: 1px `color-stroke-secondary`
- Background: transparent
- Hover: `background: color-transparent-white-10`
- Same typography as EL-02
- Often used in horizontal row: `flex gap-xs flex-wrap`

**SVB use:** "VIEW RULES", "OPEN IN X", filter toggles.

**Status:** `reference`

---

## EL-04 — Icon button

**Breakpoint reference:** `flex size-12 items-center justify-center border border-stroke-secondary`

### Specs

- Size: 48×48px (`size-12`)
- Icon: 20–24px, centered
- Border: 1px stroke-secondary
- Hover: border brightens to stroke-primary

**SVB use:** Carousel prev/next, close modal, copy link.

**Status:** `reference`

---

## EL-05 — Eyebrow label

**Breakpoint reference:** `type-eyebrow` — mono, uppercase, tracked.

### Specs

| Property | Value |
| -------- | ----- |
| Font | `font-mono` |
| Size | 1rem |
| Letter-spacing | 0.08rem |
| Line-height | 1.3 |
| Color | `color-text-secondary` or accent for urgency |
| Transform | uppercase |

### Examples

- `DAY 4 · SUBMISSIONS CLOSE 18:00 MYT`
- `AMAZING RACE · 6 PTS`
- `GET INVOLVED`

**Status:** `token`

---

## EL-06 — Display heading

**Breakpoint reference:** `font-bp26`, `text-display` / `text-h1`, tight leading.

### Specs

- Font: `font-display` (Space Grotesk)
- Size: `clamp(2.5rem, 8vw, 5rem)`
- Line-height: `leading-tight` (0.98)
- Color: `color-text-primary`
- Optional: split color — first word `color-text-highlight` (purple)

### Motion (landing only)

- Optional EL-21 glitch wrapper
- Optional EL-22 block-wipe on enter

**Status:** `token`

---

## EL-07 — Section heading

### Specs

- Size: `text-h2` clamp(1.75rem, 4vw, 4rem)
- Color: white
- Margin-top: follows eyebrow with `space-xs` gap
- Section spacing below: `space-l`

**Status:** `token`

---

## EL-08 — Stat block

**Breakpoint reference:** "2,200+" / "75+" / "$650B+" row with labels.

### Anatomy

```
┌──────────────┐
│   1,240      │  ← display/mono, large
│  TOTAL PTS   │  ← eyebrow label
└──────────────┘
```

### Specs

| Property | Value |
| -------- | ----- |
| Number font | Display or mono, 3–5rem |
| Label font | Mono eyebrow, `color-text-secondary` |
| Layout | Flex row, equal columns, gap `space-m` |
| Align | Center on mobile, left on desktop |

### SVB variants

- Team total points
- Tasks completed / total
- Rank position
- Time until cutoff

**Status:** `reference`

---

## EL-09 — Featured card (mint)

**Breakpoint reference:** General Admission ticket — mint `#14f195` background, black text, arrow top-right.

### Anatomy

```
┌─────────────────────────────────────┐
│  ➔                                  │
│                                     │
│  ONBOARD A REAL USER                │
│  10 PTS                             │
│  Teach wallet · document friction   │
│                                     │
│  [ SUBMIT THREAD ➔ ]                │
└─────────────────────────────────────┘
```

### Specs

| Property | Value |
| -------- | ----- |
| Background | `color-bg-accent` (#14f195) |
| Text | `color-text-on-accent` |
| Padding | `space-m` (32px) |
| Min height | 200px |
| Border radius | `radius-lg` (8px) optional — Breakpoint uses sharp corners |
| Arrow affordance | Top-right, 24px |

### When to use

- Highest-point active task
- Featured race challenge
- Primary call-to-action card in a grid

**Status:** `token`

---

## EL-10 — Standard card (dark)

**Breakpoint reference:** Developers / Students / Late Bird ticket cards.

### Specs

| Property | Value |
| -------- | ----- |
| Background | `color-bg-elevated` (#1a1a1a) |
| Border | 1px `color-stroke-primary` optional |
| Text primary | white |
| Text secondary | `color-text-secondary` |
| Padding | `space-m` |
| Hover | border `stroke-secondary` → brighter, subtle lift optional |

### Sub-elements

- Title: body-lg bold
- Points: mono, 2rem
- Description: body, secondary color
- Footer: EL-02 or EL-03

**SVB use:** Team cards, race tasks, schedule workshops, judge team cards.

**Status:** `token`

---

## EL-11 — Status chip

**Derived** — Breakpoint does not use chips; SVB needs submission states.

### Variants

| Variant | Background | Text | Border |
| ------- | ---------- | ---- | ------ |
| `pending` | `#f59e0b1a` | amber | amber 30% |
| `approved` | `#14f1951a` | mint | mint 30% |
| `rejected` | `#ef44441a` | red | red 30% |
| `locked` | `#ffffff0a` | muted | stroke-primary |
| `draft` | transparent | secondary | stroke-secondary |

### Specs

- Font: mono, `text-caption`, uppercase
- Padding: 4px 8px
- Radius: `radius-sm`
- Inline in cards and table rows

**Status:** `token`

---

## EL-12 — Accordion

**Breakpoint reference:** `accordion-control` + expandable body in "Why Breakpoint".

### Anatomy

```
▾ The institutional turn          ← p-large, bold when open
  Descriptive paragraph text...   ← paragraph style
─────────────────────────────────
▸ The infrastructure leap
```

### Specs

| Property | Value |
| -------- | ----- |
| Trigger font | body-lg (1.5rem), sans |
| Trigger weight | 400 closed / 700 open |
| Body font | paragraph 1.125rem |
| Divider | 1px stroke-primary between items |
| Icon | Chevron or `+`/`−` mono |
| Padding | `space-s` vertical per item |

### A11y

- `button` element for trigger
- `aria-expanded`, `aria-controls`
- Focus-visible outline

**SVB use:** FAQ, Amazing Race task rules, wallet onboarding steps.

**Status:** `reference`

---

## EL-13 — Leaderboard row

**Derived** from stat blocks + dark table aesthetics.

### Desktop table row

| Rank | Team | Points | Last activity | Status |
| ---- | ---- | ------ | ------------- | ------ |
| 1 | Team Laksa | 84 | 2m ago | ▲ +6 |
| 2 | Monke Builders | 78 | 15m ago | — |

### Specs

| Property | Value |
| -------- | ----- |
| Row height | 56px min |
| Rank 1 | Left border 3px mint OR mint text on rank |
| Font data | Mono for points, timestamps |
| Font name | Sans bold for team name |
| Hover | `bg` elevated +5% brightness |
| Update flash | Brief mint background fade on point change |

### Mobile

Convert to EL-10 cards stacked, rank badge top-left.

**Rules (constitution):** No decorative glitch; numbers must be legible at arm's length.

**Status:** `reference`

---

## EL-14 — Submission form

**Derived** from Breakpoint CTA + input patterns.

### Fields

1. X/Twitter thread URL (required)
2. Task selector (if not contextual)
3. Optional note (organizer only)

### Specs

- Input: dark bg `color-bg-secondary`, border `stroke-primary`, mono for URL
- Focus: border `stroke-focus`
- Submit: EL-02 `accent` variant
- Show server timestamp on success (audit trail)
- Validate URL pattern client-side; enforce cutoff server-side

### Error states

- After cutoff: EL-15 banner + disabled submit
- Invalid URL: red border + caption text
- Duplicate: amber warning

**Status:** `reference`

---

## EL-15 — Cutoff banner

**Derived** — urgency without Breakpoint equivalent.

### Specs

| Property | Value |
| -------- | ----- |
| Background | coral at 15% opacity OR amber when >1h left |
| Border | 1px solid matching accent |
| Text | mono eyebrow + sans message |
| Position | Sticky below nav when active |
| Icon | Clock mono |

### Messages

- `SUBMISSIONS CLOSE IN 2H 14M — 18:00 MYT DAY 4`
- `SUBMISSIONS CLOSED — NO NEW ENTRIES AFTER 18:00`

**Status:** `token`

---

## EL-16 — Schedule day tab

**Derived** from nav + section patterns.

### Specs

- Horizontal scroll on mobile
- Tab: mono uppercase, padding `space-xs` `space-s`
- Active: mint underline 2px OR mint text
- Inactive: secondary text
- Days: `DAY 1` … `DAY 5` with date subtitle

**Status:** `reference`

---

## EL-17 — Timeline item

**Breakpoint reference:** Ecosystem event list — mono date/time + title + external link.

### Anatomy

```
10:00  Opening · Superteam MY                    ➔
11:15  Workshop · Elfa AI                        ➔
```

### Specs

- Time: mono, `color-text-accent` if "now"
- Title: sans, body
- Speaker: secondary, caption
- Divider between items
- "Now" indicator: teal left bar 3px (`svb-color-borneo-teal`)

**Status:** `reference`

---

## EL-18 — Quote / testimonial card

**Breakpoint reference:** White card on black section, community highlights.

### Specs

| Property | Value |
| -------- | ----- |
| Background | `color-bg-invert` (white) |
| Text | `color-text-invert` |
| Quote font | body-lg or h5 |
| Attribution | mono caption — handle, name, role |
| Padding | `space-m` |
| Radius | `radius-lg` |

**SVB use:** Builder quotes, partner testimonials, optional on landing.

**Status:** `reference`

---

## EL-19 — Footer

**Breakpoint reference:** SVG wave top, purple bg, social icons, countdown, mega wordmark.

### Anatomy

```
~~~~ SVG wave ~~~~  (purple)
[ social icons ]     © SUPERTEAM MY · SOCOE 2026     CONTACT ➔
        COUNTDOWN: 3 DAYS · 4 HOURS · ...
        ≡ STARTUP VILLAGE BORNEO
```

### Specs

| Property | Value |
| -------- | ----- |
| Background | `color-bg-brand` (purple) |
| Wave SVG | `fill: currentColor`, preserveAspectRatio none |
| Social icons | 24px, black on purple, hover 70% opacity |
| Countdown | display font, black text |
| Wordmark | display, full width, black |

**SVB adaptation:** Countdown to Day 4 cutoff OR event start, not conference tickets.

**Status:** `reference`

---

## EL-20 — Modal overlay

**Breakpoint reference:** `video-modal-overlay` — fixed inset, blur, 80% black.

### Specs

| Property | Value |
| -------- | ----- |
| Overlay | `rgba(0,0,0,0.8)` + `backdrop-filter: blur(8px)` |
| Content max-width | 640px (forms) / 1024px (media) |
| Z-index | `var(--z-modal)` |
| Animation | fade 200ms |
| Close | EL-04 icon button top-right |

**SVB use:** Wallet connect, confirm submission, reject reason.

**Status:** `reference`

---

## EL-21 — Glitch display text

**Breakpoint reference:** `bp-glitch-root`, `bp-glitch-jitter`, `bp-glitch-scanlines`, `bp-glitch-slice`.

### CSS variables (from Breakpoint)

```css
--bp-glitch-duration: 0.52s;
--bp-glitch-scanline-alpha: 45%;
--bp-glitch-scanline-pitch: 2px;
```

### Rules for SVB

- **Landing hero only** — never on leaderboard, forms, or scores
- Trigger once on page load, not continuous
- Disable entirely when `prefers-reduced-motion: reduce`
- Intensity: `bp-glitch-sm` (subtle) not full intensity

**Status:** `token` (reference vars in breakpoint-reference.css)

---

## EL-22 — Block reveal

**Breakpoint reference:** `bp-block-wipe`, `bp-block-reveal`.

### Specs

- Wipe: `clip-path: inset(0 100% 0 0)` → `inset(0)`, 1.5s `steps(6)`
- Reveal: polygon clip, 0.9s `steps(5)`
- Use on: section headings, hero subtext
- Max 1–2 per viewport to avoid fatigue

**Status:** `reference`

---

## EL-23 — Photo strip

**Breakpoint reference:** `photo-strip-track`, 50s infinite pan, reduced-motion safe.

### Specs

- Images: event photos with duotone filter (mint/purple/teal overlays)
- Height: 120–160px strip
- Gap: 8px between images
- Pause on hover (optional)
- `will-change: transform`

**SVB use:** Landing footer, Amazing Race gallery, community section.

**Status:** `reference`

---

## EL-24 — Empty state

**Derived.**

### Anatomy

```
[ illustration optional ]
No team yet
Join or create a team before Day 2 lunch.
[ FIND A TEAM ➔ ]
```

### Specs

- Centered, max-width 400px
- Title: h5 sans
- Body: secondary paragraph
- CTA: EL-02 or EL-03
- Optional: subtle Borneo line illustration at 20% opacity

**Status:** `reference`

---

## EL-25 — Toast / alert

**Derived.**

### Variants

| Type | Accent | Icon |
| ---- | ------ | ---- |
| Success | mint | check |
| Error | red | x |
| Warning | amber | ! |
| Info | purple | i |

### Specs

- Position: bottom-center mobile, top-right desktop
- Auto-dismiss: 5s (success), persistent (error)
- Font: mono message, sans detail
- Animation: slide + fade 300ms expo

**SVB use:** "Submission received", "Points awarded +6", "Cutoff passed".

**Status:** `reference`

---

## Implementation mapping (future)

When the Next.js app is scaffolded, map elements to components:

| Element ID | Suggested component path |
| ---------- | ------------------------ |
| EL-01 | `components/shell/AppNav.tsx` |
| EL-02–04 | `components/ui/Button.tsx` |
| EL-05–07 | `components/ui/Typography.tsx` |
| EL-08 | `components/ui/StatBlock.tsx` |
| EL-09–10 | `components/ui/Card.tsx` |
| EL-11 | `components/ui/StatusChip.tsx` |
| EL-12 | `components/ui/Accordion.tsx` |
| EL-13 | `components/race/LeaderboardRow.tsx` |
| EL-14 | `components/race/SubmissionForm.tsx` |
| EL-15 | `components/race/CutoffBanner.tsx` |
| EL-16–17 | `components/schedule/*` |
| EL-19 | `components/shell/Footer.tsx` |
| EL-20 | `components/ui/Modal.tsx` |
| EL-25 | `components/ui/Toast.tsx` |

Global styles: import `docs/design/tokens/svb-theme.css` → move to `app/globals.css` when app exists.

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-08-06 | Initial library from Breakpoint reverse engineering |
