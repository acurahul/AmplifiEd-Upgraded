# US-B3 — Ingestion & Jobs Endpoints

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 3-5 points

## Story
As a tutor/admin,
I want to create sessions and see/operate on processing jobs,
so that ingestion and monitoring work end-to-end.

## Description
Implement ingestion session creation and admin jobs listing + retry/cancel. Persist to Supabase tables `sessions`, `processing_jobs`, and `job_events`.

## Acceptance Criteria
- `POST /ingest/session` creates `sessions(draft)` and enqueues `processing_jobs(transcription)`.
- `GET /admin/jobs` lists jobs; `POST /admin/jobs/:id/retry|cancel` mutates state idempotently and appends `job_events`.
 - When MSW is active, endpoints mirror shapes and include `synthetic: true`; UI shows a `*` next to synthetic jobs.

## UX/Routes
- Admin: `/admin/queue` (frontend already built against mocks)

## Data Model
- `sessions`, `processing_jobs`, `job_events`.

## API
- `POST /ingest/session`
- `GET /admin/jobs`
- `POST /admin/jobs/:id/retry|cancel`

## UI Spec
- N/A (API-only; must maintain contract from PRD §11)

## Notes/Dependencies
- Replace MSW mocks gradually; keep same JSON shapes.
 - Synthetic Data (MSW) Note: Ensure mocks remain seeded and marked `*` in UI until backend fully replaces them.

## Tasks
- Implement ingestion route and job enqueue logic.
- Implement jobs list and retry/cancel with idempotency.
- Add repository layer for Supabase queries.

## Dev Notes
- Architecture patterns and constraints
  - Use clear status enums; record events for observability.
- References
  - [Source: docs/prd.md §4.1 Tutor Ingestion & Processing]
  - [Source: docs/prd.md §11 API Requirements → Ingestion & Jobs]

## Dev Agent Record
- Completion Notes List:
  - [] Ingestion route creates session + job
  - [] Jobs list + retry/cancel implemented
  - [] Event log appended
- File List:
  - NEW: `services/api/routes/ingestion.py`
  - NEW: `services/api/routes/admin_jobs.py`
  - NEW: `services/api/repos/jobs.py`

## Test Cases
- Ingest session returns 200 and creates session+job.
- Retry/Cancel produces event and updates status idempotently.

