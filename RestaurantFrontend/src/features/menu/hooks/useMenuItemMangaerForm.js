import { useSelector } from 'react-redux';
import { useState } from 'react';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../../store/thunks/menuThunks';
import { useDispatch } from 'react-redux';
import { scrollToTop } from '../../../utils/scrollUtils';

// Constants for Menu Item Form
const INITIAL_FORM_DATA = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  isAvailable: true,
  ingredients: [],
};

const INITIAL_FORM_ERRORS = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  isAvailable: '',
};

const VALIDATION_RULES = {
  categoryId: {
    required: true,
    pattern: /^[1-9]\d*$/,
    message: 'Category is required, select a category',
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Menu Item name is required, must be between 2 and 100 characters',
  },
  description: {
    required: false,
    maxLength: 500,
    message: 'Description cannot exceed 500 characters',
  },
  price: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/,
    min: 0.01,
    max: 999.99,
    message: 'Price is required, must be between 0.01 and 999.99',
  },
  isAvailable: {
    required: true,
    message: 'Availability flag is required',
  },
};

const useMenuItemManagerForm = () => {
  const { menuItems, categories } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return '';

    // Required validation - handle different data types
    if (rule.required) {
      // For booleans, check if it's null or undefined
      if (typeof value === 'boolean') {
        if (value === null || value === undefined) {
          return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
      }
      // For strings, check if empty after trim
      else if (typeof value === 'string') {
        if (!value.trim()) {
          return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
      }
      // For other types (numbers, arrays), check if falsy
      else if (!value && value !== 0) {
        return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
    }

    // Pattern validation (only for strings)
    if (rule.pattern && value && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message;
    }

    // MaxLength validation (only for strings)
    if (rule.maxLength && value && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message;
    }

    // Min validation (for numbers)
    if (rule.min && value && parseFloat(value) < rule.min) {
      return rule.message;
    }

    // Max validation (for numbers)
    if (rule.max && value && parseFloat(value) > rule.max) {
      return rule.message;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const value = formData[field] ?? '';
      const error = validateField(field, value);
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

  const handleAddOrEditMenuItem = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const payload = addMode
        ? formData
        : {
            ...formData,
            id: editingMenuItem.id,
            isAvailable: Boolean(formData.isAvailable), // Ensure it's always a boolean
          };
      console.log('payload in handleAddOrEditMenuItem:', payload);
      await dispatch(addMode ? createMenuItem(payload) : updateMenuItem(payload)).unwrap();
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

  // Mode switching functions (now using internal state)
  const handleSwitchToAddMode = () => {
    resetForm();
    setAddMode(true);
    setEditingMenuItem(null);
  };

  const handleSwitchToEditMode = (menuItem) => {
    resetForm();
    setEditingMenuItem(menuItem);
    setAddMode(false);
    setFormData((prev) => ({
      ...prev,
      categoryId: menuItem.category.id,
      name: menuItem.name,
      description: menuItem.description,
      price: String(menuItem.price),
      isAvailable: Boolean(menuItem.isAvailable),
      ingredients: menuItem.ingredients,
    }));

    scrollToTop();
  };

  const handleDeleteMenuItem = (menuItemId) => {
    console.log('menuItemId in handleDeleteMenuItem:', menuItemId);
    dispatch(deleteMenuItem(menuItemId));
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    handleAddOrEditMenuItem,
    handleSwitchToAddMode,
    handleSwitchToEditMode,
    handleDeleteMenuItem,
    handleInputChange,
    categories,
    menuItems,
    addMode,
    editingMenuItem,
  };
};

export default useMenuItemManagerForm;
