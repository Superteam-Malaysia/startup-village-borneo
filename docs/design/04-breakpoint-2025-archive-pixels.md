# 04 — Breakpoint 2025 Archive (Pixel Specs)

> Source snapshot:
> [web.archive.org/web/20251127225341/https://solana.com/breakpoint](https://web.archive.org/web/20251127225341/https://solana.com/breakpoint)
>
> Abu Dhabi 2025 edition — distinct from the 2026 London site. This document
> records **pixel-level** measurements extracted from archived HTML + CSS
> (`6d444f02261d736d.css`, `61bfe45354d8d89d.css`).

---

## A. Color system (2025 archive)

### Core semantic colors

| Token | Hex / value | Role |
| ----- | ----------- | ---- |
| `--color-primary-null` | `#11081b` | Page background (deep violet-black) |
| `--color-primary-wisp` | `#e7d2f9` | Primary text on dark (lavender white) |
| `--color-primary-byte` | `#ab66fd` | Purple accent (CTAs, hover, tabs) |
| `--color-secondary-mint` | `#14f195` | Mint green |
| `--color-secondary-azure` | `#59b8fe` | Sky blue sections + bullets |
| `--color-secondary-lime` | `#c9ff7c` | Lime bullets / highlights |

### Transparency (wisp-tinted)

| Token | Value |
| ----- | ----- |
| `--color-transparent-wisp-10` | `#e7d2f91a` |
| `--color-transparent-wisp-20` | `#e7d2f933` |
| `--color-transparent-wisp-30` | `#e7d2f94d` |
| `--color-transparent-wisp-40` | `#e7d2f966` |
| `--color-transparent-wisp-60` | `#e7d2f999` |
| `--color-transparent-wisp-80` | `#e7d2f9cc` |

### Utility classes

| Class | Maps to |
| ----- | ------- |
| `bg-null` | `#11081b` |
| `bg-byte` | `#ab66fd` |
| `bg-azure` | `#59b8fe` |
| `bg-mint` | `#14f195` |
| `bg-lime` | `#c9ff7c` |
| `bg-transparent-wisp-10` | wisp 10% |
| `text-primary` | wisp text |
| `text-invert` | null text on light surfaces |
| `text-mint` | `#14f195` captions |
| `border-wisp-10` | wisp 10% border |

---

## B. Typography (2025 archive)

### Font families (proprietary — use fallbacks in SVB)

| CSS var | Breakpoint font | SVB fallback |
| ------- | --------------- | ------------ |
| `--font-abc-diatype` | ABC Diatype | DM Sans |
| `--font-macan-mono` | Macan Mono | JetBrains Mono |
| `--font-fh-lecturis` | FH Lecturis | Space Grotesk |

### Fluid display sizes

| Style | CSS | Desktop approx |
| ----- | --- | -------------- |
| `text-stat-display` | `clamp(4rem, 3.648rem + 1.502vw, 5rem)` | 80px, lh 83.2px, ls -2.56px |
| `text-xl` (countdown) | `clamp(var(--text-8xl), 2.768rem + 5.258vw, var(--text-10xl))` | up to 120px (7.5rem) |
| `text-h1` | clamp 4rem → 5rem | 80px |
| `text-h2` | clamp 2.5rem → 3.5rem | 56px, ls -0.8px |
| `text-h4` | 1.75rem (md: 2rem) | 28–32px |
| `text-h5` | 1.25rem (md: 1.75rem) | 20–28px |

### Eyebrow (`text-eyebrow`)

| Property | Value |
| -------- | ----- |
| Font | Macan Mono |
| Size | 0.882rem mobile → 1.0625rem md (`--text-md`) |
| Letter-spacing | 0.09375rem → 0.10625rem md |
| Transform | uppercase |
| Padding-inline | `var(--spacing-3xs)` = 8px |
| Margin-inline-start | 8px |
| Display | inline-block, align-self flex-start |

### Mono label (`text-p2-mono`)

| Property | Value |
| -------- | ----- |
| Size | 0.9375rem (`--text-sm`) |
| Letter-spacing | 0.075rem (1.2px) |
| Weight | medium (500) |
| Line-height | 1.125rem |

### CTA / button text (`text-button` via `.cta`)

| Property | Value |
| -------- | ----- |
| Font | Macan Mono |
| Size | 0.9375rem |
| Letter-spacing | 0.09375rem |
| Weight | medium |
| Transform | uppercase |

---

## C. Spacing & article wrapper

### Article shell (every `<article>`)

```
p-xs w-full md:px-s md:py-m
```

| Breakpoint | Padding |
| ---------- | ------- |
| Mobile | `padding: 16px` (`--spacing-xs`) all sides |
| md+ | `padding: 24px 24px` (`--spacing-s` horizontal + vertical) |

### Section padding presets

| Class combo | Top padding |
| ----------- | ----------- |
| `pt-xl md:pt-3xl` | 64px → 120px |
| `pt-2xl md:pt-3xl` | 80px → 120px |
| `pt-m md:pt-3xl` | 32px → 120px |
| `pb-xl md:pb-2xl` | bottom 64px → 80px |

### Gap scale (used in flex/grid)

`gap-3xs` 8px · `gap-2xs` 12px · `gap-xs` 16px · `gap-s` 24px · `gap-m` 32px · `gap-l` 48px · `gap-xl` 64px · `gap-2xl` 80px

---

## D. CTA button matrix (pixel-perfect)

Base classes on every interactive CTA:

```
gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center
cta-transition [&>svg]:transition-all [&>svg]:duration-300
outline-offset-[8px] outline-transparent
focus:outline focus:outline-transparent-wisp-40
```

`cta-transition`: transitions color, background, border, fill — 300ms default.

### Size variants

| Variant | Height | Padding-x | Notes |
| ------- | ------ | --------- | ----- |
| Compact | `h-[3rem]` (48px) | `px-[var(--spacing-xs)]` = 16px | Card inline CTAs |
| Default | `h-[3.5rem]` (56px) | `px-[var(--spacing-m)]` = 32px | Hero register |
| Large | `md:h-[4.25rem]` (68px) | `px-[var(--spacing-m)]` | Hero primary |

### Style variants

| Name | Classes | Hover |
| ---- | ------- | ----- |
| **Byte primary** | `bg-byte text-invert [&>svg]:fill-primary-null` | `hover:bg-primary-wisp hover:text-invert` |
| **Azure on card** | `bg-azure text-invert` on null card | same wisp hover |
| **Ghost bordered** | `bg-transparent border border-wisp text-primary-wisp` | `hover:bg-transparent-wisp-10` |
| **Ghost on mint** | `border-primary-null text-primary-null bg-transparent` | `hover:bg-transparent-null-10` |
| **Icon nav** | `w-[48px] h-[48px] border-wisp` | `hover:bg-transparent-wisp-10` |
| **Carousel arrow** | 48×48, `border-wisp`, svg 18×16 | fill wisp |

### Arrow SVG

- Inline CTA arrow: 10×10px, rotates 0° (east)
- External link arrow: 10×10 viewBox, diagonal northeast

---

## E. Hero section (archive layout)

### Container

```
section.pb-m px-s bg-transparent-wisp-10
flex flex-col justify-between relative
md:min-h-[calc(100vh-48px)]
min-h-[calc(100vh-98px)]
```

### Gradient overlay (`::before`)

```css
before:absolute before:inset-0 before:opacity-60
before:bg-[linear-gradient(249deg, var(--color-primary-null) 43.3%, rgba(17,8,27,0) 100%)]
```

### Logo

- Full wordmark SVG, `w-full pt-xs` (16px top)
- Intrinsic ~1396×165

### 4-column editorial grid

```
flex flex-col md:grid grid-cols-4
pt-s md:pt-0 md:gap-y-3xl md:gap-x-s
font-mono text-p2 uppercase
```

| Column | Content | Spacing |
| ------ | ------- | ------- |
| col-start-3 | `11-13 December` / `2025` | year `mb-[40px]` mobile |
| col-span-2 area | Abu Dhabi / UAE / Etihad Arena | `gap-y-[40px]` mobile, `gap-y-2xl` md |
| col-span-2 | Register CTA full width | `mb-s` mobile |

### Register button (hero)

- `bg-byte`, full width, h 56px / 68px md
- `px-[var(--spacing-m)]` = 32px horizontal

---

## F. Countdown block

### Ticker rows (above/below stats)

```
relative overflow-hidden whitespace-nowrap
-ml-xs md:-ml-s
w-[calc(100%+(var(--spacing-xs)*2))]
animate-ticker-reverse
animation-duration: 200s
```

- Text: `text-ticker` class, repeated "Breakpoint 2025" / "See You Soon"
- `motion-reduce:animate-none` for a11y

### Stat grid

```
grid grid-cols-1 gap-m md:grid-cols-12 md:gap-s
md:[&_.stat]:col-span-3
```

Each stat cell:

```
.stat flex flex-col gap-xs items-center
  span.text-xl     → FH Lecturis fluid up to 120px
  span.text-p2-mono → "Days" / "Hours" / etc.
```

---

## G. Ticket cards (azure band)

### Section wrapper

```
article.bg-azure text-invert pt-xl md:pt-3xl
```

### Grid

```
ul.gap-s grid card-sm:grid-cols-2 md-lg:grid-cols-4 mt-2xl
```

### Card shell (square)

```
p-xs md:px-s md:py-m aspect-[1/1]
flex flex-col justify-between
md:[&&]:p-s
```

| Variant | Background | Text | Border |
| ------- | ---------- | ---- | ------ |
| Featured null | `bg-null *:text-azure` | azure price on dark | `border-0` |
| Standard | `bg-azure text-invert` | white on blue | `border` 1px |

### Price

```
p.text-stat-display  → clamp 64–80px
h3.text-p2-mono      → ticket tier name
mt-auto gap-m        → pushes price + CTA to bottom
```

### Card CTA

`h-[3rem]` (48px), `md:flex-1`, `bg-azure` or wisp hover pattern.

---

## H. Action cards (Get Involved — 5:4 ratio)

```
aspect-[5/4] md:[&&]:p-s
```

| Card | bg | Featured |
| ---- | -- | -------- |
| Speak | `bg-null *:text-mint` | dark + mint text |
| Sponsor / Press | `bg-mint text-invert` | mint fill |
| Content | `bg-mint` | mint fill |

Body: `text-p2-mono` at bottom via `mt-auto gap-m`.

Grid: `card-sm:grid-cols-2 md-lg:grid-cols-4 mt-xl gap-s`.

---

## I. Why attend — theme bullets

12-column grid: `md:grid-cols-12 gap-l md:gap-s mt-2xl`

Bullet row:

```
flex items-center gap-2xs
div.size-2xs bg-secondary-lime   → 12×12px dot
span.text-p2-mono                → theme label
p.pt-xs text-h4                  → body (28px md)
```

Dot colors observed: `bg-secondary-lime`, `bg-secondary-azure`.

---

## J. Speaker carousel card

Slide width:

- Mobile: `flex-[0_0_calc(75%)]`
- Desktop: `flex-[0_0_calc(33.333%-var(--spacing-xs))]`

Image:

```
aspect-[4/3] overflow-hidden
object-fit: cover; height: 100%
```

Text stack:

```
p.text-h4          → name
p.text-caption.text-mint → role (mint, 11px, ls 1.1px)
p.text-caption     → org
gap-xs between caption lines
```

Carousel nav: 48×48 bordered buttons, `gap-3xs`, hidden mobile.

---

## K. Schedule tabs + rows

### Tab list

```
flex gap-m overflow-x-auto whitespace-nowrap scrollbar-hidden
```

Tab button:

```
font-abc-diatype text-h2 normal-case cta-transition
hover:text-byte (→ #ab66fd)
```

- Active: `text-primary`, `pointer-events-none`, `aria-selected=true`
- Inactive: `text-secondary` (wisp 60%)

### Timeline row

```
grid grid-cols-12 gap-s
border-b-1 border-wisp-10 pt-s pb-l
```

| Column | Span | Content |
| ------ | ---- | ------- |
| Time meta | `md:col-span-2` | `text-caption`, mint time `text-secondary-mint` |
| Title | `md:col-span-9` | `h3` plain weight |

Hover group: `group-hover:text-primary-byte` on time labels.

---

## L. FAQ accordion (Radix)

### Layout

```
article flex-col md:flex-row
left: md:w-5/12 (heading)
right: md:w-6/12 mt-xl (accordion)
```

### Item

```
group mt-s pb-s border-b-wisp-10 border-b-1 grid
```

### Trigger

```
h5 normal-case text-left group-hover:text-byte
flex justify-between w-full
```

### Expand icon box

| Property | Value |
| -------- | ----- |
| Size | `size-m` = 32×32px |
| Border | `border-1 border-stroke-tertiary` (wisp) |
| Icon | Two 12px (`w-2xs`) bars, 2px height, centered |
| Hover | `group-hover:border-primary-byte`, `group-hover:bg-primary-byte` on bars |
| Open | vertical bar rotates to 360° (`group-data-[state=open]:rotate-360`) |

### Content animation

`accordion-slide-down` / `accordion-slide-up` — 0.2s linear.

---

## M. Image filter (photo treatment)

Applied to carousel/card images:

```css
.image-filter img {
  filter: grayscale() contrast() brightness();
  object-fit: cover;
}
.image-filter::before {
  /* SVG fractal noise overlay, opacity 1 */
}
.image-filter::after {
  background: var(--tint);
  mix-blend-mode: multiply;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.group-image-filter:hover .image-filter-hover::after {
  opacity: 1;
}
```

---

## N. Sponsor logo grid

```
grid grid-cols-2 gap-y-3xs gap-x-2xs
md:grid-cols-6 md:gap-s
```

Cell:

```
flex items-center justify-center aspect-16/9
.image-mask (mask-size contain)
hover:opacity-80 transition-opacity
```

Headline sponsors: `md:grid-cols-3`; supporting: `md:grid-cols-6`.

---

## O. Navigation inset-shadow hover

Nav link inner div:

```
inset-shadow-[0px_-2px_0px_0px] inset-shadow-transparent
hover:inset-shadow-transparent-wisp-40
py-xs
```

Creates **bottom inset highlight** on hover (2px wisp line).

Sticky nav list:

```
inset-shadow-[0px_-1px_0px_0px] inset-shadow-transparent-wisp-30/100
```

---

## P. Breakpoints (container max-widths)

| Min-width | Container max |
| --------- | ------------- |
| 23.5rem (376px) | 23.5rem |
| 37.5rem (600px) | 37.5rem |
| 48.063rem (769px) | 48.063rem |
| 55.5rem (888px) | 55.5rem |
| 64rem (1024px) | 64rem |
| 90.063rem (1441px) | 90.063rem |

Custom nav breakpoint: `nav-sm` ≈ 55.5rem for horizontal nav links.

---

## Q. Animation catalog

| Name | Duration | Easing |
| ---- | -------- | ------ |
| `ticker` / `ticker-reverse` | 2s default, 200s on hero | linear infinite |
| `accordion-slide-down/up` | 0.2s | linear |
| `dialog-overlay-show/hide` | 0.2s | linear |
| `embla__viewport` | 0.3s | ease-out |
| `cta-transition` | 300ms | default |
