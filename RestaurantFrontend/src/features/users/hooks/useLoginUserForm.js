import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../store/thunks/authThunks';

// Constants
const INITIAL_FORM_DATA = {
  email: '',
  password: '',
};

const INITIAL_ERRORS = {
  email: '',
  password: '',
};

const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email should be valid',
  },
  password: {
    required: true,
    pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/,
    message:
      'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  },
};

/**
 * Login form hook - manages form state, validation, and authentication
 * Implements validation and submission logic directly
 * @returns {Object} Form data, handlers, and state
 */
const useLoginUserForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Pattern validation (for email and password)
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      resetForm();
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors(INITIAL_ERRORS);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleLogin,
  };
};

export default useLoginUserForm;
