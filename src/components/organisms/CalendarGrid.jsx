import React from 'react';
import { motion } from 'framer-motion';
import CalendarDay from '@/components/molecules/CalendarDay';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';

const CalendarGrid = ({ 
  currentDate, 
  entries = [], 
  prediction, 
  onDayClick 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEntryForDate = (date) => {
    return entries.find(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const isPredictedPeriod = (date) => {
    if (!prediction) return false;
    const predictionDate = new Date(prediction.nextPeriodStart);
    const endDate = new Date(predictionDate.getTime() + (5 * 24 * 60 * 60 * 1000));
    return date >= predictionDate && date <= endDate;
  };

  const isFertileWindow = (date) => {
    if (!prediction) return false;
    const startDate = new Date(prediction.fertileWindowStart);
    const endDate = new Date(prediction.fertileWindowEnd);
    return date >= startDate && date <= endDate;
  };

return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>

      {/* Week day labels */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm md:text-base font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <motion.div 
        className="grid grid-cols-7 gap-2 md:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {days.map((day, index) => (
          <motion.div
            key={day.toISOString()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.01,
              ease: "easeOut"
            }}
          >
            <CalendarDay
              date={day}
              entry={getEntryForDate(day)}
              isToday={isToday(day)}
              isPredicted={isPredictedPeriod(day)}
              isFertile={isFertileWindow(day)}
              isOtherMonth={!isSameMonth(day, currentDate)}
              onClick={onDayClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Legend */}
      <div className="flex justify-center md:justify-start mt-6 md:mt-8 space-x-4 md:space-x-6 text-xs md:text-sm">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full" />
          <span className="text-gray-600">Period</span>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-secondary/30 border border-secondary rounded-full" />
          <span className="text-gray-600">Fertile</span>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/20 border-2 border-primary border-dashed rounded-full" />
          <span className="text-gray-600">Predicted</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;