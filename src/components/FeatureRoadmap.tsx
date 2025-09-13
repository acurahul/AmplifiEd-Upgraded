import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Zap, Gamepad2, Rocket } from 'lucide-react';

const FeatureRoadmap: React.FC = () => {
  const [openPriorities, setOpenPriorities] = useState<number[]>([1]);

  const togglePriority = (priority: number) => {
    if (openPriorities.includes(priority)) {
      setOpenPriorities(openPriorities.filter(p => p !== priority));
    } else {
      setOpenPriorities([...openPriorities, priority]);
    }
  };

  const priorities = [
    {
      number: 1,
      title: "Core MVP Features",
      icon: Star,
      gradient: "from-violet-500 to-purple-600",
      features: [
        "Chatbot assistant",
        "Summaries & study notes", 
        "Quiz/test generator",
        "Flashcards & mnemonics",
        "Glossary/database",
        "Transcription & screen grabs",
        "Teacher & student dashboards",
        "Notifications & logins"
      ]
    },
    {
      number: 2,
      title: "Advanced Features",
      icon: Zap,
      gradient: "from-teal-500 to-cyan-600",
      features: [
        "Custom printable flashcards",
        "Teacher-approved quizzes/tests",
        "Translations",
        "Audio summaries",
        "Cheat sheets",
        "Exam prep guides",
        "Random quiz generator",
        "Visualization of concepts"
      ]
    },
    {
      number: 3,
      title: "Engagement Layer",
      icon: Gamepad2,
      gradient: "from-purple-500 to-pink-600",
      features: [
        "Gamification",
        "Viva",
        "Auto-prompts & streaks",
        "ASMR background",
        "Feedback loops",
        "Ratings"
      ]
    },
    {
      number: 4,
      title: "Next-Gen Features",
      icon: Rocket,
      gradient: "from-orange-500 to-red-600",
      features: [
        "Teacher analytics",
        "FAQs & feedback loop",
        "Lesson plan generation",
        "Mind maps",
        "Recaps in teacher's voice"
      ]
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Feature Roadmap
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our development journey from MVP to next-generation AI teaching platform
          </p>
        </div>

        <div className="space-y-6">
          {priorities.map((priority) => {
            const IconComponent = priority.icon;
            const isOpen = openPriorities.includes(priority.number);
            
            return (
              <div 
                key={priority.number}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'border-violet-500/50 shadow-2xl shadow-violet-500/10' 
                    : 'border-slate-700/50 hover:border-violet-500/30'
                }`}
              >
                <button
                  onClick={() => togglePriority(priority.number)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/30 rounded-2xl transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${priority.gradient}`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-sm font-semibold text-gray-400">P{priority.number}</span>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${priority.gradient}`}></div>
                      </div>
                      <h3 className="text-xl font-bold text-white">{priority.title}</h3>
                    </div>
                  </div>
                  
                  <div className="text-gray-400">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                    <div className="ml-16 grid md:grid-cols-2 gap-3">
                      {priority.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors duration-200"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${priority.gradient}`}></div>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureRoadmap;