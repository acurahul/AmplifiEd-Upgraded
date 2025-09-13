import React from 'react';
import { Upload, Cog, Users } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload",
      description: "Teachers upload their recorded class or lesson plan",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      number: 2,
      icon: Cog,
      title: "AI Transforms",
      description: "AmplifiEd generates transcripts, notes, quizzes, flashcards, and study guides instantly",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      number: 3,
      icon: Users,
      title: "Students Engage",
      description: "Students log in to access personalized study tools, while tutors track progress",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your teaching workflow in three simple steps
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection lines - positioned to connect icon centers */}
          <div className="hidden md:block absolute top-[5rem] left-0 right-0 h-0.5">
            <div className="flex justify-between items-center h-full mx-auto px-[6.5rem]">
              <div className="w-full h-0.5 bg-gradient-to-r from-violet-500 via-teal-500 to-purple-500"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8 flex justify-center">
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={32} />
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 border-2 border-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-violet-400 font-bold text-xs">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};