import React from 'react';
import { ArrowLeft, TrendingUp, Target, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import StatCard from '../components/StatCard';

export default function StudentPerformancePage() {
  const navigate = useNavigate();

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

          <Section 
            title="My Performance" 
            description="Track your learning progress and achievements"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Overall Score"
                value="78%"
                icon={<Target size={24} />}
              />
              <StatCard
                title="Quizzes Taken"
                value="12"
                icon={<Award size={24} />}
              />
              <StatCard
                title="Study Streak"
                value="7 days"
                icon={<TrendingUp size={24} />}
              />
              <StatCard
                title="Time Studied"
                value="24h"
                icon={<Clock size={24} />}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Topic Mastery</h3>
                <div className="space-y-4">
                  {[
                    { topic: 'Chemical Reactions', mastery: 85, attempts: 4, correct: 4 },
                    { topic: 'Acids & Bases', mastery: 60, attempts: 8, correct: 3 },
                    { topic: 'Metals & Non-metals', mastery: 75, attempts: 5, correct: 4 },
                    { topic: 'Carbon Compounds', mastery: 45, attempts: 3, correct: 2 }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{item.topic}</h4>
                        <span className={`font-semibold ${
                          item.mastery >= 80 ? 'text-green-400' : 
                          item.mastery >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {item.mastery}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {item.correct}/{item.attempts} correct attempts
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.mastery >= 80 ? 'bg-green-500' : 
                            item.mastery >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.mastery}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { activity: 'Completed Quiz: Chemical Reactions', score: '8/10', time: '2 hours ago' },
                    { activity: 'Studied: Acids & Bases Summary', score: null, time: '1 day ago' },
                    { activity: 'Completed Quiz: Metals & Non-metals', score: '7/10', time: '2 days ago' },
                    { activity: 'Asked AI: pH calculations', score: null, time: '3 days ago' },
                    { activity: 'Completed Quiz: Carbon Compounds', score: '6/10', time: '5 days ago' }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{item.activity}</p>
                          <p className="text-gray-400 text-xs mt-1">{item.time}</p>
                        </div>
                        {item.score && (
                          <span className="text-violet-400 font-semibold text-sm">{item.score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}