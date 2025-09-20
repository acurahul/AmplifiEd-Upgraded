import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, FileText, MessageSquare, Download, Clock } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import { formatDate, formatDateTime } from '../../lib/format';

interface Course {
  course_id: string;
  title: string;
  description: string;
  academic_year: string;
  subject_id: string;
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

interface StudyMaterial {
  material_id: string;
  session_id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

export default function StudentCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'materials'>('sessions');

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchSessions();
      fetchMaterials();
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
      setSessions(data.filter((s: Session) => s.status === 'published'));
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      // Fetch materials for all sessions in this course
      const allMaterials: StudyMaterial[] = [];
      for (const session of sessions) {
        const response = await fetch(`/api/sessions/${session.session_id}/materials`);
        const sessionMaterials = await response.json();
        allMaterials.push(...sessionMaterials.filter((m: StudyMaterial) => m.status === 'published'));
      }
      setMaterials(allMaterials);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'summary': return <FileText size={20} />;
      case 'flashcards': return <MessageSquare size={20} />;
      case 'quiz': return <Play size={20} />;
      default: return <FileText size={20} />;
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
            onClick={() => navigate('/student/home')}
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
        <RoleGate allowedRoles={['student']}>
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title={course.title}
            description={`${course.description} • ${course.academic_year}`}
          >
            {/* Course Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate(`/student/chat/${courseId}`)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
              >
                <MessageSquare size={20} className="mr-2" />
                Ask AI Assistant
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sessions'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Sessions ({sessions.length})
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'materials'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Study Materials ({materials.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.session_id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {session.title}
                        </h4>
                        {session.description && (
                          <p className="text-gray-400 text-sm mb-3">
                            {session.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={16} className="mr-2" />
                          <span>{formatDateTime(session.session_date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>3 study materials available</span>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => navigate(`/student/chat/${session.session_id}`)}
                          className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg font-medium hover:bg-teal-500/20 transition-colors flex items-center"
                        >
                          <MessageSquare size={16} className="mr-2" />
                          Ask About This
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {sessions.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                    <Play className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-white mb-2">No Sessions Available</h4>
                    <p className="text-gray-400">Your tutor hasn't published any sessions yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-6">
                {materials.map((material) => (
                  <div key={material.material_id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-violet-400">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{material.title}</h4>
                          <p className="text-sm text-gray-400 capitalize">{material.type}</p>
                        </div>
                      </div>
                      <button className="text-violet-400 hover:text-violet-300 text-sm flex items-center">
                        <Download size={16} className="mr-1" />
                        Download
                      </button>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {material.content}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-gray-400">
                        Created on {formatDate(material.created_at)}
                      </p>
                      <button 
                        onClick={() => navigate(`/student/chat/${material.session_id}`)}
                        className="text-teal-400 hover:text-teal-300 text-sm flex items-center"
                      >
                        <MessageSquare size={16} className="mr-1" />
                        Ask Questions
                      </button>
                    </div>
                  </div>
                ))}

                {materials.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-white mb-2">No Study Materials</h4>
                    <p className="text-gray-400">Study materials will appear here as they're published</p>
                  </div>
                )}
              </div>
            )}
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}