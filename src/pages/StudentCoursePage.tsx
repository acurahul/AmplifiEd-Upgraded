import React from 'react';
import { ArrowLeft, Play, MessageSquare, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function StudentCoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const sessions = [
    { id: 'ses-chem-001', title: 'Chemical Reactions – Part 1', date: '2025-07-01T10:00:00Z', status: 'published' },
    { id: 'ses-chem-002', title: 'Acids, Bases and Salts – Part 1', date: '2025-07-08T10:00:00Z', status: 'published' },
    { id: 'ses-chem-003', title: 'Metals and Non-metals – Part 1', date: '2025-07-15T10:00:00Z', status: 'published' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Student Dashboard
          </button>

          <button
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Student Dashboard
          </button>

          <Section 
            title="Class 10 Chemistry (Full Year)" 
            description="CBSE Grade 10 Chemistry • Academic Year 2025-2026"
          >
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate(`/student/chat/ses-chem-001`)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
              >
                <MessageSquare size={20} className="mr-2" />
                Ask AI Assistant
              </button>
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {session.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-2" />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>3 study materials available</span>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => navigate(`/student/sessions/${session.id}/overview`)}
                        className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg font-medium hover:bg-violet-500/20 transition-colors"
                      >
                        Study Materials
                      </button>
                      <button 
                        onClick={() => navigate(`/student/chat/${session.id}`)}
                        className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg font-medium hover:bg-teal-500/20 transition-colors flex items-center"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Ask About This
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}