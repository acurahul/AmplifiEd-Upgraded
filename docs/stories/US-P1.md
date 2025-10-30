# US-P1 — View Topic Mastery

- Epic: Parent Progress View
- Priority: Low (MVP Phase 3/4)
- Status: done
- Estimate: 5 points

## Story
As a parent,
I want to view my child’s topic mastery,
so that I can support them where needed.

## Description
Parent sees student’s topic mastery in a read-only view.

## Acceptance Criteria
1. Parent can only view students they are guardian of (guardianships filtering enforced)
2. Topic mastery table displays:
   - Topic name (from topics table)
   - Attempt count
   - Correct answers count
   - Last attempt date (formatted as readable date)
3. Data sourced from aggregated quiz attempts for each topic

## UX/Routes
- Parent: `/parent/students/:studentId/performance`

## Data Model
- tables: `guardianships`, `topics`, `quiz_attempts`, `attempt_answers`, `questions`, `question_topics`
- API: `GET /api/parent/students/:studentId/performance`
  - Returns: `{ student_id, topics: [{ topic_id, topic_name, attempts, correct, last_attempt, accuracy_percent }] }`
  - Authorization: Verify parent has guardianship relationship

## UI Spec
- Page title: "Student Performance"
- Student selector dropdown (if multiple children)
- Table columns:
  - Topic (topic name)
  - Attempts (number)
  - Correct (number with accuracy percentage)
  - Last Attempt (formatted date, e.g., "Sep 20, 2025")
- Empty state: Message "No quiz attempts recorded yet"
- Responsive: Mobile-friendly table layout

## Notes/Dependencies
- Depends on quiz attempts data

## Tasks
1. Create API endpoint `/api/parent/students/:studentId/performance` with guardianship authorization
2. Aggregate quiz attempts data by topic for the specified student
3. Build parent performance page component with topic mastery table
4. Implement student selector in parent navigation
5. Testing
   - Verify guardianship authorization blocks unauthorized access
   - Topic mastery table renders correct data from fixtures
   - Student selector filters appropriately

## Dev Notes
- Architecture patterns and constraints
  - Read‑only; ensure privacy and correct guardianship filtering
- References
  - [Source: docs/prd.md §4.5 Parent Progress View]
- Project Structure Notes
  - Parent route under `/parent` with student selector
- Learnings from Previous Story
  - Depends on recorded attempts; no prior learnings

## Dev Agent Record
- Context Reference: PRD v1.1 loaded; section §4.5 cited
- Agent Model Used: N/A
- Debug Log References: N/A
- Completion Notes List:
  - [x] Topic mastery table implemented
  - [x] Data wiring from attempts
  - [x] Tests passing
- File List:
  - NEW: `src/app/(portal)/parent/students/[studentId]/performance/page.tsx`
  - NEW: `src/components/parent/PerformanceView.tsx`
  - NEW: `src/app/api/parent/students/[studentId]/performance/route.ts`
  - MAYBE: `src/components/parent/StudentSelector.tsx` (if not already exists)

## Test Cases
1. Unauthorized parent cannot access student performance data
2. Authorized parent sees only their linked students' data
3. Topic mastery table displays all required fields with correct data
4. Empty state handled gracefully when no attempts exist
5. Student selector shows only guardianship-linked students
