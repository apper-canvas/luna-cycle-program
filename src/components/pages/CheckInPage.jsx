import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckInForm from '@/components/organisms/CheckInForm';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const CheckInPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleStartCheckIn = () => {
    setShowForm(true);
  };

  const handleCheckInSuccess = () => {
    setShowForm(false);
    navigate('/calendar');
  };

  const handleCheckInCancel = () => {
    setShowForm(false);
  };

  if (showForm) {
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
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="Heart" className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
          Daily Check-in
        </h1>
        <p className="text-gray-600 font-body">
          Take a moment to track how you're feeling today
        </p>
      </div>

      <Card gradient className="text-center">
        <div className="space-y-4">
          <div className="text-6xl">📅</div>
          <div>
            <h3 className="text-lg font-semibold font-display text-gray-900 mb-2">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-gray-600 font-body">
              Ready to log your symptoms, mood, and flow?
            </p>
          </div>
          
          <Button 
            onClick={handleStartCheckIn}
            size="lg"
            fullWidth
            icon="Plus"
          >
            Start Check-in
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <div className="text-3xl mb-2">💭</div>
          <h4 className="font-semibold font-display text-gray-900 mb-1">
            Track Mood
          </h4>
          <p className="text-sm text-gray-600 font-body">
            Monitor emotional patterns
          </p>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <h4 className="font-semibold font-display text-gray-900 mb-1">
            Log Symptoms
          </h4>
          <p className="text-sm text-gray-600 font-body">
            Track physical changes
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <ApperIcon name="Info" className="w-4 h-4 text-info" />
          </div>
          <div>
            <h4 className="font-semibold font-display text-gray-900 mb-1">
              Quick Tip
            </h4>
            <p className="text-sm text-gray-600 font-body">
              Regular check-ins help Luna learn your unique patterns and provide more accurate predictions. Try to log daily for the best results!
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CheckInPage;