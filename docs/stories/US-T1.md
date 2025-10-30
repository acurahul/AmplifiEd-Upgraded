# US-T1 — Add Session via Drive Link

- Epic: Tutor Ingestion & Processing
- Priority: High (MVP Phase 1)
- Status: Done
- Estimate: 3-5 points

## Story
As a tutor,
I want to add a session by pasting a Drive/Dropbox video URL with basic details,
so that the session is created in draft and kicks off transcription automatically.

## Description
Tutor adds a session using Drive/Dropbox link with title/date/subject/topic.

## Acceptance Criteria
- POST succeeds; session visible in `/tutor/courses/:id` → Sessions tab with status `draft`.

## UX/Routes
- Tutor: `/tutor/courses/:courseId` (Sessions tab)
- Session creation modal/component

## Data Model
- tables: `sessions`, `processing_jobs`
- fields: title, date, course_id, language, topics[], video_url, status=`draft`

## Implementation Path
- Use Supabase direct inserts from the client:
  - Insert into `sessions` with `status=draft`
  - Insert into `processing_jobs` with `job=transcription`, `status=queued`, `session_id` set
  - No dedicated `/ingest/session` API route required for MVP

## UI Spec
- Form: title, date, subject/course, topics, video URL
- Validate non-empty title, valid URL; date ≤ today

## Notes/Dependencies
- Triggers `processing_jobs: transcription`
- Uses Supabase Auth for tutor scope

## Tasks
- Implement client-side creation via Supabase inserts (AC: #1)
  - Validate required fields, strict URL, date ≤ today (AC: #1)
  - Set `status=draft`; enqueue `processing_jobs: transcription` (AC: #1)
- Ensure Sessions tab UI displays new draft session (AC: #1)
  - Show basic fields and `draft` badge (AC: #1)
- Strengthen session creation modal validation (AC: #1)
- Testing
  - UI/integration: valid input → session created + job queued (AC: #1)
  - UI validation: invalid URL → inline error (AC: #1)
  - UI validation: future date → inline error (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Use Supabase for Auth and Postgres access per PRD; store only derived data; video remains in Drive/Dropbox
  - Jobs are idempotent; failures visible and retryable; enqueue transcription job on session create
- References
  - [Source: docs/prd.md §4.1 Tutor Ingestion & Processing]
  - [Source: docs/prd.md §5.1 Ingestion]
  - [Source: docs/prd.md §11 API Requirements → Ingestion & Jobs]
- Project Structure Notes
  - Place API route under backend/service layer per project conventions; UI under tutor routes’ Sessions tab
- Learnings from Previous Story
  - First story in epic; no previous learnings to capture

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.1, §5.1, §11 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [x] Implemented client inserts for session creation
  - [x] Enqueued transcription job reliably
  - [x] UI Sessions tab shows draft session
  - [x] UI validations added (URL domains, date ≤ today)

### Completion Notes
**Completed:** {{date}}
**Definition of Done:** All acceptance criteria met, code reviewed, validations in place
- File List:
  - MODIFIED: `src/components/SessionCreationModal.tsx`
  - EXISTING: `src/pages/migrated/TutorCoursePage.tsx`
  - EXISTING: `src/app/(portal)/tutor/home/page.tsx`

## Test Cases
- Valid URL creates session (`draft`) and job queued
- Invalid URL shows inline error

## Change Log
 - 2025-10-30: Status set to Done; completion notes added; checklist updated
 - 2025-10-30: Status set to Approved; aligned implementation to Supabase client inserts; updated Tasks and File List; added stricter validation requirements
- 2025-10-30: Converted status to drafted; added Story, Tasks, Dev Notes with citations, Dev Agent Record, and Change Log
- 2025-10-30: Approved for development; status set to Ready
