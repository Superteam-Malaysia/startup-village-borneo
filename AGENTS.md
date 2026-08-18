# Agent instructions — Startup Village Borneo

## Verification (keep it light)

For **small, data-only changes** (e.g. syncing `src/data/*.ts` or docs from the
Google Doc agenda), do **not** run token-heavy verification:

- No browser / computer-use walks, screenshots, or screen recordings
- No video review subagents
- No exhaustive curl + HTML scraping across every page

**Enough for data-only syncs:**

1. `npm run build` in `apps/web` (or confirm types compile)
2. Quick sanity check that edited data files contain the expected strings

Reserve manual UI testing for actual UI/component changes or non-trivial behavior.
