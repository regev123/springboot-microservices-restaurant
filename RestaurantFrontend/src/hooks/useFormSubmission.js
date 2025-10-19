import { useCallback, useState } from 'react';

/**
 * Custom hook for handling form submissions following SOLID principles
 *
 * Single Responsibility: Handles only form submission logic
 * Open/Closed: Extensible through configuration
 * Liskov Substitution: Can be used interchangeably with direct implementations
 * Interface Segregation: Provides only necessary methods
 * Dependency Inversion: Depends on abstractions (dispatch function)
 *
 * @param {Object} config - Configuration object
 * @param {Function} config.action - Redux action creator
 * @param {Function} config.validateForm - Form validation function
 * @returns {Object} onSubmit handler and isSubmitting state
 */
const useFormSubmission = ({ action, validateForm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate form
      const validationResult = validateForm();
      if (!validationResult.isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        await action();
        // Success and error handling is done in Redux thunks/slices
      } catch (err) {
        // Error handling is done in Redux thunks/slices
      } finally {
        setIsSubmitting(false);
      }
    },
    [action, validateForm]
  );

  return { onSubmit, isSubmitting };
};

export default useFormSubmission;
