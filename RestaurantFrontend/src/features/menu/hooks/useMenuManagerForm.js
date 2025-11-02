import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMenu, deleteMenu, activateMenu, updateMenu } from '../../../store/thunks/menuThunks';
import { scrollToTop } from '../../../utils/scrollUtils';

// Constants
const INITIAL_FORM_DATA = {
  name: '',
};

const INITIAL_FORM_ERRORS = {
  name: '',
};

const VALIDATION_RULES = {
  name: {
    required: true,
    pattern: /^[A-Za-z0-9\s\-'&.,]{2,50}$/,
    message:
      'Menu name must be 2-50 characters and contain only letters, numbers, spaces, hyphens, apostrophes, ampersands, periods, and commas',
  },
};

/**
 * Comprehensive hook for managing menu management page
 * Combines state management, validation, and actions in a single file
 * Follows SOLID principles and clean code concepts
 */
const useMenuManagerForm = () => {
  const { menus } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingMenu, setEditingMenu] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
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

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAddOrEditMenu = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(
        addMode ? createMenu(formData) : updateMenu({ ...formData, id: editingMenu.id })
      ).unwrap();
      resetForm();
      addMode ? resetForm() : handleSwitchToAddMode();
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_FORM_ERRORS);
  };

  const handleActivateMenu = (id) => {
    dispatch(activateMenu(id));
  };

  const handleDeleteMenu = (menuId) => {
    dispatch(deleteMenu(menuId));

    // If we're deleting the currently edited menu, switch back to add mode
    if (editingMenu && editingMenu.id === menuId) {
      handleSwitchToAddMode();
    }
  };

  // Mode switching functions (now using internal state)
  const handleSwitchToAddMode = () => {
    resetForm();
    setAddMode(true);
    setEditingMenu(null);
  };

  const handleSwitchToEditMode = (menu) => {
    resetForm();
    setEditingMenu(menu);
    setAddMode(false);
    setFormData((prev) => ({ ...prev, name: menu.name }));

    scrollToTop();
  };

  return {
    // Data
    menus,
    formData,

    // State
    addMode,
    editingMenu,

    // Handlers
    handleInputChange,
    handleAddOrEditMenu,
    handleDeleteMenu,
    handleActivateMenu,
    handleSwitchToAddMode,
    handleSwitchToEditMode,

    // Validation
    validateForm,
    validateField,
    formErrors,
    isSubmitting,

    // Actions
    setFormData,
    setFormErrors,
    setAddMode,
    setEditingMenu,
  };
};

export default useMenuManagerForm;
