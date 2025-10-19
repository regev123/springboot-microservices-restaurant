/**
 * Name validation constants for all types of names in the application
 * Provides reusable validation options for different name fields
 */

/**
 * Basic name validation (first name, last name)
 * Simple names with basic requirements
 */
export const BASIC_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 2,
  maxLength: 50,
  allowNumbers: false,
  allowSpecialChars: false,
};

/**
 * Extended name validation (menu name, category name)
 * Allows slightly more flexibility for business names
 */
export const EXTENDED_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 2,
  maxLength: 100,
  allowNumbers: false,
  allowSpecialChars: true,
  allowedSpecialChars: " -'&.",
};

/**
 * Menu item name validation
 * Allows more flexibility for creative menu item names
 */
export const MENU_ITEM_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 3,
  maxLength: 100,
  allowNumbers: true,
  allowSpecialChars: true,
  allowedSpecialChars: " -'&.,()",
};

/**
 * Category name validation
 * Simple category names with basic requirements
 */
export const CATEGORY_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 2,
  maxLength: 50,
  allowNumbers: false,
  allowSpecialChars: true,
  allowedSpecialChars: " -'",
};

/**
 * Table name validation (for table names/numbers)
 * Allows numbers and basic formatting
 */
export const TABLE_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 1,
  maxLength: 20,
  allowNumbers: true,
  allowSpecialChars: true,
  allowedSpecialChars: ' -',
};

/**
 * Generic name validation (fallback for any name field)
 * Balanced options that work for most name fields
 */
export const GENERIC_NAME_VALIDATION_OPTIONS = {
  required: true,
  minLength: 2,
  maxLength: 100,
  allowNumbers: false,
  allowSpecialChars: true,
  allowedSpecialChars: " -'",
};
