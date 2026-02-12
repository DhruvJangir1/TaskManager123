import React from 'react';

interface ReminderBannerProps {
  taskCount: number;
  onDismiss: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({ 
  taskCount, 
  onDismiss 
}) => {
  return (
    <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
      <div className="shrink-0 text-2xl">💡</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900 mb-1">
          Tasks ready for you
        </p>
        <p className="text-sm text-blue-700">
          You have {taskCount} {taskCount === 1 ? 'task' : 'tasks'} that might match your energy right now.
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Got it
      </button>
    </div>
  );
};