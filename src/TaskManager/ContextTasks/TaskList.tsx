import React, { useState } from 'react';
import type { Task, TaskContext } from './types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  selectedContext: TaskContext;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onAddNew: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedContext,
  onComplete,
  onEdit,
  onDelete,
  onBack,
  onAddNew
}) => {
  const [sortBy, setSortBy] = useState<'duration' | 'created'>('duration');

  const contextInfo = {
    quick: { label: 'Quick tasks', emoji: '⚡', color: 'orange' },
    focused: { label: 'Focused work', emoji: '🎯', color: 'blue' },
    'low-energy': { label: 'Easy tasks', emoji: '🌙', color: 'purple' }
  };

  const info = contextInfo[selectedContext];

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'duration') {
      return a.duration - b.duration;
    }
    return b.createdAt - a.createdAt;
  });

  // Calculate total time
  const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 text-sm flex items-center gap-1 font-medium"
          >
            ← Change context
          </button>
          <button
            onClick={onAddNew}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
          >
            + New task
          </button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{info.emoji}</span>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{info.label}</h2>
            <p className="text-sm text-slate-600">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              {totalMinutes > 0 && (
                <span className="ml-2">
                  • ~{hours > 0 ? `${hours}h ` : ''}{minutes}m total
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Sort controls */}
        {tasks.length > 1 && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSortBy('duration')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'duration'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              By duration
            </button>
            <button
              onClick={() => setSortBy('created')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'created'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Most recent
            </button>
          </div>
        )}
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <p className="text-lg text-slate-700 mb-2 font-medium">
            No {info.label.toLowerCase()} right now
          </p>
          <p className="text-sm text-slate-500">
            Your energy might be better spent elsewhere, or create a new task.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};