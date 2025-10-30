# AmplifiEd — Product Requirements Document (PRD) · v1.1

> Scope: MVP through Demo Day (India, CBSE Grade 10/12; independent tutors). This PRD is the single source of truth for what we will build, how we’ll validate it, and how we’ll demonstrate it.

---

## 1. Executive Summary

AmplifiEd turns tutors’ recorded classes into high‑quality, tutor‑approved study aids and practice experiences. The MVP supports independent Chemistry/Physics tutors with ~20–30 students per cohort. Tutors keep their videos in Google Drive; AmplifiEd ingests links, transcribes locally (RTX 3060), generates materials (summary/flashcards/cheatsheet), powers a RAG chatbot, and delivers quizzes and analytics. Parents get a read‑only snapshot of progress. Admins monitor processing and retrieval health.

**Primary objective (Demo Day):** Show a credible, end‑to‑end pipeline with a real tutor flow (upload → transcription → tutor review → publish → student consumption → quiz → analytics) with seeded data + at least one live run.

**Success metric (Demo Day):** Judges can complete the scripted flow without help; tutor trust is evident through review/approval UX; students see useful materials and can complete a quiz.

---

## 2. Goals, Non‑Goals, Out‑of‑Scope

**Goals**

1. Reduce tutor overhead by generating high‑quality recap/flashcards they can **approve** quickly.
2. Provide students with self‑serve guidance (chatbot + quizzes) and visible progress.
3. Keep ownership with tutors (we store derived data only).
4. Make the system demo‑able and believable with realistic data quality.

**Non‑Goals (MVP)**

* Payments/subscriptions, marketplace, multi‑org administration.
* Full LMS (assignments, attendance, scheduling) beyond essentials.
* Mobile apps (PWA/desktop web only).

**Out‑of‑Scope (MVP)**

* Multi‑language UX beyond English; transcripts may be Hinglish, but UI is English.
* Large‑scale cloud GPU orchestration; we use a single local RTX worker.

---

## 3. Personas & Jobs‑To‑Be‑Done (JTBD)

**Tutor (Rahul, 34, independent Chemistry tutor)**

* JTBD: “After class, I want materials that reflect what I taught so I can give my students a clean recap without rewriting notes, and be confident it’s correct.”
* Pain: Time sink in writing notes; distrust of generic AI summaries; managing student doubts individually.

**Student (Aditi, 15, Class 10)**

* JTBD: “I want clear notes/flashcards and a way to ask doubts about what was taught so I can revise quickly and test myself.”
* Pain: Long videos; no quick recap; no guided practice.

**Parent (Raj, 42)**

* JTBD: “I want a simple view of my child’s strengths/weaknesses so I can support them.”

**Admin/Dev**

* JTBD: “I need to see if the pipeline is stuck and why.”

---

## 4. User Stories & Acceptance Criteria

### 4.1 Tutor Ingestion & Processing

* **US‑T1**: As a tutor, I can add a session via Drive link with title/date/subject/topic.

  * **AC**: POST succeeds; session visible in `/tutor/courses/:id` → Sessions tab with status `draft`.
* **US‑T2**: As a tutor, I see processing status (transcription, summarization) for a session.

  * **AC**: `/admin/queue` shows job states; tutor session page shows badge (`draft/approved/published`).
* **US‑T3**: As a tutor, I can open a transcript with time‑stamped chunks.

  * **AC**: `/tutor/sessions/:id/transcript` lists ≥6 chunks with `mm:ss` chips; clicking highlights chunk (jump link placeholder acceptable for MVP).

### 4.2 Tutor Materials & Approval

* **US‑T4**: Generate a **Summary** and **Flashcards** from a transcript.

  * **AC**: Clicking Generate creates `study_materials` with status `draft` and visible content.
* **US‑T5**: Edit and submit materials for review, then approve to publish.

  * **AC**: Status transitions: `draft → pending_review → approved → published`. Versions recorded. Rejected path requires a comment.

### 4.3 Tutor Question Bank & Quiz Builder

* **US‑T6**: Import or author MCQ questions; tag topics/difficulty.

  * **AC**: Bank shows questions with choices; at least one is_correct per MCQ.
* **US‑T7**: Build a quiz by selecting topics and desired count.

  * **AC**: Quiz template saved; preview shows ordered questions, points.

### 4.4 Student Consumption & Practice

* **US‑S1**: See enrolled courses and sessions.

  * **AC**: `/student/home` lists course; sessions show published materials.
* **US‑S2**: Use recap and flashcards.

  * **AC**: Overview shows summary bullets; flashcards flip with Q/A.
* **US‑S3**: Ask a doubt in chat; see cited chunks.

  * **AC**: Response includes 1–3 citations referencing transcript chunk IDs.
* **US‑S4**: Take a quiz; get a score and per‑question correctness.

  * **AC**: Attempt recorded; score computed; correctness displayed.

### 4.5 Parent Progress View

* **US‑P1**: View student’s topic mastery.

  * **AC**: Topic table with attempts/correct/last_attempt.

### 4.6 Admin/Dev Ops

* **US‑A1**: View jobs and events; retry/cancel.

  * **AC**: Buttons update job status in mocks; events log visible.
* **US‑A2**: View RAG health.

  * **AC**: Count of chunks; last embed time; sample retrieval demo.

---

## 5. Functional Requirements (Detailed)

### 5.1 Ingestion

* Fields captured: session title, date, course, language, topics, video URL (Drive/Dropbox).
* Validation: non‑empty title, valid URL; date ≤ today.
* On save: create `sessions` (status `draft`) and enqueue `processing_jobs: transcription`.

### 5.2 Transcription & Chunking

* Worker pulls queued jobs, downloads video, runs Whisper; writes `transcripts` and `transcript_chunks` (8–12 chunks/hour for demo; real may be higher).
* Chunks store `start_ms`, `end_ms`, `text`, and `embedding` (mocked score in dev).

### 5.3 Materials Generation

* Types: `summary`, `flashcards`, (`cheatsheet` optional if time allows).
* Content shape (JSON):

  * Summary: `{ bullets: string[], length?: number }`
  * Flashcards: `{ cards: { q: string, a: string }[] }`
* Versioning: Saving creates a new `material_versions` row.

### 5.4 Review Workflow

* States: `draft` → `pending_review` → `approved`/`rejected` → `published`.
* Reject requires comment; history recorded in `reviews`.

### 5.5 Question Bank & Quizzes

* MCQ only for MVP; single correct choice.
* Question fields: text, explanation (optional), difficulty, topics mapping.
* Quiz template: ordered set of questions with points.
* Attempts: Each answer recorded; auto‑grade MCQ; save score.

### 5.6 Chatbot (RAG)

* Retrieval sources: `transcript_chunks` and `doc_chunks` (if available).
* UX: message thread, streaming not required; citations show chunk IDs.
* Feedback: rating 1–5 + optional comment.

### 5.7 Dashboards

* Tutor Performance: students × topics; surface weak topics.
* Student Performance: topic mastery table; simple trend (delta since last week—mocked).
* Parent View: read‑only of Student Performance.

---

## 6. Non‑Functional Requirements (NFRs)

* **Performance**: transcription ≤ 15 min for 60‑min video on RTX 3060; page loads ≤ 2.5s P95 locally.
* **Security**: store derived data only; no tutor raw videos stored; Supabase RLS gates: tutors → own data; students → enrolled courses; parents → guardianships.
* **Reliability**: jobs are idempotent; failures have visible error and retry.
* **Accessibility**: keyboard navigation; color contrast AA for key flows.
* **Observability**: job_events, retrieval_hits, audit_log populated.
* **Privacy**: PII limited to names/emails; no sensitive data collected.

---

## 7. System Architecture

* **Frontend**: Vite + React + TS; Tailwind + shadcn/ui; MSW in dev for mocks.
* **Backend**: Supabase (Auth, Postgres, pgvector, Storage). FastAPI microservice for AI orchestration (future).
* **Worker**: Python on RTX 3060 (Whisper). Polls `processing_jobs`.
* **Data ownership**: video_url points to tutor’s Drive; optional uploaded docs stored in Supabase Storage.

**Data Flow (text)**

```
Tutor adds session URL → sessions(draft) → processing_jobs(transcription)
Worker: Whisper → transcripts → transcript_chunks(+embeddings)
Generate materials (summary/flashcards) → study_materials(draft)
Tutor review → published → Student sees materials/chat/quiz
Quiz attempts → topic_mastery → Parent view
Admin monitors jobs & RAG health
```

---

## 8. Information Architecture & Navigation

**Entry**: `/portal` (select Admin / Tutor / Student). Keep role in localStorage; header shows role + switch.

**Tutor**

* `/tutor/home` (course cards, quick actions)
* `/tutor/courses/:courseId` (Overview | Sessions | Students | Analytics)
* `/tutor/sessions/:sessionId/transcript` | `/materials` | `/review` | `/files`
* `/tutor/question-bank` | `/tutor/quiz-builder` | `/tutor/performance`

**Student**

* `/student/home` | `/student/courses/:courseId`
* `/student/sessions/:sessionId/overview` | `/chat` | `/quiz`
* `/student/performance`

**Parent**

* `/parent/students/:studentId/performance`

**Admin**

* `/admin/queue` | `/admin/rag`

---

## 9. Data Model (Summary)

Key tables with purpose:

* `profiles` (users with role), `guardianships` (parent↔student)
* `subjects`, `topics` (taxonomy)
* `courses` (per subject/year), `enrollments`
* `sessions`, `session_files`
* `processing_jobs`, `job_events`
* `transcripts`, `transcript_chunks`, `doc_chunks`
* `study_materials`, `material_versions`, `reviews`
* `question_banks`, `questions`, `choices`, `question_topics`
* `quiz_templates`, `quiz_questions`, `quiz_attempts`, `attempt_answers`
* `topic_mastery`
* `conversations`, `messages`, `retrieval_hits`, `message_feedback`
* `notifications`, `notification_preferences`, `audit_log`

(See full SQL in `amplified_schema.sql`.)

---

## 10. Analytics & Telemetry (MVP)

* Material generation clicks, publish events → `audit_log`.
* Chat: retrieval_hits count; average rating from `message_feedback`.
* Quiz funnel: templates created, attempts started/submitted, avg score.
* Processing: job durations; failure counts per job type.

---

## 11. API Requirements (Contract‑level)

**Ingestion & Jobs**

* `POST /ingest/session` → create session, queue transcription
* `GET /admin/jobs` → list jobs; `POST /admin/jobs/:id/retry|cancel`

**Transcripts & Materials**

* `GET /sessions/:id/transcript`
* `GET /sessions/:id/materials` | `POST /materials/{id}/approve|reject`
* `POST /materials/{sessionId}/{type}` (summary|flashcards)

**Banks & Quizzes**

* `POST /questions/import` | `GET /question-banks/:id/questions`
* `POST /quizzes/build` | `GET /quizzes/:id`
* `POST /quizzes/:id/attempt` | `POST /attempts/:id/submit`

**Chat**

* `POST /chat/ask` | `POST /chat/feedback`

**RAG Health**

* `GET /rag/health`

(Full OpenAPI to live in `/services/openapi.yaml`.)

---

## 12. Acceptance Test Plan (Happy Paths)

1. **Tutor upload → publish**: Create session, see job, view transcript, generate materials, approve, see `published` badge.
2. **Student consumption**: Open session overview; see summary + flashcards; start quiz; submit; see score.
3. **Chat with citations**: Ask question; get answer with 1–3 citations.
4. **Admin ops**: View running job; retry/cancel button changes status in mocks.

**Edge Cases** (MVP handling)

* Invalid Drive URL → inline error.
* Empty transcript chunk set → show friendly notice; allow regenerate.
* No questions for selected topics → combine with AI pool or prompt tutor.

---

## 13. Risks & Mitigations

* **ASR quality varies** → allow tutor edits before publish; keep versions.
* **Bolt/Scaffold drift** → lock UX components; use fixtures; document routes.
* **Time** → prioritize Summary + Flashcards + Quiz; Cheatsheet optional.
* **RAG hallucinations** → strong citations; student feedback capture.

---

## 14. Release Plan & Demo Script

* Seed Chemistry course with fixtures; run one live ingestion on RTX.
* Demo flow: Tutor upload → queue view → transcript → generate → review/publish → Student overview/flashcards/chat → quiz → parent dashboard → admin RAG.

---

## 15. Open Questions

* Do we need per‑session chat vs course‑wide chat in MVP? (Current: per‑session.)
* Do we expose tutor bank sharing in MVP? (Current: no.)
* Do we add Cheatsheet in MVP or post‑demo? (Optional.)

---

## 16. Definition of Done (DoD)

* All routes render with non‑empty data (fixtures or live).
* Core flows pass acceptance tests in Chrome.
* README quick start works on a fresh machine (Vite + `.env.local`).
* One end‑to‑end live ingestion succeeds on stage/local.
* Demo script reproducible by two team members.
