import React from 'react';
import './Toggle.css';

const Toggle = ({
  checked,
  onChange,
  title,
  subtitle,
  id,
  disabled = false,
  size = 'medium', // small, medium, large
  variant = 'default', // default, success, warning, danger
  className = '',
}) => {
  // Generate unique ID if not provided
  const toggleId = id || `toggle-${Date.now()}`;

  return (
    <div className={`toggle-container ${size} ${variant} ${className}`}>
      <div className="toggle-wrapper">
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="toggle-input"
        />
        <label htmlFor={toggleId} className="toggle-label">
          <span className="toggle-slider"></span>
          {(title || subtitle) && (
            <span className="toggle-text">
              {title && <span className="toggle-title">{title}</span>}
              {subtitle && <span className="toggle-subtitle">{subtitle}</span>}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default Toggle;
