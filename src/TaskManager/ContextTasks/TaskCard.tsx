import React, { useState, useRef } from 'react';
import type { Task } from './types';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    // Only allow swipe right
    if (diff > 0 && diff < 150) {
      setSwipeX(diff);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    
    if (swipeX > 100) {
      // Complete task
      handleComplete();
    } else {
      // Reset
      setSwipeX(0);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(task.id);
    }, 400);
  };

  const contextColors = {
    quick: 'bg-orange-100 text-orange-700',
    focused: 'bg-blue-100 text-blue-700',
    'low-energy': 'bg-purple-100 text-purple-700'
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-sm border border-slate-200 transition-all duration-400 ${
        isCompleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ transform: `translateX(${swipeX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe background indicator */}
      {swipeX > 0 && (
        <div 
          className="absolute inset-y-0 left-0 bg-green-500 rounded-l-2xl flex items-center pl-4 pr-2"
          style={{ width: `${swipeX}px` }}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="p-5 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 break-words mb-2">
              {task.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${contextColors[task.context]}`}>
                {task.context}
              </span>
              <span className="text-xs text-slate-500">
                ~{task.duration} min
              </span>
              {task.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {task.note && (
              <p className="text-sm text-slate-600 break-words">{task.note}</p>
            )}
          </div>

          <button
            onClick={() => setShowActions(!showActions)}
            className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Complete
            </button>
            <button
              onClick={() => onEdit(task)}
              className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 bg-red-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        )}

        {/* Swipe hint */}
        {swipeX === 0 && (
          <div className="mt-3 text-xs text-slate-400 text-center">
            Swipe right or tap menu to complete
          </div>
        )}
      </div>
    </div>
  );
};