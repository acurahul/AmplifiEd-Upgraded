import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-violet-400">
          {icon}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-white mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-400">
          {title}
        </div>
      </div>
      
      {trend && (
        <div className="text-xs text-gray-500">
          +{trend.value} {trend.label}
        </div>
      )}
    </div>
  );
};

export default StatCard;