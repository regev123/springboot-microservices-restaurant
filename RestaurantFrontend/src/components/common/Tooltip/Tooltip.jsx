import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modern Tooltip Component
 *
 * A reusable tooltip with arrow pointer and dark theme.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Element that triggers the tooltip
 * @param {string} props.content - Tooltip text content
 * @param {string} [props.position='top'] - Position: 'top', 'bottom', 'left', 'right'
 * @param {string} [props.className=''] - Additional classes for the wrapper
 */
const Tooltip = ({ children, content, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({});
  const triggerRef = useRef(null);

  // Calculate tooltip position based on trigger element
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top, left;

      switch (position) {
        case 'top':
          top = rect.top + window.scrollY - 8;
          left = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + window.scrollY + 8;
          left = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'left':
          top = rect.top + window.scrollY + rect.height / 2;
          left = rect.left + window.scrollX - 8;
          break;
        case 'right':
          top = rect.top + window.scrollY + rect.height / 2;
          left = rect.right + window.scrollX + 8;
          break;
        default:
          top = rect.top + window.scrollY - 8;
          left = rect.left + window.scrollX + rect.width / 2;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  // Position-specific styles for arrow
  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900';
    }
  };

  const getTooltipTransform = () => {
    switch (position) {
      case 'top':
        return '-translate-x-1/2 -translate-y-full';
      case 'bottom':
        return '-translate-x-1/2';
      case 'left':
        return '-translate-x-full -translate-y-1/2';
      case 'right':
        return '-translate-y-1/2';
      default:
        return '-translate-x-1/2 -translate-y-full';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-flex ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible &&
        content &&
        createPortal(
          <div
            className={`
            absolute px-4 py-3 text-sm text-white bg-slate-900 rounded-lg shadow-2xl
            pointer-events-none
            animate-in fade-in duration-200
            ${getTooltipTransform()}
          `}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: '250px',
              zIndex: 9999,
            }}
          >
            {content}
            {/* Arrow */}
            <div
              className={`
              absolute w-0 h-0 border-4
              ${getArrowStyles()}
            `}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
