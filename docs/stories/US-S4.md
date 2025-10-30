# US-S4 — Take Quiz and See Score

- Epic: Student Consumption & Practice
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 5-8 points

## Story
As a student,
I want to take a quiz and see my score with per‑question correctness,
so that I can understand my mastery.

## Description
Student takes a quiz and sees per-question correctness and score.

## Acceptance Criteria
- Attempt recorded; score computed; correctness displayed.

## UX/Routes
- Student: `/student/sessions/:sessionId/quiz`

## Data Model
- tables: `quiz_templates`, `quiz_questions`, `quiz_attempts`, `attempt_answers`

## API
- `POST /quizzes/:id/attempt`
- `POST /attempts/:id/submit`

## UI Spec
- Quiz player; show score and per-question check marks after submit

## Notes/Dependencies
- Depends on US‑T7 builder and question bank

## Tasks
- Implement quiz attempt and submit endpoints (AC: #1)
  - Compute score and correctness; persist attempt (AC: #1)
- Build quiz player UI and results view (AC: #1)
- Testing
  - Submitting computes score; correctness displayed per question (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Auto‑grade MCQ; persist attempts; show simple post‑submit results
- References
  - [Source: docs/prd.md §4.4 Student Consumption & Practice]
  - [Source: docs/prd.md §5.5 Question Bank & Quizzes]
- Project Structure Notes
  - Player component under student session route; services for grading
- Learnings from Previous Story
  - Uses built quiz; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.4, §5.5 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Attempt and submit endpoints
  - [] Player UI and results
  - [] Tests passing
- File List:
  - NEW: `api/quizzes/attempt.ts`
  - NEW: `api/quizzes/submitAttempt.ts`
  - NEW: `ui/student/session/QuizPage.tsx`

## Test Cases
- Submitting computes score; correctness displayed per question
