import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CalendarGrid from '@/components/organisms/CalendarGrid';
import CycleOverviewCard from '@/components/molecules/CycleOverviewCard';
import CheckInForm from '@/components/organisms/CheckInForm';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { cycleEntryService, cycleService, predictionService } from '@/services';
import { format } from 'date-fns';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [entriesData, cycleData, predictionData] = await Promise.all([
        cycleEntryService.getAll(),
        cycleService.getCurrent(),
        predictionService.getCurrent()
      ]);
      
      setEntries(entriesData);
      setCurrentCycle(cycleData);
      setPrediction(predictionData);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowCheckIn(true);
  };

  const handleCheckInSuccess = () => {
    setShowCheckIn(false);
    setSelectedDate(null);
    loadData(); // Refresh data
  };

  const handleCheckInCancel = () => {
    setShowCheckIn(false);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="calendar" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Calendar Error"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (showCheckIn && selectedDate) {
    return (
      <CheckInForm
        selectedDate={selectedDate}
        onSuccess={handleCheckInSuccess}
        onCancel={handleCheckInCancel}
      />
    );
  }

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8"
    >
      <div className="md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8 space-y-6 md:space-y-0">
        <div className="lg:col-span-2">
          <CalendarGrid
            currentDate={currentDate}
            entries={entries}
            prediction={prediction}
            onDayClick={handleDayClick}
          />
        </div>
        
        <div className="space-y-6">
          <CycleOverviewCard 
            cycle={currentCycle} 
            prediction={prediction}
          />
          
          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-card rounded-xl p-4 md:p-6 border border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-lg">🔮</span>
                </div>
                <div>
                  <h3 className="font-semibold font-display text-gray-900">
                    Next Period Prediction
                  </h3>
                  <p className="text-sm text-gray-600 font-body">
                    Expected on {format(new Date(prediction.nextPeriodStart), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage;