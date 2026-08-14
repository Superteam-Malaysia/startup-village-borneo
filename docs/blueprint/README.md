# Startup Village Borneo — Project Blueprint

This directory holds the **blueprint docs**: the durable, high-level context that
grounds every spec, plan, and task produced with [Spec Kit](https://github.com/github/spec-kit).
Read these before running `/speckit-specify` so features stay aligned with the
event and the product vision.

## Reading order

| # | Document | What it covers |
| - | -------- | -------------- |
| 1 | [`01-event-context.md`](./01-event-context.md) | The Startup Village Borneo event: dates, partners, schedule, the Amazing Race, prizes, and ops rules — the source of truth distilled from the official agenda. |
| 2 | [`02-product-vision.md`](./02-product-vision.md) | The companion product this repo builds: goals, target users, primary flows, and non-goals. |
| 3 | [`03-architecture.md`](./03-architecture.md) | Proposed technical architecture, including the Solana components and off-chain services. |
| 4 | [`04-spec-kit-workflow.md`](./04-spec-kit-workflow.md) | How to drive development with Spec Kit in this repo (constitution → specify → plan → tasks → implement). |

**UI / brand design** (Breakpoint-derived element library and tokens):
[`docs/design/README.md`](../design/README.md)

## At a glance

- **Event:** Startup Village Borneo — 5–9 September 2026, Sheraton Kuching, Sarawak.
- **Anchor partners:** Solana Foundation, SOCOE.
- **Ecosystem:** Solana-first. Wallet onboarding, on-chain proofs, and community
  tooling are in scope.
- **What we are building:** an event companion dApp/portal supporting teams, the
  Amazing Race leaderboard, the schedule, submissions, and demo-day judging.
- **How we build it:** spec-driven development with Spec Kit + Cursor.

> These are living documents. When the event program or product direction
> changes, update the relevant file here first, then re-run the affected Spec Kit
> steps. Per this repo's convention, prefer commenting out superseded content
> (with a short note) over deleting it, so history stays referenceable inline.
