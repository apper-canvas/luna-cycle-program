import React from 'react';
import { motion } from 'framer-motion';
import { isSameDay, format } from 'date-fns';

const CalendarDay = ({ 
  date, 
  entry, 
  isToday, 
  isPredicted, 
  isFertile, 
  isOtherMonth,
  onClick 
}) => {
  const getFlowColor = (flow) => {
    switch (flow) {
      case 'light': return 'bg-pink-200';
      case 'medium': return 'bg-pink-400';
      case 'heavy': return 'bg-red-500';
      default: return '';
    }
  };

  const getDayClasses = () => {
    let classes = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer ";
    
    if (isOtherMonth) {
      classes += "text-gray-300 ";
    } else if (isToday) {
      classes += "bg-primary text-white font-bold ";
    } else if (entry && entry.flow !== 'none') {
      classes += `${getFlowColor(entry.flow)} text-white `;
    } else if (isPredicted) {
      classes += "bg-primary/20 text-primary border-2 border-primary border-dashed ";
    } else if (isFertile) {
      classes += "bg-secondary/30 text-secondary border border-secondary ";
    } else {
      classes += "text-gray-700 hover:bg-gray-100 ";
    }
    
    return classes;
  };

  const hasSymptoms = entry && entry.symptoms && entry.symptoms.length > 0;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={() => onClick(date)}
        className={getDayClasses()}
      >
        {format(date, 'd')}
      </button>
      
      {/* Symptoms indicator */}
      {hasSymptoms && (
        <div className="w-1 h-1 bg-orange-400 rounded-full mt-1" />
      )}
      
      {/* Mood indicator */}
      {entry?.mood && (
        <div className="text-xs mt-1">
          {entry.mood === 'good' && '😊'}
          {entry.mood === 'neutral' && '😐'}
          {entry.mood === 'tired' && '😴'}
          {entry.mood === 'moody' && '😤'}
          {entry.mood === 'irritable' && '😠'}
          {entry.mood === 'amazing' && '🤩'}
          {entry.mood === 'sad' && '😢'}
          {entry.mood === 'anxious' && '😰'}
        </div>
      )}
    </motion.div>
  );
};

export default CalendarDay;