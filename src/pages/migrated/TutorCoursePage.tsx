import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, BookOpen, FileText, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import RoleGate from '../../components/RoleGate';
import Section from '../../components/Section';
import EnrollmentManager from '../../components/EnrollmentManager';
import SessionCreationModal from '../../components/SessionCreationModal';
import { supabase } from '../../lib/supabase';

interface Course {
  course_id: string;
  title: string;
  description: string;
  tutor_id: string;
  academic_year: string;
  is_active: boolean;
}

interface CourseForModal {
  course_id: string;
  title: string;
  description: string;
}

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_on: string;
  left_on: string | null;
  student?: {
    full_name: string;
    email: string;
  };
}

interface Session {
  id: string;
  course_id: string;
  title: string;
  session_date: string;
  status: string;
}

export default function TutorCoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [allCourses, setAllCourses] = useState<CourseForModal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Load all courses for the modal (assuming same tutor)
      const { data: allCoursesData, error: allCoursesError } = await supabase
        .from('courses')
        .select('course_id, title, description')
        .eq('tutor_id', courseData.tutor_id);

      if (allCoursesError) throw allCoursesError;
      setAllCourses(allCoursesData || []);

      // Load enrollments with student details
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_student_id_fkey(full_name, email)
        `)
        .eq('course_id', courseId);

      if (enrollmentsError) throw enrollmentsError;
      setEnrollments(enrollmentsData || []);

      // Load sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('course_id', courseId)
        .order('session_date', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentSuccess = () => {
    setShowEnrollmentForm(false);
    loadCourseData(); // Refresh the data
  };

  const handleSessionSuccess = () => {
    setShowAddSession(false);
    loadCourseData(); // Refresh the data to show new session
  };

  const createNewSession = () => {
    setShowAddSession(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="text-center py-24">
            <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
            <button
              onClick={() => navigate('/tutor/home')}
              className="text-violet-400 hover:text-violet-300"
            >
              Back to Dashboard
            </button>
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
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title={course.title}
            description={course.description}
          >
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 text-center">
                <Users className="text-violet-400 mx-auto mb-3" size={32} />
                <div className="text-2xl font-bold text-white">{enrollments.length}</div>
                <div className="text-sm text-gray-400">Students Enrolled</div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 text-center">
                <BookOpen className="text-teal-400 mx-auto mb-3" size={32} />
                <div className="text-2xl font-bold text-white">{sessions.length}</div>
                <div className="text-sm text-gray-400">Sessions</div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 text-center">
                <Target className="text-green-400 mx-auto mb-3" size={32} />
                <div className="text-2xl font-bold text-white">
                  {Math.round((sessions.filter(s => s.status === 'published').length / Math.max(sessions.length, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Published</div>
              </div>
            </div>

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
                onClick={createNewSession}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                New Session
              </button>
            </div>

            {/* Enrollment Manager */}
            {showEnrollmentForm && (
              <div className="mb-8">
                <EnrollmentManager
                  courseId={courseId!}
                  onEnrollmentSuccess={handleEnrollmentSuccess}
                  onCancel={() => setShowEnrollmentForm(false)}
                />
              </div>
            )}

            {/* Students List */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Enrolled Students ({enrollments.length})
              </h3>
              
              {enrollments.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                  <Users className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-400 mb-4">No students enrolled yet</p>
                  <button
                    onClick={() => setShowEnrollmentForm(true)}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Enroll your first students
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Enrolled
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                {enrollment.student?.full_name || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">
                                {enrollment.student?.email || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">
                                {enrollment.enrolled_on}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                !enrollment.left_on
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {!enrollment.left_on ? 'Active' : 'Left'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Sessions List */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="mr-2" size={20} />
                Sessions ({sessions.length})
              </h3>
              
              {sessions.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                  <BookOpen className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-400 mb-4">No sessions created yet</p>
                  <button
                    onClick={createNewSession}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Create your first session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(session.session_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'published'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : session.status === 'approved'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {session.status}
                          </span>
                          <button
                            onClick={() => navigate(`/tutor/sessions/${session.id}`)}
                            className="text-violet-400 hover:text-violet-300 font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </RoleGate>
      </main>

      <SessionCreationModal
        isOpen={showAddSession}
        onClose={() => setShowAddSession(false)}
        onSuccess={handleSessionSuccess}
        courses={allCourses}
        preselectedCourseId={courseId}
      />
    </div>
  );
}