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

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Connecting arrow for desktop */}
                {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-20 h-0.5 bg-gradient-to-r from-violet-500/50 to-teal-500/50 transform -translate-x-6">
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-6 border-l-violet-500/50 border-t-3 border-b-3 border-t-transparent border-b-transparent"></div>
</div>

                )}
                
                {/* Step icon with number */}
                <div className="relative mb-8 flex justify-center">
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="text-white" size={32} />
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border-2 border-violet-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-violet-400 font-bold text-sm">{step.number}</span>
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
    </section>
  );
};

export default HowItWorks;