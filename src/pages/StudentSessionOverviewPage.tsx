import React from 'react';
import { ArrowLeft, FileText, MessageSquare, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function StudentSessionOverviewPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => navigate('/student/courses/co-chem-10-2025')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Course
          </button>
          <button
            onClick={() => navigate('/student/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title="Chemical Reactions - Part 1" 
            description="Session overview and study materials"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FileText className="mr-2" size={20} />
                    Session Summary
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>• Chemical reactions involve the formation of new substances</p>
                    <p>• Four main types: combination, decomposition, displacement, double displacement</p>
                    <p>• Combination reactions: A + B → AB</p>
                    <p>• Decomposition reactions: AB → A + B</p>
                    <p>• Energy changes occur during reactions</p>
                    <p>• Catalysts can speed up reactions</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigate(`/student/chat/${sessionId}`)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <MessageSquare size={20} className="mr-2" />
                    Ask AI Assistant
                  </button>
                  <button 
                    onClick={() => navigate(`/student/sessions/${sessionId}/quiz`)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center justify-center"
                  >
                    <Play size={20} className="mr-2" />
                    Take Quiz
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Flashcards</h3>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-center">
                      <p className="text-white font-medium mb-4">What is a chemical reaction?</p>
                      <button className="text-violet-400 hover:text-violet-300 text-sm">Show Answer</button>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-center">
                      <p className="text-white font-medium mb-4">Name the four types of chemical reactions</p>
                      <button className="text-violet-400 hover:text-violet-300 text-sm">Show Answer</button>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="text-center">
                      <p className="text-white font-medium mb-4">What is a combination reaction?</p>
                      <button className="text-violet-400 hover:text-violet-300 text-sm">Show Answer</button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button className="text-gray-400 hover:text-white">← Previous</button>
                  <span className="text-gray-400">3 of 8</span>
                  <button className="text-gray-400 hover:text-white">Next →</button>
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}