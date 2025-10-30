# AmplifiEd-Upgraded — Development Backlog (Derived from PRD v1.1)

Generated from `docs/prd.md`. Stories are organized under epics matching PRD sections. Each story includes ID, description, and acceptance criteria (from PRD). Use this as the authoritative backlog for planning and sprint slicing.

## Epic: Tutor Ingestion & Processing

- Story: US-T1 — Add Session via Drive Link
  - Description: Tutor adds a session using Drive/Dropbox link with title/date/subject/topic.
  - Acceptance Criteria:
    - POST succeeds; session visible in `/tutor/courses/:id` → Sessions tab with status `draft`.

- Story: US-T2 — View Processing Status
  - Description: Tutor and Admin can see statuses for transcription and summarization jobs.
  - Acceptance Criteria:
    - `/admin/queue` shows job states; tutor session page shows badge (`draft/approved/published`).

- Story: US-T3 — Open Transcript with Time-stamped Chunks
  - Description: Tutor can open a transcript with time-stamped chunks (jump links placeholder OK for MVP).
  - Acceptance Criteria:
    - `/tutor/sessions/:id/transcript` lists ≥6 chunks with `mm:ss` chips; clicking highlights chunk.

## Epic: Tutor Materials & Approval

- Story: US-T4 — Generate Summary and Flashcards
  - Description: System generates summary and flashcards from transcript.
  - Acceptance Criteria:
    - Clicking Generate creates `study_materials` with status `draft` and visible content.

- Story: US-T5 — Edit, Review, Approve to Publish
  - Description: Tutor edits materials, submits for review, approves/rejects with versioning.
  - Acceptance Criteria:
    - Status transitions: `draft → pending_review → approved → published`. Versions recorded. Rejected path requires a comment.

## Epic: Tutor Question Bank & Quiz Builder

- Story: US-T6 — Manage MCQ Question Bank
  - Description: Import or author MCQs; tag topics and difficulty.
  - Acceptance Criteria:
    - Bank shows questions with choices; at least one `is_correct` per MCQ.

- Story: US-T7 — Build Quiz from Topics and Count
  - Description: Tutor builds a quiz by selecting topics and desired question count.
  - Acceptance Criteria:
    - Quiz template saved; preview shows ordered questions and points.

## Epic: Student Consumption & Practice

- Story: US-S1 — See Enrolled Courses and Sessions
  - Description: Student views enrolled course and sessions with published materials.
  - Acceptance Criteria:
    - `/student/home` lists course; sessions show published materials.

- Story: US-S2 — Use Recap and Flashcards
  - Description: Student consumes recap and flashcards for a session.
  - Acceptance Criteria:
    - Overview shows summary bullets; flashcards flip with Q/A.

- Story: US-S3 — Chat with Citations
  - Description: Student asks doubts; chatbot responds with citations to transcript chunks.
  - Acceptance Criteria:
    - Response includes 1–3 citations referencing transcript chunk IDs.

- Story: US-S4 — Take Quiz and See Score
  - Description: Student takes a quiz and sees per-question correctness and score.
  - Acceptance Criteria:
    - Attempt recorded; score computed; correctness displayed.

## Epic: Parent Progress View

- Story: US-P1 — View Topic Mastery
  - Description: Parent sees student’s topic mastery in a read-only view.
  - Acceptance Criteria:
    - Topic table with attempts/correct/last_attempt.

## Epic: Admin/Dev Ops

- Story: US-A1 — Jobs and Events; Retry/Cancel
  - Description: Admin views jobs and events; can retry or cancel jobs (mocked in dev).
  - Acceptance Criteria:
    - Buttons update job status in mocks; events log visible.

- Story: US-A2 — RAG Health Dashboard
  - Description: Admin sees retrieval health and sample retrieval demo.
  - Acceptance Criteria:
    - Count of chunks; last embed time; sample retrieval demo.

---

## Labels and Notes
- Labels: `frontend`, `backend`, `data`, `rag`, `ui`, `mvp`.
- Field Type: brownfield (existing code). Prioritize integration with current routes and components.
- Tech Context: Vite + React + TS frontend; Supabase backend; Python worker (Whisper) planned.

## MVP Prioritization (Suggested)
1. US-T1, US-T2, US-T3 (enable ingestion → transcript visibility)
2. US-T4, US-T5 (materials generation and approval)
3. US-S1, US-S2 (student consumption)
4. US-S3 (chat with citations)
5. US-T6, US-T7 (quiz builder path)
6. US-S4 (quiz attempts and scoring)
7. US-A1, US-A2 (admin observability)
8. US-P1 (parent view)

## Acceptance Test Anchors (from PRD)
- Tutor upload → publish
- Student consumption
- Chat with citations
- Admin ops

## Definition of Done (Reference)
- All routes render with non-empty data (fixtures or live)
- Core flows pass acceptance tests in Chrome
- README quick start works on a fresh machine
- One end-to-end live ingestion succeeds locally/stage
- Demo script reproducible by two team members
