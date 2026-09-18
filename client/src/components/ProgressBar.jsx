import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressBar({ progress, statusMessage }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center animate-fade-in">
      
      <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Loader2 className="w-6 h-6 animate-spin stroke-[2.5]" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">
        {statusMessage || 'Processing your document...'}
      </h4>
      
      <p className="text-xs text-slate-400 mb-6">
        Please do not close this window while conversion is running.
      </p>

      {/* Progress Track */}
      <div className="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider">
        {progress}%
      </div>

    </div>
  );
}
