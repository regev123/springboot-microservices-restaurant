import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  updateCategoryOrder,
} from '../../../store/thunks/menuThunks';
import { scrollToTop } from '../../../utils/scrollUtils';

// Constants for Add Category Mode
const INITIAL_FORM_DATA = {
  name: '',
  description: '',
};

const INITIAL_FORM_ERRORS = {
  name: '',
  description: '',
};

const VALIDATION_RULES = {
  name: {
    required: true,
    pattern: /^[A-Za-z0-9\s\-'&.,]{2,50}$/,
    message:
      'Category name is required and must be 2-50 characters containing only letters, numbers, spaces, hyphens, apostrophes, ampersands, periods, and commas',
  },
  description: {
    required: false,
    maxLength: 500,
    message: 'Category description cannot exceed 500 characters',
  },
};

/**
 * Comprehensive hook for managing category management page
 * Combines state management, validation, and actions in a single file
 * Follows SOLID principles and clean code concepts
 */
const useCategoryManagerForm = () => {
  const { categories } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);

  const [localCategories, setLocalCategories] = useState([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [originalCategories, setOriginalCategories] = useState([]);

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

    // MaxLength validation
    if (rule.maxLength && value && value.length > rule.maxLength) {
      return rule.message;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field] || '');
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

  const handleAddOrEditCategory = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(
        addMode ? createCategory(formData) : updateCategory({ ...formData, id: editingCategory.id })
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

  // Mode switching functions (now using internal state)
  const handleSwitchToAddMode = () => {
    resetForm();
    setAddMode(true);
    setEditingCategory(null);
  };

  const handleSwitchToEditMode = (category) => {
    resetForm();
    setEditingCategory(category);
    setAddMode(false);
    setFormData((prev) => ({
      ...prev,
      name: category.name,
      description: category.description || '',
    }));

    scrollToTop();
  };

  // Initialize local categories when categories change
  useEffect(() => {
    setLocalCategories(categories);
    setOriginalCategories(categories);
    setHasOrderChanges(false);
  }, [categories]);

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));

    if (editingCategory && editingCategory.id === id) {
      handleSwitchToAddMode();
    }
  };

  const swapCategories = (categories, fromIndex, toIndex) => {
    const newCategories = [...categories];
    [newCategories[fromIndex], newCategories[toIndex]] = [
      newCategories[toIndex],
      newCategories[fromIndex],
    ];
    return newCategories;
  };

  const updateLocalCategories = (newCategories) => {
    setLocalCategories(newCategories);
    setHasOrderChanges(true);
  };

  const handleMoveUp = (category) => {
    setHasOrderChanges(true);
    const currentIndex = localCategories.findIndex((cat) => cat.id === category.id);
    if (currentIndex > 0) {
      const newCategories = swapCategories(localCategories, currentIndex, currentIndex - 1);
      updateLocalCategories(newCategories);
    }
  };

  const handleMoveDown = (category) => {
    setHasOrderChanges(true);
    const currentIndex = localCategories.findIndex((cat) => cat.id === category.id);
    if (currentIndex < localCategories.length - 1) {
      const newCategories = swapCategories(localCategories, currentIndex, currentIndex + 1);
      updateLocalCategories(newCategories);
    }
  };

  const createOrderChangesPayload = () => {
    return localCategories.map((cat, index) => ({
      id: cat.id,
      newOrder: index + 1,
    }));
  };

  const saveOrderChanges = () => {
    const changes = createOrderChangesPayload();

    if (changes.length > 0) {
      dispatch(updateCategoryOrder(changes));
    }
    setHasOrderChanges(false);
  };

  const cancelOrderChanges = () => {
    setLocalCategories(originalCategories);
    setHasOrderChanges(false);
  };

  return {
    // Data
    categories: localCategories,
    formData,

    // State
    addMode,
    editingCategory,
    hasOrderChanges,

    // Handlers
    handleInputChange,
    handleAddOrEditCategory,
    handleSwitchToEditMode,
    handleDeleteCategory,
    handleMoveUp,
    handleMoveDown,
    saveOrderChanges,
    cancelOrderChanges,
    handleSwitchToAddMode,

    // Validation
    validateForm,
    validateField,
    formErrors,
    isSubmitting,

    // Actions
    setFormData,
    setFormErrors,
  };
};

export default useCategoryManagerForm;
