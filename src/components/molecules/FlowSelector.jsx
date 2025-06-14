import React from 'react';
import { motion } from 'framer-motion';

const FlowSelector = ({ value, onChange, className = '' }) => {
  const flowOptions = [
    { value: 'none', label: 'None', color: 'bg-gray-200', icon: '○' },
    { value: 'light', label: 'Light', color: 'bg-pink-200', icon: '●' },
    { value: 'medium', label: 'Medium', color: 'bg-pink-400', icon: '●' },
    { value: 'heavy', label: 'Heavy', color: 'bg-red-500', icon: '●' }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-medium font-display text-gray-900">Flow</h3>
      <div className="grid grid-cols-2 gap-3">
        {flowOptions.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200
              ${value === option.value 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-6 h-6 rounded-full ${option.color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{option.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FlowSelector;