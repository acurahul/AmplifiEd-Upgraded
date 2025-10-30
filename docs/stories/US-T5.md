# US-T5 — Edit, Review, Approve to Publish

- Epic: Tutor Materials & Approval
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 5-8 points

## Story
As a tutor,
I want to edit generated materials and move them through review to publish,
so that students only see approved, high‑quality content.

## Description
Tutor edits materials, submits for review, approves/rejects with versioning.

## Acceptance Criteria
- Status transitions: `draft → pending_review → approved → published`. Versions recorded. Rejected path requires a comment.

## UX/Routes
- Tutor: `/tutor/sessions/:sessionId/review`

## Data Model
- tables: `study_materials`, `material_versions`, `reviews`

## API
- `POST /materials/{id}/approve|reject`

## UI Spec
- Edit form for materials; submit for review; approve/reject with comment

## Notes/Dependencies
- Depends on US‑T4

## Tasks
- Implement review workflow transitions and validation (AC: #1)
  - Require comment on reject; record history (AC: #1)
- Build edit form and submit for review flow (AC: #1)
- Implement approve/publish actions with versioning (AC: #1)
- Testing
  - Approve publishes; reject requires comment; versions recorded (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Enforce state machine; all transitions auditable; versions immutable
- References
  - [Source: docs/prd.md §4.2 Tutor Materials & Approval]
  - [Source: docs/prd.md §5.4 Review Workflow]
- Project Structure Notes
  - Keep state logic in a single workflow module; UI consumes actions
- Learnings from Previous Story
  - Builds on generated drafts; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.2, §5.4 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] State machine implemented
  - [] Edit and submit for review flow
  - [] Approve/publish with versions
  - [] Tests passing
- File List:
  - NEW: `services/materials/reviewWorkflow.ts`
  - MODIFIED: `ui/tutor/review/ReviewPage.tsx`

## Test Cases
- Approve publishes; reject requires comment; versions recorded
