// src/components/common/ToggleCard/ToggleCard.jsx
import React from 'react';
import Toggle from '../Toggle/Toggle';

/**
 * Reusable ToggleCard Component
 * A card-style toggle component with title, description, and toggle functionality
 *
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the toggle is checked/on
 * @param {Function} props.onChange - Callback function when toggle state changes
 * @param {string} props.title - Title text for the toggle card
 * @param {string} props.description - Description text for the toggle card
 * @param {string} props.size - Toggle size: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.variant - Toggle color variant: 'primary', 'success', 'warning', 'danger' (default: 'success')
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.className - Additional CSS classes for the card container
 * @param {string} props.titleClassName - Additional CSS classes for the title
 * @param {string} props.descriptionClassName - Additional CSS classes for the description
 * @param {string} props.id - HTML id attribute
 * @param {string} props.ariaLabel - Accessibility label for the toggle
 * @param {Object} props.style - Inline styles for the card container
 * @param {boolean} props.clickable - Whether the entire card is clickable (default: true)
 * @param {string} props.checkedTitleColor - Color class for title when checked (default: 'text-green-400')
 * @param {string} props.uncheckedTitleColor - Color class for title when unchecked (default: 'text-white')
 * @param {string} props.checkedDescriptionColor - Color class for description when checked (default: 'text-green-300')
 * @param {string} props.uncheckedDescriptionColor - Color class for description when unchecked (default: 'text-red-300')
 * @param {string} props.checkedBorderColor - Border color when checked (default: 'border-green-500')
 * @param {string} props.uncheckedBorderColor - Border color when unchecked (default: '')
 */
const ToggleCard = ({
  checked = false,
  onChange,
  title,
  description,
  size = 'medium',
  variant = 'success',
  disabled = false,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  id,
  ariaLabel,
  style,
  clickable = true,
  checkedTitleColor = 'text-green-400',
  uncheckedTitleColor = 'text-white',
  checkedDescriptionColor = 'text-green-300',
  uncheckedDescriptionColor = 'text-red-300',
  checkedBorderColor = 'border-green-500',
  uncheckedBorderColor = '',
  ...props
}) => {
  const handleCardClick = () => {
    if (clickable && !disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      id={id}
      className={`
        bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 transition-all duration-200
        ${clickable ? 'cursor-pointer hover:bg-slate-800/40' : ''}
        ${checked ? checkedBorderColor : uncheckedBorderColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable && !disabled ? 0 : -1}
      role={clickable ? 'button' : undefined}
      aria-pressed={clickable ? checked : undefined}
      aria-label={ariaLabel}
      style={style}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {title && (
            <h4
              className={`
                font-semibold text-sm transition-colors duration-200
                ${checked ? checkedTitleColor : uncheckedTitleColor}
                ${titleClassName}
              `.trim()}
            >
              {title}
            </h4>
          )}
          {description && (
            <p
              className={`
                text-xs mt-0.5 transition-colors duration-200
                ${checked ? checkedDescriptionColor : uncheckedDescriptionColor}
                ${descriptionClassName}
              `.trim()}
            >
              {description}
            </p>
          )}
        </div>
        <div className="ml-4">
          <Toggle
            checked={checked}
            onChange={onChange}
            size={size}
            variant={variant}
            disabled={disabled}
            ariaLabel={ariaLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default ToggleCard;
