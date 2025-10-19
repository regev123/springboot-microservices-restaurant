import {
  EMAIL_VALIDATION_OPTIONS,
  PASSWORD_VALIDATION_OPTIONS,
  PHONE_VALIDATION_OPTIONS,
  REQUIRED_VALIDATION_OPTIONS,
} from '../../constants/user';
import { BASIC_NAME_VALIDATION_OPTIONS as NAME_OPTIONS } from '../../constants/names';

/**
 * User registration form validation configuration
 * Uses universal name validation for first and last names
 */
export const USER_REGISTRATION_VALIDATION_RULES = {
  firstName: {
    type: 'name',
    options: NAME_OPTIONS, // Uses universal name validation
  },
  lastName: {
    type: 'name',
    options: NAME_OPTIONS, // Uses universal name validation
  },
  email: {
    type: 'email',
    options: EMAIL_VALIDATION_OPTIONS,
  },
  phoneNumber: {
    type: 'phone',
    options: PHONE_VALIDATION_OPTIONS,
  },
  password: {
    type: 'password',
    options: PASSWORD_VALIDATION_OPTIONS,
  },
  confirmPassword: {
    type: 'required',
    options: REQUIRED_VALIDATION_OPTIONS,
  },
};

/**
 * User registration form initial data
 */
export const USER_REGISTRATION_INITIAL_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};
