import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, BookOpen, FileText, Play, Clock, CheckCircle } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import StatCard from '../components/StatCard';
import { formatDate } from '../../lib/format';

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
  session_date: string;
  status: string;
  created_at: string;
}

export default function TutorHomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    video_source_url: '',
    date: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchRecentSessions();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?tutorId=u_tutor_rahul');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setRecentSessions(data.slice(0, 5)); // Get latest 5 sessions
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courses[0]?.course_id,
          ...sessionForm
        })
      });
      
      if (response.ok) {
        setShowAddSession(false);
        setSessionForm({ title: '', video_source_url: '', date: '' });
        fetchRecentSessions();
      }
    } catch (error) {
      console.error('Failed to add session:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PortalHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <Section 
            title="Tutor Dashboard" 
            description="Manage your courses, sessions, and student progress"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Students"
                value={24}
                icon={<Users size={24} />}
                trend={{ value: 3, label: 'new this week' }}
              />
              <StatCard
                title="Active Courses"
                value={courses.filter(c => c.is_active).length}
                icon={<BookOpen size={24} />}
              />
              <StatCard
                title="Sessions Created"
                value={recentSessions.length}
                icon={<Play size={24} />}
              />
              <StatCard
                title="Materials Generated"
                value={12}
                icon={<FileText size={24} />}
                trend={{ value: 4, label: 'pending review' }}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                <Plus size={20} className="mr-2" />
                Create Course
              </button>
              <button 
                onClick={() => setShowAddSession(true)}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Session
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Courses */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Your Courses</h3>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div 
                      key={course.course_id} 
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/tutor/course/${course.course_id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {course.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3">
                            {course.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{course.academic_year}</span>
                            <span className="mx-2">•</span>
                            <span>{course.subject_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">24</div>
                          <div className="text-xs text-gray-400">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">3</div>
                          <div className="text-xs text-gray-400">Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">8</div>
                          <div className="text-xs text-gray-400">Materials</div>
                        </div>
                      </div>

                      <button className="w-full bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg font-medium hover:bg-violet-500/20 transition-colors">
                        Manage Course
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Sessions</h3>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div 
                        key={session.session_id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors cursor-pointer"
                        onClick={() => navigate(`/tutor/session/${session.session_id}`)}
                      >
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-white mb-1">
                            {session.title}
                          </h5>
                          <p className="text-xs text-gray-400">
                            {formatDate(session.session_date)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Session</h3>
            
            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Source URL
                </label>
                <input
                  type="url"
                  value={sessionForm.video_source_url}
                  onChange={(e) => setSessionForm({...sessionForm, video_source_url: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Date
                </label>
                <input
                  type="datetime-local"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSession(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}