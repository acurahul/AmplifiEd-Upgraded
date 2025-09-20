'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ChevronDown, LogOut, RotateCcw } from 'lucide-react';
import { getSessionRole, clearSessionRole, type SessionRole } from '@/lib/role';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [sessionRole, setSessionRole] = useState<SessionRole | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setSessionRole(getSessionRole());
  }, []);

  const handleSwitchRole = () => {
    clearSessionRole();
    router.push('/portal');
  };

  const handleSignOut = async () => {
    await signOut();
    clearSessionRole();
    router.push('/');
  };

  const getRoleColor = (role: SessionRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'tutor': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'student': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AmplifiEd Portal
            </h1>
            {sessionRole && (
              <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRoleColor(sessionRole)}`}>
                {sessionRole.charAt(0).toUpperCase() + sessionRole.slice(1)}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {sessionRole && (
              <button
                onClick={handleSwitchRole}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Switch Role
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <User size={20} />
                <span className="text-sm">{user?.email}</span>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}