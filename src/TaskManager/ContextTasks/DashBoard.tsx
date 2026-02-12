import React from 'react';
import type { CompletionStats, TaskContext } from './types';

interface DashboardProps {
  stats: CompletionStats;
  onClose: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onClose }) => {
  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const maxDayCount = Math.max(...last7Days.map(day => stats.byDay[day] || 0), 1);

  // Peak hours
  const hourEntries = Object.entries(stats.byHour).map(([hour, count]) => ({
    hour: parseInt(hour),
    count
  }));
  hourEntries.sort((a, b) => b.count - a.count);
  const topHours = hourEntries.slice(0, 3);

  const contextColors: Record<TaskContext, string> = {
    quick: 'bg-orange-500',
    focused: 'bg-blue-500',
    'low-energy': 'bg-purple-500'
  };

  const contextLabels: Record<TaskContext, string> = {
    quick: 'Quick',
    focused: 'Focused',
    'low-energy': 'Low-energy'
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Your insights</h2>
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          Close
        </button>
      </div>

      {/* Total completed */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
        <div className="text-4xl font-bold text-green-700 mb-1">
          {stats.total}
        </div>
        <div className="text-sm text-green-600 font-medium">
          Total tasks completed
        </div>
      </div>

      {/* By context */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Tasks by energy level</h3>
        <div className="space-y-3">
          {(Object.keys(stats.byContext) as TaskContext[]).map(context => {
            const count = stats.byContext[context];
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={context}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {contextLabels[context]}
                  </span>
                  <span className="text-sm text-slate-600">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${contextColors[context]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last 7 days heatmap */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Last 7 days</h3>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map(day => {
            const count = stats.byDay[day] || 0;
            const intensity = maxDayCount > 0 ? (count / maxDayCount) : 0;
            const date = new Date(day);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            
            return (
              <div key={day} className="text-center">
                <div 
                  className={`aspect-square rounded-lg mb-1 flex items-center justify-center text-xs font-semibold transition-all ${
                    count === 0 
                      ? 'bg-slate-100 text-slate-400' 
                      : intensity > 0.7 
                        ? 'bg-green-600 text-white'
                        : intensity > 0.4
                          ? 'bg-green-400 text-white'
                          : 'bg-green-200 text-green-800'
                  }`}
                  title={`${count} tasks on ${day}`}
                >
                  {count}
                </div>
                <div className="text-xs text-slate-500">{dayName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peak hours */}
      {topHours.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Your peak hours</h3>
          <div className="space-y-2">
            {topHours.map(({ hour, count }) => {
              const time = `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
              return (
                <div key={hour} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm font-medium text-slate-700">{time}</span>
                  <span className="text-sm text-slate-600">{count} completed</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};