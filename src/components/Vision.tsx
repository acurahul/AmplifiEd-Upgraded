import React from 'react';
import { Brain, Users, Heart } from 'lucide-react';

const Vision: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-violet-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            A Smarter Future of Learning
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Where every class instantly transforms into a personalized study journey. Tutors are freed from repetitive prep, students thrive with adaptive tools, and education finally feels <span className="text-violet-400 font-semibold">human again</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 mb-6 group-hover:from-violet-500/30 group-hover:to-purple-500/30 transition-all duration-300">
              <Brain className="text-violet-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Intelligent Automation</h3>
            <p className="text-gray-400">AI handles the busywork while preserving your teaching style</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 mb-6 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
              <Users className="text-teal-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Student Empowerment</h3>
            <p className="text-gray-400">Personalized tools that adapt to each student's learning pace</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
              <Heart className="text-purple-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Human Connection</h3>
            <p className="text-gray-400">Technology that enhances relationships, not replaces them</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;