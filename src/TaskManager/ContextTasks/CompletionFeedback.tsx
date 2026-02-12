import React, { useEffect } from 'react';

interface CompletionFeedbackProps {
  onDismiss: () => void;
}

export const CompletionFeedback: React.FC<CompletionFeedbackProps> = ({ onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 px-4 z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm">
        <p className="text-lg text-slate-800 text-center">
          Nice. That fit your energy.
        </p>
      </div>
    </div>
  );
};