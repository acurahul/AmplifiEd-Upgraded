import React from 'react';
import { Clock, Target, Shield } from 'lucide-react';
import GlowingCard from './GlowingCard';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time for What Matters",
      description: "AmplifiEd handles transcription, lesson notes, quizzes, and flashcards — so you can focus on teaching.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Personalized Student Learning",
      description: "Students access study notes, quizzes, and flashcards grounded in your own class content — improving retention.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Stay in Control",
      description: "You approve and guide what AmplifiEd generates — unlike generic AI tools, it enhances your authority.",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Why Choose AmplifiEd?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your teaching experience with AI that amplifies your expertise rather than replacing it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <GlowingCard
                key={index}
                className="hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.gradient} mb-6`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </GlowingCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;