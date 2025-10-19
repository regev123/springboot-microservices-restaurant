import { EMAIL_VALIDATION_OPTIONS, PASSWORD_VALIDATION_OPTIONS } from '../../constants/user';

/**
 * Login form validation configuration
 * Defines validation rules for the login form using the strategy pattern
 */
export const LOGIN_VALIDATION_RULES = {
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
 * Login form initial data
 */
export const LOGIN_INITIAL_DATA = {
  email: '',
  password: '',
};
