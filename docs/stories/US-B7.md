# US-B7 — RAG Health Endpoint

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 2-3 points

## Story
As an admin,
I want a RAG health endpoint,
so that I can view chunks count, last embed time, and demo retrieval.

## Description
Implement `GET /rag/health` returning KPIs and a sample retrieval demo payload for UI consumption.

## Acceptance Criteria
- Returns chunks counts and last embed time.
- Returns a demo retrieval array with top hits.
 - When MSW is active, response includes `synthetic: true`; UI shows a `*` next to KPI labels to denote Synthetic.

## UX/Routes
- Admin: `/admin/rag`

## Data Model
- `transcript_chunks`, `doc_chunks`

## API
- `GET /rag/health`

## UI Spec
- N/A (API-only)

## Notes/Dependencies
- Keep health checks light; mock acceptable values if embeddings unavailable.
 - Synthetic Data (MSW) Note: Seed KPI fixtures and demo retrieval; display `*` so Synthetic state is obvious.

## Tasks
- Implement KPI queries and shape response per frontend contract.
- Add sample retrieval demo with deterministic seed.

## Dev Notes
- Architecture patterns and constraints
  - Avoid heavy queries; cap demo results.
- References
  - [Source: docs/prd.md §4.6 Admin/Dev Ops]
  - [Source: docs/prd.md §11 API Requirements → RAG Health]

## Dev Agent Record
- Completion Notes List:
  - [] Health endpoint returns KPIs
  - [] Demo retrieval section present
- File List:
  - NEW: `services/api/routes/rag.py`

## Test Cases
- KPIs present and correctly typed; demo retrieval length ≥ 1.

