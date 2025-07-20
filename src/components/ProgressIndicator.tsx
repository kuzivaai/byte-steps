import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total, label }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className="flex justify-between mb-2">
        <span className="text-xl font-bold">
          {label || `Step ${current} of ${total}`}
        </span>
        <span className="text-lg" aria-label={`${percentage} percent complete`}>
          {percentage}% done
        </span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-lg text-gray-600">
        {current === total ? "Almost finished!" : `${total - current} steps remaining`}
      </div>
    </div>
  );
};