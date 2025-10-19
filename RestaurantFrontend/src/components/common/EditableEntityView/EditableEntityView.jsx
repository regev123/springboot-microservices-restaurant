import React from 'react';

/**
 * Reusable component for displaying editable entity information
 * Shows a header with entity details and can be customized for any entity type
 *
 * @param {Object} props
 * @param {string} props.title - The main title (h3)
 * @param {string} props.text - The complete descriptive text (dynamic content)
 * @param {string} props.className - Optional additional CSS classes
 * @param {Object} props.style - Optional custom styles
 * @returns {JSX.Element}
 */
const EditableEntityView = ({ title, text, className = '', style = {} }) => {
  return (
    <div
      className={`mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg ${className}`}
      style={style}
    >
      <h3 className="text-blue-400 font-semibold mb-2">{title}</h3>
      <div className="text-slate-300">{text}</div>
    </div>
  );
};

export default EditableEntityView;
