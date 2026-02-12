// Core types for ContextTasks
export type TaskContext = 'quick' | 'focused' | 'low-energy';

export interface Task {
  id: string;
  title: string;
  context: TaskContext;
  tags: string[];
  duration: number; // in minutes
  note?: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export type AppView = 'context-picker' | 'task-list' | 'create-task' | 'dashboard' | 'settings';

export type ReminderWindow = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface ReminderSettings {
  enabled: boolean;
  window: ReminderWindow;
  lastDismissed?: number;
  lastShown?: number;
}

export interface CompletionStats {
  total: number;
  byContext: Record<TaskContext, number>;
  byDay: Record<string, number>; // ISO date string -> count
  byHour: Record<number, number>; // hour (0-23) -> count
}