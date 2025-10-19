import { useState } from 'react';
import validationManager from '../ValidationManager';

/**
 * Simple validation form hook
 * Provides basic form validation functionality
 * @param {Object} validationRules - Validation rules for form fields
 * @param {Object} initialData - Initial form data
 * @returns {Object} Form state and validation methods
 */
const useValidationForm = (validationRules, initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for this field when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const result = validationManager.validateForm(validationRules, formData);
    setValidationErrors(result.errors);
    return result;
  };

  // Check if field has error
  const hasError = (fieldName) => !!validationErrors[fieldName];

  // Get error message for field
  const getError = (fieldName) => validationErrors[fieldName] || '';

  return {
    formData,
    handleInputChange,
    validateForm,
    hasError,
    getError,
  };
};

export default useValidationForm;
