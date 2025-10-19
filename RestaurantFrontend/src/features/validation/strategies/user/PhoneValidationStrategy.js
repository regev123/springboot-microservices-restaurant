import ValidationStrategy from '../ValidationStrategy';

/**
 * Phone number validation strategy
 * Configurable validation for phone numbers with explicit options
 * Supports exact length and prefix requirements
 */
class PhoneValidationStrategy extends ValidationStrategy {
  validate(value, options = {}) {
    const { required = true, exactLength = 10, mustStartWith = '05' } = options;

    // Check if required and empty
    if (required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        error: 'Phone number is required',
      };
    }

    // Check if phone number contains only digits
    if (!/^\d+$/.test(value)) {
      return {
        isValid: false,
        error: 'Phone number must contain only digits',
      };
    }

    // Phone number validation using explicit options
    if (value.length !== exactLength) {
      return {
        isValid: false,
        error: `Phone number must be exactly ${exactLength} digits`,
      };
    }

    if (!value.startsWith(mustStartWith)) {
      return {
        isValid: false,
        error: `Phone number must start with "${mustStartWith}"`,
      };
    }

    return { isValid: true };
  }

  getRuleName() {
    return 'PhoneValidation';
  }
}

export default PhoneValidationStrategy;
