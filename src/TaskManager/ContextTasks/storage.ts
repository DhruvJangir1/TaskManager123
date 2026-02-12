// LocalStorage wrapper with analytics
import type { Task, ReminderSettings, CompletionStats } from './types';

const TASKS_KEY = 'contexttasks_tasks';
const REMINDER_KEY = 'contexttasks_reminder_settings';
const STATS_KEY = 'contexttasks_stats';

export const storage = {
  // Tasks
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  },

  updateTask(id: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      
      // Update stats if completing
      if (updates.completed && updates.completedAt) {
        this.updateStats(tasks[index]);
      }
      
      this.saveTasks(tasks);
    }
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  },

  // Reminder settings
  getReminderSettings(): ReminderSettings {
    try {
      const data = localStorage.getItem(REMINDER_KEY);
      return data ? JSON.parse(data) : { enabled: true, window: 'anytime' };
    } catch {
      return { enabled: true, window: 'anytime' };
    }
  },

  saveReminderSettings(settings: ReminderSettings): void {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  },

  // Stats
  getStats(): CompletionStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      return data ? JSON.parse(data) : {
        total: 0,
        byContext: { quick: 0, focused: 0, 'low-energy': 0 },
        byDay: {},
        byHour: {}
      };
    } catch {
      return {
        total: 0,
        byContext: { quick: 0, focused: 0, 'low-energy': 0 },
        byDay: {},
        byHour: {}
      };
    }
  },

  updateStats(task: Task): void {
    const stats = this.getStats();
    
    stats.total++;
    stats.byContext[task.context]++;
    
    if (task.completedAt) {
      const date = new Date(task.completedAt);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      stats.byDay[dayKey] = (stats.byDay[dayKey] || 0) + 1;
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
    }
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(REMINDER_KEY);
    localStorage.removeItem(STATS_KEY);
  }
};