import React from 'react';

/**
 * DialogContent Component
 *
 * A reusable component for the content structure of confirmation dialogs.
 * Provides consistent layout for icon, title, and message.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.iconColor - CSS classes for icon color
 * @param {string} props.iconBg - CSS classes for icon background
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/description
 * @returns {JSX.Element} Dialog content component
 */
const DialogContent = ({ icon, iconColor, iconBg, title, message }) => {
  return (
    <>
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl
            flex items-center justify-center
            ${iconBg} ${iconColor}
          `}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h2 id="dialog-title" className="text-xl font-semibold text-white mb-2">
            {title}
          </h2>
          <p id="dialog-description" className="text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </>
  );
};

export default DialogContent;
