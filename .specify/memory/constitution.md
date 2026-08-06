# Startup Village Borneo Constitution

The principles below govern how features for the Startup Village Borneo event
companion are specified, planned, and built. They exist to serve a live,
five-day, points-weighted hackathon (see `docs/blueprint/01-event-context.md`)
where fairness, deadlines, and a great onboarding experience matter most.

## Core Principles

### I. Event Rules Are the Spec
Every feature must trace back to a rule or need in the event program
(`docs/blueprint/01-event-context.md`) or the product vision
(`docs/blueprint/02-product-vision.md`). Scoring weights, station caps, bonuses,
windows, and cutoffs are requirements, not implementation details — encode them
explicitly and cite the source. If the program and the code disagree, the program
wins and the discrepancy is reconciled in the blueprint first.

### II. Deadlines Are Enforced by the System
Time-bound rules are enforced against a trusted server clock, never client input.
The hard cutoff — Amazing Race & deck submission at 18:00 on Day 4 — rejects late
entries rather than silently accepting them. Task active-windows and content-award
timing (e.g. the 10 Sept overall-impressions post) are validated the same way.

### III. Scoring Is Transparent and Auditable (NON-NEGOTIABLE)
Standings must always be reconstructable. Points derive from an append-only score
ledger; every change records who, what, when, and why. No destructive edits to
awarded points — corrections are new, attributable entries. This makes disputes
resolvable and results defensible in front of judges and teams.

### IV. Onboarding Teaches, Never Pressures
Wallet and crypto flows exist to onboard real users (Amazing Race task #15). They
must be non-coercive: teach, don't sell; never prompt anyone about money or
investment. The app never takes custody of user funds. Accessibility and clarity
for first-time crypto users take priority over feature density.

### V. Ship Simple, Ship Fast, Then Iterate
The event is short and the room is building live. Prefer the smallest correct
solution (YAGNI), boring reliable technology, and off-chain storage for
operational data — reserving Solana for identity, onboarding, and proofs where it
adds real value. Optimize for organizer/participant speed during the event over
architectural elegance.

## Technology Constraints

- **Solana-first.** On-chain features use the Solana ecosystem. Consult the Solana
  expert / documentation / Anchor MCP tools when designing and implementing them.
- **Off-chain for operational data.** Teams, submissions, and the live leaderboard
  live in a conventional service + database; proofs and identity go on-chain.
- **No fund custody in v1.** Wallet features are onboarding, identity, and proofs only.
- **Pinned tooling.** Use the environment's provided toolchains (Node, Python +
  `uv`, Rust/Cargo) and the Spec Kit workflow; do not rewrite lockfiles casually.

## Development Workflow

- **Spec-driven.** Build through Spec Kit: constitution → `/speckit-specify` →
  (`/speckit-clarify`) → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
  See `docs/blueprint/04-spec-kit-workflow.md`.
- **Blueprint before spec.** Read `docs/blueprint/` before writing a spec so
  features stay aligned with the event and vision.
- **Decisions are documented.** Ambiguities are resolved via `/speckit-clarify`
  and recorded; open questions in the architecture blueprint are answered in plans.
- **Prefer commenting out over deleting** superseded logic or content, with a short
  note, so prior decisions remain referenceable inline.

## Governance

This constitution supersedes ad-hoc practice. Specs, plans, and reviews must verify
compliance with these principles; deviations require an explicit, justified note in
the relevant spec or plan. Amendments are made here with a version bump and a short
rationale, and dependent blueprint docs are updated in the same change.

**Version**: 1.0.0 | **Ratified**: 2026-08-06 | **Last Amended**: 2026-08-06
