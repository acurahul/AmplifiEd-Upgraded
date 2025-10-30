# US-A1 — Jobs and Events; Retry/Cancel

- Epic: Admin/Dev Ops
- Priority: Medium (MVP Phase 3)
- Status: Approved
- Estimate: 3-5 points

## Story
As an admin,
I want to view jobs and events and retry/cancel jobs,
so that I can keep processing healthy during demos and development.

## Description
Admin views jobs and events; can retry or cancel jobs (mocked in dev).

## Acceptance Criteria
- Buttons update job status in mocks; events log visible.
 - When MSW is active, responses include `synthetic: true` and the UI shows a `*` next to job IDs/status to denote Synthetic.

## UX/Routes
- Admin: `/admin/queue`

## Data Model
- tables: `processing_jobs`, `job_events`

## API
- `GET /admin/jobs`
- `POST /admin/jobs/:id/retry|cancel`

## UI Spec
- Jobs table with actions; events panel/log

## Notes/Dependencies
- MSW mocks for dev
 - Synthetic Data (MSW) Note: Maintain seeded events/jobs; display `*` marker in UI when data is synthetic to verify wiring.

## Tasks
- Implement jobs list UI and events log (AC: #1)
- Wire retry/cancel actions to mock API (AC: #1)
- Testing
  - Retry/Cancel changes job status; events log updates (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Observability emphasized; actions are idempotent in mocks
- References
  - [Source: docs/prd.md §4.6 Admin/Dev Ops]
  - [Source: docs/prd.md §11 API Requirements → Ingestion & Jobs]
- Project Structure Notes
  - Route under `/admin/queue`; hooks/services for data
- Learnings from Previous Story
  - Mirrors tutor status page; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.6, §11 cited; context: docs/stories/US-A1.context.xml
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Jobs table and events log
  - [] Retry/Cancel actions
  - [] Tests passing
- File List:
  - NEW: `ui/admin/QueuePage.tsx`
  - NEW: `mocks/handlers/adminJobs.ts`

## Test Cases
- Retry/Cancel changes job status; events log updates

## Change Log
- 2025-10-30: Approved for development; status set to Ready
