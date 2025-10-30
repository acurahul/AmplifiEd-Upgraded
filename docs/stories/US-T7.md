# US-T7 — Build Quiz from Topics and Count

- Epic: Tutor Question Bank & Quiz Builder
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 3-5 points

## Story
As a tutor,
I want to build a quiz by selecting topics and question count,
so that I can quickly assemble targeted practice for students.

## Description
Tutor builds a quiz by selecting topics and desired question count.

## Acceptance Criteria
- Quiz template saved; preview shows ordered questions and points.

## UX/Routes
- Tutor: `/tutor/quiz-builder`

## Data Model
- tables: `quiz_templates`, `quiz_questions`

## API
- `POST /quizzes/build`
- `GET /quizzes/:id`

## UI Spec
- Builder wizard: select topics, count; preview ordered list with points

## Notes/Dependencies
- Depends on US‑T6 question bank

## Tasks
- Implement quiz build endpoint from topic filters and count (AC: #1)
  - Save `quiz_templates` and `quiz_questions` ordered list (AC: #1)
- Build builder UI and preview pane with points (AC: #1)
- Testing
  - Build saves template; preview matches ordered questions (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Deterministic selection for demo; allow variability later; persist order
- References
  - [Source: docs/prd.md §4.4 Student Consumption & Practice]
  - [Source: docs/prd.md §5.5 Question Bank & Quizzes]
- Project Structure Notes
  - Keep builder logic in service; UI remains declarative
- Learnings from Previous Story
  - Uses question bank; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.4, §5.5 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Build endpoint implemented
  - [] Builder UI and preview
  - [] Order persisted and displayed
  - [] Tests passing
- File List:
  - NEW: `api/quizzes/build.ts`
  - NEW: `ui/tutor/quiz-builder/BuilderPage.tsx`

## Test Cases
- Build saves template; preview matches selected questions
