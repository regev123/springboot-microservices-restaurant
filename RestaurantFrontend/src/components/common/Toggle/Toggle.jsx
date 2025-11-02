// src/components/common/Toggle/Toggle.jsx
import React from 'react';

/**
 * Reusable Toggle Component
 * A customizable toggle switch component with smooth animations
 *
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the toggle is checked/on
 * @param {Function} props.onChange - Callback function when toggle state changes
 * @param {string} props.size - Size variant: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.variant - Color variant: 'primary', 'success', 'warning', 'danger' (default: 'primary')
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - HTML id attribute
 * @param {string} props.ariaLabel - Accessibility label
 * @param {Object} props.style - Inline styles
 */
const Toggle = ({
  checked = false,
  onChange,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className = '',
  id,
  ariaLabel,
  style,
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      position: 'top-0.5',
    },
    medium: {
      container: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
      position: 'top-0.5',
    },
    large: {
      container: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
      position: 'top-0.5',
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      checked: 'bg-blue-500',
      unchecked: 'bg-slate-600 hover:bg-slate-500',
      shadow: 'shadow-blue-500/30',
    },
    success: {
      checked: 'bg-green-500',
      unchecked: 'bg-slate-600 hover:bg-slate-500',
      shadow: 'shadow-green-500/30',
    },
    warning: {
      checked: 'bg-yellow-500',
      unchecked: 'bg-slate-600 hover:bg-slate-500',
      shadow: 'shadow-yellow-500/30',
    },
    danger: {
      checked: 'bg-red-500',
      unchecked: 'bg-slate-600 hover:bg-slate-500',
      shadow: 'shadow-red-500/30',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const currentVariant = variantConfig[variant] || variantConfig.primary;

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      id={id}
      className={`
        relative rounded-full cursor-pointer transition-all duration-200
        ${currentSize.container}
        ${checked ? currentVariant.checked : currentVariant.unchecked}
        ${checked && currentVariant.shadow ? `shadow-lg ${currentVariant.shadow}` : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={style}
      {...props}
    >
      <div
        className={`
          absolute bg-white rounded-full transition-all duration-200
          ${currentSize.thumb}
          ${currentSize.position}
          ${checked ? currentSize.translate : 'translate-x-0.5'}
        `.trim()}
      />
    </div>
  );
};

export default Toggle;
