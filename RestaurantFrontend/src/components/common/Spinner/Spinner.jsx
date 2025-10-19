import React from 'react';

/**
 * Modern form spinner component
 * Usage: <Spinner size="sm" />
 */
const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

/**
 * Reusable form spinner with text
 * Usage: <FormSpinner show={isSubmitting} text="Signing in..." />
 */
const FormSpinner = ({ show = false, text = 'Loading...', className = '' }) => {
  if (!show) return null;

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <div className="flex items-center gap-3 text-slate-400">
        <Spinner size="sm" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
};

export default FormSpinner;
