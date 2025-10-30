# US-A2 — RAG Health Dashboard

- Epic: Admin/Dev Ops
- Priority: Medium (MVP Phase 3)
- Status: done
- Estimate: 3-5 points

## Story
As an admin,
I want to see retrieval health metrics and a sample retrieval demo,
so that I can validate RAG readiness.

## Description
Admin sees retrieval health and sample retrieval demo.

## Acceptance Criteria
- Count of chunks; last embed time; sample retrieval demo.
 - When MSW is active, responses include `synthetic: true` and the UI shows a `*` next to KPI values or section headers to denote Synthetic.

## UX/Routes
- Admin: `/admin/rag`

## Data Model
- tables: `transcript_chunks`, `doc_chunks`

## API
- `GET /rag/health`

## UI Spec
- KPIs: chunks count, last embed time; sample retrieval panel

## Notes/Dependencies
- Requires ingestion/embedding pipeline (mock acceptable)
 - Synthetic Data (MSW) Note: Provide seeded KPIs/sample retrieval; display `*` marker in UI when data is synthetic for quick verification.

## Tasks
- Implement health endpoint with KPIs; mock acceptable (AC: #1)
- Build RAG dashboard with KPIs and sample retrieval (AC: #1)
- Testing
  - Health metrics render; sample retrieval returns results (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Keep health checks lightweight; mock data permissible for MVP
- References
  - [Source: docs/prd.md §4.6 Admin/Dev Ops]
  - [Source: docs/prd.md §11 API Requirements → RAG Health]
- Project Structure Notes
  - Route under `/admin/rag`; service for health metrics
- Learnings from Previous Story
  - Complements jobs queue; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.6, §11 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [x] Health endpoint and KPIs (Mock via MSW with synthetic flag)
  - [x] Dashboard UI and sample retrieval with citations
  - [x] Synthetic data indicator (*) displayed when MSW is active
  - [x] All acceptance criteria met

### Completion Notes
**Completed:** 2025-01-28
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

- Health endpoint implemented via MSW with real fixture data calculations
- Sample retrieval demo functional with live citations display
- Synthetic data indicators properly implemented per MSW active state
- No linting errors, follows Next.js app directory patterns

- File List:
  - MODIFIED: `src/app/(portal)/admin/rag/page.tsx` - Implemented RAG health dashboard
  - MODIFIED: `mocks/handlers.ts` - Added synthetic flag to /api/rag/health and /api/chat/ask endpoints

## Test Cases
- Health metrics render; sample retrieval returns results
