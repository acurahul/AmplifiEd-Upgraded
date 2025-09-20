'use client';

import { useRouter } from 'next/navigation';
import { Shield, GraduationCap, BookOpen } from 'lucide-react';
import { setSessionRole, type SessionRole } from '@/lib/role';
import Header from '@/components/Header';

export default function PortalPage() {
  const router = useRouter();

  const handleRoleSelect = (role: SessionRole) => {
    setSessionRole(role);
    
    switch (role) {
      case 'admin':
        router.push('/admin/queue');
        break;
      case 'tutor':
        router.push('/tutor/home');
        break;
      case 'student':
        router.push('/student/home');
        break;
    }
  };

  const roles = [
    {
      id: 'admin' as SessionRole,
      title: 'Admin',
      description: 'Manage system operations, monitor jobs, and oversee platform health',
      icon: Shield,
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-600 to-red-700'
    },
    {
      id: 'tutor' as SessionRole,
      title: 'Tutor',
      description: 'Create courses, manage sessions, review materials, and track student progress',
      icon: GraduationCap,
      gradient: 'from-violet-500 to-purple-600',
      hoverGradient: 'from-violet-600 to-purple-700'
    },
    {
      id: 'student' as SessionRole,
      title: 'Student',
      description: 'Access course materials, take quizzes, chat with AI, and track your learning',
      icon: BookOpen,
      gradient: 'from-teal-500 to-cyan-600',
      hoverGradient: 'from-teal-600 to-cyan-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Welcome to AmplifiEd Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Choose a workspace to continue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-violet-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${role.gradient} group-hover:${role.hoverGradient} transition-all duration-300 mb-6`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {role.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}