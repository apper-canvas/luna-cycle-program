import cycleEntries from '../mockData/cycleEntries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...cycleEntries];

const cycleEntryService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const entry = data.find(item => item.id === id);
    if (!entry) throw new Error('Cycle entry not found');
    return { ...entry };
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return data.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    }).map(entry => ({ ...entry }));
  },

  async create(entry) {
    await delay(400);
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: entry.date || new Date().toISOString().split('T')[0]
    };
    data.push(newEntry);
    return { ...newEntry };
  },

  async update(id, updates) {
    await delay(350);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cycle entry not found');
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cycle entry not found');
    data.splice(index, 1);
    return { success: true };
  },

  async getRecent(days = 30) {
    await delay(200);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return data.filter(entry => new Date(entry.date) >= cutoffDate)
               .map(entry => ({ ...entry }))
               .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};

export default cycleEntryService;