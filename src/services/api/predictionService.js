import predictions from '../mockData/predictions.json';
import { cycleEntryService } from '../index';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...predictions];

const predictionService = {
  async getCurrent() {
    await delay(300);
    // Return the most recent prediction
    return data.length > 0 ? { ...data[0] } : null;
  },

  async generatePrediction() {
    await delay(500);
    
    // Simple ML-like prediction based on recent cycle data
    try {
      const recentEntries = await cycleEntryService.getRecent(90);
      const periodEntries = recentEntries.filter(entry => entry.flow !== 'none');
      
      if (periodEntries.length === 0) {
        throw new Error('Insufficient data for prediction');
      }

      // Calculate average cycle length
      const cycleLengths = [];
      let lastPeriodStart = null;
      
      for (const entry of periodEntries.reverse()) {
        if (entry.flow === 'medium' || entry.flow === 'heavy') {
          if (lastPeriodStart) {
            const daysBetween = Math.abs(new Date(entry.date) - new Date(lastPeriodStart)) / (1000 * 60 * 60 * 24);
            if (daysBetween > 20 && daysBetween < 40) {
              cycleLengths.push(daysBetween);
            }
          }
          lastPeriodStart = entry.date;
        }
      }

      const avgCycleLength = cycleLengths.length > 0 
        ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
        : 28;

      // Predict next period
      const lastPeriod = new Date(lastPeriodStart || periodEntries[periodEntries.length - 1].date);
      const nextPeriodStart = new Date(lastPeriod.getTime() + (avgCycleLength * 24 * 60 * 60 * 1000));
      
      // Calculate fertile window (typically 12-16 days before next period)
      const ovulationDay = new Date(nextPeriodStart.getTime() - (14 * 24 * 60 * 60 * 1000));
      const fertileStart = new Date(ovulationDay.getTime() - (5 * 24 * 60 * 60 * 1000));
      const fertileEnd = new Date(ovulationDay.getTime() + (1 * 24 * 60 * 60 * 1000));

      const prediction = {
        nextPeriodStart: nextPeriodStart.toISOString().split('T')[0],
        fertileWindowStart: fertileStart.toISOString().split('T')[0],
        fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
        confidence: Math.min(0.95, 0.4 + (cycleLengths.length * 0.1))
      };

      // Update stored predictions
      data.unshift(prediction);
      if (data.length > 3) data.pop();

      return { ...prediction };
    } catch (error) {
      throw new Error('Unable to generate prediction: ' + error.message);
    }
  },

  async update(updates) {
    await delay(300);
    if (data.length > 0) {
      data[0] = { ...data[0], ...updates };
      return { ...data[0] };
    }
    throw new Error('No prediction to update');
  }
};

export default predictionService;