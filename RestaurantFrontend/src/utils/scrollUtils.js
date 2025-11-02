/**
 * Scrolls to the top of the page (position 0)
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Scrolls to the form section (window.innerHeight * 1.1)
 */
export const scrollToFormSection = () => {
  const scrollPosition = window.innerHeight * 1.1;
  window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
};
