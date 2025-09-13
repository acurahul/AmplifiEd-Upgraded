import React from 'react';
import { BarChart3, Target, TrendingUp } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import GlowingCard from './GlowingCard';

const MarketInsights: React.FC = () => {
  const insights = [
    {
      icon: BarChart3,
      number: 10,
      suffix: " hours",
      description: "Teachers spend weekly outside class creating prep materials",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Target,
      number: 75,
      suffix: "%",
      description: "of students say current tools don't meet their learning needs",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: TrendingUp,
      number: 30,
      suffix: "%",
      description: "improvement in test performance with personalized learning",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            The Need is Clear
          </h2>
          <p className="text-xl text-gray-400">
            The data shows why educators and students are ready for a better solution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <GlowingCard key={index} className="text-center p-8">
                <div className="group">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${insight.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  
                  <div className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${insight.gradient} bg-clip-text text-transparent`}>
                    <AnimatedCounter 
                      end={insight.number} 
                      suffix={insight.suffix}
                      duration={2500}
                    />
                  </div>
                  
                  <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                    {insight.description}
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

export default MarketInsights;