import { http, HttpResponse } from 'msw';

// Import all fixture data
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
import questions from './fixtures/questions.json';
import choices from './fixtures/choices.json';
import questionBanks from './fixtures/question_banks.json';
import questionTopics from './fixtures/question_topics.json';
import quizTemplates from './fixtures/quiz_templates.json';
import quizQuestions from './fixtures/quiz_questions.json';
import quizAttempts from './fixtures/quiz_attempts.json';
import attemptAnswers from './fixtures/attempt_answers.json';
import topicMastery from './fixtures/topic_mastery.json';
import conversations from './fixtures/conversations.json';
import messages from './fixtures/messages.json';
import messageFeedback from './fixtures/message_feedback.json';
import retrievalHits from './fixtures/retrieval_hits.json';
import notifications from './fixtures/notifications.json';
import processingJobs from './fixtures/processing_jobs.json';
import jobEvents from './fixtures/job_events.json';
import guardianships from './fixtures/guardianships.json';

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
    return HttpResponse.json({ status: 'approved' });
  }),

  http.post('/api/materials/:id/reject', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({ status: 'rejected', comment: body.comment });
  }),

  http.get('/api/sessions/:id/files', ({ params }) => {
    const files = sessionFiles.filter(f => f.session_id === params.id);
    return HttpResponse.json(files);
  }),

  // Parent performance endpoint (mock)
  http.get('/api/parent/students/:studentId/performance', ({ params }) => {
    const studentId = params.studentId as string
    const topics = [
      { topic_id: 't1', topic_name: 'Stoichiometry', attempts: 8, correct: 6, last_attempt: '2025-09-20T10:00:00Z', accuracy_percent: 75 },
      { topic_id: 't2', topic_name: 'Thermodynamics', attempts: 5, correct: 3, last_attempt: '2025-09-18T12:30:00Z', accuracy_percent: 60 },
    ]
    return HttpResponse.json({ student_id: studentId, topics })
  }),

  // Quiz endpoints
  http.get('/api/quizzes', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    
    let filteredQuizzes = quizTemplates;
    if (courseId) {
      filteredQuizzes = quizTemplates.filter(q => q.course_id === courseId);
    }
    
    return HttpResponse.json(filteredQuizzes);
  }),

  http.get('/api/quizzes/:id', ({ params }) => {
    const quiz = quizTemplates.find(q => q.id === params.id);
    if (!quiz) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Get quiz questions with choices
    const quizQuestionIds = quizQuestions
      .filter(qq => qq.quiz_id === params.id)
      .sort((a, b) => a.position - b.position)
      .map(qq => qq.question_id);
    
    const questionsWithChoices = quizQuestionIds.map(questionId => {
      const question = questions.find(q => q.id === questionId);
      const questionChoices = choices.filter(c => c.question_id === questionId);
      return {
        ...question,
        choices: questionChoices
      };
    });
    
    return HttpResponse.json({
      ...quiz,
      questions: questionsWithChoices
    });
  }),

  http.get('/api/quizzes/:id/attempts', ({ params }) => {
    const attempts = quizAttempts.filter(a => a.quiz_id === params.id);
    
    // Enrich with student data and answers
    const enrichedAttempts = attempts.map(attempt => {
      const student = profiles.find(p => p.user_id === attempt.student_id);
      const answers = attemptAnswers.filter(a => a.attempt_id === attempt.id);
      return {
        ...attempt,
        student,
        answers
      };
    });
    
    return HttpResponse.json(enrichedAttempts);
  }),

  http.post('/api/quizzes/:id/attempts', async ({ params, request }) => {
    const body = await request.json() as any;
    const newAttempt = {
      id: `at-${Date.now()}`,
      quiz_id: params.id,
      student_id: body.student_id,
      started_at: new Date().toISOString(),
      submitted_at: body.submitted_at || new Date().toISOString(),
      score: body.score || 0
    };
    
    return HttpResponse.json(newAttempt);
  }),

  // Admin endpoints
  http.get('/api/admin/jobs', () => {
    // Convert existing fixture jobs to expected format
    const fixtureJobs = processingJobs.map(job => ({
      job_id: job.id,
      type: job.job,
      session_id: job.session_id,
      status: job.status,
      queued_at: job.queued_at,
      started_at: job.started_at,
      finished_at: job.finished_at,
      assigned_to: job.assigned_to,
      last_event: jobEvents.find(e => e.job_id === job.id)?.message || 'No events',
      synthetic: true
    }));

    // Provide a realistic mixed-status list to ensure UI has data in dev
    const now = new Date();
    const iso = (d: Date) => d.toISOString();
    const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

    const syntheticJobs = [
      {
        job_id: 'job-queued-01',
        type: 'transcription',
        session_id: 'ses-chem-003',
        status: 'queued',
        queued_at: iso(minutesAgo(5)),
        started_at: null,
        finished_at: null,
        assigned_to: null,
        last_event: 'Queued by tutor upload',
        synthetic: true
      },
      {
        job_id: 'job-processing-01',
        type: 'summarization',
        session_id: 'ses-chem-004',
        status: 'processing',
        queued_at: iso(minutesAgo(20)),
        started_at: iso(minutesAgo(18)),
        finished_at: null,
        assigned_to: 'RTX3060-01',
        last_event: 'Generating summary chunks…',
        synthetic: true
      },
      {
        job_id: 'job-completed-01',
        type: 'transcription',
        session_id: 'ses-chem-005',
        status: 'completed',
        queued_at: iso(minutesAgo(60)),
        started_at: iso(minutesAgo(58)),
        finished_at: iso(minutesAgo(40)),
        assigned_to: 'RTX3060-02',
        last_event: 'Completed successfully',
        synthetic: true
      },
      {
        job_id: 'job-failed-01',
        type: 'summarization',
        session_id: 'ses-chem-006',
        status: 'failed',
        queued_at: iso(minutesAgo(90)),
        started_at: iso(minutesAgo(88)),
        finished_at: iso(minutesAgo(85)),
        assigned_to: 'RTX3060-02',
        last_event: 'Error: model timeout; retry available',
        synthetic: true
      }
    ];

    const jobs = [...syntheticJobs, ...fixtureJobs]
      .sort((a, b) => new Date(b.queued_at).getTime() - new Date(a.queued_at).getTime());

    return HttpResponse.json(jobs.map(j => ({ ...j, synthetic: true })));
  }),

  http.post('/api/admin/jobs/:id/retry', ({ params }) => {
    return HttpResponse.json({ status: 'queued', synthetic: true });
  }),

  http.post('/api/admin/jobs/:id/cancel', ({ params }) => {
    return HttpResponse.json({ status: 'canceled', synthetic: true });
  }),

  http.get('/api/admin/jobs/:id/events', ({ params }) => {
    const fromFixtures = jobEvents
      .filter(e => e.job_id === params.id)
      .map(event => ({
        event_id: event.id,
        job_id: event.job_id,
        event_type: event.status,
        message: event.message,
        timestamp: event.created_at
      }));

    // If no fixture events exist (e.g., for synthetic jobs), synthesize a plausible timeline
    if (fromFixtures.length === 0) {
      const id = String(params.id);
      const now = new Date();
      const iso = (d: Date) => d.toISOString();
      const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

      let synthetic: any[] = [];
      if (id.includes('queued')) {
        synthetic = [
          { event_id: `${id}-e1`, job_id: id, event_type: 'queued', message: 'Job queued', timestamp: iso(minutesAgo(5)) }
        ];
      } else if (id.includes('processing')) {
        synthetic = [
          { event_id: `${id}-e1`, job_id: id, event_type: 'queued', message: 'Job queued', timestamp: iso(minutesAgo(22)) },
          { event_id: `${id}-e2`, job_id: id, event_type: 'running', message: 'Worker picked up job', timestamp: iso(minutesAgo(19)) },
          { event_id: `${id}-e3`, job_id: id, event_type: 'running', message: 'Generating summary chunks…', timestamp: iso(minutesAgo(17)) }
        ];
      } else if (id.includes('completed')) {
        synthetic = [
          { event_id: `${id}-e1`, job_id: id, event_type: 'queued', message: 'Job queued', timestamp: iso(minutesAgo(62)) },
          { event_id: `${id}-e2`, job_id: id, event_type: 'running', message: 'Transcribing audio', timestamp: iso(minutesAgo(59)) },
          { event_id: `${id}-e3`, job_id: id, event_type: 'completed', message: 'Completed successfully', timestamp: iso(minutesAgo(40)) }
        ];
      } else if (id.includes('failed')) {
        synthetic = [
          { event_id: `${id}-e1`, job_id: id, event_type: 'queued', message: 'Job queued', timestamp: iso(minutesAgo(92)) },
          { event_id: `${id}-e2`, job_id: id, event_type: 'running', message: 'Starting summarization', timestamp: iso(minutesAgo(89)) },
          { event_id: `${id}-e3`, job_id: id, event_type: 'failed', message: 'Error: model timeout; retry available', timestamp: iso(minutesAgo(85)) }
        ];
      }

      return HttpResponse.json(synthetic);
    }

    return HttpResponse.json(fromFixtures);
  }),

  http.get('/api/rag/health', () => {
    return HttpResponse.json({
      transcript_chunks_count: transcriptChunks.length,
      doc_chunks_count: sessionFiles.length,
      last_embed_at: '2025-07-15T18:00:00Z',
      avg_chunk_len: transcriptChunks.reduce((sum, chunk) => sum + chunk.text.length, 0) / transcriptChunks.length,
      synthetic: true
    });
  }),

  // Chat endpoints
  http.post('/api/chat/ask', async ({ request }) => {
    const body = await request.json() as any;
    const question = body.question;
    
    // Find relevant chunks based on question keywords
    const relevantChunks = transcriptChunks
      .filter(chunk => {
        const questionWords = question.toLowerCase().split(' ');
        const chunkText = chunk.text.toLowerCase();
        return questionWords.some(word => chunkText.includes(word));
      })
      .slice(0, 3)
      .map(chunk => ({
        chunk_id: chunk.chunk_id,
        score: chunk.embedding_score
      }));
    
    // Generate contextual response
    let answer = "I can help you understand this topic better. ";
    if (question.toLowerCase().includes('reaction')) {
      answer += "Chemical reactions involve the formation of new substances with different properties. There are four main types: combination, decomposition, displacement, and double displacement reactions.";
    } else if (question.toLowerCase().includes('acid') || question.toLowerCase().includes('base')) {
      answer += "Acids release hydrogen ions (H⁺) in water, while bases release hydroxide ions (OH⁻). The pH scale helps us measure acidity from 0-14.";
    } else if (question.toLowerCase().includes('metal')) {
      answer += "Metals are good conductors of heat and electricity, while non-metals are generally poor conductors. Metals are malleable and ductile.";
    } else {
      answer += "Based on your class materials, this concept is covered in detail in your study materials.";
    }
    
    return HttpResponse.json({
      answer,
      citations: relevantChunks,
      synthetic: true
    });
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
    
    // Get topic mastery data for the student
    const studentMastery = topicMastery
      .filter(tm => tm.student_id === studentId)
      .map(tm => ({
        student_id: tm.student_id,
        topic_id: tm.topic_id,
        attempts: tm.attempts,
        correct: tm.correct,
        mastery_score: tm.correct / tm.attempts,
        last_attempt: tm.last_attempt
      }));
    
    return HttpResponse.json(studentMastery);
  }),

  // Question bank endpoints
  http.get('/api/questions', ({ request }) => {
    const url = new URL(request.url);
    const bankId = url.searchParams.get('bankId');
    const subjectId = url.searchParams.get('subjectId');
    
    let filteredQuestions = questions;
    if (bankId) {
      filteredQuestions = filteredQuestions.filter(q => q.bank_id === bankId);
    }
    if (subjectId) {
      filteredQuestions = filteredQuestions.filter(q => q.subject_id === subjectId);
    }
    
    // Enrich with choices and topics
    const enrichedQuestions = filteredQuestions.map(question => {
      const questionChoices = choices.filter(c => c.question_id === question.id);
      const questionTopicIds = questionTopics
        .filter(qt => qt.question_id === question.id)
        .map(qt => qt.topic_id);
      
      return {
        ...question,
        choices: questionChoices,
        topics: questionTopicIds
      };
    });
    
    return HttpResponse.json(enrichedQuestions);
  }),

  // Notification endpoints
  http.get('/api/notifications', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    let filteredNotifications = notifications;
    if (userId) {
      filteredNotifications = notifications.filter(n => n.user_id === userId);
    }
    
    return HttpResponse.json(filteredNotifications);
  }),

  http.post('/api/notifications/:id/read', ({ params }) => {
    return HttpResponse.json({ read_at: new Date().toISOString() });
  }),

  // Conversation endpoints
  http.get('/api/conversations', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const sessionId = url.searchParams.get('sessionId');
    
    let filteredConversations = conversations;
    if (userId) {
      filteredConversations = filteredConversations.filter(c => c.user_id === userId);
    }
    if (sessionId) {
      filteredConversations = filteredConversations.filter(c => c.session_id === sessionId);
    }
    
    return HttpResponse.json(filteredConversations);
  }),

  http.get('/api/conversations/:id/messages', ({ params }) => {
    const conversationMessages = messages.filter(m => m.conversation_id === params.id);
    return HttpResponse.json(conversationMessages);
  }),

  // Subject and topic endpoints
  http.get('/api/subjects', () => {
    return HttpResponse.json(subjects);
  }),

  http.get('/api/topics', ({ request }) => {
    const url = new URL(request.url);
    const subjectId = url.searchParams.get('subjectId');
    
    let filteredTopics = topics;
    if (subjectId) {
      filteredTopics = topics.filter(t => t.subject_id === subjectId);
    }
    
    return HttpResponse.json(filteredTopics);
  })
];