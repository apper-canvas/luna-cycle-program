import userSettings from '../mockData/userSettings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = { ...userSettings };

const userSettingsService = {
  async get() {
    await delay(250);
    return { ...data };
  },

  async update(settings) {
    await delay(250);
    data = { ...data, ...settings, lastUpdated: new Date().toISOString() };
    return { ...data };
  },

  async reset() {
    await delay(250);
    data = {
      averageCycleLength: 28,
      reminderTime: "09:00",
      notificationsEnabled: true,
      privacyMode: false,
      fertilityMode: false,
      language: 'en',
      units: 'metric',
      theme: 'purple',
      lastUpdated: new Date().toISOString()
    };
    return { ...data };
  }
};

export default userSettingsService;