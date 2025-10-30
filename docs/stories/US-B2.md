# US-B2 — Supabase Auth JWT Verification + RLS Alignment

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: High (MVP Phase 2)
- Status: drafted
- Estimate: 2-3 points

## Story
As a developer,
I want the backend to verify Supabase JWTs and respect RLS policies,
so that access controls are consistent with the database.

## Description
Implement middleware to validate Supabase JWT, extract user id and role, and apply role-based checks aligned to Supabase RLS policies.

## Acceptance Criteria
- Requests with valid Supabase JWT succeed; invalid/expired are 401.
- User id and role propagated to handlers and queries.
- RLS-aligned checks demonstrated via sample protected endpoint.

## UX/Routes
- N/A

## Data Model
- Uses `profiles` for role mapping.

## API
- Protect all non-public endpoints with JWT middleware.

## UI Spec
- N/A

## Notes/Dependencies
- Requires Supabase project keys and JWT secret in env.

## Tasks
- Add auth middleware and token verification utilities.
- Add dependency that exposes `current_user` in routes.
- Add sample protected route and tests.

## Dev Notes
- Architecture patterns and constraints
  - Cache JWKS if using GoTrue JWKS; handle clock skew.
- References
  - [Source: docs/prd.md §7 System Architecture]
  - [Source: docs/prd.md §6 NFRs → Security]

## Dev Agent Record
- Completion Notes List:
  - [] JWT verification middleware
  - [] Protected route with role check
  - [] Tests for auth pass/fail
- File List:
  - MODIFIED: `services/api/main.py`
  - NEW: `services/api/auth.py`

## Test Cases
- Missing token → 401.
- Invalid token → 401.
- Valid tutor token → 200 on protected tutor route.

