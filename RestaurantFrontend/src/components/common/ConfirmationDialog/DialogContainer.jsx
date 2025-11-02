import React from 'react';

/**
 * DialogContainer Component
 *
 * A reusable component for the dialog container structure including backdrop and dialog wrapper.
 * Provides consistent styling and layout for modal dialogs.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the dialog
 * @param {Function} props.onBackdropClick - Function to call when backdrop is clicked
 * @param {string} props.borderColor - CSS classes for dialog border color
 * @param {string} props.className - Additional CSS classes for the dialog
 * @returns {JSX.Element} Dialog container component
 */
const DialogContainer = ({ children, onBackdropClick, borderColor, className = '' }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />

      {/* Dialog */}
      <div
        className={`
          relative w-full max-w-md
          bg-slate-800/90 backdrop-blur-xl
          border border-slate-700/50 ${borderColor}
          rounded-2xl shadow-2xl shadow-black/50
          transform transition-all duration-300 ease-out
          animate-in fade-in-0 zoom-in-95
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        style={{
          position: 'relative',
          zIndex: 10000,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default DialogContainer;
