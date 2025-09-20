import React from 'react';
import { ArrowLeft, Plus, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function TutorQuizBuilderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back
          </button>

          <Section 
            title="Quiz Builder" 
            description="Create custom quizzes from your question bank"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Configuration */}
              <div className="space-y-6">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quiz Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title</label>
                      <input
                        type="text"
                        placeholder="Enter quiz title..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Topic Selection</h3>
                  <div className="space-y-3">
                    {['Chemical Reactions', 'Acids & Bases', 'Metals & Non-metals', 'Carbon Compounds'].map((topic) => (
                      <label key={topic} className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded" />
                        <span className="text-gray-300">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Difficulty Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Easy</span>
                      <input type="range" defaultValue="40" className="w-24" />
                      <span className="text-gray-400">40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Medium</span>
                      <input type="range" defaultValue="40" className="w-24" />
                      <span className="text-gray-400">40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Hard</span>
                      <input type="range" defaultValue="20" className="w-24" />
                      <span className="text-gray-400">20%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Quiz Preview</h3>
                  <div className="flex space-x-3">
                    <button className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center">
                      <Eye size={16} className="mr-2" />
                      Preview
                    </button>
                    <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Quiz
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center py-12 text-gray-400">
                    <Plus size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Configure your quiz settings to see a preview</p>
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