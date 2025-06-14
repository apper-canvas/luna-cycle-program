import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import InsightsChart from '@/components/organisms/InsightsChart';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { cycleEntryService, predictionService } from '@/services';
import { format, subDays, differenceInDays } from 'date-fns';

const InsightsPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [generatingPrediction, setGeneratingPrediction] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const entriesData = await cycleEntryService.getAll();
      setEntries(entriesData);
      generateInsights(entriesData);
    } catch (err) {
      setError(err.message || 'Failed to load insights data');
      toast.error('Failed to load insights data');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (entriesData) => {
    if (entriesData.length === 0) {
      setInsights(null);
      return;
    }

    // Calculate average cycle length
    const periodEntries = entriesData
      .filter(entry => entry.flow === 'heavy' || entry.flow === 'medium')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const cycleLengths = [];
    for (let i = 1; i < periodEntries.length; i++) {
      const currentDate = new Date(periodEntries[i].date);
      const prevDate = new Date(periodEntries[i - 1].date);
      const length = differenceInDays(currentDate, prevDate);
      if (length > 20 && length < 40) {
        cycleLengths.push(length);
      }
    }

    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
      : 28;

    // Most common symptoms
    const symptomCounts = {};
    entriesData.forEach(entry => {
      if (entry.symptoms) {
        entry.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });

    const mostCommonSymptom = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)[0];

    // Mood patterns
    const moodCounts = {};
    entriesData.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];

    setInsights({
      avgCycleLength,
      totalEntries: entriesData.length,
      mostCommonSymptom: mostCommonSymptom ? mostCommonSymptom[0] : null,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
      cycleConsistency: cycleLengths.length > 2 ? 
        (Math.max(...cycleLengths) - Math.min(...cycleLengths)) <= 3 ? 'Regular' : 'Irregular' 
        : 'Unknown'
    });
  };

  const handleGeneratePrediction = async () => {
    setGeneratingPrediction(true);
    
    try {
      await predictionService.generatePrediction();
      toast.success('New prediction generated successfully!');
    } catch (err) {
      toast.error('Unable to generate prediction: ' + err.message);
    } finally {
      setGeneratingPrediction(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Insights Error"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title="No Data Yet"
        description="Start logging your daily check-ins to see personalized insights and predictions."
        actionLabel="Start Tracking"
        onAction={() => window.location.href = '/checkin'}
        icon="TrendingUp"
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
        <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
          Your Insights
        </h1>
        <p className="text-gray-600 font-body">
          Discover patterns in your cycle and wellbeing
        </p>
      </div>

      {insights && (
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <div className="text-3xl font-bold font-display text-primary mb-1">
                {insights.avgCycleLength}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Average Cycle Length
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <div className="text-3xl font-bold font-display text-secondary mb-1">
                {insights.totalEntries}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Total Check-ins
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center">
              <div className="text-lg font-semibold font-display text-gray-900 mb-1 capitalize">
                {insights.mostCommonMood || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Most Common Mood
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center">
              <div className="text-lg font-semibold font-display text-gray-900 mb-1 capitalize">
                {insights.mostCommonSymptom || 'None'}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Most Common Symptom
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold font-display text-gray-900">
                AI Predictions
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Machine learning powered forecasts
              </p>
            </div>
            <Button
              onClick={handleGeneratePrediction}
              disabled={generatingPrediction}
              icon={generatingPrediction ? "Loader" : "Zap"}
              size="sm"
            >
              {generatingPrediction ? 'Generating...' : 'Update'}
            </Button>
          </div>
          
          <div className="bg-gradient-card rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h4 className="font-semibold font-display text-gray-900">
                  Adaptive Learning Active
                </h4>
                <p className="text-sm text-gray-600 font-body">
                  Your predictions improve with each check-in
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <InsightsChart entries={entries} />
    </motion.div>
  );
};

export default InsightsPage;