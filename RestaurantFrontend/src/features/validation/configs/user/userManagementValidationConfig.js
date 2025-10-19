import {
  EMAIL_VALIDATION_OPTIONS,
  PASSWORD_VALIDATION_OPTIONS,
  PHONE_VALIDATION_OPTIONS,
} from '../../constants/user';
import { REQUIRED_VALIDATION_OPTIONS } from '../../constants/common';
import { BASIC_NAME_VALIDATION_OPTIONS } from '../../constants/names';

/**
 * User management validation configurations
 * Defines validation rules for both new user creation and user editing
 */

/**
 * Base validation rules that are common to both new and edit user forms
 */
const BASE_USER_VALIDATION_RULES = {
  firstName: {
    type: 'name',
    options: BASIC_NAME_VALIDATION_OPTIONS,
  },
  lastName: {
    type: 'name',
    options: BASIC_NAME_VALIDATION_OPTIONS,
  },
  phoneNumber: {
    type: 'phone',
    options: PHONE_VALIDATION_OPTIONS,
  },
  role: {
    type: 'required',
    options: REQUIRED_VALIDATION_OPTIONS,
  },
};

/**
 * Additional validation rules for new user creation (email and password)
 */
const NEW_USER_ADDITIONAL_RULES = {
  email: {
    type: 'email',
    options: EMAIL_VALIDATION_OPTIONS,
  },
  password: {
    type: 'password',
    options: PASSWORD_VALIDATION_OPTIONS,
  },
};

/**
 * New user validation rules (base + additional)
 */
export const NEW_USER_VALIDATION_RULES = {
  ...BASE_USER_VALIDATION_RULES,
  ...NEW_USER_ADDITIONAL_RULES,
};

/**
 * Edit user validation rules (only base rules - no email/password)
 */
export const EDIT_USER_VALIDATION_RULES = {
  ...BASE_USER_VALIDATION_RULES,
};

/**
 * Base initial data that is common to both forms
 */
const BASE_USER_INITIAL_DATA = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: '',
};

/**
 * Additional initial data for new user creation
 */
const NEW_USER_ADDITIONAL_DATA = {
  email: '',
  password: '',
};

/**
 * New user form initial data (base + additional)
 */
export const NEW_USER_INITIAL_DATA = {
  ...BASE_USER_INITIAL_DATA,
  ...NEW_USER_ADDITIONAL_DATA,
};

/**
 * Edit user form initial data (only base data)
 */
export const EDIT_USER_INITIAL_DATA = {
  ...BASE_USER_INITIAL_DATA,
};
