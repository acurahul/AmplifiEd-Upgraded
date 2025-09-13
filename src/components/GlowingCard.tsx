import React, { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'violet' 
}) => {
  return (
    <div className={`group relative ${className}`}>
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
      
      {/* Card content */}
      <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 group-hover:border-violet-500/30 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default GlowingCard;