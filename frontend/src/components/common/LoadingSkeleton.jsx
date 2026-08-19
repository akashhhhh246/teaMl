import React from 'react';

export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 animate-pulse space-y-4"
        >
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
