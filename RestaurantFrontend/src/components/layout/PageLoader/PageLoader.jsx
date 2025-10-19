import React from 'react';

/**
 * Modern full-viewport loader with black theme
 * Usage:
 *   <PageLoader show={loading} text="Loading..." />
 */
const PageLoader = ({ show = false, text = 'Loading...' }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50 flex flex-col items-center gap-6 min-w-[280px]">
        {/* Modern Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-700/50 rounded-full animate-spin border-t-blue-500"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin border-t-blue-400/70"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="text-white font-semibold text-lg tracking-wide">{text}</div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
