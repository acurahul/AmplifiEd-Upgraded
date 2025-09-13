import React from 'react';
import { Quote } from 'lucide-react';
import GlowingCard from './GlowingCard';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "This is the tool I've been waiting for — less prep, more impact.",
      author: "Sarah M.",
      role: "High School Physics Teacher",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      quote: "Finally, an AI that respects the teacher's role.",
      author: "David L.",
      role: "Independent Math Tutor",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      quote: "My students are more engaged than ever with personalized content.",
      author: "Maria R.",
      role: "Chemistry Professor",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            What Educators Say
          </h2>
          <p className="text-xl text-gray-400">
            Join hundreds of teachers already transforming their workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlowingCard
              key={index}
              className="transition-all duration-300 h-full"
            >
              <div className="p-8 h-full flex flex-col">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${testimonial.gradient} mb-6`}>
                  <Quote className="text-white" size={20} />
                </div>
                
                <blockquote className="text-xl text-gray-300 mb-6 leading-relaxed italic flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;