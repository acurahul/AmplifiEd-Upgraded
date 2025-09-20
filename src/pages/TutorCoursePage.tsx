import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Play, FileText, Plus, Calendar, Clock } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import StatCard from '../components/StatCard';
import { formatDate, formatDateTime } from '../../lib/format';

interface Course {
  course_id: string;
  title: string;
  description: string;
  academic_year: string;
  subject_id: string;
  is_active: boolean;
  created_at: string;
}

interface Session {
  session_id: string;
  course_id: string;
  title: string;
  description?: string;
  session_date: string;
  status: string;
  created_at: string;
}

interface Enrollment {
  enrollment_id: string;
  student_id: string;
  enrolled_on: string;
  status: string;
  student: {
    user_id: string;
    full_name: string;
    email: string;
  };
}

export default function TutorCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchSessions();
      fetchEnrollments();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/sessions?courseId=${courseId}`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`/api/enrollments?courseId=${courseId}`);
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PortalHeader />
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PortalHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <button
            onClick={() => navigate('/tutor/home')}
            className="text-violet-400 hover:text-violet-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PortalHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title={course.title}
            description={`${course.description} • ${course.academic_year}`}
          >
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Enrolled Students"
                value={enrollments.length}
                icon={<Users size={24} />}
              />
              <StatCard
                title="Total Sessions"
                value={sessions.length}
                icon={<Play size={24} />}
              />
              <StatCard
                title="Published Sessions"
                value={sessions.filter(s => s.status === 'published').length}
                icon={<FileText size={24} />}
              />
              <StatCard
                title="Draft Sessions"
                value={sessions.filter(s => s.status === 'draft').length}
                icon={<Clock size={24} />}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sessions */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Course Sessions</h3>
                  <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center text-sm">
                    <Plus size={16} className="mr-2" />
                    Add Session
                  </button>
                </div>

                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div 
                      key={session.session_id}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/tutor/session/${session.session_id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">
                              {session.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          {session.description && (
                            <p className="text-gray-400 text-sm mb-3">
                              {session.description}
                            </p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>{formatDateTime(session.session_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>3 materials generated</span>
                          <span>•</span>
                          <span>24 students enrolled</span>
                        </div>
                        <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                          Manage →
                        </button>
                      </div>
                    </div>
                  ))}

                  {sessions.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                      <Play className="mx-auto text-gray-400 mb-4" size={48} />
                      <h4 className="text-lg font-semibold text-white mb-2">No Sessions Yet</h4>
                      <p className="text-gray-400 mb-6">Create your first session to get started</p>
                      <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300">
                        Create Session
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Enrolled Students */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Enrolled Students</h3>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.enrollment_id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                        <div>
                          <h5 className="text-sm font-medium text-white">
                            {enrollment.student.full_name}
                          </h5>
                          <p className="text-xs text-gray-400">
                            {enrollment.student.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Enrolled {formatDate(enrollment.enrolled_on)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}