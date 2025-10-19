import ValidationStrategy from '../ValidationStrategy';

/**
 * Universal Name validation strategy
 * Validates all types of names: first name, last name, menu name, category name, menu item name, etc.
 *
 * This strategy is designed to be flexible and reusable across all name fields in the application
 */
class NameValidationStrategy extends ValidationStrategy {
  validate(value, options = {}) {
    const {
      required = true,
      minLength = 2,
      maxLength = 100, // Increased to support longer names like menu items
      allowNumbers = false,
      allowSpecialChars = false,
      allowedSpecialChars = " -'", // Spaces, hyphens, apostrophes
      customMessage,
    } = options;

    // Check if required and empty
    if (required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        error: customMessage || 'This field is required',
      };
    }

    // If not required and empty, it's valid
    if (!required && (!value || value.trim() === '')) {
      return { isValid: true };
    }

    const trimmedValue = value.trim();

    // Length validation
    if (trimmedValue.length < minLength) {
      return {
        isValid: false,
        error: `Must be at least ${minLength} characters long`,
      };
    }

    if (trimmedValue.length > maxLength) {
      return {
        isValid: false,
        error: `Must be no more than ${maxLength} characters long`,
      };
    }

    // Numbers validation
    if (!allowNumbers && /\d/.test(trimmedValue)) {
      return {
        isValid: false,
        error: 'Names cannot contain numbers',
      };
    }

    // Special characters validation
    if (!allowSpecialChars) {
      // Allow only letters and basic punctuation
      const basicNameRegex = /^[a-zA-Z\s\-']+$/;
      if (!basicNameRegex.test(trimmedValue)) {
        return {
          isValid: false,
          error: 'Invalid characters in name',
        };
      }
    } else {
      // Allow custom special characters
      const allowedCharsRegex = new RegExp(
        `^[a-zA-Z0-9${allowedSpecialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`
      );
      if (!allowedCharsRegex.test(trimmedValue)) {
        return {
          isValid: false,
          error: `Invalid characters. Only letters, numbers, and ${allowedSpecialChars} are allowed`,
        };
      }
    }

    // Check for consecutive spaces or special characters
    if (/\s{2,}/.test(trimmedValue)) {
      return {
        isValid: false,
        error: 'Cannot have consecutive spaces',
      };
    }

    return { isValid: true };
  }

  getRuleName() {
    return 'NameValidation';
  }
}

export default NameValidationStrategy;
