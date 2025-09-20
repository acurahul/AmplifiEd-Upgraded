import React from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function TutorSessionPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const materials = [
    {
      id: 'mat-001-summary',
      type: 'summary',
      title: 'Chemical Reactions Summary',
      status: 'published',
      content: '• Chemical reactions involve the formation of new substances\n• Four main types: combination, decomposition, displacement, double displacement\n• Combination reactions: A + B → AB\n• Decomposition reactions: AB → A + B'
    },
    {
      id: 'mat-001-flashcards',
      type: 'flashcards',
      title: 'Chemical Reactions Flashcards',
      status: 'pending_review',
      content: 'Q: What is a chemical reaction?\nA: A process where substances interact to form new compounds with different properties.\n\nQ: Name the four types of chemical reactions.\nA: Combination, decomposition, displacement, and double displacement.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending_review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate('/tutor/courses/co-chem-10-2025')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Course
          </button>

          <Section 
            title="Chemical Reactions – Part 1" 
            description="Session created on July 1, 2025"
          >
            <div className="space-y-6">
              {materials.map((material) => (
                <div key={material.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-violet-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{material.title}</h4>
                        <p className="text-sm text-gray-400 capitalize">{material.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(material.status)}`}>
                        {material.status.replace('_', ' ')}
                      </span>
                      {material.status === 'pending_review' && (
                        <div className="flex space-x-2">
                          <button className="text-green-400 hover:text-green-300 p-1" title="Approve">
                            <CheckCircle size={20} />
                          </button>
                          <button className="text-red-400 hover:text-red-300 p-1" title="Reject">
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                      {material.content}
                    </pre>
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