# US-T4 — Generate Summary and Flashcards

- Epic: Tutor Materials & Approval
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 5-8 points

## Story
As a tutor,
I want the system to generate a summary and flashcards from a transcript,
so that I get high‑quality draft materials to review quickly.

## Description
System generates summary and flashcards from transcript.

## Acceptance Criteria
- Clicking Generate creates `study_materials` with status `draft` and visible content.

## UX/Routes
- Tutor: `/tutor/sessions/:sessionId/materials`

## Data Model
- tables: `study_materials`, `material_versions`
- types: `summary`, `flashcards`
- shapes:
  - Summary: `{ bullets: string[], length?: number }`
  - Flashcards: `{ cards: { q: string, a: string }[] }`

## API
- `POST /materials/{sessionId}/{type}` (summary|flashcards)

## UI Spec
- Generate buttons per type; show draft preview

## Notes/Dependencies
- Requires transcript chunks (US‑T3)

## Tasks
- Implement material generation endpoints for summary and flashcards (AC: #1)
  - Persist drafts in `study_materials`; create `material_versions` on save (AC: #1)
- Build UI generate actions and preview pane (AC: #1)
- Testing
  - Generating summary creates draft content (AC: #1)
  - Generating flashcards creates draft content (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Version every save; drafts remain until review; deterministic output for demo
- References
  - [Source: docs/prd.md §4.2 Tutor Materials & Approval]
  - [Source: docs/prd.md §5.3 Materials Generation]
  - [Source: docs/prd.md §11 API Requirements → Transcripts & Materials]
- Project Structure Notes
  - Keep generators in a service; UI triggers per material type
- Learnings from Previous Story
  - Downstream of transcripts; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.2, §5.3, §11 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Endpoints implemented and persist drafts
  - [] UI preview renders content
  - [] Versioning recorded
  - [] Tests passing
- File List:
  - NEW: `api/materials/generate.ts`
  - NEW: `services/materials/generator.ts`
  - MODIFIED: `ui/tutor/materials/MaterialsPage.tsx`

## Test Cases
- Generate summary produces draft content
- Generate flashcards produces draft content
