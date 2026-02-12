import React from 'react';
import type { TaskContext } from './types';

interface ContextPickerProps {
  onSelectContext: (context: TaskContext) => void;
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  taskCounts: Record<TaskContext, number>;
}

export const ContextPicker: React.FC<ContextPickerProps> = ({ 
  onSelectContext,
  onOpenDashboard,
  onOpenSettings,
  taskCounts 
}) => {
  const contexts: { 
    type: TaskContext; 
    label: string; 
    description: string;
    emoji: string;
    gradient: string;
  }[] = [
    { 
      type: 'quick', 
      label: 'Quick', 
      description: '≤15 minutes', 
      emoji: '⚡',
      gradient: 'from-yellow-50 to-orange-50'
    },
    { 
      type: 'focused', 
      label: 'Focused', 
      description: 'Deep work', 
      emoji: '🎯',
      gradient: 'from-blue-50 to-indigo-50'
    },
    { 
      type: 'low-energy', 
      label: 'Low-energy', 
      description: 'Easy mode', 
      emoji: '🌙',
      gradient: 'from-purple-50 to-pink-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            What's your energy?
          </h1>
          <p className="text-slate-600 mt-1">
            Choose what fits right now
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenDashboard}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            title="Dashboard"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            title="Settings"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Context cards */}
      <div className="space-y-3">
        {contexts.map(({ type, label, description, emoji, gradient }) => {
          const count = taskCounts[type];
          return (
            <button
              key={type}
              onClick={() => onSelectContext(type)}
              className={`w-full bg-gradient-to-br ${gradient} rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-slate-300 active:scale-[0.98] group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {emoji}
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-slate-900">{label}</div>
                    <div className="text-sm text-slate-600">{description}</div>
                  </div>
                </div>
                {count > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm text-slate-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                    {count} {count === 1 ? 'task' : 'tasks'}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};