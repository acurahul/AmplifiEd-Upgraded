# US-B6 — Chat Endpoints (Ask + Feedback) with Minimal RAG Adapter

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 3-5 points

## Story
As a student,
I want to ask doubts and provide feedback,
so that I can get contextual answers with citations and rate quality.

## Description
Implement chat ask endpoint with simple retrieval from `transcript_chunks` and optional doc sources, returning 1–3 citations. Implement feedback capture.

## Acceptance Criteria
- `POST /chat/ask` returns an answer with 1–3 citations referencing chunk IDs.
- `POST /chat/feedback` records rating 1–5 and optional comment.
 - When MSW is active, responses include `synthetic: true`; UI shows a `*` marker in the chat header or message meta to denote Synthetic.

## UX/Routes
- Student: `/student/sessions/:sessionId/chat`

## Data Model
- `conversations`, `messages`, `retrieval_hits`, `message_feedback`.

## API
- `POST /chat/ask` | `POST /chat/feedback`

## UI Spec
- N/A (API-only)

## Notes/Dependencies
- Retrieval can be lexical/embedding based (pgvector) as available.
 - Synthetic Data (MSW) Note: Seed demo answers/citations and keep `*` visible to verify end-to-end.

## Tasks
- Implement retrieval helper and answer synthesis stub.
- Persist messages and retrieval hits.
- Implement feedback persistence and aggregation.

## Dev Notes
- Architecture patterns and constraints
  - Keep timeouts conservative; stream not required for MVP.
- References
  - [Source: docs/prd.md §4.4 Student Consumption & Practice → Chat]
  - [Source: docs/prd.md §11 API Requirements → Chat]

## Dev Agent Record
- Completion Notes List:
  - [] Ask endpoint returns citations
  - [] Feedback endpoint persists rating/comment
- File List:
  - NEW: `services/api/routes/chat.py`
  - NEW: `services/api/services/rag.py`

## Test Cases
- Ask returns citations array size 1–3 with valid chunk IDs.
- Feedback 201 created with rating in range 1–5.

