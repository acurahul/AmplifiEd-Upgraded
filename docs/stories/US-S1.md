# US-S1 — See Enrolled Courses and Sessions

- Epic: Student Consumption & Practice
- Priority: High (MVP Phase 3)
- Status: drafted
- Estimate: 3-5 points

## Story
As a student,
I want to see my enrolled courses and sessions with published materials,
so that I can quickly access what I need to study.

## Description
Student views enrolled course and sessions with published materials.

## Acceptance Criteria
- `/student/home` lists course; sessions show published materials.

## UX/Routes
- Student: `/student/home`
- Student: `/student/courses/:courseId`

## Data Model
- tables: `enrollments`, `courses`, `sessions`, `study_materials`

## UI Spec
- Course cards; session list with published indicators

## Notes/Dependencies
- Requires materials published (US‑T5)

## Tasks
- Implement enrolled courses listing and session list with published flags (AC: #1)
- Testing
  - Enrolled course appears; sessions show published materials (AC: #1)

## Dev Notes
- Architecture patterns and constraints
  - Read‑only views; ensure performance and simple fixture fallback
- References
  - [Source: docs/prd.md §4.3 Student Consumption & Practice]
- Project Structure Notes
  - Student home and course detail pages under `/student`
- Learnings from Previous Story
  - Downstream of publish flow; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; section §4.3 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [] Course list and session list implemented
  - [] Published indicators wired
  - [] Tests passing
- File List:
  - NEW: `ui/student/HomePage.tsx`
  - NEW: `ui/student/CourseDetailPage.tsx`

## Test Cases
- Enrolled course appears; sessions show published materials
