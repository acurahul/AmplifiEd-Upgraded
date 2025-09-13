import React from 'react';

interface PulsingDotProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PulsingDot: React.FC<PulsingDotProps> = ({ 
  color = 'violet', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} bg-${color}-500 rounded-full animate-pulse`}></div>
      <div className={`absolute inset-0 ${sizeClasses[size]} bg-${color}-400 rounded-full animate-ping opacity-75`}></div>
    </div>
  );
};

export default PulsingDot;