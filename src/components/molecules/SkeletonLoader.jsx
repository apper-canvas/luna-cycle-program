import React from 'react';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const getSkeletonContent = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-full" />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        );
      case 'chart':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-40 bg-gray-200 rounded" />
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {getSkeletonContent()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;