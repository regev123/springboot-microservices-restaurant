import EmailValidationStrategy from './strategies/user/EmailValidationStrategy';
import PasswordValidationStrategy from './strategies/user/PasswordValidationStrategy';
import RequiredValidationStrategy from './strategies/common/RequiredValidationStrategy';
import PhoneValidationStrategy from './strategies/user/PhoneValidationStrategy';
import NameValidationStrategy from './strategies/common/NameValidationStrategy';

/**
 * Validation Manager - Central hub for all validation strategies
 * Implements the Strategy pattern to provide flexible validation
 */
class ValidationManager {
  constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  /**
   * Initialize all available validation strategies
   */
  initializeStrategies() {
    this.strategies.set('email', new EmailValidationStrategy());
    this.strategies.set('password', new PasswordValidationStrategy());
    this.strategies.set('required', new RequiredValidationStrategy());
    this.strategies.set('phone', new PhoneValidationStrategy());
    this.strategies.set('name', new NameValidationStrategy());
  }

  /**
   * Validate a single field with a specific strategy
   * @param {string} strategyName - The name of the validation strategy
   * @param {string} value - The value to validate
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateField(strategyName, value, options = {}) {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      console.warn(`Validation strategy '${strategyName}' not found`);
      return { isValid: true }; // Default to valid if strategy not found
    }

    return strategy.validate(value, options);
  }

  /**
   * Validate multiple fields at once
   * @param {Object} validationRules - Object with field names as keys and validation configs as values
   * @param {Object} formData - The form data to validate
   * @returns {Object} - Validation results with errors
   */
  validateForm(validationRules, formData) {
    const errors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      const fieldValue = formData[fieldName];
      const fieldErrors = [];

      // Handle single rule or array of rules
      const rulesArray = Array.isArray(rules) ? rules : [rules];

      rulesArray.forEach((rule) => {
        const result = this.validateField(rule.type, fieldValue, rule.options || {});

        if (!result.isValid) {
          fieldErrors.push(result.error);
          isValid = false;
        }
      });

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors[0]; // Take first error
      }
    });

    return {
      isValid,
      errors,
    };
  }

  /**
   * Add a custom validation strategy
   * @param {string} name - The name of the strategy
   * @param {ValidationStrategy} strategy - The strategy instance
   */
  addStrategy(name, strategy) {
    this.strategies.set(name, strategy);
  }

  /**
   * Get all available strategy names
   * @returns {Array} - Array of strategy names
   */
  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }
}

// Create singleton instance
const validationManager = new ValidationManager();

export default validationManager;
