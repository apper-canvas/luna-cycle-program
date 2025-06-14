import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ProgressRing from '@/components/atoms/ProgressRing';
import { format, differenceInDays } from 'date-fns';

const CycleOverviewCard = ({ cycle, prediction, className = '' }) => {
  const getCurrentPhase = () => {
    if (!cycle || !prediction) return { phase: 'Unknown', day: 0, total: 28 };
    
    const today = new Date();
    const cycleStart = new Date(cycle.startDate);
    const dayInCycle = Math.max(1, differenceInDays(today, cycleStart) + 1);
    
    let phase = 'Menstrual';
    if (dayInCycle > 5 && dayInCycle <= 13) phase = 'Follicular';
    else if (dayInCycle > 13 && dayInCycle <= 15) phase = 'Ovulation';
    else if (dayInCycle > 15) phase = 'Luteal';
    
    return { phase, day: dayInCycle, total: cycle.length || 28 };
  };

  const getDaysUntilNext = () => {
    if (!prediction) return 0;
    const today = new Date();
    const nextPeriod = new Date(prediction.nextPeriodStart);
    return Math.max(0, differenceInDays(nextPeriod, today));
  };

  const { phase, day, total } = getCurrentPhase();
  const daysUntilNext = getDaysUntilNext();
  const progress = (day / total) * 100;

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Menstrual': return '#F44336';
      case 'Follicular': return '#FF9800';
      case 'Ovulation': return '#4CAF50';
      case 'Luteal': return '#9C6FDE';
      default: return '#9C6FDE';
    }
  };

  return (
    <Card gradient className={`text-center ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressRing
          progress={progress}
          size={120}
          color={getPhaseColor(phase)}
          className="mx-auto mb-4"
        >
          <div className="text-center">
            <div className="text-2xl font-bold font-display text-gray-900">
              {day}
            </div>
            <div className="text-sm text-gray-600">
              Day {day}
            </div>
          </div>
        </ProgressRing>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-display text-gray-900">
            {phase} Phase
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-primary">
                {daysUntilNext}
              </div>
              <div className="text-sm text-gray-600">
                Days until next period
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-secondary">
                {Math.round((prediction?.confidence || 0) * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                Prediction confidence
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default CycleOverviewCard;