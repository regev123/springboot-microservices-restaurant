import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../store/thunks/authThunks';
import { NAVIGATION_LINKS } from '../../../constants';
import useValidationForm from '../../validation/hooks/useValidationForm';
import useFormSubmission from '../../../hooks/useFormSubmission';
import {
  CHANGE_PASSWORD_VALIDATION_RULES,
  CHANGE_PASSWORD_INITIAL_DATA,
} from '../../validation/configs/user/changePasswordValidationConfig';

/**
 * Change password form hook - manages form state, validation, and password change
 * Implements validation and submission logic using clean hooks
 * @returns {Object} Form data, handlers, and state
 */
const useChangePasswordForm = () => {
  const dispatch = useDispatch();

  // Use validation form hook
  const { formData, handleInputChange, validateForm, hasError, getError } = useValidationForm(
    CHANGE_PASSWORD_VALIDATION_RULES,
    CHANGE_PASSWORD_INITIAL_DATA
  );

  // Use form submission hook
  const { onSubmit, isSubmitting } = useFormSubmission({
    action: () => dispatch(changePassword(formData)).unwrap(),
    validateForm,
  });

  // Navigation links
  const navigationLinks = useMemo(() => [NAVIGATION_LINKS.AUTH.BACK_TO_LOGIN], []);

  return {
    formData,
    handleInputChange,
    onSubmit,
    isSubmitting,
    navigationLinks,
    hasError,
    getError,
  };
};

export default useChangePasswordForm;
