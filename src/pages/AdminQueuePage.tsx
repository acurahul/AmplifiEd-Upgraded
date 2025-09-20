import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function AdminQueuePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['admin']}>
          <button
            onClick={() => navigate('/portal')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Portal
          </button>

          <Section 
            title="Admin Dashboard" 
            description="System administration and monitoring"
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate('/admin/rag')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center"
              >
                <Database size={20} className="mr-2" />
                RAG Health
              </button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Processing Queue Status</h3>
              <p className="text-gray-400 mb-6">Monitor background job processing and system health</p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2</div>
                  <div className="text-sm text-gray-400">Running</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">3</div>
                  <div className="text-sm text-gray-400">Queued</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">1</div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm">All systems operational • Last updated: 2 minutes ago</p>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}