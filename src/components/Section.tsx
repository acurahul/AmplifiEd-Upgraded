import React from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, description, children, className = '' }) => {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;