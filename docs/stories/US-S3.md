# US-S3 — Chat with Citations

- Epic: Student Consumption & Practice
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 5-8 points

## Story
As a student,
I want to ask doubts in chat and see cited transcript chunks,
so that I can trust and verify answers while studying.

## Description
Student asks doubts; chatbot responds with citations to transcript chunks.

## Acceptance Criteria
- Response includes 1–3 citations referencing transcript chunk IDs.

## UX/Routes
- Student: `/student/sessions/:sessionId/chat`

## Data Model
- tables: `conversations`, `messages`, `retrieval_hits`, `message_feedback`

## API
- `POST /chat/ask`
- `POST /chat/feedback`

## UI Spec
- Chat thread; citation chips linking to chunk IDs; feedback (1–5 + comment)

## Notes/Dependencies
- Requires transcript chunks (US‑T3); RAG indexing mocked acceptable for MVP

## Tasks
- Implement chat ask endpoint with mocked retrieval and citations (AC: #1)
- Build chat UI with citation chips and feedback control (AC: #1)
- Testing
  - Answer shows 1–3 citations; feedback recorded (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Keep retrieval deterministic for demo; include chunk IDs in the response
- References
  - [Source: docs/prd.md §4.3 Student Consumption & Practice]
  - [Source: docs/prd.md §5.6 Chatbot (RAG)]
- Project Structure Notes
  - Place chat UI under student session routes; retrieval service isolated
- Learnings from Previous Story
  - Builds on transcripts; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.3, §5.6 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Ask endpoint returns citations
  - [] UI displays citation chips
  - [] Feedback saved
  - [] Tests passing
- File List:
  - NEW: `api/chat/ask.ts`
  - NEW: `ui/student/session/ChatPage.tsx`

## Test Cases
- Answer shows 1–3 citations; feedback recorded
