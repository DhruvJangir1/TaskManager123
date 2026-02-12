import { useState, useEffect } from 'react';
import { ContextPicker } from '../taskmanagerapp/src/TaskManager/ContextTasks/ContextPicker';
import { TaskInput } from '../taskmanagerapp/src/TaskManager/ContextTasks/TaskInput';
import { TaskList } from '../taskmanagerapp/src/TaskManager/ContextTasks/TaskList';
import { ReminderBanner } from '../taskmanagerapp/src/TaskManager/ContextTasks/ReminderBanner';
import { Dashboard } from '../taskmanagerapp/src/TaskManager/ContextTasks/DashBoard';
import { EditTaskModal } from '../taskmanagerapp/src/TaskManager/ContextTasks/EditTaskModal';
import { SettingsModal } from '../taskmanagerapp/src/TaskManager/ContextTasks/SettingsModal';
import { storage } from '../taskmanagerapp/src/TaskManager/ContextTasks/storage';
import type { Task,ReminderSettings, TaskContext, AppView } from '../taskmanagerapp/src/TaskManager/ContextTasks/types';

// cd "C:/Users/User/react project/my-react-app"
function App() {
  const [view, setView] = useState<AppView>('context-picker');
  const [selectedContext, setSelectedContext] = useState<TaskContext | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showReminder, setShowReminder] = useState(false);
  const [completionMessage, setCompletionMessage] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load tasks on mount
 useEffect(() => {
  const tasksFromStorage = storage.getTasks();
  // Defer state update
  setTimeout(() => setTasks(tasksFromStorage), 0);
}, []);
  // Check if reminder should show
  useEffect(() => {
    const reminderSettings = storage.getReminderSettings();
    if (!reminderSettings.enabled || view !== 'context-picker') return;

    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) return;

    // Check time window
    const now = new Date();
    const hour = now.getHours();
    const matchesWindow = 
      reminderSettings.window === 'anytime' ||
      (reminderSettings.window === 'morning' && hour >= 6 && hour < 12) ||
      (reminderSettings.window === 'afternoon' && hour >= 12 && hour < 18) ||
      (reminderSettings.window === 'evening' && hour >= 18 && hour < 24);

    if (!matchesWindow) return;

    // Check if we should show (12 hours since last dismissed)
    const twelveHoursAgo = Date.now() - (12 * 60 * 60 * 1000);
    const canShow = !reminderSettings.lastDismissed || reminderSettings.lastDismissed < twelveHoursAgo;

    if (canShow) {
  setTimeout(() => setShowReminder(true), 0);
}
  }, [tasks, view]);

  const getActiveTasks = () => {
    if (!selectedContext) return [];
    return tasks.filter(t => !t.completed && t.context === selectedContext);
  };

  const getTaskCounts = () => {
    const counts = { quick: 0, focused: 0, 'low-energy': 0 };
    tasks.forEach(task => {
      if (!task.completed) {
        counts[task.context]++;
      }
    });
    return counts;
  };

  const handleSelectContext = (context: TaskContext) => {
    setSelectedContext(context);
    setView('task-list');
  };

  const handleAddTask = (title: string, context: TaskContext, duration: number, tags: string[], note?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      context,
      duration,
      tags,
      note,
      completed: false,
      createdAt: Date.now()
    };
    storage.addTask(newTask);
    setTasks(storage.getTasks());
    setView('task-list');
  };

  const handleCompleteTask = (id: string) => {
    storage.updateTask(id, { 
      completed: true, 
      completedAt: Date.now() 
    });
    setTasks(storage.getTasks());
    
    setCompletionMessage(true);
    setTimeout(() => setCompletionMessage(false), 2000);
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    storage.updateTask(id, updates);
    setTasks(storage.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Delete this task?')) {
      storage.deleteTask(id);
      setTasks(storage.getTasks());
    }
  };

  const handleDismissReminder = () => {
    setShowReminder(false);
    const settings = storage.getReminderSettings();
    storage.saveReminderSettings({
      ...settings,
      lastDismissed: Date.now()
    });
  };

  const handleSaveSettings = (settings:ReminderSettings) => {
    storage.saveReminderSettings(settings);
  };

  const handleClearAll = () => {
    storage.clearAll();
    setTasks([]);
    setView('context-picker');
    setSelectedContext(null);
    setShowReminder(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {view === 'context-picker' && (
          <>
            {showReminder && (
              <ReminderBanner
                taskCount={tasks.filter(t => !t.completed).length}
                onDismiss={handleDismissReminder}
              />
            )}
            <ContextPicker 
              onSelectContext={handleSelectContext}
              onOpenDashboard={() => setView('dashboard')}
              onOpenSettings={() => setShowSettings(true)}
              taskCounts={getTaskCounts()}
            />
          </>
        )}

        {view === 'task-list' && selectedContext && (
          <TaskList
            tasks={getActiveTasks()}
            selectedContext={selectedContext}
            onComplete={handleCompleteTask}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onBack={() => setView('context-picker')}
            onAddNew={() => setView('create-task')}
          />
        )}

        {view === 'create-task' && (
          <TaskInput
            onSave={handleAddTask}
            onCancel={() => setView('task-list')}
            initialContext={selectedContext || undefined}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            stats={storage.getStats()}
            onClose={() => setView('context-picker')}
          />
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onSave={handleEditTask}
            onClose={() => setEditingTask(null)}
          />
        )}

        {showSettings && (
          <SettingsModal
            settings={storage.getReminderSettings()}
            onSave={handleSaveSettings}
            onClearAll={handleClearAll}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>

      {completionMessage && (
        <div className="fixed inset-0 flex items-center justify-center px-4 pointer-events-none z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl animate-fade-in-out border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl">✓</div>
              <p className="text-lg font-semibold text-slate-900">
                Task completed!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;