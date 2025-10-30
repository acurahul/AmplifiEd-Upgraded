// src/app/(portal)/student/courses/[courseId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, MessageSquare, Clock, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';

export default function StudentCoursePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  // Database state
  const [course, setCourse] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // --- START OF FIX ---
  // If params are not available yet, render a loading state or nothing.
  if (!params) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
    );
  }

  // Once we are past the check, TypeScript knows params is not null.
  const courseId = params.courseId;
  // --- END OF FIX ---

  // Fetch course data from database
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user || !courseId) return;
      
      try {
        setLoading(true);
        setError(null);

        // Check if student is enrolled in this course
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('student_id', user.id)
          .eq('course_id', courseId)
          .is('left_on', null)
          .single();

        if (enrollmentError && enrollmentError.code !== 'PGRST116') {
          throw enrollmentError;
        }

        setIsEnrolled(!!enrollmentData);

        if (!enrollmentData) {
          setError('You are not enrolled in this course.');
          return;
        }

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('course_id', courseId)
          .single();

        if (courseError) throw courseError;

        // Fetch sessions for this course
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            id,
            title,
            description,
            status,
            session_date,
            created_at,
            study_materials(count)
          `)
          .eq('course_id', courseId)
          .order('session_date', { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch study materials for all sessions
        const { data: materialsData, error: materialsError } = await supabase
          .from('study_materials')
          .select('*')
          .in('session_id', (sessionsData || []).map(s => s.id));

        if (materialsError) throw materialsError;

        setCourse(courseData);
        setSessions(sessionsData || []);
        setStudyMaterials(materialsData || []);

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <button
            onClick={() => router.push('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Student Dashboard
          </button>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Course</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <button
            onClick={() => router.push('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Student Dashboard
          </button>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Course Not Found</h3>
            <p className="text-yellow-300">The requested course could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => router.push('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Student Dashboard
          </button>

          <Section 
            title={course.title}
            description={`${course.description} • Academic Year ${course.academic_year || '2025-2026'}`}
          >
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => router.push(`/student/chat/${sessions[0]?.id || 'default'}`)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
              >
                <MessageSquare size={20} className="mr-2" />
                Ask AI Assistant
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-4">No Sessions Available</h3>
                <p className="text-gray-400 mb-6">This course doesn't have any sessions yet.</p>
                <p className="text-sm text-gray-500">Check back later for new content.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const sessionMaterials = studyMaterials.filter(m => m.session_id === session.id);
                  const materialsCount = session.study_materials?.[0]?.count || sessionMaterials.length;
                  
                  return (
                    <div key={session.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {session.title}
                          </h4>
                          {session.description && (
                            <p className="text-gray-400 text-sm mb-2">{session.description}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={16} className="mr-2" />
                            <span>
                              {session.session_date 
                                ? new Date(session.session_date).toLocaleDateString()
                                : new Date(session.created_at).toLocaleDateString()
                              }
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${
                          session.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          session.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {session.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{materialsCount} study materials available</span>
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => router.push(`/student/sessions/${session.id}/overview`)}
                            className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg font-medium hover:bg-violet-500/20 transition-colors"
                          >
                            Study Materials
                          </button>
                          <button 
                            onClick={() => router.push(`/student/chat/${session.id}`)}
                            className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg font-medium hover:bg-teal-500/20 transition-colors flex items-center"
                          >
                            <MessageSquare size={16} className="mr-2" />
                            Ask About This
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}