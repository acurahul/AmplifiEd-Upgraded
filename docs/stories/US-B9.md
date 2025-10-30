# US-B9 — Deployment, Monitoring, and Migration Plan

- Epic: Backend Services v1 (FastAPI + Supabase)
- Priority: Medium (MVP Phase 3)
- Status: drafted
- Estimate: 2-3 points

## Story
As an operator,
I want the backend deployed with basic monitoring and a migration path,
so that the MVP can run reliably for demos.

## Description
Set up dev/stage deployments, basic metrics/logs, and a lightweight DB migration process compatible with Supabase.

## Acceptance Criteria
- Deployable via one command to dev and stage.
- Basic health/metrics visible (logs + request counts; 95th latency).
- Migrations runnable with versioning and rollback plan.
 - When MSW is enabled in dev, staging banner and `*` marker appear in UI to denote Synthetic data sources.

## UX/Routes
- N/A

## Data Model
- Leverage existing Supabase schema; migrations for new tables are versioned.

## API
- N/A (operational)

## UI Spec
- N/A

## Notes/Dependencies
- Align with PRD DoD: one end-to-end live ingestion succeeds on stage/local.
 - Synthetic Data (MSW) Note: Document enabling/disabling MSW and how the `*` indicator manifests across routes.

## Tasks
- Provision deployment scripts/workflows.
- Add logging/metrics middleware; export counters/histograms.
- Configure migration tool and document process.

## Dev Notes
- Architecture patterns and constraints
  - Keep costs minimal; prefer managed where possible.
- References
  - [Source: docs/prd.md §14 Release Plan & Demo Script]
  - [Source: docs/prd.md §16 DoD]

## Dev Agent Record
- Completion Notes List:
  - [] Dev/stage deployment workflows
  - [] Basic monitoring attached
  - [] Migration tool configured
- File List:
  - NEW: `services/deploy/README.md`
  - NEW: `.github/workflows/backend-deploy.yaml`
  - NEW: `services/migrations/README.md`

## Test Cases
- Deploys to stage and `/healthz` returns ok.
- Migration adds a dummy table and can be rolled back.

