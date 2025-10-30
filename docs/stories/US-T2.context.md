# Story Context — US-T2: View Processing Status

- Story ID: US-T2
- Epic: Tutor Ingestion & Processing
- Priority: High (MVP Phase 1)
- Status: Ready
- Estimate: 2–3 points

## Problem Statement
Tutors and admins cannot easily monitor the processing state of ingestion jobs (transcription, summarization). This creates uncertainty, slows triage, and obscures operational health. We need clear visibility into job states and simple actions to retry or cancel when appropriate.

## Users and Goals
- Tutor: Understand session processing state at a glance within course sessions; know when content is ready for use.
- Admin: Monitor global queue, identify stuck/failed jobs, and trigger remediation (retry/cancel).

## Scope and Boundaries
- In scope: Read-only visibility for tutors; full queue view and retry/cancel for admins; mock-backed integration via MSW during MVP.
- Out of scope: Real backend orchestration, historical analytics, SLA dashboards, and notifications.

## Preconditions
- Sessions exist and can reference processing jobs.
- Mock API (MSW) is enabled in dev, reflecting job lifecycles and idempotent actions.

## Postconditions
- Tutors see a status badge per session reflecting latest processing state.
- Admins see a jobs table with id, type, status, updated_at, and actions (retry/cancel) that mutate mock state.

## Key Entities
- processing_jobs: { id, session_id, type: transcription|summarization, status, updated_at }
- job_events: { job_id, event_type, at }
- sessions: { id, course_id, status_badge }

## API Touchpoints (Mocked for MVP)
- GET /admin/jobs — list jobs
- POST /admin/jobs/:id/retry
- POST /admin/jobs/:id/cancel

## UX Routes
- Admin: /admin/queue — jobs table view
- Tutor: /tutor/courses/:courseId → Sessions tab — per-session status badge

## State Model (Simplified)
Statuses: queued → running → succeeded | failed | cancelled
- Retry allowed from failed; cancel allowed from queued|running (mock-enforced idempotency)

## Success Criteria
- Admin table renders jobs from mocks with correct fields
- Retry/cancel update job status in the mock store
- Tutor session row shows correct badge for underlying job state

## Risks and Mitigations
- Ambiguous status mapping to tutor badge → define deterministic mapping and test oracles
- Flaky mock state after action → use idempotent handlers and confirm updated_at changes
- Data sync between tutor view and admin queue → ensure consistent mock source of truth

## Test Oracles
- Admin: list displays n jobs; action results in expected status transition and timestamp update
- Tutor: for a session with job status X, badge shows expected label and style

## Dependencies
- MSW setup for admin jobs endpoints
- UI components: JobsPage (admin), SessionsTab row badge (tutor)

## References
- docs/prd.md §4.1 Tutor Ingestion & Processing
- docs/prd.md §11 API Requirements → Ingestion & Jobs
- docs/prd.md §7 System Architecture

## Implementation Notes
- Keep actions idempotent; reflect state immediately in UI via mock store updates
- Use stable status enums shared across admin and tutor surfaces to avoid drift

