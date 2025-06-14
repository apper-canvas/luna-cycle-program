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

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    dateOfBirth: '',
    location: '',
    phoneNumber: '',
    emergencyContact: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      cycleReminders: true,
      insightUpdates: true
    },
    privacySettings: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsOptIn: true
    },
    accountSettings: {
      twoFactorAuth: false,
      loginAlerts: true
    }
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(profileChanged);
  }, [profile, originalProfile]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);
      
      // Get existing settings and merge with profile structure
      const settings = await userSettingsService.get();
      const profileData = {
        ...profile,
        ...settings.profile,
        notificationPreferences: {
          ...profile.notificationPreferences,
          ...settings.notifications
        }
      };
      
      setProfile(profileData);
      setOriginalProfile(JSON.parse(JSON.stringify(profileData)));
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      setSaving(true);
      
      // Prepare settings data with profile information
      const settingsData = {
        profile: {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          avatar: profile.avatar,
          dateOfBirth: profile.dateOfBirth,
          location: profile.location,
          phoneNumber: profile.phoneNumber,
          emergencyContact: profile.emergencyContact,
          privacySettings: profile.privacySettings,
          accountSettings: profile.accountSettings
        },
        notifications: profile.notificationPreferences
      };
      
      await userSettingsService.update(settingsData);
      setOriginalProfile(JSON.parse(JSON.stringify(profile)));
      setHasChanges(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(section, key, value) {
    if (section) {
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [key]: value
      }));
    }
  }

  function handleToggle(section, key) {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  }

  function handleDiscardChanges() {
    setProfile(JSON.parse(JSON.stringify(originalProfile)));
    setHasChanges(false);
    toast.info('Changes discarded');
  }

  async function handleDeleteAccount() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      // In a real app, this would call an account deletion service
      toast.success('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error('Failed to process account deletion request.');
    }
  }

  function handleExportProfile() {
    const exportData = {
      profile: profile,
      exportDate: new Date().toISOString(),
      app: 'Luna Cycle'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luna-cycle-profile-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Profile data exported successfully!');
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load profile"
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscardChanges}
            >
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveProfile}
              loading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-gray-600 text-sm">
                  Your basic profile details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={profile.email}
                onChange={(e) => handleInputChange(null, 'email', e.target.value)}
              />
              <Input
                type="date"
                label="Date of Birth"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange(null, 'dateOfBirth', e.target.value)}
              />
              <Input
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={profile.phoneNumber}
                onChange={(e) => handleInputChange(null, 'phoneNumber', e.target.value)}
              />
            </div>

            <Input
              type="text"
              label="Location"
              placeholder="City, Country"
              value={profile.location}
              onChange={(e) => handleInputChange(null, 'location', e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                rows={3}
                placeholder="Tell us a bit about yourself..."
                value={profile.bio}
                onChange={(e) => handleInputChange(null, 'bio', e.target.value)}
              />
            </div>

            <Input
              type="text"
              label="Emergency Contact"
              placeholder="Name and phone number"
              value={profile.emergencyContact}
              onChange={(e) => handleInputChange(null, 'emergencyContact', e.target.value)}
            />
          </div>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Bell" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose how you want to be notified
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile notifications' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts' },
                { key: 'cycleReminders', label: 'Cycle Reminders', desc: 'Period and ovulation predictions' },
                { key: 'insightUpdates', label: 'Insight Updates', desc: 'New analysis and trends' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggle('notificationPreferences', key)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${profile.notificationPreferences[key] 
                        ? 'bg-primary' 
                        : 'bg-gray-200'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${profile.notificationPreferences[key] 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                        }
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Privacy & Security
                </h2>
                <p className="text-gray-600 text-sm">
                  Control your privacy and security settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                  value={profile.privacySettings.profileVisibility}
                  onChange={(e) => handleInputChange('privacySettings', 'profileVisibility', e.target.value)}
                >
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {[
                { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for research' },
                { key: 'analyticsOptIn', label: 'Analytics', desc: 'Help improve the app with usage data' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggle('privacySettings', key)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${profile.privacySettings[key] 
                        ? 'bg-primary' 
                        : 'bg-gray-200'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${profile.privacySettings[key] 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                        }
                      `}
                    />
                  </button>
                </div>
              ))}

              {[
                { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Add extra security to your account', section: 'accountSettings' },
                { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new sign-ins', section: 'accountSettings' }
              ].map(({ key, label, desc, section }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-600">{desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(section, key)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${profile[section][key] 
                        ? 'bg-primary' 
                        : 'bg-gray-200'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${profile[section][key] 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                        }
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Account Actions
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage your account data and settings
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={handleExportProfile}
                icon="Download"
                className="flex-1"
              >
                Export Profile Data
              </Button>
              
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                icon={showDeleteConfirm ? "AlertTriangle" : "Trash2"}
                className="flex-1"
              >
                {showDeleteConfirm ? "Confirm Delete Account" : "Delete Account"}
              </Button>
            </div>

            {showDeleteConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Delete Account</h3>
                    <p className="text-red-700 text-sm mt-1">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Save Button - Mobile Fixed */}
      {hasChanges && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-10">
          <Button
            variant="primary"
            onClick={handleSaveProfile}
            loading={saving}
            disabled={saving}
            fullWidth
            className="shadow-lg"
          >
            Save Profile Changes
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;