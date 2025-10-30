# US-B8 — Replace MSW Mocks with Real Backend Integration

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: High (MVP Phase 3)
- Status: drafted
- Estimate: 2-3 points

## Story
As a user,
I want the UI to talk to the real backend instead of mocks,
so that data reflects actual state in Supabase.

## Description
Switch the frontend API client from MSW to real FastAPI base URL, with env-based toggles, error handling, and migration path per route.

## Acceptance Criteria
- `.env.local` configures API base URL; dev can still enable MSW.
- Routes `/admin/queue`, tutor session transcript/materials, chat, quizzes use real endpoints successfully.
- Error toasts/logging in place for failures.
 - When MSW is active, UI indicates Synthetic data with a `*` marker and payloads include `synthetic: true` for quick verification.

## UX/Routes
- Admin: `/admin/queue` | `/admin/rag`
- Tutor: sessions transcript/materials
- Student: chat/quiz

## Data Model
N/A

## API
Consumes contracts from PRD §11 implemented in US-B3..B7.

## UI Spec
N/A (wiring only)

## Notes/Dependencies
- Land after US-B3..B7 endpoints are available.
 - Synthetic Data (MSW) Note: Keep a toggle to re-enable MSW; ensure `*` marker appears when Synthetic.

## Tasks
- Add API client base URL config; feature flag for MSW.
- Replace per-route handlers to call real endpoints.
- Verify JSON shape parity and adjust adapters if needed.

## Dev Notes
- Architecture patterns and constraints
  - Keep thin adapters; centralize error handling.
- References
  - [Source: docs/prd.md §11 API Requirements]

## Dev Agent Record
- Completion Notes List:
  - [] Base URL/env wiring
  - [] Admin queue, transcript/materials, chat, quiz hooked
- File List:
  - MODIFIED: `src/lib/api/client.ts`
  - MODIFIED: route data hooks/components as needed

## Test Cases
- Admin queue shows real jobs; retry/cancel works end-to-end.
- Tutor transcript/materials load from backend.
- Chat returns answers with citations.

