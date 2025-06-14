import userSettings from '../mockData/userSettings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = { ...userSettings };

const userSettingsService = {
  async get() {
    await delay(200);
    return { ...data };
  },

  async update(updates) {
    await delay(300);
    data = { ...data, ...updates };
    return { ...data };
  },

async reset() {
    await delay(250);
    data = {
      averageCycleLength: 28,
      reminderTime: "09:00",
      notificationsEnabled: true,
      privacyMode: false,
      fertilityMode: false
    };
    return { ...data };
  }
};

export default userSettingsService;