import { EMAIL_VALIDATION_OPTIONS, PASSWORD_VALIDATION_OPTIONS } from '../../constants/user';

/**
 * Change password form validation configuration
 * Defines validation rules for the change password form using the strategy pattern
 * Aligned with backend ChangePasswordRequest.java DTO
 */
export const CHANGE_PASSWORD_VALIDATION_RULES = {
  email: {
    type: 'email',
    options: EMAIL_VALIDATION_OPTIONS,
  },
  oldPassword: {
    type: 'password',
    options: PASSWORD_VALIDATION_OPTIONS,
  },
  newPassword: {
    type: 'password',
    options: PASSWORD_VALIDATION_OPTIONS,
  },
};

/**
 * Change password form initial data
 * Aligned with backend ChangePasswordRequest.java DTO
 */
export const CHANGE_PASSWORD_INITIAL_DATA = {
  email: '',
  oldPassword: '',
  newPassword: '',
};
