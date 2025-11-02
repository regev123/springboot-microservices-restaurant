import React from 'react';

// Simple reusable divider with sensible defaults and override support
const Divider = ({ className = '' }) => {
  return <div className={`w-full max-w-md border-t border-slate-700/50 ${className}`} />;
};

export default Divider;
