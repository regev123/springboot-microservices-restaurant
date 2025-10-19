import ValidationStrategy from '../ValidationStrategy';

/**
 * Email validation strategy
 * Validates email format according to standard email patterns
 */
class EmailValidationStrategy extends ValidationStrategy {
  validate(value, options = {}) {
    const { required = true } = options;

    // Check if required and empty
    if (required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        error: 'Email is required',
      };
    }

    // If not required and empty, it's valid
    if (!required && (!value || value.trim() === '')) {
      return { isValid: true };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return {
        isValid: false,
        error: 'Please enter a valid email address',
      };
    }

    return { isValid: true };
  }

  getRuleName() {
    return 'EmailValidation';
  }
}

export default EmailValidationStrategy;
