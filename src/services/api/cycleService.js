import cycles from '../mockData/cycles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...cycles];

const cycleService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const cycle = data.find(item => item.id === id);
    if (!cycle) throw new Error('Cycle not found');
    return { ...cycle };
  },

  async getCurrent() {
    await delay(250);
    const now = new Date();
    const currentCycle = data.find(cycle => {
      const start = new Date(cycle.startDate);
      const end = cycle.endDate ? new Date(cycle.endDate) : new Date(start.getTime() + (cycle.length * 24 * 60 * 60 * 1000));
      return now >= start && now <= end;
    });
    return currentCycle ? { ...currentCycle } : null;
  },

  async create(cycle) {
    await delay(400);
    const newCycle = {
      ...cycle,
      id: Date.now().toString()
    };
    data.push(newCycle);
    return { ...newCycle };
  },

  async update(id, updates) {
    await delay(350);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cycle not found');
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Cycle not found');
    data.splice(index, 1);
    return { success: true };
  },

  async getRecent(count = 6) {
    await delay(200);
    return [...data]
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, count)
      .map(cycle => ({ ...cycle }));
  }
};

export default cycleService;