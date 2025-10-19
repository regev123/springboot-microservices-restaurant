import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 p-8 transition-all duration-300 hover:shadow-3xl hover:shadow-primary-500/10 hover:border-primary-500/30 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
