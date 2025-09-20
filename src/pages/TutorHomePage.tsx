import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

import { Plus, Users, FileText } from 'lucide-react';

export default function TutorHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate('/portal')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Role Selection
          </button>
          <button
            onClick={() => navigate('/portal')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Role Selection
          </button>

          <Section 
            title="Tutor Dashboard" 
            description="Manage your courses and students"
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                <Plus size={20} className="mr-2" />
                Create Course
              </button>
              <button 
                onClick={() => navigate('/tutor/question-bank')}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <FileText size={20} className="mr-2" />
                Question Bank
              </button>
              <button 
                onClick={() => navigate('/tutor/quiz-builder')}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Quiz Builder
              </button>
              <button 
                onClick={() => navigate('/tutor/performance')}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Users size={20} className="mr-2" />
                Performance
              </button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Class 10 Chemistry (Full Year)</h3>
              <p className="text-gray-400 mb-6">CBSE Grade 10 Chemistry with weekly live classes and study materials</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-sm text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-400">Materials</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/tutor/courses/co-chem-10-2025')}
                className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-6 py-3 rounded-lg font-medium hover:bg-violet-500/20 transition-colors"
              >
                Open Course
              </button>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}