import { http, HttpResponse } from 'msw';

// Import fixture data
import profiles from './fixtures/profiles.json';
import subjects from './fixtures/subjects.json';
import topics from './fixtures/topics.json';
import courses from './fixtures/courses.json';
import enrollments from './fixtures/enrollments.json';
import sessions from './fixtures/sessions.json';
import sessionFiles from './fixtures/session_files.json';
import transcripts from './fixtures/transcripts.json';
import transcriptChunks from './fixtures/transcript_chunks.json';
import studyMaterials from './fixtures/study_materials.json';
import materialVersions from './fixtures/material_versions.json';
import reviews from './fixtures/reviews.json';

// Mock current user - in real app this would come from auth
const getCurrentUser = () => profiles.find(p => p.user_id === 'u_tutor_rahul');

export const handlers = [
  // User endpoints
  http.get('/api/me', () => {
    const user = getCurrentUser();
    return HttpResponse.json(user);
  }),

  // Course endpoints
  http.get('/api/courses', ({ request }) => {
    const url = new URL(request.url);
    const tutorId = url.searchParams.get('tutorId');
    
    let filteredCourses = courses;
    if (tutorId) {
      filteredCourses = courses.filter(c => c.tutor_id === tutorId);
    }
    
    return HttpResponse.json(filteredCourses);
  }),

  http.get('/api/courses/:id', ({ params }) => {
    const course = courses.find(c => c.course_id === params.id);
    if (!course) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(course);
  }),

  // Enrollment endpoints
  http.get('/api/enrollments', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    
    let filteredEnrollments = enrollments;
    if (courseId) {
      filteredEnrollments = enrollments.filter(e => e.course_id === courseId);
    }
    
    // Join with student profiles
    const enrichedEnrollments = filteredEnrollments.map(enrollment => {
      const student = profiles.find(p => p.user_id === enrollment.student_id);
      return {
        ...enrollment,
        student
      };
    });
    
    return HttpResponse.json(enrichedEnrollments);
  }),

  // Session endpoints
  http.post('/api/sessions', async ({ request }) => {
    const body = await request.json() as any;
    const newSession = {
      session_id: `ses-${Date.now()}`,
      course_id: body.courseId,
      title: body.title,
      video_source_url: body.video_source_url,
      session_date: body.date || new Date().toISOString(),
      status: 'draft',
      created_at: new Date().toISOString()
    };
    
    // In real implementation, this would be persisted
    return HttpResponse.json(newSession);
  }),

  http.get('/api/sessions', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    
    let filteredSessions = sessions;
    if (courseId) {
      filteredSessions = sessions.filter(s => s.course_id === courseId);
    }
    
    return HttpResponse.json(filteredSessions);
  }),

  http.get('/api/sessions/:id', ({ params }) => {
    const session = sessions.find(s => s.session_id === params.id);
    if (!session) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(session);
  }),

  http.get('/api/sessions/:id/transcript', ({ params }) => {
    const transcript = transcripts.find(t => t.session_id === params.id);
    if (!transcript) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const chunks = transcriptChunks.filter(c => c.transcript_id === transcript.transcript_id);
    
    return HttpResponse.json({
      transcript,
      chunks
    });
  }),

  http.get('/api/sessions/:id/materials', ({ params }) => {
    const materials = studyMaterials.filter(m => m.session_id === params.id);
    
    // Enrich with versions
    const enrichedMaterials = materials.map(material => {
      const versions = materialVersions.filter(v => v.material_id === material.material_id);
      return {
        ...material,
        versions
      };
    });
    
    return HttpResponse.json(enrichedMaterials);
  }),

  http.post('/api/materials/:id/approve', ({ params }) => {
    // Mock approval - in real app would update database
    return HttpResponse.json({ status: 'approved' });
  }),

  http.post('/api/materials/:id/reject', async ({ request }) => {
    const body = await request.json() as any;
    // Mock rejection - in real app would update database and create review
    return HttpResponse.json({ status: 'rejected', comment: body.comment });
  }),

  http.get('/api/sessions/:id/files', ({ params }) => {
    const files = sessionFiles.filter(f => f.session_id === params.id);
    return HttpResponse.json(files);
  }),

  // Admin endpoints
  http.get('/api/admin/jobs', () => {
    // Mock processing jobs
    const jobs = [
      {
        job_id: 'job-001',
        type: 'transcript_generation',
        session_id: 'ses-chem-001',
        status: 'completed',
        queued_at: '2025-07-01T14:00:00Z',
        started_at: '2025-07-01T14:01:00Z',
        finished_at: '2025-07-01T14:05:00Z',
        assigned_to: 'worker-01',
        last_event: 'Transcript generated successfully'
      },
      {
        job_id: 'job-002',
        type: 'material_generation',
        session_id: 'ses-chem-002',
        status: 'running',
        queued_at: '2025-07-08T15:00:00Z',
        started_at: '2025-07-08T15:02:00Z',
        assigned_to: 'worker-02',
        last_event: 'Generating flashcards...'
      },
      {
        job_id: 'job-003',
        type: 'embedding_update',
        session_id: 'ses-chem-003',
        status: 'queued',
        queued_at: '2025-07-15T16:00:00Z',
        last_event: 'Waiting for available worker'
      }
    ];
    
    return HttpResponse.json(jobs);
  }),

  http.post('/api/admin/jobs/:id/retry', ({ params }) => {
    return HttpResponse.json({ status: 'queued' });
  }),

  http.post('/api/admin/jobs/:id/cancel', ({ params }) => {
    return HttpResponse.json({ status: 'canceled' });
  }),

  http.get('/api/admin/jobs/:id/events', ({ params }) => {
    const events = [
      {
        event_id: 'evt-001',
        job_id: params.id,
        event_type: 'started',
        message: 'Job started processing',
        timestamp: '2025-07-01T14:01:00Z'
      },
      {
        event_id: 'evt-002',
        job_id: params.id,
        event_type: 'progress',
        message: 'Processing video file...',
        timestamp: '2025-07-01T14:02:00Z'
      },
      {
        event_id: 'evt-003',
        job_id: params.id,
        event_type: 'completed',
        message: 'Transcript generated successfully',
        timestamp: '2025-07-01T14:05:00Z'
      }
    ];
    
    return HttpResponse.json(events);
  }),

  http.get('/api/rag/health', () => {
    return HttpResponse.json({
      transcript_chunks_count: transcriptChunks.length,
      doc_chunks_count: 156,
      last_embed_at: '2025-07-15T18:00:00Z',
      avg_chunk_len: 145.6
    });
  }),

  // Chat endpoints
  http.post('/api/chat/ask', async ({ request }) => {
    const body = await request.json() as any;
    const question = body.question;
    
    // Mock response with citations
    const mockResponse = {
      answer: `Based on the class materials, ${question.toLowerCase().includes('reaction') ? 'chemical reactions involve the formation of new substances with different properties. There are four main types: combination, decomposition, displacement, and double displacement reactions.' : 'I can help you understand this topic better. Please refer to the specific sections in your class materials.'}`,
      citations: [
        { chunk_id: 'chunk-001-01', score: 0.95 },
        { chunk_id: 'chunk-001-02', score: 0.88 },
        { chunk_id: 'chunk-001-03', score: 0.82 }
      ]
    };
    
    return HttpResponse.json(mockResponse);
  }),

  http.post('/api/chat/feedback', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Student endpoints
  http.get('/api/student/enrollments', ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    
    let filteredEnrollments = enrollments;
    if (studentId) {
      filteredEnrollments = enrollments.filter(e => e.student_id === studentId);
    }
    
    // Join with course data
    const enrichedEnrollments = filteredEnrollments.map(enrollment => {
      const course = courses.find(c => c.course_id === enrollment.course_id);
      return {
        ...enrollment,
        course
      };
    });
    
    return HttpResponse.json(enrichedEnrollments);
  }),

  http.get('/api/student/topic-mastery', ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId') || 'u_stu_01';
    
    // Mock topic mastery data
    const topicMastery = [
      {
        student_id: studentId,
        topic_id: 'topic-chem-reactions',
        attempts: 5,
        correct: 4,
        mastery_score: 0.8,
        last_attempt: '2025-07-10T10:00:00Z'
      },
      {
        student_id: studentId,
        topic_id: 'topic-acids-bases',
        attempts: 3,
        correct: 2,
        mastery_score: 0.67,
        last_attempt: '2025-07-12T14:00:00Z'
      },
      {
        student_id: studentId,
        topic_id: 'topic-metals',
        attempts: 2,
        correct: 1,
        mastery_score: 0.5,
        last_attempt: '2025-07-14T16:00:00Z'
      }
    ];
    
    return HttpResponse.json(topicMastery);
  })
];