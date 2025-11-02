import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { scrollToTop } from '../../../utils/scrollUtils';
import { registerUser, updateUser, deleteUser } from '../../../store/thunks/adminThunks';

// Constants
const INITIAL_SHARED_FIELDS = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: '',
};

const INITIAL_ADD_FORM_DATA = {
  ...INITIAL_SHARED_FIELDS,
  email: '',
  password: '',
};

const INITIAL_UPDATE_FORM_DATA = {
  ...INITIAL_SHARED_FIELDS,
};

const INITIAL_SHARED_ERRORS = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: '',
};

const INITIAL_ADD_FORM_ERRORS = {
  ...INITIAL_SHARED_ERRORS,
  email: '',
  password: '',
};

const INITIAL_UPDATE_FORM_ERRORS = {
  ...INITIAL_SHARED_ERRORS,
};

// Shared validation rules for common fields
const SHARED_VALIDATION_RULES = {
  firstName: {
    required: true,
    pattern: /^[A-Za-z]{3,30}$/,
    message: 'First name must be only letters with 3-30 characters',
  },
  lastName: {
    required: true,
    pattern: /^[A-Za-z]{3,30}$/,
    message: 'Last name must be only letters with 3-30 characters',
  },
  phoneNumber: {
    required: true,
    pattern: /^05\d{8}$/,
    message: 'Phone number must start with 05 and be exactly 10 digits',
  },
  role: {
    required: true,
    message: 'Role is required',
  },
};

// Validation rules for adding new user (RegisterRequest)
const ADD_VALIDATION_RULES = {
  ...SHARED_VALIDATION_RULES,
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email should be valid',
  },
  password: {
    required: true,
    pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/,
    message:
      'Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  },
};

// Validation rules for updating user (UpdateUserRequest)
const UPDATE_VALIDATION_RULES = {
  ...SHARED_VALIDATION_RULES,
};

const useUserManagementForm = () => {
  const { users, roles } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const [addFormData, setAddFormData] = useState(INITIAL_ADD_FORM_DATA);
  const [addFormErrors, setAddFormErrors] = useState(INITIAL_ADD_FORM_ERRORS);
  const [updateFormData, setUpdateFormData] = useState(INITIAL_UPDATE_FORM_DATA);
  const [updateFormErrors, setUpdateFormErrors] = useState(INITIAL_UPDATE_FORM_ERRORS);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = (name, value) => {
    const rule = addMode ? ADD_VALIDATION_RULES[name] : UPDATE_VALIDATION_RULES[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Pattern validation
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(addMode ? ADD_VALIDATION_RULES : UPDATE_VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, addMode ? addFormData[field] : updateFormData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    addMode ? setAddFormErrors(newErrors) : setUpdateFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    addMode
      ? setAddFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      : setUpdateFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

    // Clear error when user starts typing
    if (addMode ? addFormErrors[name] : updateFormErrors[name]) {
      addMode
        ? setAddFormErrors((prev) => ({
            ...prev,
            [name]: '',
          }))
        : setUpdateFormErrors((prev) => ({
            ...prev,
            [name]: '',
          }));
    }
  };

  const resetForm = () => {
    setAddFormData(INITIAL_ADD_FORM_DATA);
    setAddFormErrors(INITIAL_ADD_FORM_ERRORS);
    setUpdateFormData(INITIAL_UPDATE_FORM_DATA);
    setUpdateFormErrors(INITIAL_UPDATE_FORM_ERRORS);
  };

  const handleAddOrEditUser = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(
        addMode ? registerUser(addFormData) : updateUser({ ...updateFormData, id: editingUser.id })
      ).unwrap();
      resetForm();
      addMode ? resetForm() : handleSwitchToAddMode();
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    if (userId === editingUser?.id) {
      handleSwitchToAddMode();
    }
  };

  // Mode switching functions (now using internal state)
  const handleSwitchToAddMode = () => {
    resetForm();
    setAddMode(true);
    setEditingUser(null);
  };

  const handleSwitchToEditMode = (user) => {
    resetForm();
    setEditingUser(user);
    setAddMode(false);
    setUpdateFormData(user);

    scrollToTop();
  };

  return {
    // Data
    users,
    roles,
    formData: addMode ? addFormData : updateFormData,

    // State
    addMode,
    editingUser,

    // Handlers
    handleInputChange,
    handleAddOrEditUser,
    handleSwitchToEditMode,
    handleDeleteUser,
    handleSwitchToAddMode,

    // Validation
    addFormErrors,
    updateFormErrors,
    isSubmitting,

    // Actions
    setEditingUser,
    setAddMode,
  };
};

export default useUserManagementForm;
