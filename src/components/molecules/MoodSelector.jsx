import React from 'react';
import { motion } from 'framer-motion';

const MoodSelector = ({ value, onChange, className = '' }) => {
  const moods = [
    { value: 'amazing', label: 'Amazing', icon: '🤩', color: 'text-green-500' },
    { value: 'good', label: 'Good', icon: '😊', color: 'text-green-400' },
    { value: 'neutral', label: 'Neutral', icon: '😐', color: 'text-gray-400' },
    { value: 'tired', label: 'Tired', icon: '😴', color: 'text-blue-400' },
    { value: 'moody', label: 'Moody', icon: '😤', color: 'text-orange-400' },
    { value: 'irritable', label: 'Irritable', icon: '😠', color: 'text-red-400' },
    { value: 'sad', label: 'Sad', icon: '😢', color: 'text-blue-500' },
    { value: 'anxious', label: 'Anxious', icon: '😰', color: 'text-purple-400' }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-medium font-display text-gray-900">Mood</h3>
      <div className="grid grid-cols-4 gap-2">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-center
              ${value === mood.value
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl">{mood.icon}</span>
              <span className="text-xs font-medium text-gray-600">{mood.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;