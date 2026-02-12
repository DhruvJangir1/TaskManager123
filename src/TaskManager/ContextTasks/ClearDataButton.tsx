import React, { useState } from 'react';

interface ClearDataButtonProps {
  onClear: () => void;
}

export const ClearDataButton: React.FC<ClearDataButtonProps> = ({ onClear }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    onClear();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 px-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            Clear all data?
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            This will delete all your tasks and settings. This can't be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
    >
      Clear all data
    </button>
  );
};