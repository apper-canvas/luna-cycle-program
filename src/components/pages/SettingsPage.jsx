import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { userSettingsService } from '@/services';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const settingsData = await userSettingsService.get();
      setSettings(settingsData);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      await userSettingsService.update(settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportData = () => {
    // Create a simple data export
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      app: 'Luna Cycle'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `luna-cycle-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };
const applyTheme = (themeName) => {
    const themeColors = {
      purple: { primary: '#9C6FDE', secondary: '#F5A5C8', accent: '#6B46C1' },
      pink: { primary: '#E91E63', secondary: '#F8BBD9', accent: '#C2185B' },
      green: { primary: '#4CAF50', secondary: '#A5D6A7', accent: '#388E3C' },
      blue: { primary: '#2196F3', secondary: '#90CAF9', accent: '#1976D2' }
    };
    
    const colors = themeColors[themeName] || themeColors.purple;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);
  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Settings Error"
        message={error}
        onRetry={loadSettings}
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
          Settings
        </h1>
        <p className="text-gray-600 font-body">
          Customize your Luna Cycle experience
        </p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Cycle Preferences
        </h3>
        
        <div className="space-y-4">
          <Input
            type="number"
            min="20"
            max="40"
            label="Average Cycle Length (days)"
            value={settings?.averageCycleLength || 28}
            onChange={(e) => handleInputChange('averageCycleLength', parseInt(e.target.value))}
          />
          
          <Input
            type="time"
            label="Daily Reminder Time"
            value={settings?.reminderTime || '09:00'}
            onChange={(e) => handleInputChange('reminderTime', e.target.value)}
          />
        </div>
</Card>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Fertility Tracking
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Trying to Conceive (TTC)</h4>
              <p className="text-sm text-gray-600">Enable fertility tracking with BBT, LH tests, and cervical mucus</p>
            </div>
            <motion.button
              onClick={() => handleToggle('fertilityMode')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings?.fertilityMode ? 'bg-primary' : 'bg-gray-200'}
              `}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                animate={{
                  x: settings?.fertilityMode ? 24 : 4
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
          
          {settings?.fertilityMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Heart" className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Enhanced Tracking Active</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your check-ins now include basal body temperature, LH test results, and cervical mucus observations for comprehensive fertility tracking.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Daily Reminders</h4>
              <p className="text-sm text-gray-600">Get reminded to log your daily check-in</p>
            </div>
            <motion.button
              onClick={() => handleToggle('notificationsEnabled')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings?.notificationsEnabled ? 'bg-primary' : 'bg-gray-200'}
              `}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                animate={{
                  x: settings?.notificationsEnabled ? 24 : 4
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Privacy & Security
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Privacy Mode</h4>
              <p className="text-sm text-gray-600">Hide sensitive information from notifications</p>
            </div>
            <motion.button
              onClick={() => handleToggle('privacyMode')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings?.privacyMode ? 'bg-primary' : 'bg-gray-200'}
              `}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                animate={{
                  x: settings?.privacyMode ? 24 : 4
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Shield" className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Your Data is Secure</h4>
                <p className="text-sm text-gray-600 mt-1">
                  All data is stored locally on your device. We never share your personal health information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Data Management
        </h3>
        
        <div className="space-y-4">
          <Button
            onClick={handleExportData}
            icon="Download"
            variant="secondary"
            fullWidth
          >
            Export My Data
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 font-body">
              Export your cycle data as a JSON file for backup or transfer to another device.
            </p>
          </div>
</div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Theme
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose your theme
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  key: 'purple', 
                  name: 'Purple', 
                  colors: ['#9C6FDE', '#F5A5C8', '#6B46C1'],
                  gradient: 'linear-gradient(135deg, #9C6FDE 0%, #F5A5C8 100%)'
                },
                { 
                  key: 'pink', 
                  name: 'Pink', 
                  colors: ['#E91E63', '#F8BBD9', '#C2185B'],
                  gradient: 'linear-gradient(135deg, #E91E63 0%, #F8BBD9 100%)'
                },
                { 
                  key: 'green', 
                  name: 'Green', 
                  colors: ['#4CAF50', '#A5D6A7', '#388E3C'],
                  gradient: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 100%)'
                },
                { 
                  key: 'blue', 
                  name: 'Blue', 
                  colors: ['#2196F3', '#90CAF9', '#1976D2'],
                  gradient: 'linear-gradient(135deg, #2196F3 0%, #90CAF9 100%)'
                }
              ].map((theme) => (
                <motion.button
                  key={theme.key}
                  onClick={() => {
                    handleInputChange('theme', theme.key);
                    // Apply theme immediately
                    const root = document.documentElement;
                    root.style.setProperty('--theme-primary', theme.colors[0]);
                    root.style.setProperty('--theme-secondary', theme.colors[1]);
                    root.style.setProperty('--theme-accent', theme.colors[2]);
                    toast.success(`${theme.name} theme applied!`);
                  }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${settings?.theme === theme.key 
                      ? 'border-gray-900 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-full h-16 rounded-lg mb-3"
                    style={{ background: theme.gradient }}
                  />
                  
                  <div className="flex justify-center space-x-1 mb-2">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900">
                    {theme.name}
                  </p>
                  
                  {settings?.theme === theme.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Palette" className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Personalize Your Experience</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Choose a theme that reflects your style. Your selection will be applied immediately across the entire app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex space-x-3">
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          icon={saving ? "Loader" : "Check"}
          fullWidth
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Card>
        <div className="text-center">
          <div className="text-4xl mb-2">🌙</div>
          <h3 className="font-semibold font-display text-gray-900 mb-2">
            Luna Cycle v1.0
          </h3>
          <p className="text-sm text-gray-600 font-body">
            Your trusted companion for cycle tracking and health insights
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;