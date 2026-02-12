import React from 'react';
import type { Task } from './types.ts';

interface CompletedTodayProps {
  tasks: Task[];
}

export const CompletedToday: React.FC<CompletedTodayProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h3 className="text-sm font-medium text-slate-600 mb-3">
        Completed today
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="bg-slate-50 rounded-xl p-3 border border-slate-100"
          >
            <p className="text-sm text-slate-600 line-through">{task.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};