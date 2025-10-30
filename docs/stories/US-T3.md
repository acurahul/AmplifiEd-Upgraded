# US-T3 — Open Transcript with Time‑Stamped Chunks

- Epic: Tutor Ingestion & Processing
- Priority: High (MVP Phase 1)
- Status: drafted
- Estimate: 3-5 points

## Story
As a tutor,
I want to open a transcript with time‑stamped chunks,
so that I can quickly navigate to specific moments from the session.

## Description
Tutor can open a transcript with time‑stamped chunks; jump links can be placeholders for MVP.

## Acceptance Criteria
- `/tutor/sessions/:id/transcript` lists ≥6 chunks with `mm:ss` chips; clicking highlights chunk.

## UX/Routes
- Tutor: `/tutor/sessions/:sessionId/transcript`

## Data Model
- tables: `transcripts`, `transcript_chunks`
- fields: start_ms, end_ms, text, embedding (mocked in dev)

## API
- `GET /sessions/:id/transcript`

## UI Spec
- List of chunks with time chips; highlight on click

## Notes/Dependencies
- Upstream on US‑T1 ingestion and worker producing chunks

## Tasks
- Build transcript page rendering chunk list with time chips (AC: #1)
  - Highlight selected chunk on click (AC: #1)
- Wire to API to fetch transcript + chunks (AC: #1)
- Testing
  - Renders ≥6 chunks for seeded data (AC: #1)
  - Clicking a chip highlights corresponding chunk (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Use lightweight client state; no need for streaming; embeddings mocked
- References
  - [Source: docs/prd.md §4.1 Tutor Ingestion & Processing]
  - [Source: docs/prd.md §5.2 Transcription & Chunking]
  - [Source: docs/prd.md §11 API Requirements → Transcripts & Materials]
- Project Structure Notes
  - Page lives under tutor sessions route; chunk list component extracted for reuse
- Learnings from Previous Story
  - Follows ingestion outputs; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.1, §5.2, §11 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Chunk list renders with time chips
  - [] Highlight behavior implemented
  - [] API wired and resilient to empty data
  - [] Tests passing
- File List:
  - NEW: `ui/tutor/transcript/TranscriptPage.tsx`
  - NEW: `ui/tutor/transcript/ChunkList.tsx`

## Test Cases
- Transcript view renders with ≥6 chunks
- Clicking a chip highlights corresponding chunk
