import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useValidationForm from '../../validation/hooks/useValidationForm';
import useFormSubmission from '../../../hooks/useFormSubmission';
import useScrollToView from '../../../hooks/useScrollToView';
import { registerUser, updateUser, deleteUser } from '../../../store/thunks/adminThunks';
import {
  NEW_USER_VALIDATION_RULES,
  NEW_USER_INITIAL_DATA,
  EDIT_USER_VALIDATION_RULES,
  EDIT_USER_INITIAL_DATA,
} from '../../validation/configs/user/userManagementValidationConfig';

/**
 * Comprehensive hook for managing user management page
 * Combines state management, validation, and actions in a single file
 * Follows SOLID principles and clean code concepts
 */
const useUserManagementForm = () => {
  // Redux state
  const { users, roles } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  // Page-level state management
  const [addMode, setAddMode] = useState(true); // Start with add mode
  const [editingUser, setEditingUser] = useState(null);
  const editFormRef = useRef(null);

  // Scroll to view hook
  const scrollToView = useScrollToView();

  // Create separate validation instances for each mode
  const newUserValidation = useValidationForm(NEW_USER_VALIDATION_RULES, NEW_USER_INITIAL_DATA);
  const editUserValidation = useValidationForm(EDIT_USER_VALIDATION_RULES, EDIT_USER_INITIAL_DATA);

  // Get current validation based on mode
  const currentValidation = addMode ? newUserValidation : editUserValidation;

  // Populate form when editing
  useEffect(() => {
    if (!addMode && editingUser) {
      editUserValidation.handleInputChange('firstName', editingUser.firstName);
      editUserValidation.handleInputChange('lastName', editingUser.lastName);
      editUserValidation.handleInputChange('phoneNumber', editingUser.phoneNumber);
      editUserValidation.handleInputChange('role', editingUser.role);
    }
  }, [addMode, editingUser]); // Removed currentValidation to prevent infinite loop

  // Scroll to edit form when entering edit mode
  useEffect(() => {
    if (!addMode && editingUser && editFormRef.current) {
      scrollToView(editFormRef);
    }
  }, [addMode, editingUser]); // Removed scrollToView from dependencies to prevent infinite loop

  // Check if there are changes in edit mode
  const hasChanges = useMemo(() => {
    if (!editingUser || addMode) return false;

    return (
      currentValidation.formData.firstName !== editingUser.firstName ||
      currentValidation.formData.lastName !== editingUser.lastName ||
      currentValidation.formData.phoneNumber !== editingUser.phoneNumber ||
      currentValidation.formData.role !== editingUser.role
    );
  }, [currentValidation.formData, editingUser, addMode]);

  // Form submission handler
  const { onSubmit, isSubmitting } = useFormSubmission({
    action: () => {
      if (!addMode) {
        // Include user ID when updating existing user
        const userDataWithId = {
          ...currentValidation.formData,
          id: editingUser.id,
        };
        return dispatch(updateUser(userDataWithId)).unwrap();
      } else {
        return dispatch(registerUser(currentValidation.formData)).unwrap();
      }
    },
    validateForm: currentValidation.validateForm,
  });

  // Switch back to add mode (from edit mode)
  const handleBackToAddMode = () => {
    setAddMode(true);
    setEditingUser(null);
  };

  // User actions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setAddMode(false);
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  return {
    // Data
    users,
    roles,
    formData: currentValidation.formData,

    // State
    addMode,
    editingUser,
    editFormRef,

    // Handlers
    handleInputChange: currentValidation.handleInputChange,
    onSubmit,
    handleEditUser,
    handleDeleteUser,
    handleBackToAddMode,

    // Validation
    hasError: currentValidation.hasError,
    getError: currentValidation.getError,
    isSubmitting,
    hasChanges,

    // Actions
    setEditingUser,
    setAddMode,
  };
};

export default useUserManagementForm;
