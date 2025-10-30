# US-B5 — Question Bank & Quizzes Endpoints

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 3-5 points

## Story
As a tutor and student,
I want to manage question banks and take quizzes,
so that practice flows work end-to-end.

## Description
Implement endpoints for importing/listing questions, building a quiz template, starting an attempt, submitting, and returning score/correctness.

## Acceptance Criteria
- Import/list endpoints persist to question bank tables; at least one is_correct per MCQ enforced.
- Build quiz saves template; get quiz returns ordered questions and points.
- Attempt submit computes score; stores per-question correctness.
 - When MSW is active, responses include `synthetic: true`; UI shows a `*` next to quiz titles or attempt IDs to denote Synthetic.

## UX/Routes
- Tutor: `/tutor/question-bank`, `/tutor/quiz-builder`
- Student: `/student/sessions/:sessionId/quiz`

## Data Model
- `question_banks`, `questions`, `choices`, `question_topics`, `quiz_templates`, `quiz_questions`, `quiz_attempts`, `attempt_answers`.

## API
- `POST /questions/import` | `GET /question-banks/:id/questions`
- `POST /quizzes/build` | `GET /quizzes/:id`
- `POST /quizzes/:id/attempt` | `POST /attempts/:id/submit`

## UI Spec
- N/A (API-only)

## Notes/Dependencies
- Validate input shape; ensure single correct choice per MCQ.
 - Synthetic Data (MSW) Note: Provide seeded questions/quizzes and display `*` marker in UI to confirm wiring.

## Tasks
- Implement import/list for questions with topic tags.
- Implement quiz template builder and retrieval.
- Implement attempt lifecycle and grading for MCQ.

## Dev Notes
- Architecture patterns and constraints
  - Keep grading deterministic; avoid partial credit in MVP.
- References
  - [Source: docs/prd.md §4.3 Tutor Question Bank & Quiz Builder]
  - [Source: docs/prd.md §4.4 Student Consumption & Practice]
  - [Source: docs/prd.md §11 API Requirements → Banks & Quizzes]

## Dev Agent Record
- Completion Notes List:
  - [] Questions import/list
  - [] Quiz build/retrieve
  - [] Attempt submit and grade
- File List:
  - NEW: `services/api/routes/quizzes.py`
  - NEW: `services/api/repos/quizzes.py`

## Test Cases
- Import rejects MCQ without exactly one correct choice.
- Submit returns score and correctness array length = number of questions.

