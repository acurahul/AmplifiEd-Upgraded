# US-S2 — Use Recap and Flashcards

- Epic: Student Consumption & Practice
- Priority: High (MVP Phase 3)
- Status: drafted
- Estimate: 3-5 points

## Story
As a student,
I want to read session recaps and practice with flashcards,
so that I can revise quickly and reinforce learning.

## Description
Student consumes recap and flashcards for a session.

## Acceptance Criteria
- Overview shows summary bullets; flashcards flip with Q/A.

## UX/Routes
- Student: `/student/sessions/:sessionId/overview`

## Data Model
- tables: `study_materials`

## UI Spec
- Summary bullets view; flip-card component for Q/A

## Notes/Dependencies
- Depends on US‑T4/US‑T5

## Tasks
- Implement session overview with summary bullets (AC: #1)
- Implement flashcards flip UI with Q/A (AC: #1)
- Testing
  - Overview renders summary bullets; flashcards flip interaction works (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Read‑only; ensure accessibility for keyboard navigation
- References
  - [Source: docs/prd.md §4.3 Student Consumption & Practice]
  - [Source: docs/prd.md §5.3 Materials Generation]
- Project Structure Notes
  - Components under student session routes
- Learnings from Previous Story
  - Consumes published materials; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; sections §4.3, §5.3 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Overview page with summary
  - [] Flashcards flip component
  - [] Tests passing
- File List:
  - NEW: `ui/student/session/OverviewPage.tsx`
  - NEW: `ui/student/session/Flashcards.tsx`

## Test Cases
- Overview renders summary bullets; flashcards flip interaction works
