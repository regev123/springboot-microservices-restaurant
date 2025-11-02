import React from 'react';

// ==================== CONSTANTS ====================

// Badge color configurations
const BADGE_COLORS = {
  BLUE: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
  },
  GREEN: {
    background: 'bg-green-100',
    text: 'text-green-800',
  },
  RED: {
    background: 'bg-red-100',
    text: 'text-red-800',
  },
  YELLOW: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  PURPLE: {
    background: 'bg-purple-100',
    text: 'text-purple-800',
  },
  INDIGO: {
    background: 'bg-indigo-100',
    text: 'text-indigo-800',
  },
  PINK: {
    background: 'bg-pink-100',
    text: 'text-pink-800',
  },
  GRAY: {
    background: 'bg-gray-100',
    text: 'text-gray-800',
  },
  ORANGE: {
    background: 'bg-orange-100',
    text: 'text-orange-800',
  },
  TEAL: {
    background: 'bg-teal-100',
    text: 'text-teal-800',
  },
};

// Default badge styles
const DEFAULT_BADGE_STYLES = 'text-xs font-medium px-2.5 py-0.5 rounded-full';

// ==================== PROP TYPES ====================
/**
 * @typedef {Object} TableBadgeProps
 * @property {string} text - Text to display in the badge
 * @property {string} color - Color variant: 'blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'pink', 'gray', 'orange', 'teal'
 * @property {string} [className=''] - Additional CSS classes
 * @property {boolean} [centered=false] - Whether to center the badge
 */

/**
 * TableBadge Component
 *
 * A reusable badge component for table cells with customizable colors.
 * Follows clean code principles and provides consistent styling across all tables.
 *
 * Features:
 * - Multiple color variants (blue, green, red, yellow, etc.)
 * - Consistent sizing and typography
 * - Optional centering
 * - Customizable with additional CSS classes
 * - Accessible and semantic markup
 *
 * @param {TableBadgeProps} props - Component props
 * @returns {JSX.Element} Table badge component
 */
const TableBadge = ({ text, color = 'blue', className = '', centered = false }) => {
  // ==================== COMPUTED VALUES ====================

  /**
   * Gets the color configuration for the specified color variant
   * @param {string} colorName - Color variant name
   * @returns {Object} Color configuration object
   */
  const getColorConfig = (colorName) => {
    const upperColor = colorName.toUpperCase();
    return BADGE_COLORS[upperColor] || BADGE_COLORS.BLUE;
  };

  const colorConfig = getColorConfig(color);

  // ==================== STYLE COMPOSITION ====================

  const badgeClasses = [DEFAULT_BADGE_STYLES, colorConfig.background, colorConfig.text, className]
    .filter(Boolean)
    .join(' ');

  const containerClasses = centered ? 'flex justify-center' : '';

  // ==================== RENDER ====================

  return (
    <div className={containerClasses}>
      <span className={badgeClasses}>{text}</span>
    </div>
  );
};

export default TableBadge;
