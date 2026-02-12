import React, { useState } from 'react';
import type { TaskContext } from './types';

interface TaskInputProps {
  onSave: (title: string, context: TaskContext, duration: number, tags: string[], note?: string) => void;
  onCancel: () => void;
  initialContext?: TaskContext;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onSave, onCancel, initialContext }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState<TaskContext>(initialContext || 'quick');
  const [duration, setDuration] = useState(15);
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), context, duration, tags, note.trim() || undefined);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-slate-600 hover:text-slate-900 text-sm flex items-center gap-1 font-medium"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create task</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What needs doing?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Review Q4 budget proposal"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            autoFocus
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Energy level required
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'quick', label: '⚡ Quick', color: 'orange' },
              { value: 'focused', label: '🎯 Focused', color: 'blue' },
              { value: 'low-energy', label: '🌙 Easy', color: 'purple' }
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setContext(option.value)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  context === option.value
                    ? `bg-${option.color}-500 text-white shadow-md scale-105`
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estimated duration: <span className="font-semibold">{duration} min</span>
          </label>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tags (optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g., work, urgent"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any context that helps..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors active:scale-[0.98] shadow-lg shadow-slate-900/10"
        >
          Create task
        </button>
      </form>
    </div>
  );
};