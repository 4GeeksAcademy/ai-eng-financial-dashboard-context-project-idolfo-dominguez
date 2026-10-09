# Active Context — Current Status

_Last verified: 2026-10-09._

## What works (verified this session)

- **Full stack runs via `docker compose up --build`**: backend healthy (`GET /health` → 200), API serves 360 movements dated 2025-10-02..2026-09 (today-relative generator), frontend serves on :5173.
- **All tests green:** backend pytest **19/19** (`backend/tests/test_routes.py`), frontend vitest **10/10** (`frontend/src/lib/financial-utils.test.ts`), `npm run lint` clean, `npm run build` succeeds (pre-existing >500 kB chunk-size warning only).
- **Rule 11 fix shipped:** period badge now derived from loaded data via `computePeriodLabel()` (single year → "YYYY - Full Year", span → "YYYY - YYYY", empty → "No data"); `dashboard-header.tsx` default is neutral "Full Period". Locked by 3 vitest cases.
- **Agent conventions in place:** `.agents/rules/` holds 20 DRAFT rules (numbers match Phase 2 of `verification.md`); new Rule 16 boundary/invalid-value tests added to the backend suite.
- **Stack cleanly torn down** (`docker compose down`) — nothing running in background.

## Known gaps (open items, each governed by a draft rule)

| Gap | Rule | Notes |
|---|---|---|
| Wildcard CORS + credentials | 10 | `backend/app/main.py` — dev-only, must change before deploy |
| debugpy published on 5678 | 19 | `backend/Dockerfile` CMD + `docker-compose.yml` — dev-only |
| `frontend/.env.example` missing | 13 | README tells users to copy it |
| `build_metrics_facets()` crashes on empty list | 20 | reads `ordered[0]`/`ordered[-1]`; safe only because generator always returns 360 items |
| Global `random.seed()` in generator | 9 | mutates process-wide random state |
| Date-only strings parsed via `new Date()` | 12 | `computeMonthlyData` — local-time grouping edge near month boundaries |
| Fetch errors swallowed | 14 | `App.tsx` `.catch()` drops the error object |
| Unused analytics endpoints | 3 | facets/summary/top-categories/comparison/alerts/B2B/B2C defined but unconsumed |
| Float money + ad-hoc rounding | 18 | policy decision needed before real data |
| Rules set still DRAFT | — | awaiting ratification |

## Next priorities (suggested order)

1. **Re-validate the stack on a fresh `docker compose up --build`** — the 2026-10-09 teardown showed a Vite-proxy 502 (`ETIMEDOUT` to the backend container's old IP) while direct `:8000` worked; likely a stale-DNS artifact of container recreation, needs confirmation. Then browser-check the badge shows "2025 - 2026".
2. **Ratify the rules** — drop DRAFT markers in `.agents/rules/README.md` and Phase 3 of `verification.md`.
3. **Close cheap gaps:** add `frontend/.env.example` (rule 13), guard empty list in facets (rule 20).

## Recent changes (2026-10-09)

- Created `.agents/rules/` (9 files), `.agents/skills/` (4 SKILL.md procedures: run-and-verify-stack, add-api-endpoint, add-dashboard-feature, maintain-rules-and-verification), `memory-bank/` (this folder), Phase 3 section in `verification.md`.
- Added 4 backend tests (rule 16 boundaries/invalid values) + 5 frontend tests (empty inputs, period label).
- Fixed the hard-coded period label (product-code change; first in the repo since review began).
