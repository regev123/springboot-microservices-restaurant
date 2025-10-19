import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMenu, deleteMenu, activateMenu, updateMenu } from '../../../store/thunks/menuThunks';
import useFormValidation from '../../validation/hooks/useFormValidation';
import useFormSubmission from '../../../hooks/useFormSubmission';
import {
  MENU_VALIDATION_RULES,
  MENU_INITIAL_DATA,
} from '../../validation/configs/menu/menuValidationConfig';

/**
 * Custom hook for managing menu form operations following SOLID principles
 *
 * Features:
 * - Form state management (add/edit modes)
 * - Menu CRUD operations (create, read, update, delete, activate)
 * - Form validation and submission
 * - Automatic form reset after operations
 * - Clean separation of concerns
 *
 * @returns {Object} Form state and handlers for menu management
 * @returns {Array} menus - List of all menus
 * @returns {Object} formData - Current form data
 * @returns {boolean} isSubmitting - Form submission state
 * @returns {boolean} addMode - Whether form is in add mode
 * @returns {Object|null} editingMenu - Currently edited menu
 * @returns {boolean} hasChanges - Whether form has unsaved changes
 * @returns {Function} onSubmit - Form submission handler
 * @returns {Function} handleActivateMenu - Menu activation handler
 * @returns {Function} handleDelete - Menu deletion handler
 * @returns {Function} switchToEditMode - Switch to edit mode handler
 * @returns {Function} switchToAddMode - Switch to add mode handler
 */
const useMenuManagerForm = () => {
  // ==================== STATE MANAGEMENT ====================
  const [formState, setFormState] = useState({
    addMode: true,
    editingMenu: null,
    originalMenuName: '',
  });

  // ==================== DEPENDENCIES ====================
  const validation = useFormValidation(MENU_VALIDATION_RULES, MENU_INITIAL_DATA);
  const dispatch = useDispatch();

  // ==================== SELECTORS ====================
  const { menus } = useSelector((state) => state.menu);
  const { isCreating, isDeleting, isUpdating } = useSelector((state) => state.menu.menuUI);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Creates menu data object from form data
   * @returns {Object} Menu data for API
   */
  const createMenuData = () => ({
    name: validation.formData.menuName,
  });

  /**
   * Determines the appropriate action based on current mode
   * @returns {Promise} Redux action promise
   */
  const getSubmissionAction = () => {
    const menuData = createMenuData();

    if (formState.addMode) {
      return dispatch(createMenu(menuData)).unwrap();
    } else {
      return dispatch(
        updateMenu({
          menuId: formState.editingMenu.id,
          menuData,
        })
      ).unwrap();
    }
  };

  // ==================== FORM SUBMISSION ====================
  const { onSubmit: baseOnSubmit, isSubmitting } = useFormSubmission({
    action: getSubmissionAction,
    validateForm: validation.validateForm,
  });

  /**
   * Handles post-submission form reset based on mode
   * @param {boolean} wasInAddMode - Whether form was in add mode before submission
   */
  const handlePostSubmissionReset = (wasInAddMode) => {
    if (wasInAddMode) {
      validation.resetForm();
    } else {
      switchToAddMode();
    }
  };

  /**
   * Handles form submission with post-submission logic
   * @param {Event} e - Form submission event
   */
  const onSubmit = async (e) => {
    const wasInAddMode = formState.addMode;
    await baseOnSubmit(e);
    handlePostSubmissionReset(wasInAddMode);
  };

  /**
   * Handles menu activation
   * @param {string} id - Menu ID to activate
   */
  const handleActivateMenu = (id) => {
    dispatch(activateMenu(id));
  };

  /**
   * Checks if we're deleting the currently edited menu
   * @param {string} menuId - ID of menu being deleted
   * @returns {boolean} True if deleting currently edited menu
   */
  const isDeletingCurrentMenu = (menuId) => {
    return !formState.addMode && formState.editingMenu && formState.editingMenu.id === menuId;
  };

  /**
   * Handles menu deletion and form state cleanup
   * @param {string} id - Menu ID to delete
   */
  const handleDelete = (id) => {
    dispatch(deleteMenu(id));

    if (isDeletingCurrentMenu(id)) {
      switchToAddMode();
    }
  };

  /**
   * Handles direct menu editing (alternative to form-based editing)
   * @param {string} id - Menu ID to edit
   * @param {Object} menuData - Menu data to update
   */
  const handleEditMenu = (id, menuData) => {
    dispatch(updateMenu({ menuId: id, menuData }));
  };

  /**
   * Sets form state for edit mode
   * @param {Object} menu - Menu object to edit
   */
  const setEditModeState = (menu) => {
    setFormState({
      addMode: false,
      editingMenu: menu,
      originalMenuName: menu.name,
    });
  };

  /**
   * Populates form with menu data and scrolls to top
   * @param {Object} menu - Menu object to populate form with
   */
  const populateFormAndScroll = (menu) => {
    validation.setFieldValue('menuName', menu.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Switches form to edit mode
   * @param {Object} menu - Menu object to edit
   */
  const switchToEditMode = (menu) => {
    setEditModeState(menu);
    populateFormAndScroll(menu);
  };

  /**
   * Sets form state for add mode
   */
  const setAddModeState = () => {
    setFormState({
      addMode: true,
      editingMenu: null,
      originalMenuName: '',
    });
  };

  /**
   * Switches form to add mode
   */
  const switchToAddMode = () => {
    setAddModeState();
    validation.resetForm();
  };

  // ==================== COMPUTED VALUES ====================

  /**
   * Determines if form has unsaved changes in edit mode
   * @returns {boolean} True if form has changes
   */
  const hasChanges =
    !formState.addMode && validation.formData.menuName !== formState.originalMenuName;

  // ==================== PUBLIC API ====================
  return {
    // Data
    menus,
    formData: validation.formData,
    isSubmitting,

    // State
    addMode: formState.addMode,
    editingMenu: formState.editingMenu,
    hasChanges,
    isCreating,
    isDeleting,
    isUpdating,

    // Form Handlers
    handleInputChange: validation.handleInputChange,
    onSubmit,

    // Menu Operations
    handleActivateMenu,
    handleDelete,
    handleEditMenu,

    // Mode Management
    switchToEditMode,
    switchToAddMode,

    // Validation
    hasError: validation.hasError,
    getError: validation.getError,
    clearFormErrors: validation.clearErrors,
  };
};

export default useMenuManagerForm;
