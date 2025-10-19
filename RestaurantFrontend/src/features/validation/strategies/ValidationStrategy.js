/**
 * Validation Strategy Interface
 *
 * This defines the contract for all validation strategies.
 * Each strategy implements specific validation logic for different types of inputs.
 */
class ValidationStrategy {
  /**
   * Validates the given value according to the strategy's rules
   * @param {string} value - The value to validate
   * @param {Object} options - Additional validation options (optional)
   * @returns {Object} - Validation result with isValid and error message
   */
  validate(value, options = {}) {
    throw new Error('validate method must be implemented by subclass');
  }

  /**
   * Gets the validation rule name for debugging/logging
   * @returns {string} - The name of the validation rule
   */
  getRuleName() {
    throw new Error('getRuleName method must be implemented by subclass');
  }
}

export default ValidationStrategy;
