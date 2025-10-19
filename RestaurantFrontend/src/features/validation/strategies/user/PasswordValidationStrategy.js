import ValidationStrategy from '../ValidationStrategy';

/**
 * Password validation strategy
 * Validates password strength and format
 */
class PasswordValidationStrategy extends ValidationStrategy {
  validate(value, options = {}) {
    const {
      required = true,
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = false,
    } = options;

    // Check if required and empty
    if (required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        error: 'Password is required',
      };
    }

    // If not required and empty, it's valid
    if (!required && (!value || value.trim() === '')) {
      return { isValid: true };
    }

    // Length validation
    if (value.length < minLength) {
      return {
        isValid: false,
        error: `Password must be at least ${minLength} characters long`,
      };
    }

    // Uppercase validation
    if (requireUppercase && !/[A-Z]/.test(value)) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter',
      };
    }

    // Lowercase validation
    if (requireLowercase && !/[a-z]/.test(value)) {
      return {
        isValid: false,
        error: 'Password must contain at least one lowercase letter',
      };
    }

    // Numbers validation
    if (requireNumbers && !/\d/.test(value)) {
      return {
        isValid: false,
        error: 'Password must contain at least one number',
      };
    }

    // Special characters validation
    if (requireSpecialChars) {
      // Comprehensive special character regex including all common special characters
      const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?\/\\~`]/;
      if (!specialCharRegex.test(value)) {
        return {
          isValid: false,
          error: 'Password must contain at least one special character',
        };
      }
    }

    return { isValid: true };
  }

  getRuleName() {
    return 'PasswordValidation';
  }
}

export default PasswordValidationStrategy;
