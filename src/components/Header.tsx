import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSessionRole, clearSessionRole, type SessionRole } from '../lib/role';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sessionRole, setSessionRole] = useState<SessionRole | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSessionRole(getSessionRole());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSwitchRole = () => {
    clearSessionRole();
    navigate('/portal');
  };

  const handleSignOut = async () => {
    await signOut();
    clearSessionRole();
    navigate('/');
  };

  const getRoleColor = (role: SessionRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'tutor': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'student': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || user ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-white">AmplifiEd</Link>
            {sessionRole && (
              <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRoleColor(sessionRole)}`}>
                {sessionRole.charAt(0).toUpperCase() + sessionRole.slice(1)}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
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
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <User size={20} />
                    <span className="hidden md:block text-sm">{user.email}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                      {sessionRole && (
                        <button
                          onClick={handleSwitchRole}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          <RotateCcw size={16} className="mr-2" />
                          Switch Role
                        </button>
                      )}
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
              </>
            ) : (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-8">
                    <button onClick={() => scrollToSection('benefits')} className="text-gray-300 hover:text-white transition-colors">Benefits</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition-colors">How It Works</button>
                    <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">Features</button>
                    <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-white transition-colors">FAQ</button>
                  </div>
                </nav>

                <div className="hidden md:block">
                  <button 
                    onClick={() => scrollToSection('cta')}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl mr-3"
                  >
                    Join Early Access
                  </button>
                  <Link 
                    to="/login"
                    className="bg-slate-800 border border-slate-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            {!user && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && !user && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => scrollToSection('benefits')} className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left">Benefits</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left">Features</button>
            <button onClick={() => scrollToSection('faq')} className="block px-3 py-2 text-gray-300 hover:text-white transition-colors w-full text-left">FAQ</button>
            <button 
              onClick={() => scrollToSection('cta')}
              className="block w-full text-left bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-200 mt-4"
            >
              Join Early Access
            </button>
            <Link 
              to="/login"
              className="block w-full text-left bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 mt-2"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;