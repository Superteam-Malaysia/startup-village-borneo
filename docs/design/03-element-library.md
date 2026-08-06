# 03 — Element Library

Catalog of reusable UI elements for Startup Village Borneo. Each entry maps to
Breakpoint patterns documented in
[`01-breakpoint-reverse-engineering.md`](./01-breakpoint-reverse-engineering.md),
the 2025 archive pixel specs in
[`04-breakpoint-2025-archive-pixels.md`](./04-breakpoint-2025-archive-pixels.md),
and SVB adaptations in [`02-brand-design-plan.md`](./02-brand-design-plan.md).

**Halftone UI** covers print-screen meters and charts — see
[`06-halftone-ui-integration.md`](./06-halftone-ui-integration.md) (not duplicated as EL IDs here).

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
| EL-26 | Article section shell | `p-xs md:px-s md:py-m` | Page section wrapper |
| EL-27 | Wisp eyebrow | `text-eyebrow` + padding | Section labels |
| EL-28 | CTA system | `.cta` + size matrix | All buttons/links |
| EL-29 | Nav inset-shadow link | inset-shadow hover | Sticky nav tabs |
| EL-30 | Hero editorial grid | 4-col dates/venue | Landing hero |
| EL-31 | Hero gradient veil | `::before` linear-gradient | Hero overlay |
| EL-32 | Stat display price | `text-stat-display` | Points, prices, big nums |
| EL-33 | Countdown stat cell | `.stat` + `text-xl` | Timer units |
| EL-34 | Text ticker marquee | `animate-ticker-reverse` | Hero/footer motion |
| EL-35 | Square ticket card | `aspect-[1/1]` azure band | Task tier cards |
| EL-36 | Action card 5:4 | `aspect-[5/4]` mint/null | Get involved cards |
| EL-37 | Theme bullet row | `size-2xs` colored dot | Why attend / tracks |
| EL-38 | Speaker carousel slide | `group-image-filter` 4:3 | Partner/speaker row |
| EL-39 | Schedule tab (h2) | `text-h2 hover:text-byte` | Day picker |
| EL-40 | Schedule timeline row | 12-col `border-wisp-10` | Agenda items |
| EL-41 | Mint spotlight band | `bg-mint` full article | Featured campaign |
| EL-42 | Carousel nav 48px | bordered icon buttons | Media carousels |
| EL-43 | Sponsor logo cell | `image-mask aspect-16/9` | Partner grid |
| EL-44 | FAQ accordion radix | animated +/- box 32px | FAQ + task rules |
| EL-45 | Image filter stack | grayscale + noise + tint | Photo treatment |
| EL-46 | Azure section band | `bg-azure text-invert` | Full-width CTA sections |
| EL-47 | Byte primary CTA | `bg-byte` purple button | Primary register |
| EL-48 | Get involved 4-col grid | `md-lg:grid-cols-4` | Participation cards |
| EL-49 | Video highlight card | carousel + year label | Recap / fireside |
| EL-50 | Closing CTA band | azure + h2 + dual CTA | Event sign-off |
| EL-51 | Event map section | `#map` + EventMap component | Sheraton / venue |
| EL-52 | Map search input | 48px dark field + icon | Find tasks/rooms |
| EL-53 | Floor tab bar (mobile) | 3-col byte active | Level/day switcher |
| EL-54 | Floor list button (desktop) | sidebar level rows | Level picker |
| EL-55 | Map pan/zoom container | `event-map-container` 16:9 | Interactive plan |
| EL-56 | Floor plan image layer | stacked webp opacity fade | Floor/venue art |
| EL-57 | Numbered map pin | SVG mint pulse + number | Zone markers |
| EL-58 | Icon map pin | smaller circle + 16px icon | Single POI |
| EL-59 | Map leader line | mint orthogonal path | Pin to edge |
| EL-60 | Zone callout panel | byte border + location list | Selected zone |
| EL-61 | Location list chip | `bg-wisp/5` rounded row | Booth/task row |
| EL-62 | Map zoom controls | 28px stack bottom-right | Pan/zoom UI |
| EL-63 | Event nav Map link | `#map` inset-shadow tab | Live event nav |

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

## Archive elements (EL-26–EL-50)

> Pixel-level source:
> [2025 archive snapshot](https://web.archive.org/web/20251127225341/https://solana.com/breakpoint).
> Full measurements in [`04-breakpoint-2025-archive-pixels.md`](./04-breakpoint-2025-archive-pixels.md).

### EL-26 — Article section shell

| Property | Value |
| -------- | ----- |
| Mobile padding | 16px all sides (`p-xs` / `--spacing-xs`) |
| Desktop padding | 24px (`md:px-s md:py-m`) |
| Width | `w-full` |
| Typical stacks | `flex flex-col gap-xl md:gap-2xl` |

Wrap every major page section in `<article>` with this padding pattern.

**Status:** `reference`

---

### EL-27 — Wisp eyebrow label

| Property | Value |
| -------- | ----- |
| Font | Macan Mono → `font-mono` |
| Size | 14.1px mobile → 17px md |
| Letter-spacing | 1.5px → 1.7px md |
| Transform | uppercase |
| Padding-inline | 8px |
| Margin-inline-start | 8px |
| Color | `--color-primary-wisp` `#e7d2f9` |

Pseudo-layout: inline-block, `align-self: flex-start`, sits above EL-07.

**Status:** `token`

---

### EL-28 — CTA system (canonical button)

Supersedes EL-02 for archive-derived builds. Base class chain:

```
cta uppercase flex items-center justify-center gap-xs cta-transition
outline-offset-[8px] focus:outline-transparent-wisp-40
[&>svg]:transition-all [&>svg]:duration-300
```

| Size | Height | Padding-x |
| ---- | ------ | --------- |
| `sm` | 48px | 16px |
| `md` | 56px | 32px |
| `lg` | 68px (md+) | 32px |

| Variant | Background | Text | Border |
| ------- | ---------- | ---- | ------ |
| `byte` | `#ab66fd` | invert | — |
| `azure` | `#59b8fe` | invert | — |
| `ghost-wisp` | transparent | wisp | 1px wisp |
| `ghost-null` | transparent | `#11081b` | 1px null (on mint) |

Hover (byte/azure): `background #e7d2f9`, text invert. Ghost: `bg-transparent-wisp-10`.

**Status:** `token`

---

### EL-29 — Nav inset-shadow link

Inner wrapper on nav anchors:

```
py-xs (16px vertical)
inset-shadow-[0px_-2px_0px_0px] inset-shadow-transparent
hover:inset-shadow-transparent-wisp-40
```

Creates 2px bottom inset line in wisp 40% on hover. Nav bar uses 1px inset `wisp-30`.

**Status:** `reference`

---

### EL-30 — Hero editorial grid

4-column grid on `md+`:

| Area | Grid | Typography |
| ---- | ---- | ---------- |
| Dates | `col-start-3` | mono `text-p2` uppercase |
| Venue block | default cols | stacked city/country/arena, `gap-y-40px` mobile |
| CTAs | `col-span-2` | full-width EL-28 `lg` |

Min-height: `calc(100vh - 48px)` desktop, `calc(100vh - 98px)` mobile.

**Status:** `reference`

---

### EL-31 — Hero gradient veil

Absolute `::before` on hero section:

```css
inset: 0;
opacity: 0.6;
background: linear-gradient(249deg, #11081b 43.3%, rgba(17,8,27,0) 100%);
```

Layer under content (`z-10`), over background media (`z-[-1]`).

**Status:** `reference`

---

### EL-32 — Stat display typography

Class `text-stat-display`:

| Property | Value |
| -------- | ----- |
| Size | `clamp(64px, 3.648rem + 1.502vw, 80px)` |
| Line-height | clamp 66.5px → 83.2px |
| Letter-spacing | clamp -4px → -2.56px |
| Weight | 400 |
| Font | FH Lecturis → `font-display` |

Used for ticket prices (`$500`), leaderboard totals, prize pool.

**Status:** `token`

---

### EL-33 — Countdown stat cell

```
.stat flex flex-col gap-xs items-center
  .text-xl        → fluid up to 120px (countdown number)
  .text-p2-mono   → "Days" / "Hours" label
```

Grid: 4 equal columns on md (`col-span-3` each in 12-col). Gap: 32px (`gap-m`).

**Status:** `reference`

---

### EL-34 — Text ticker marquee

Container: full-bleed negative margin to escape padding.

| Property | Value |
| -------- | ----- |
| Animation | `ticker reverse`, 200s linear infinite |
| Text class | `text-ticker` (15px mono) |
| Overflow | hidden, nowrap |
| A11y | `motion-reduce:animate-none`, duplicate spans for seamless loop |

**SVB use:** "STARTUP VILLAGE BORNEO" / "KUCHING 2026" hero band.

**Status:** `reference`

---

### EL-35 — Square ticket card

On `bg-azure` section band (EL-46):

| Property | Value |
| -------- | ----- |
| Aspect | 1:1 (`aspect-[1/1]`) |
| Padding | 16px mobile → 24px md |
| Layout | flex col, `justify-between` |
| Featured variant | `bg-null`, child text `*:text-azure` |
| Standard | `bg-azure text-invert` |
| Title | `text-p2-mono` top |
| Price | EL-32 bottom stack via `mt-auto gap-m` |
| CTA | EL-28 `sm` `azure` or `byte`, `md:flex-1` |

Grid: 2 cols mobile → 4 cols desktop, gap 24px.

**Status:** `reference`

---

### EL-36 — Action card (5:4)

Get Involved / participation cards:

| Property | Value |
| -------- | ----- |
| Aspect | 5:4 (`aspect-[5/4]`) |
| Featured | `bg-mint text-invert` |
| Default | `bg-null *:text-mint` |
| Body | `text-p2-mono` at bottom |
| CTA row | `gap-2xs`, ghost-null on mint |

**Status:** `reference`

---

### EL-37 — Theme bullet row

```
flex items-center gap-2xs (12px)
  div.size-2xs (12×12px) bg-lime | bg-azure
  span.text-p2-mono — theme title
p.pt-xs.text-h4 — description (28–32px)
```

Used in 12-col grid (`md:col-span-4` per theme).

**Status:** `reference`

---

### EL-38 — Speaker carousel slide

| Property | Value |
| -------- | ----- |
| Slide width | 75% mobile / `calc(33.333% - 16px)` desktop |
| Image | `aspect-[4/3]`, cover, EL-45 filter |
| Name | `text-h4` |
| Role | `text-caption text-mint` (11px, mint) |
| Org | `text-caption` |
| Gap below image | `gap-s` (24px) |

Nav: EL-42 prev/next.

**Status:** `reference`

---

### EL-39 — Schedule tab (archive style)

Large day tabs — distinct from EL-16:

| Property | Value |
| -------- | ----- |
| Font | ABC Diatype → `font-sans` |
| Size | `text-h2` (40–56px fluid) |
| Transform | normal-case (not uppercase) |
| Active | `text-primary`, `pointer-events-none` |
| Inactive | `text-secondary` (wisp 60%) |
| Hover | `text-byte` `#ab66fd` |
| List | horizontal scroll, `gap-m` (32px), hidden scrollbar |

**Status:** `reference`

---

### EL-40 — Schedule timeline row

| Column | md span | Content |
| ------ | ------- | ------- |
| Meta | 2 | time mint, date, session type — `text-caption` |
| Body | 9 | `h3` title/description |

Row: `border-b-1 border-wisp-10`, `pt-s pb-l` (24px / 48px). Hover: meta turns byte purple.

**Status:** `reference`

---

### EL-41 — Mint spotlight band

Full-width article: `bg-mint text-invert`, image + copy split `md:grid-cols-12`.

Featured campaign pattern (Community Spotlights / voting). Image column `md:col-span-6`.

**Status:** `reference`

---

### EL-42 — Carousel nav button (48px)

| Property | Value |
| -------- | ----- |
| Size | 48×48px |
| Border | 1px wisp |
| Background | transparent |
| Hover | `bg-transparent-wisp-10` |
| Icon | 18×16px arrow SVG |
| Gap between pair | `gap-3xs` (8px) |

**Status:** `reference`

---

### EL-43 — Sponsor logo cell

| Property | Value |
| -------- | ----- |
| Aspect | 16:9 |
| Layout | flex center |
| Mask | `image-mask` contain |
| Grid | 2 col mobile → 6 col md |
| Gap | 8px mobile / 24px md |
| Hover | `opacity-80`, `transition-opacity` |

Logo asset: white/monochrome on dark.

**Status:** `reference`

---

### EL-44 — FAQ accordion (Radix)

Two-column FAQ layout: heading `md:w-5/12`, accordion `md:w-6/12`.

Expand control: 32×32px box, 1px wisp border, animated +/- bars (12×2px).

| State | Bar color |
| ----- | --------- |
| Default | wisp bars |
| Hover | byte purple border + fill |
| Open | vertical bar rotates 360° |

Content: `accordion-slide-down` 0.2s linear.

**Status:** `reference`

---

### EL-45 — Image filter stack

Photo treatment for cards/carousels:

1. `grayscale() contrast() brightness()` on img
2. SVG noise `::before` (opacity 1)
3. Tint `::after`, `mix-blend-mode: multiply`, opacity 0.85
4. Hover: opacity 1 on `::after`

Wrap in `group-image-filter` for hover chain.

**Status:** `reference`

---

### EL-46 — Azure section band

Full article: `bg-azure` `#59b8fe`, `text-invert`, `pt-xl md:pt-3xl`.

Contains ticket grids (EL-35), register CTAs, closing sections. Invert text to `#11081b` on buttons.

**Status:** `token`

---

### EL-47 — Byte primary CTA

Purple register button: `bg-byte` `#ab66fd`, invert text, svg fill null.

Hero default: full width, EL-28 `lg`. Most prominent CTA on page.

**Status:** `token`

---

### EL-48 — Get involved 4-col grid

```
ul.gap-s grid card-sm:grid-cols-2 md-lg:grid-cols-4 mt-xl
```

Optional intro row: `md:grid-cols-4 border-b-1 border-stroke-primary pb-m`.

Cards: mix of EL-36 variants (speak null, sponsor/press mint).

**Status:** `reference`

---

### EL-49 — Video highlight card

Carousel item with year label (`2024`), session title, speakers. White/light text on dark.

Paired with EL-42 navigation. Hidden on mobile carousel controls in some sections.

**Status:** `reference`

---

### EL-50 — Closing CTA band

`bg-azure`, `h2` + `text-p1` body, dual CTA row `md:flex-row gap-s mt-l`.

Sign-off pattern ("See you in Abu Dhabi" → SVB: "See you in Kuching").

**Status:** `reference`

---

## Event map elements (EL-51–EL-63)

> Full pixel specs: [`05-breakpoint-event-map-pixels.md`](./05-breakpoint-event-map-pixels.md).
> Extracted from Dec 11, 2025 event-day archive (not the Nov 27 pre-event URL).

| ID | Summary | Key pixels |
| -- | ------- | ---------- |
| EL-51 | Section shell `id="map"`, eyebrow + venue `h2` | `bg-null`, EL-26 padding |
| EL-52 | Search `h-12 px-4`, border `wisp/20`, focus `byte/50` | 48px height, 20px icon |
| EL-53 | Mobile tabs `grid-cols-3`, active `bg-byte` | `text-xs`, `py-2` |
| EL-54 | Desktop level rows `px-4 py-3`, count badge `text-[12px]` | active `byte/20` border |
| EL-55 | `aspect-video`, react-transform pan/zoom, canvas underlay | 8/4 grid split |
| EL-56 | Layered webp, opacity 1 vs 0.1, 500ms fade | `object-contain` |
| EL-57 | Pin `r=3`, pulse-ring 1.5s, number `font-size 2.2` | mint `#14f195` |
| EL-58 | Pin `r=2.5` + 16×16 icon embed | white icon on null fill |
| EL-59 | Leader `stroke #14f19566`, width 0.35, square caps | end dot `r=0.5` |
| EL-60 | Callout `border-byte/50 p-4`, badge 24–28px circle | zone title `text-byte` |
| EL-61 | Chip `px-3 py-2 bg-wisp/5 rounded-md text-sm` | partner \| location format |
| EL-62 | Zoom stack `bottom-4 right-4`, buttons 28×28 | `bg-null/50` border `wisp/10` |
| EL-63 | Nav `href="#map"` with EL-29 inset hover | event-mode nav item |

**SVB use:** Sheraton floor plan, Amazing Race station clusters, workshop rooms at Voco.

**Status:** `reference` + assets in `docs/design/assets/`

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
| EL-26 | `components/shell/ArticleSection.tsx` |
| EL-27–07 | `components/ui/Typography.tsx` |
| EL-28, EL-47 | `components/ui/CtaButton.tsx` |
| EL-29 | `components/shell/NavLink.tsx` |
| EL-30–31 | `components/landing/Hero.tsx` |
| EL-32–33 | `components/ui/StatDisplay.tsx` |
| EL-34 | `components/ui/TextTicker.tsx` |
| EL-35–36, EL-48 | `components/ui/ActionCard.tsx` |
| EL-37 | `components/ui/ThemeBullet.tsx` |
| EL-38, EL-42 | `components/ui/Carousel.tsx` |
| EL-39–40 | `components/schedule/*` |
| EL-41, EL-46, EL-50 | `components/ui/SectionBand.tsx` |
| EL-43 | `components/ui/SponsorLogo.tsx` |
| EL-44 | `components/ui/Accordion.tsx` |
| EL-45 | `components/ui/ImageFilter.tsx` |
| EL-51–63 | `apps/web/src/components/venue/EventMap.tsx` + subcomponents |

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-08-06 | Initial library from Breakpoint 2026 London reverse engineering |
| 2026-08-06 | Added EL-26–EL-50 from 2025 archive pixel specs (wisp/azure/cta system) |
| 2026-08-06 | Added EL-51–EL-63 event map + floor plans (Dec 11 event-day archive) |
