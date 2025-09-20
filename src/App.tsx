import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Vision from './components/Vision';
import MarketInsights from './components/MarketInsights';
import HowItWorks from './components/HowItWorks';
import FeatureRoadmap from './components/FeatureRoadmap';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import Portal from './components/Portal';
import ProtectedRoute from './components/ProtectedRoute';
import { setSessionRole, type SessionRole } from '../lib/role';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Benefits />
      <Vision />
      <MarketInsights />
      <HowItWorks />
      <FeatureRoadmap />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

function PortalPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: SessionRole) => {
    setSessionRole(role);
    
    switch (role) {
      case 'admin':
        navigate('/admin/queue');
        break;
      case 'tutor':
        navigate('/tutor/home');
        break;
      case 'student':
        navigate('/student/home');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Welcome to AmplifiEd Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Choose a workspace to continue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <button
            onClick={() => handleRoleSelect('admin')}
            className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-violet-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300 mb-6">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Admin
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                Manage system operations, monitor jobs, and oversee platform health
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('tutor')}
            className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-violet-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 group-hover:from-violet-600 group-hover:to-purple-700 transition-all duration-300 mb-6">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Tutor
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                Create courses, manage sessions, review materials, and track student progress
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('student')}
            className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 hover:border-violet-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:from-teal-600 group-hover:to-cyan-700 transition-all duration-300 mb-6">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Student
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                Access course materials, take quizzes, chat with AI, and track your learning
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <PortalPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/queue" element={<div className="min-h-screen bg-slate-900 text-white p-8"><h1>Admin Queue - Coming Soon</h1></div>} />
            <Route path="/tutor/home" element={<div className="min-h-screen bg-slate-900 text-white p-8"><h1>Tutor Home - Coming Soon</h1></div>} />
            <Route path="/student/home" element={<div className="min-h-screen bg-slate-900 text-white p-8"><h1>Student Home - Coming Soon</h1></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;