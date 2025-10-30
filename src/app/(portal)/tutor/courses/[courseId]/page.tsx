// src/app/(portal)/tutor/courses/[courseId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Play, FileText, Calendar, Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation'; // <-- Use Next.js hooks
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import EnrollmentManager from '@/components/EnrollmentManager';
import SessionCreationModal from '@/components/SessionCreationModal';

export default function TutorCoursePage() {
  const router = useRouter(); // <-- Use Next.js router
  const params = useParams(); // <-- Use Next.js params
  const { user } = useAuth();
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  
  // Database state
  const [course, setCourse] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!params) {
    return <div>Loading...</div>;
  }
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  // Fetch course data from database
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user || !courseId) {
        console.log('Missing user or courseId:', { user: !!user, courseId });
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching course data for:', { courseId, userId: user.id });

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
            status,
            session_date,
            created_at
          `)
          .eq('course_id', courseId)
          .order('session_date', { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch study materials count for each session separately
        let sessionsWithMaterials = [];
        if (sessionsData && sessionsData.length > 0) {
          for (const session of sessionsData) {
            const { count: materialsCount } = await supabase
              .from('study_materials')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id);
            
            sessionsWithMaterials.push({
              ...session,
              materialsCount: materialsCount || 0
            });
          }
        }

        // Fetch enrolled students
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            profiles!inner(
              user_id,
              full_name,
              email
            )
          `)
          .eq('course_id', courseId)
          .is('left_on', null); // Only active enrollments

        if (enrollmentsError) throw enrollmentsError;

        setCourse(courseData);
        setSessions(sessionsWithMaterials || []);
        setEnrolledStudents(enrollmentsData?.map(e => e.profiles) || []);

      } catch (err) {
        console.error('Error fetching course data:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          courseId,
          user: user?.id
        });
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  const handleSessionSuccess = () => {
    setShowAddSession(false);
    // Refresh sessions data
    const fetchSessions = async () => {
      try {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            id,
            title,
            status,
            session_date,
            created_at
          `)
          .eq('course_id', courseId)
          .order('session_date', { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch study materials count for each session
        let sessionsWithMaterials = [];
        if (sessionsData && sessionsData.length > 0) {
          for (const session of sessionsData) {
            const { count: materialsCount } = await supabase
              .from('study_materials')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id);
            
            sessionsWithMaterials.push({
              ...session,
              materialsCount: materialsCount || 0
            });
          }
        }
        
        setSessions(sessionsWithMaterials || []);
      } catch (err) {
        console.error('Error refreshing sessions:', err);
      }
    };
    fetchSessions();
    console.log('Session created successfully!');
  };

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
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Course</h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
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
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => router.push('/tutor/home')} // <-- Use router.push
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Tutor Dashboard
          </button>

          <Section 
            title={course.title} 
            description={course.description}
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setShowEnrollmentForm(true)}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center"
              >
                <Users size={20} className="mr-2" />
                Manage Students
              </button>
              
              <button
                onClick={() => setShowAddSession(true)}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add New Session
              </button>
            </div>

            {/* Enrollment Manager */}
            {showEnrollmentForm && (
              <div className="mb-8">
                <EnrollmentManager
                  courseId={courseId}
                  courseTitle={course.title}
                  tutorName={course.tutor_name || "Tutor"}
                  onEnrollmentSuccess={() => {
                    setShowEnrollmentForm(false);
                    // Refresh enrolled students data
                    const fetchEnrolledStudents = async () => {
                      try {
                        const { data: enrollmentsData, error: enrollmentsError } = await supabase
                          .from('enrollments')
                          .select(`
                            profiles!inner(
                              user_id,
                              full_name,
                              email
                            )
                          `)
                          .eq('course_id', courseId)
                          .is('left_on', null);
                        if (!enrollmentsError) {
                          setEnrolledStudents(enrollmentsData?.map(e => e.profiles) || []);
                        }
                      } catch (err) {
                        console.error('Error refreshing enrolled students:', err);
                      }
                    };
                    fetchEnrolledStudents();
                  }}
                  onCancel={() => setShowEnrollmentForm(false)}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Course Sessions</h3>
                <div className="space-y-4">
                  {sessions.length === 0 ? (
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                      <Calendar size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                      <h4 className="text-lg font-medium text-gray-300 mb-2">No Sessions Yet</h4>
                      <p className="text-gray-400 mb-4">Create your first session to get started with this course.</p>
                      <button
                        onClick={() => setShowAddSession(true)}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Create First Session
                      </button>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <div 
                        key={session.id}
                        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
                        onClick={() => router.push(`/tutor/sessions/${session.id}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-2">
                              {session.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={16} className="mr-2" />
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
                            <span>
                              {session.materialsCount || 0} materials generated
                            </span>
                            <span>•</span>
                            <span>{enrolledStudents.length} students enrolled</span>
                          </div>
                          <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                            Manage →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Enrolled Students ({enrolledStudents.length})</h3>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  {enrolledStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                      <h4 className="text-lg font-medium text-gray-300 mb-2">No Students Enrolled</h4>
                      <p className="text-gray-400 mb-4">Enroll students to get started with this course.</p>
                      <button
                        onClick={() => setShowEnrollmentForm(true)}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Enroll Students
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enrolledStudents.map((student) => (
                        <div key={student.user_id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div>
                            <h5 className="text-sm font-medium text-white">{student.full_name}</h5>
                            <p className="text-xs text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>

      <SessionCreationModal
        isOpen={showAddSession}
        onClose={() => setShowAddSession(false)}
        onSuccess={handleSessionSuccess}
        courses={course ? [{ course_id: courseId, title: course.title, description: course.description }] : []}
        preselectedCourseId={courseId}
      />
    </div>
  );
}