# 02 — Product Vision

## One-liner

A Solana-first **event companion dApp** for Startup Village Borneo that runs the
Amazing Race leaderboard, keeps teams oriented around the schedule, collects
submissions, and streamlines demo-day judging — while showcasing real Solana
wallet onboarding.

## Why it exists

The event (see [`01-event-context.md`](./01-event-context.md)) is a five-day,
multi-track hackathon with a week-long, points-weighted Amazing Race, rolling
team formation, social-thread submissions, and a hard submission cutoff.
Coordinating that with WhatsApp groups and spreadsheets alone is error-prone.
A purpose-built companion removes friction for organizers and participants and
doubles as a live demonstration of Solana onboarding (Amazing Race task #15).

## Target users

- **Participants / builders** — see their team, the schedule, race tasks, points,
  and submit entries.
- **Organizers (Superteam MY / SOCOE)** — manage teams, verify submissions,
  adjust scores, and enforce the Day 4 cutoff.
- **Judges** — review teams and demo-day pitches on Day 5.
- **Partners** — logo placement and office-hours visibility (lightweight).

## Primary flows (candidate epics for Spec Kit)

1. **Team formation & profiles** — create/join teams (open Day 1 dinner, close Day 2
   lunch), member handles, solo-founder matchmaking.
2. **Amazing Race leaderboard** — task catalog with weighted scoring, bonuses,
   per-station caps; submission → review → points; live standings.
3. **Submissions intake** — capture X/Twitter thread links per task, enforce the
   18:00 Day 4 hard cutoff, and flag content-award entries.
4. **Schedule & program** — per-day agenda with the fixed daily rhythm and
   workshop details; "happening now / next".
5. **Demo Day & judging** — rubric-based scoring, deliberation support, final
   standings and prize allocation.
6. **Solana wallet onboarding** — connect a wallet, and optionally mint a
   proof-of-participation / proof-of-completion artifact aligned with task #15.

## Success metrics

- Organizers score and publish standings in minutes, not spreadsheets.
- Zero disputes traceable to the Day 4 cutoff (submissions are timestamped).
- A measurable number of "real user" wallet onboardings completed in-app.
- Judges complete Day 5 scoring inside the app with a clear audit trail.

## Non-goals (initial scope)

- Not a general-purpose event platform; it is scoped to this event's rules.
- No payments/treasury handling of the prize pool in v1 (prizes settled off-app).
- No replacement for WhatsApp comms in v1; integrate/link rather than rebuild.
- No custody of user funds; wallet features are onboarding and proofs only.

## Guiding constraints

Derived from the event's ops rules and the [constitution](../../.specify/memory/constitution.md):

- **Teach, don't sell** — onboarding UX must never pressure users about money.
- **Deadlines are law** — the Day 4 18:00 cutoff is enforced by the system clock.
- **Scoring is transparent & auditable** — every point change is attributable.
- **Solana-first** — prefer Solana ecosystem tooling for on-chain features.
