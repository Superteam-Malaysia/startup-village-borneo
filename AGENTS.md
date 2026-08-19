# Agent instructions — Startup Village Borneo

Always-on project rules live in `.cursor/rules/`. See
`lightweight-verification.mdc` — small data/CSS/layout changes need no
verification; commit and move on.

## Testing — do not use

- **No computer-use / GUI subagents** for this project.
- **No Playwright** (or similar browser automation) for verification.
- For small CSS/layout/copy changes, commit after the edit — no dev server, screenshots, or recordings.
- For non-trivial work, use terminal checks only (`curl`, `npm run build`, existing test scripts).
