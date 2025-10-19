import { useState, useCallback, useEffect } from 'react';
import validationManager from '../ValidationManager';

/**
 * Reusable form validation hook
 * Provides validation functionality for any form in the application
 *
 * @param {Object} validationRules - Validation rules for each field
 * @param {Object} initialFormData - Initial form data
 * @returns {Object} - Validation state and methods
 */
const useFormValidation = (validationRules = {}, initialFormData = {}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Clear validation errors when form data changes
   */
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      // Clear errors for fields that have been touched and are now valid
      const newErrors = { ...validationErrors };
      let hasChanges = false;

      Object.keys(validationErrors).forEach((fieldName) => {
        if (touchedFields[fieldName]) {
          const fieldRules = validationRules[fieldName];
          if (fieldRules) {
            const result = validationManager.validateForm({ [fieldName]: fieldRules }, formData);

            if (result.isValid || !result.errors[fieldName]) {
              delete newErrors[fieldName];
              hasChanges = true;
            }
          }
        }
      });

      if (hasChanges) {
        setValidationErrors(newErrors);
      }
    }
  }, [formData, validationErrors, touchedFields, validationRules]);

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback(
    (fieldName) => (event) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Mark field as touched
      setTouchedFields((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      // Validate field if rules exist
      const fieldRules = validationRules[fieldName];
      if (fieldRules && touchedFields[fieldName]) {
        const result = validationManager.validateForm(
          { [fieldName]: fieldRules },
          { ...formData, [fieldName]: value }
        );

        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: result.errors[fieldName] || null,
        }));
      }
    },
    [validationRules, touchedFields, formData]
  );

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const result = validationManager.validateForm(validationRules, formData);
    setValidationErrors(result.errors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach((fieldName) => {
      allTouched[fieldName] = true;
    });
    setTouchedFields(allTouched);

    return result;
  }, [validationRules, formData]);

  /**
   * Validate single field
   */
  const validateField = useCallback(
    (fieldName) => {
      const fieldRules = validationRules[fieldName];
      if (!fieldRules) return { isValid: true };

      const result = validationManager.validateForm({ [fieldName]: fieldRules }, formData);

      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: result.errors[fieldName] || null,
      }));

      setTouchedFields((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      return result;
    },
    [validationRules, formData]
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setTouchedFields({});
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    setTouchedFields({});
    setIsSubmitting(false);
  }, [initialFormData]);

  /**
   * Set form data directly (useful for programmatic updates)
   */
  const setFieldValue = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  /**
   * Check if form is valid
   */
  const isFormValid =
    Object.keys(validationErrors).length === 0 && Object.keys(validationRules).length > 0;

  return {
    // Form state
    formData,
    validationErrors,
    touchedFields,
    isSubmitting,
    isFormValid,

    // Actions
    handleInputChange,
    validateForm,
    validateField,
    clearErrors,
    resetForm,
    setFieldValue,
    setIsSubmitting,

    // Utilities
    hasError: (fieldName) => !!validationErrors[fieldName],
    getError: (fieldName) => validationErrors[fieldName] || '',
    isFieldTouched: (fieldName) => !!touchedFields[fieldName],
  };
};

export default useFormValidation;
