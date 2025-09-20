import React from 'react';
import { ArrowLeft, TrendingDown, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import StatCard from '../components/StatCard';

export default function TutorPerformancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Tutor Dashboard
          </button>

          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Tutor Dashboard
          </button>
          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title="Student Performance" 
            description="Track student progress and identify areas for improvement"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Avg Quiz Score"
                value="78%"
                icon={<Target size={24} />}
              />
              <StatCard
                title="Active Students"
                value="24"
                icon={<Users size={24} />}
              />
              <StatCard
                title="Struggling Topics"
                value="3"
                icon={<TrendingDown size={24} />}
              />
              <StatCard
                title="Completion Rate"
                value="85%"
                icon={<Target size={24} />}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Struggling Topics</h3>
                <div className="space-y-4">
                  {[
                    { topic: 'Chemical Equations', score: 45, students: 12 },
                    { topic: 'pH Calculations', score: 52, students: 8 },
                    { topic: 'Redox Reactions', score: 58, students: 15 }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{item.topic}</h4>
                        <span className="text-red-400 font-semibold">{item.score}%</span>
                      </div>
                      <p className="text-gray-400 text-sm">{item.students} students struggling</p>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Student Progress</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { name: 'Aarav Patel', score: 85, attempts: 12 },
                    { name: 'Vivaan Singh', score: 72, attempts: 10 },
                    { name: 'Aditya Kumar', score: 91, attempts: 15 },
                    { name: 'Vihaan Gupta', score: 68, attempts: 8 },
                    { name: 'Arjun Sharma', score: 79, attempts: 11 }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                      <div>
                        <h5 className="text-sm font-medium text-white">{student.name}</h5>
                        <p className="text-xs text-gray-400">{student.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          student.score >= 80 ? 'text-green-400' : 
                          student.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {student.score}%
                        </div>
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