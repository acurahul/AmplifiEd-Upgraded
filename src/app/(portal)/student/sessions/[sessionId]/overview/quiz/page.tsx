// src/app/(portal)/student/sessions/[sessionId]/quiz/page.tsx

'use client';

import React from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';

export default function StudentSessionQuizPage() {
  const router = useRouter();
  const params = useParams();

  if (!params) {
    return <div>Loading...</div>;
  }
  const sessionId = params.sessionId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['student']}>
          <button
            onClick={() => router.push(`/student/sessions/${sessionId}/overview`)}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Session Overview
          </button>
          
          {/* Mock Quiz Content Here */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Chemical Reactions Quiz</h1>
                <p className="text-gray-400">10 Questions</p>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Clock size={20} />
                <span className="font-semibold">14:52</span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  1. Which of the following is an example of a combination reaction?
                </p>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors">A) H2O → H2 + O2</button>
                  <button className="w-full text-left p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors">B) C + O2 → CO2</button>
                  <button className="w-full text-left p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors">C) Zn + CuSO4 → ZnSO4 + Cu</button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
                <button className="px-6 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors">
                  Previous
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300">
                  Next Question
                </button>
              </div>
            </div>
          </div>
        </RoleGate>
      </main>
    </div>
  );
}