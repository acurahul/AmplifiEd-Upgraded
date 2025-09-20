import React from 'react';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function TutorQuestionBankPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title="Question Bank" 
            description="Manage your question collections"
          >
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                <Plus size={20} className="mr-2" />
                Add Question
              </button>
              <button className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center">
                <Plus size={20} className="mr-2" />
                Import CSV
              </button>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                      <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500">
                        <option>All Topics</option>
                        <option>Chemical Reactions</option>
                        <option>Acids & Bases</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                      <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500">
                        <option>All Levels</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Questions (24)</h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search questions..."
                          className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-white font-medium mb-2">
                              What is the pH of a neutral solution at 25°C?
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>MCQ</span>
                              <span>•</span>
                              <span>Easy</span>
                              <span>•</span>
                              <span>Acids & Bases</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-violet-400 hover:text-violet-300 text-sm">Edit</button>
                            <button className="text-gray-400 hover:text-gray-300 text-sm">Duplicate</button>
                            <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-400">A) 0</div>
                          <div className="text-gray-400">B) 14</div>
                          <div className="text-green-400">C) 7 ✓</div>
                          <div className="text-gray-400">D) 1</div>
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