# startup-village-borneo

Companion app for **Startup Village Borneo** — a Solana-first hackathon in
Kuching, Sarawak (5–9 September 2026, anchored by the Solana Foundation and
SOCOE). This repo is developed **spec-first** with
[GitHub Spec Kit](https://github.com/github/spec-kit) and Cursor.

## Start here

- **Blueprint docs:** [`docs/blueprint/`](./docs/blueprint/README.md) — event
  context, product vision, architecture, and the Spec Kit workflow.
- **Project constitution:** [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

## Development environment

Toolchains: Node 22, Python 3.12, Rust/Cargo, Git (provided by the base image).
The Cloud Agent `install` step (`.cursor/environment.json` → `.cursor/install.sh`)
adds [`uv`](https://docs.astral.sh/uv/) and the Spec Kit CLI.

To set up locally:

```bash
bash .cursor/install.sh      # installs uv + the `specify` CLI (idempotent)
specify version              # sanity check
specify check                # confirm the Cursor integration
```

## Spec-driven workflow

Run these slash commands inside Cursor (details in
[`docs/blueprint/04-spec-kit-workflow.md`](./docs/blueprint/04-spec-kit-workflow.md)):

```
/speckit-constitution   # project principles (already seeded)
/speckit-specify        # write a feature spec
/speckit-plan           # turn a spec into a plan
/speckit-tasks          # break a plan into tasks
/speckit-implement      # build it
```
