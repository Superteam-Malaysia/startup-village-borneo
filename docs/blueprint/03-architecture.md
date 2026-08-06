# 03 — Architecture Blueprint

> Proposed, not final. This is a starting point for `/speckit-plan`. Individual
> features should confirm or revise these choices in their own plans. No
> application code has been committed yet — this repo currently ships the
> development environment, the Spec Kit workflow, and these blueprint docs.

## Shape of the system

A **Solana-first** application with three layers:

1. **Client (web dApp)** — participant, organizer, and judge experiences.
2. **Off-chain service + database** — teams, submissions, scoring rules, and the
   authoritative Amazing Race leaderboard. Fast, cheap, and easy to correct.
3. **On-chain (Solana) components** — wallet-based identity/onboarding and
   optional proof-of-participation / proof-of-completion artifacts.

The default is **off-chain for operational data, on-chain for proofs and
identity**. Putting the whole leaderboard on-chain during a live, fast-moving
event adds latency and cost without clear benefit; proofs and onboarding are
where Solana shines and where the event narrative wants them.

## Recommended stack (candidate)

| Layer | Candidate choice | Rationale |
| ----- | ---------------- | --------- |
| Web client | Next.js (React, TypeScript) | Fast to build, great DX, first-class Solana wallet libraries. |
| Wallet UX | Solana Wallet Adapter | Standard multi-wallet connect for the dApp. |
| On-chain program | Anchor (Rust) — only if custom program logic is needed | Anchor is the standard framework for Solana programs. |
| Proofs / collectibles | Compressed NFTs / attestations | Cheap issuance for proof-of-participation at event scale. |
| Off-chain API + DB | Node/TypeScript service + Postgres | Shared language with the client; relational data fits teams/scores. |
| Auth | Wallet sign-in + organizer roles | Aligns with the Solana-first, onboarding-focused vision. |

Toolchains already available in this environment: Node 22, Python 3.12, Rust/Cargo,
and Git. `uv` + the Spec Kit CLI are installed by `.cursor/install.sh`.

## Domain model (first pass)

- **Team** — id, name, members[], formed_at, socials.
- **Participant** — id, handle(s), wallet address (optional), team_id.
- **RaceTask** — id, title, base_points, bonus rules, station cap, category
  (content vs race), active window.
- **Submission** — id, team_id, task_id, thread_url, submitted_at, status
  (pending/approved/rejected), awarded_points, reviewer.
- **ScoreEvent** — append-only ledger of point changes (auditable).
- **ScheduleItem** — day, start, end, title, speaker/partner, location.
- **JudgingScore** — team_id, judge_id, rubric fields, total.

## Cross-cutting rules (map to the constitution)

- **Deadline enforcement** — the 18:00 Day 4 cutoff is a server-side check against
  a trusted clock; late submissions are rejected, not silently accepted.
- **Auditable scoring** — points are derived from an append-only `ScoreEvent`
  ledger so standings are always reconstructable and disputes are traceable.
- **Onboarding is non-coercive** — wallet flows teach and never pressure (task #15).
- **No fund custody** — wallet features are identity/onboarding/proofs only in v1.

## Open questions for `/speckit-clarify`

- Do we need a custom Anchor program in v1, or are wallet sign-in + off-chain
  scoring + optional cNFT proofs enough?
- Which network for proofs (devnet during the event, mainnet for keepsakes)?
- How are organizers/judges authenticated and authorized?
- What is the submission-verification workflow (manual review vs semi-automated
  from X/Twitter thread links)?

## Solana tooling note

Per the repo's MCP guidelines, use the Solana expert / documentation / Anchor MCP
tools when designing and implementing on-chain features. They were not reachable
in the environment where this blueprint was drafted, so the on-chain choices above
should be confirmed against current Solana docs during `/speckit-plan`.
