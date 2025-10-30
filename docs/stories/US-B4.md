# US-B4 — Transcripts & Materials Endpoints

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 3-5 points

## Story
As a tutor,
I want to retrieve transcripts and manage study materials (summary/flashcards),
so that I can review and publish learning content.

## Description
Implement endpoints to fetch transcripts/chunks and to generate, list, approve/reject materials. Persist to `transcripts`, `transcript_chunks`, `study_materials`, `material_versions`, `reviews`.

## Acceptance Criteria
- `GET /sessions/:id/transcript` returns chunks with `mm:ss` timing.
- `POST /materials/{sessionId}/{type}` creates draft materials.
- `GET /sessions/:id/materials` lists materials; approve/reject updates status with required comment on reject.
 - When MSW is active, responses include `synthetic: true`; UI shows a `*` next to transcript headers/material titles to denote Synthetic.

## UX/Routes
- Tutor: `/tutor/sessions/:sessionId/transcript` | `/materials` | `/review`

## Data Model
- `transcripts`, `transcript_chunks`, `study_materials`, `material_versions`, `reviews`.

## API
- `GET /sessions/:id/transcript`
- `GET /sessions/:id/materials`
- `POST /materials/{id}/approve|reject`
- `POST /materials/{sessionId}/{type}` (summary|flashcards)

## UI Spec
- N/A (API-only)

## Notes/Dependencies
- Generation may call worker or stub for MVP; persist versions.
 - Synthetic Data (MSW) Note: Keep transcript/materials fixtures and `*` marker visible for quick verification during dev.

## Tasks
- Implement transcript retrieval with pagination.
- Implement materials CRUD and state transitions, with versioning.
- Enforce status machine: `draft → pending_review → approved/rejected → published`.

## Dev Notes
- Architecture patterns and constraints
  - Guard transitions with invariants; write review records.
- References
  - [Source: docs/prd.md §4.2 Tutor Materials & Approval]
  - [Source: docs/prd.md §11 API Requirements → Transcripts & Materials]

## Dev Agent Record
- Completion Notes List:
  - [] Transcript retrieval endpoint
  - [] Materials generate/list
  - [] Approve/Reject transitions
- File List:
  - NEW: `services/api/routes/transcripts.py`
  - NEW: `services/api/routes/materials.py`
  - NEW: `services/api/repos/materials.py`

## Test Cases
- Transcript GET returns ≥6 chunks for seeded session.
- Approve requires prior `pending_review`; Reject requires comment.

