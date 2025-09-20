import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

import { Target } from 'lucide-react';

export default function StudentHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => navigate('/portal')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Role Selection
          </button>

          <Section 
            title="Student Dashboard" 
            description="Access your courses and track progress"
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate('/student/performance')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
              >
                <Target size={20} className="mr-2" />
                View Performance
              </button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Class 10 Chemistry (Full Year)</h3>
              <p className="text-gray-400 mb-6">CBSE Grade 10 Chemistry • Academic Year 2025-2026</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-400">Materials</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">78%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => navigate('/student/courses/co-chem-10-2025')}
                  className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-6 py-3 rounded-lg font-medium hover:bg-teal-500/20 transition-colors"
                >
                  Open Course
                </button>
                <button 
                  onClick={() => navigate('/student/sessions/ses-chem-001/overview')}
                  className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-6 py-3 rounded-lg font-medium hover:bg-violet-500/20 transition-colors"
                >
                  Latest Session
                </button>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}