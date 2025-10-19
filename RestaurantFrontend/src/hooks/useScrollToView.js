import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling to a specific element
 * Provides a reusable scroll-to-view functionality across the application
 *
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('smooth', 'instant', 'auto')
 * @param {string} options.block - Vertical alignment ('start', 'center', 'end', 'nearest')
 * @param {string} options.inline - Horizontal alignment ('start', 'center', 'end', 'nearest')
 * @param {number} options.delay - Delay in milliseconds before scrolling
 * @returns {Function} scrollToView function
 */
const useScrollToView = (options = {}) => {
  const { behavior = 'smooth', block = 'start', inline = 'nearest', delay = 100 } = options;

  /**
   * Scrolls to the specified element
   * @param {React.RefObject|HTMLElement|null} elementRef - Reference to the element to scroll to
   */
  const scrollToView = useCallback(
    (elementRef) => {
      const element = elementRef?.current || elementRef;

      if (!element) {
        console.warn('useScrollToView: Element reference is null or undefined');
        return;
      }

      if (typeof element.scrollIntoView !== 'function') {
        console.warn('useScrollToView: Element does not have scrollIntoView method', element);
        return;
      }

      if (delay > 0) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior,
            block,
            inline,
          });
        }, delay);
      } else {
        element.scrollIntoView({
          behavior,
          block,
          inline,
        });
      }
    },
    [behavior, block, inline, delay]
  );

  return scrollToView;
};

export default useScrollToView;
