import ValidationStrategy from '../ValidationStrategy';

/**
 * Required field validation strategy
 * Validates that a field is not empty
 */
class RequiredValidationStrategy extends ValidationStrategy {
  validate(value, options = {}) {
    const { customMessage = 'This field is required' } = options;

    if (!value || value.toString().trim() === '') {
      return {
        isValid: false,
        error: customMessage,
      };
    }

    return { isValid: true };
  }

  getRuleName() {
    return 'RequiredValidation';
  }
}

export default RequiredValidationStrategy;
