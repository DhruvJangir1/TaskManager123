import React, { useState } from 'react';
import type { ReminderSettings, ReminderWindow } from './types';

interface SettingsModalProps {
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  settings, 
  onSave, 
  onClearAll,
  onClose 
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [window, setWindow] = useState(settings.window);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    onSave({ ...settings, enabled, window });
    onClose();
  };

  const handleClear = () => {
    onClearAll();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Settings</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Reminders toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                In-app reminders
              </label>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  enabled ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Get gentle reminders when you have tasks available
            </p>
          </div>

          {/* Reminder window */}
          {enabled && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Preferred reminder time
              </label>
              <div className="space-y-2">
                {([
                  { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
                  { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
                  { value: 'evening', label: 'Evening (6 PM - 12 AM)' },
                  { value: 'anytime', label: 'Anytime' }
                ] as const).map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      value={option.value}
                      checked={window === option.value}
                      onChange={(e) => setWindow(e.target.value as ReminderWindow)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Clear all data */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">Danger zone</p>
            <p className="text-xs text-slate-500 mb-3">
              This will permanently delete all your tasks, settings, and statistics.
            </p>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Clear all data
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-700">Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium"
                  >
                    Yes, delete all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold shadow-lg shadow-slate-900/10"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
};