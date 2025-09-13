import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import FloatingElements from './FloatingElements';

const Hero: React.FC = () => {
  const scrollToCTA = () => {
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <FloatingElements />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-violet-400 mr-2" size={24} />
          <span className="text-violet-400 font-semibold">AI-Powered Teaching Assistant</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
          AmplifiEd —<br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Your AI Teaching Partner
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Save hours of prep, empower students with personalized study tools, and make every class truly count.
        </p>
        
        <button 
          onClick={scrollToCTA}
          className="group inline-flex items-center bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105"
        >
          Join Early Access
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </button>
        
        <div className="mt-12 text-sm text-gray-400">
          <p>Join 500+ educators already signed up</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;