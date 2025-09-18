import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Users } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
          Join Early Access
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Be the first to shape the future of teaching. Get exclusive access to AmplifiEd before anyone else.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <div className="flex items-center text-gray-400">
            <Users size={20} className="mr-2" />
            <span>500+ educators signed up</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Mail size={20} className="mr-2" />
            <span>No spam, unsubscribe anytime</span>
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
            <button className="group inline-flex items-center justify-center bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25 transform hover:scale-105">
              Get Access
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Expected release: Q2 2025 • Early access includes beta testing and feature input
        </p>
        
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-gray-400 mb-4">Already have an account?</p>
          <Link 
            to="/login"
            className="inline-flex items-center bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300"
          >
            Login to Portal
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;