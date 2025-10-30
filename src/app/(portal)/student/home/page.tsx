// src/app/(portal)/student/home/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, BookOpen, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <-- Use Next.js router
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';

export default function StudentHomePage() {
  const router = useRouter(); // <-- Use Next.js router
  const { user } = useAuth();
  
  // Database state
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student data from database
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch enrolled courses
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            courses!inner(
              course_id,
              title,
              description,
              academic_year
            )
          `)
          .eq('student_id', user.id)
          .is('left_on', null); // Only active enrollments

        if (enrollmentsError) throw enrollmentsError;

        const courses = enrollmentsData?.map(e => e.courses) || [];
        setEnrolledCourses(courses);

        if (courses.length > 0) {
          // Fetch sessions for the first course (or we could show all)
          const firstCourse = courses[0];
          
          // Fetch sessions
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .eq('course_id', firstCourse.course_id)
            .order('session_date', { ascending: false });

          if (sessionsError) throw sessionsError;
          setSessions(sessionsData || []);

          // Fetch study materials count
          const { data: materialsData, error: materialsError } = await supabase
            .from('study_materials')
            .select('*')
            .in('session_id', (sessionsData || []).map(s => s.id));

          if (materialsError) throw materialsError;
          setStudyMaterials(materialsData || []);
        }

      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudentData();
    }
  }, [user]);

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
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-red-300">{error}</p>
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
            onClick={() => router.push('/portal')} // <-- Use router.push
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Role Selection
          </button>

          <Section 
            title="Student Dashboard" 
            description="Access your courses and track progress"
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => router.push('/student/performance')} // <-- Use router.push
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
              >
                <Target size={20} className="mr-2" />
                View Performance
              </button>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-4">No Courses Enrolled</h3>
                <p className="text-gray-400 mb-6">You haven't been enrolled in any courses yet.</p>
                <p className="text-sm text-gray-500">Contact your tutor to get enrolled in a course.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {enrolledCourses.map((course) => {
                  const courseSessions = sessions.filter(s => s.course_id === course.course_id);
                  const courseMaterials = studyMaterials.filter(m => 
                    courseSessions.some(s => s.id === m.session_id)
                  );
                  
                  return (
                    <div key={course.course_id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-white mb-4">{course.title}</h3>
                        <p className="text-gray-400 mb-6">{course.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{courseSessions.length}</div>
                            <div className="text-sm text-gray-400">Sessions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{courseMaterials.length}</div>
                            <div className="text-sm text-gray-400">Materials</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              {courseSessions.length > 0 ? Math.round((courseMaterials.length / (courseSessions.length * 3)) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-400">Progress</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                          <button 
                            onClick={() => router.push(`/student/courses/${course.course_id}`)}
                            className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-6 py-3 rounded-lg font-medium hover:bg-teal-500/20 transition-colors"
                          >
                            Open Course
                          </button>
                          {courseSessions.length > 0 && (
                            <button 
                              onClick={() => router.push(`/student/sessions/${courseSessions[0].id}/overview`)}
                              className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-6 py-3 rounded-lg font-medium hover:bg-violet-500/20 transition-colors"
                            >
                              Latest Session
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {courseSessions.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Calendar size={20} className="mr-2" />
                            Recent Sessions
                          </h4>
                          <div className="space-y-3">
                            {courseSessions.slice(0, 3).map((session) => (
                              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <div>
                                  <h5 className="text-sm font-medium text-white">{session.title}</h5>
                                  <p className="text-xs text-gray-400">
                                    {session.session_date 
                                      ? new Date(session.session_date).toLocaleDateString()
                                      : new Date(session.created_at).toLocaleDateString()
                                    }
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full border text-xs font-medium ${
                                  session.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  session.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                  {session.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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