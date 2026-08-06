# 04 — Spec Kit Workflow

This repo uses [GitHub Spec Kit](https://github.com/github/spec-kit) for
**spec-driven development**: define what to build (and why) before building it.
The CLI (`specify`) and the Cursor integration are already installed.

## What Spec Kit added to this repo

- `.specify/` — templates, helper scripts (`.specify/scripts/bash/*.sh`), the
  workflow definition, and the project `memory/constitution.md`.
- `.cursor/skills/speckit-*/` — the slash-command skills the Cursor agent uses.
- `specs/` — created on demand; one numbered folder per feature (e.g.
  `specs/001-<slug>/spec.md`).

## Slash commands (run inside Cursor)

| Command | Purpose |
| ------- | ------- |
| `/speckit-constitution` | Establish or amend project principles. |
| `/speckit-specify` | Create a baseline specification for a feature. |
| `/speckit-clarify` *(optional)* | Ask structured questions to de-risk ambiguity before planning. |
| `/speckit-plan` | Create an implementation plan from a spec. |
| `/speckit-tasks` | Generate actionable tasks from a plan. |
| `/speckit-analyze` *(optional)* | Cross-artifact consistency & alignment report. |
| `/speckit-checklist` *(optional)* | Generate quality checklists for a plan. |
| `/speckit-implement` | Execute the tasks. |
| `/speckit-converge` | Assess the codebase and append remaining work as tasks. |

## Recommended flow for this project

1. **Ground context** — read the [blueprint docs](./README.md) (event, vision,
   architecture) so specs stay aligned with the event's rules.
2. **`/speckit-constitution`** — the constitution is already seeded from this
   project's context; amend it as principles evolve.
3. **`/speckit-specify`** — write the spec for the first epic (a good starting
   point is the **Amazing Race leaderboard**, the product's core).
4. **`/speckit-clarify`** — resolve the open questions in
   [`03-architecture.md`](./03-architecture.md).
5. **`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`** — build it.

## Using the helper scripts directly (optional)

The slash commands call these under the hood, but they also work standalone:

```bash
# Preview the branch/spec paths for a new feature (no files written)
bash .specify/scripts/bash/create-new-feature.sh --json --dry-run "Amazing Race leaderboard"

# Create the feature scaffold for real
bash .specify/scripts/bash/create-new-feature.sh --json "Amazing Race leaderboard"

# Check prerequisites and resolve feature paths
bash .specify/scripts/bash/check-prerequisites.sh --json
```

## Environment recap

- `uv` and the Spec Kit CLI are installed by `.cursor/install.sh` (wired into
  `.cursor/environment.json` as the Cloud Agent `install` step).
- Verify locally with `specify version` and `specify check`.
