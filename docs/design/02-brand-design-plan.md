# 02 — Brand Design Plan (Startup Village Borneo)

> Adapts Breakpoint visual patterns for the event companion dApp. Read
> [`01-breakpoint-reverse-engineering.md`](./01-breakpoint-reverse-engineering.md) first.
> Data surfaces use [Halftone UI](https://halftone-ui.com/docs/) — see
> [`06-halftone-ui-integration.md`](./06-halftone-ui-integration.md).

---

## 0. Visual stack (v1)

| Concern | Source | Examples |
| ------- | ------ | -------- |
| Layout, marketing, venue | **Breakpoint elements** | CTA, ticket cards, accordion, event map, section rhythm |
| Leaderboard, progress, charts | **Halftone UI** | Meter, BarChart, LineChart, pressed Card |

No dither shaders or alternate texture libraries in product UI for v1. Breakpoint glitch stays
hero-only.

---

## 1. Brand positioning

**Breakpoint says:** global institutional Solana conference, London finance, scale.

**Startup Village Borneo should say:** builder energy, tropical Borneo, five-day
hackathon + Amazing Race, community-first, Solana-native but approachable.

### Brand pillars

| Pillar | Visual expression |
| ------ | ----------------- |
| **Solana credible** | Mint `#14f195`, purple highlights, wallet-forward UI |
| **Borneo warm** | Teal/amber accents, photography of Kuching, craft textures (subtle) |
| **Hackathon urgent** | Clear deadlines, live leaderboard, mono timestamps |
| **Teach, don't sell** | Calm onboarding flows, no aggressive CTAs (constitution IV) |
| **Fair & transparent** | Auditable score UI, visible cutoff states |

---

## 2. Color strategy

### Primary palette (use daily)

```
Background:   #0e0e10  (primary)  /  #111214  (secondary)  /  #1a1a1a  (cards)
Text:         #f5f5f5  (primary)  /  #a2a2a2  (secondary)
Accent mint:  #14f195  — CTAs, approved submissions, race task type, points up
Accent purple:#aa67fb  — brand moments, content tasks, footer, highlights
```

### Borneo secondary palette (regional warmth)

```
Teal:    #0d9488  — schedule, "happening now", water/river motif
Amber:   #f59e0b  — pending review, warnings, sunset warmth
Coral:   #f97316  — deadline urgency, cutoff approaching
Forest:  #14532d  — sustainability track, subtle backgrounds
```

### Semantic colors (product-specific)

| State | Color | Usage |
| ----- | ----- | ----- |
| Approved | `--svb-color-solana-mint` | Submission approved, points awarded |
| Pending | `--svb-color-borneo-amber` | Awaiting organizer review |
| Rejected | `#ef4444` | Rejected submission (with reason) |
| Cutoff passed | `--svb-color-borneo-coral` | After Day 4 18:00 — locked |
| Content task | Purple | Amazing Race content-category tasks |
| Race task | Mint | Location/check-in race tasks |
| Leaderboard rank 1 | Mint border/glow | Top team highlight |

Tokens live in [`tokens/svb-theme.css`](./tokens/svb-theme.css).

---

## 3. Typography plan

### Font stack (v1 — open source)

| Role | Font | Weight | Use |
| ---- | ---- | ------ | --- |
| Display | Space Grotesk | 500–700 | Hero, page titles, big stats |
| Body | DM Sans | 400–700 | Paragraphs, form labels |
| UI / data | JetBrains Mono | 400–700 | Buttons, timestamps, scores, task IDs |

Upgrade path: license ABC Favorit + a custom display face if brand budget allows.

### Hierarchy for SVB screens

| Level | Style | Example |
| ----- | ----- | ------- |
| Page title | Display, clamp(2rem–5rem) | "Amazing Race" |
| Section | H2, uppercase optional | "YOUR TEAM" |
| Card title | H5 / body-lg bold | "Choon Hui Cafe" |
| Eyebrow | Mono, uppercase, tracked | "DAY 4 · HARD CUTOFF 18:00" |
| Body | 1.125rem | Task descriptions |
| Data | Mono | `+6 pts · 14:32 MYT` |
| Button | Mono uppercase 0.875rem | "SUBMIT THREAD" |

### Rules

- Mono for anything **time-sensitive** or **score-related** (audit trail feel).
- Sans for **instructions** and **onboarding** (readability for first-time users).
- Display only for **hero** and **major stats** — not dense tables.

---

## 4. Layout templates (page archetypes)

### A. Marketing / landing (Breakpoint-like)

- Full-bleed hero with Kuching imagery + gradient overlay
- Eyebrow + display headline + primary CTA
- Section stack: black backgrounds, 80/120px vertical rhythm
- Use for: public landing, pre-event info

### B. App shell (participant / organizer)

```
┌─────────────────────────────────────────────┐
│  Nav: logo | Schedule | Race | Team | Wallet │
├─────────────────────────────────────────────┤
│  Eyebrow (context)                          │
│  Page title                                 │
├─────────────────────────────────────────────┤
│  Main content (cards, tables, forms)        │
│                                             │
└─────────────────────────────────────────────┘
```

- Sticky top nav (Breakpoint sticky pattern, simplified)
- No full glitch on data views
- Container: 16px mobile / 32px desktop padding

### C. Leaderboard (hackathon-critical)

- Live standings table/cards — **high readability, no decorative motion**
- Rank column, team name, total points, last activity
- Task breakdown expandable per team (organizer view)
- Mint highlight for rank 1; subtle stroke for ranks 2–3

### D. Task / submission card

- Breakpoint ticket-card pattern adapted:
  - **Mint featured card** = active task with highest points or deadline today
  - **Dark cards** = other tasks in category
  - Status chip: pending / approved / rejected / locked
  - Thread URL field + timestamp

### E. Schedule

- Day tabs (Day 1–5) + timeline list
- "Happening now" bar in teal
- Workshop cards with partner logo slot
- Fixed daily rhythm note in eyebrow

### F. Demo day / judging

- White cards on dark bg (Breakpoint testimonial pattern)
- Rubric sliders or score inputs
- Judge identity in mono footer on each card

---

## 5. Motion & interaction plan

| Context | Motion | Rationale |
| ------- | ------ | --------- |
| Landing hero | Subtle block-wipe reveal, optional light glitch on title | Brand moment |
| Page enter | Fade + 8px translate, 300ms expo ease | Polished but fast |
| Leaderboard update | Number tick or brief mint flash on change | Live feel |
| Cutoff warning | Amber pulse on banner (not entire page) | Urgency without panic |
| Buttons | Color transition 150ms | Breakpoint default |
| Glitch / scanlines | **Landing only** | Avoid on forms and scores |
| Marquee photo strip | Optional footer/community section | Event energy |
| All animations | Respect `prefers-reduced-motion` | Accessibility |

---

## 6. Imagery & illustration

### Photography direction

- Kuching Waterfront, cat statue, Carpenter Street murals, food race tasks
- Warm evening light, diverse teams building
- Partner workshop shots (with permission)
- **Avoid** stock crypto clichés (floating coins, neon cityscapes)

### Graphic motifs (light touch)

- Angular purple shapes at section breaks (Breakpoint-derived)
- Optional subtle batik-inspired line pattern at 5% opacity on footers
- SVG wave divider before footer (Breakpoint footer pattern)

### Icons

- Simple line icons, 24px default
- External link arrow `➔` on outbound links (Breakpoint convention)
- Wallet icon for connect flow — standard Solana wallet adapter

---

## 7. Component priority for v1

Build order aligned with product epics ([`02-product-vision.md`](../blueprint/02-product-vision.md)):

| Priority | Components | Epic |
| -------- | ---------- | ---- |
| P0 | App shell, nav, buttons, cards, status chips | Foundation |
| P0 | Leaderboard table, stat blocks, score badges | Amazing Race |
| P0 | Submission form, cutoff banner, thread link card | Submissions |
| P1 | Schedule day tabs, timeline items, "now" indicator | Schedule |
| P1 | Team member list, join/create team cards | Teams |
| P2 | Judge rubric card, score summary | Demo day |
| P2 | Wallet connect modal, onboarding steps | Wallet |
| P3 | Footer, social links, photo strip | Polish |

Full specs: [`03-element-library.md`](./03-element-library.md).

---

## 8. Dark mode only (v1)

Breakpoint is dark-only. SVB v1 matches:

- Easier brand consistency with Solana event aesthetic
- Better for evening building sessions at the hotel
- Light mode deferred — if added later, invert semantic tokens

---

## 9. Open design decisions

| # | Question | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Custom SVB wordmark? | Text-only vs designed logotype | Text + `≡SVB` mark (Breakpoint `≡BP26` pattern) for v1 |
| 2 | Glitch intensity | None / hero only / section headers | Hero only |
| 3 | Leaderboard density | Table vs card list on mobile | Cards on mobile, table on desktop |
| 4 | Borneo pattern usage | None / footer only / section dividers | Footer + hero overlay only |
| 5 | Partner logos | Color vs mono | Mono on dark (Breakpoint sponsor style) |

Resolve via `/speckit-clarify` when specifying the design-system feature.

---

## 10. Next steps

1. Review this plan + element library with organizers (Superteam MY / SOCOE).
2. `/speckit-specify` — "Design system & app shell" feature referencing this doc.
3. Scaffold Next.js + import `tokens/svb-theme.css`.
4. Implement P0 components from element library.
5. User test on mobile (primary device for participants in the field during Amazing Race).
