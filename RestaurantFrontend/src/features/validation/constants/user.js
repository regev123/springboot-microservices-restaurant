/**
 * Shared validation constants and configurations
 * Provides reusable validation options across the entire application
 */

/**
 * Standard email validation options
 */
export const EMAIL_VALIDATION_OPTIONS = {
  required: true,
};

/**
 * Standard password validation options
 * Matches backend password requirements across all services
 */
export const PASSWORD_VALIDATION_OPTIONS = {
  required: true,
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Phone number validation options
 * Israeli mobile phone: exactly 10 digits starting with "05"
 * Examples: 0501234567, 0523456789, 0539876543
 */
export const PHONE_VALIDATION_OPTIONS = {
  required: true,
  exactLength: 10,
  mustStartWith: '05',
};
