# US-B1 — Scaffold FastAPI Service + OpenAPI

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 2-3 points

## Story
As a developer,
I want a FastAPI service skeleton with CI and OpenAPI spec,
so that we can implement real endpoints and integrate with the frontend.

## Description
Create a production-ready FastAPI project structure, CI checks, env config, and an initial OpenAPI that mirrors the PRD contracts.

## Acceptance Criteria
- FastAPI app boots locally via `uvicorn` with health endpoint.
- CI runs lint/type/test on push (non-interactive, minimal tests acceptable).
- `/services/openapi.yaml` present and referenced by the app root.

## UX/Routes
- N/A (service-only)

## Data Model
- N/A (scaffold only)

## API
- `GET /healthz` → `{ status: "ok" }`.
- Serve OpenAPI at `/openapi.yaml` (static) and `/docs` (Swagger UI).

## UI Spec
- N/A

## Notes/Dependencies
- Mirrors PRD §11 API contracts to be implemented in subsequent stories.

## Tasks
- Initialize FastAPI project layout and settings.
- Add `/healthz`, OpenAPI static hosting, and Swagger UI.
- Add CI (lint/type/test) and local env templates.

## Dev Notes
- Architecture patterns and constraints
  - Use pydantic settings for env; structure modules by bounded context.
- References
  - [Source: docs/prd.md §11 API Requirements]
  - [Source: docs/prd.md §7 System Architecture]

## Dev Agent Record
- Completion Notes List:
  - [] App boots and exposes `/healthz` and `/docs`
  - [] CI runs successfully
  - [] OpenAPI file present and linked
- File List:
  - NEW: `services/openapi.yaml`
  - NEW: `services/api/main.py`
  - NEW: `.github/workflows/backend-ci.yaml`

## Test Cases
- `GET /healthz` returns 200 `{ status: "ok" }`.

