import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FlowSelector from '@/components/molecules/FlowSelector';
import SymptomSelector from '@/components/molecules/SymptomSelector';
import MoodSelector from '@/components/molecules/MoodSelector';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { cycleEntryService, userSettingsService } from '@/services';

const CheckInForm = ({ selectedDate, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    flow: 'none',
    symptoms: [],
    mood: '',
    notes: '',
    temperature: '',
    basalBodyTemp: '',
    lhTest: '',
    cervicalMucus: ''
  });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await userSettingsService.get();
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mood) {
      toast.error('Please select your mood');
      return;
    }

    setLoading(true);
    
    try {
const entry = {
        date: selectedDate.toISOString().split('T')[0],
        flow: formData.flow,
        symptoms: formData.symptoms,
        mood: formData.mood,
        notes: formData.notes,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        basalBodyTemp: formData.basalBodyTemp ? parseFloat(formData.basalBodyTemp) : null,
        lhTest: formData.lhTest || null,
        cervicalMucus: formData.cervicalMucus || null
      };

      await cycleEntryService.create(entry);
      
      toast.success('Check-in saved successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to save check-in');
      console.error('Failed to save entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
          Daily Check-in
        </h2>
        <p className="text-gray-600 font-body">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FlowSelector
          value={formData.flow}
          onChange={(flow) => setFormData(prev => ({ ...prev, flow }))}
        />

        <SymptomSelector
          value={formData.symptoms}
          onChange={(symptoms) => setFormData(prev => ({ ...prev, symptoms }))}
        />

        <MoodSelector
          value={formData.mood}
          onChange={(mood) => setFormData(prev => ({ ...prev, mood }))}
        />

        <div className="space-y-4">
          <Input
            type="number"
            step="0.1"
            placeholder="98.6"
            label="Temperature (°F)"
            value={formData.temperature}
            onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
            icon="Thermometer"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-2">
              Notes
            </label>
            <textarea
              placeholder="How are you feeling today?"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-surface-50 font-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
</div>

        {settings?.fertilityMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-4 border-t border-pink-200"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-sm">💕</span>
              </div>
              <h4 className="font-medium text-pink-900">Fertility Tracking</h4>
            </div>

            <Input
              type="number"
              step="0.01"
              placeholder="97.80"
              label="Basal Body Temperature (°F)"
              value={formData.basalBodyTemp}
              onChange={(e) => setFormData(prev => ({ ...prev, basalBodyTemp: e.target.value }))}
              icon="Thermometer"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 font-body mb-2">
                LH Test Result
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['negative', 'positive', 'peak'].map((result) => (
                  <motion.button
                    key={result}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, lhTest: result }))}
                    className={`
                      p-3 rounded-lg border font-body text-sm font-medium transition-colors
                      ${formData.lhTest === result
                        ? 'bg-pink-100 border-pink-300 text-pink-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    {result.charAt(0).toUpperCase() + result.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-body mb-2">
                Cervical Mucus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'dry', label: 'Dry', icon: '🏜️' },
                  { value: 'sticky', label: 'Sticky', icon: '🍯' },
                  { value: 'creamy', label: 'Creamy', icon: '🥛' },
                  { value: 'eggwhite', label: 'Egg White', icon: '🥚' }
                ].map((mucus) => (
                  <motion.button
                    key={mucus.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, cervicalMucus: mucus.value }))}
                    className={`
                      p-3 rounded-lg border font-body text-sm font-medium transition-colors flex items-center space-x-2
                      ${formData.cervicalMucus === mucus.value
                        ? 'bg-pink-100 border-pink-300 text-pink-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{mucus.icon}</span>
                    <span>{mucus.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            icon={loading ? "Loader" : "Check"}
          >
            {loading ? 'Saving...' : 'Save Check-in'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckInForm;