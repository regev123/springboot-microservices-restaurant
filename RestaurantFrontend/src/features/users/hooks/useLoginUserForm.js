import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../store/thunks/authThunks';
import { NAVIGATION_LINKS } from '../../../constants';
import useValidationForm from '../../validation/hooks/useValidationForm';
import useFormSubmission from '../../../hooks/useFormSubmission';
import {
  LOGIN_VALIDATION_RULES,
  LOGIN_INITIAL_DATA,
} from '../../validation/configs/user/loginValidationConfig';

/**
 * Login form hook - manages form state, validation, and authentication
 * Implements validation and submission logic directly
 * @returns {Object} Form data, handlers, and state
 */
const useLoginUserForm = () => {
  const dispatch = useDispatch();

  // Use validation form hook
  const { formData, handleInputChange, validateForm, hasError, getError } = useValidationForm(
    LOGIN_VALIDATION_RULES,
    LOGIN_INITIAL_DATA
  );

  // Use form submission hook
  const { onSubmit, isSubmitting } = useFormSubmission({
    action: () => dispatch(loginUser(formData)).unwrap(),
    validateForm,
  });

  // Navigation links
  const navigationLinks = useMemo(() => [NAVIGATION_LINKS.AUTH.CHANGE_PASSWORD], []);

  // Return form interface
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

export default useLoginUserForm;
