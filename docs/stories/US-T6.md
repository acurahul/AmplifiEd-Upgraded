# US-T6 — Manage MCQ Question Bank

- Epic: Tutor Question Bank & Quiz Builder
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 5-8 points

## Story
As a tutor,
I want to manage an MCQ bank with topics and difficulty,
so that I can build targeted quizzes efficiently.

## Description
Import or author MCQs; tag topics and difficulty.

## Acceptance Criteria
- Bank shows questions with choices; at least one `is_correct` per MCQ.

## UX/Routes
- Tutor: `/tutor/question-bank`

## Data Model
- tables: `question_banks`, `questions`, `choices`, `question_topics`

## API
- `POST /questions/import`
- `GET /question-banks/:id/questions`

## UI Spec
- Table of questions; form to add/edit; tags for topics/difficulty

## Notes/Dependencies
- Topics taxonomy available

## Tasks
- Implement import endpoint and validation for MCQs (AC: #1)
  - Enforce ≥1 correct choice per MCQ (AC: #1)
- Build question bank UI with add/edit and topic/difficulty tags (AC: #1)
- Testing
  - Import populates bank; validation enforces one correct choice (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Keep choice correctness invariant; validate on save/import
- References
  - [Source: docs/prd.md §4.4 Student Consumption & Practice]
  - [Source: docs/prd.md §5.5 Question Bank & Quizzes]
- Project Structure Notes
  - Separate persistence from UI; use services for validation
- Learnings from Previous Story
  - Preps inputs for quiz builder; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.4, §5.5 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Import endpoint with validation
  - [] Bank UI with add/edit
  - [] Topic/difficulty tagging
  - [] Tests passing
- File List:
  - NEW: `api/questions/import.ts`
  - NEW: `ui/tutor/question-bank/QuestionBankPage.tsx`

## Test Cases
- Import populates bank; validation enforces one correct choice
