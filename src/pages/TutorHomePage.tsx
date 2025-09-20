import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function TutorHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate('/portal')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Portal
          </button>

          <Section 
            title="Tutor Dashboard" 
            description="Manage your courses and students"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Tutor Dashboard</h3>
              <p className="text-gray-400">Tutor features will be implemented here</p>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}