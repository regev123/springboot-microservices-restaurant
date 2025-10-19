import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  updateCategoryOrder,
} from '../../../store/thunks/menuThunks';

const VALIDATION_RULES = {
  NAME: {
    REQUIRED: 'Category name is required',
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    MIN_LENGTH_ERROR: 'Category name must be at least 2 characters',
    MAX_LENGTH_ERROR: 'Category name must not exceed 50 characters',
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
    MAX_LENGTH_ERROR: 'Category description cannot exceed 500 characters',
  },
};

const useCategoryManagerForm = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [addMode, setAddMode] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [originalCategories, setOriginalCategories] = useState([]);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.menu);

  // Initialize local categories when categories change
  useEffect(() => {
    setLocalCategories(categories);
    setOriginalCategories(categories);
    setHasOrderChanges(false);
  }, [categories]);

  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      clearFormErrors();
    }
  }, [formData.categoryName, formData.categoryDescription]);

  const clearFormErrors = () => {
    setValidationErrors({});
  };

  /**
   * Checks if the current local order is different from the original order
   * @param {Array} currentCategories - Current local categories
   * @returns {boolean} True if there are actual order changes
   */
  const hasActualOrderChanges = (currentCategories = localCategories) => {
    if (currentCategories.length !== originalCategories.length) {
      return true;
    }

    // Check if any category has a different position
    return currentCategories.some((currentCat, index) => {
      const originalCat = originalCategories[index];
      return !originalCat || currentCat.id !== originalCat.id;
    });
  };

  const validateCategoryName = (name) => {
    const errors = {};

    if (!name || !name.trim()) {
      errors.name = VALIDATION_RULES.NAME.REQUIRED;
    } else if (name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      errors.name = VALIDATION_RULES.NAME.MIN_LENGTH_ERROR;
    } else if (name.trim().length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      errors.name = VALIDATION_RULES.NAME.MAX_LENGTH_ERROR;
    }

    return errors;
  };

  const validateCategoryDescription = (description) => {
    const errors = {};

    if (description && description.trim().length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      errors.description = VALIDATION_RULES.DESCRIPTION.MAX_LENGTH_ERROR;
    }

    return errors;
  };

  const validateForm = () => {
    const nameErrors = validateCategoryName(formData.categoryName);
    const descriptionErrors = validateCategoryDescription(formData.categoryDescription);

    const allErrors = { ...nameErrors, ...descriptionErrors };
    setValidationErrors(allErrors);

    return Object.keys(allErrors).length === 0;
  };

  const handleCreateCategory = () => {
    clearFormErrors();

    if (!validateForm()) {
      return;
    }

    dispatch(
      createCategory({
        name: formData.categoryName.trim(),
        description: formData.categoryDescription.trim() || null,
      })
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
  };

  /**
   * Moves a category up in the order (local state only)
   * @param {Object} category - Category to move up
   */
  const handleMoveUp = (category) => {
    const currentIndex = localCategories.findIndex((cat) => cat.id === category.id);
    if (currentIndex > 0) {
      const newCategories = [...localCategories];
      [newCategories[currentIndex], newCategories[currentIndex - 1]] = [
        newCategories[currentIndex - 1],
        newCategories[currentIndex],
      ];

      // Update local state and check for actual changes
      setLocalCategories(newCategories);
      setHasOrderChanges(hasActualOrderChanges(newCategories));
    }
  };

  /**
   * Moves a category down in the order (local state only)
   * @param {Object} category - Category to move down
   */
  const handleMoveDown = (category) => {
    const currentIndex = localCategories.findIndex((cat) => cat.id === category.id);
    if (currentIndex < localCategories.length - 1) {
      const newCategories = [...localCategories];
      [newCategories[currentIndex], newCategories[currentIndex + 1]] = [
        newCategories[currentIndex + 1],
        newCategories[currentIndex],
      ];

      // Update local state and check for actual changes
      setLocalCategories(newCategories);
      setHasOrderChanges(hasActualOrderChanges(newCategories));
    }
  };

  /**
   * Switches to edit mode and populates form with category data
   * @param {Object} category - Category to edit
   */
  const switchToEditMode = (category) => {
    setEditingCategory(category);
    setAddMode(false);

    // Populate form with category data
    handleInputChange('categoryName', category.name);
    handleInputChange('categoryDescription', category.description || '');

    // Scroll to category management section
    setTimeout(() => {
      const scrollPosition = window.innerHeight * 0.95;
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }, 100);
  };

  /**
   * Switches back to add mode and clears form
   */
  const switchToAddMode = () => {
    setAddMode(true);
    setEditingCategory(null);

    // Clear form data
    handleInputChange('categoryName', '');
    handleInputChange('categoryDescription', '');
  };

  /**
   * Handles form submission based on current mode
   */
  const handleSubmit = () => {
    if (addMode) {
      handleCreateCategory();
    } else {
      handleUpdateCategory(editingCategory.id);
    }
  };

  /**
   * Saves all order changes to the server
   */
  const saveOrderChanges = () => {
    const changes = [];

    // Send ALL categories with their new order positions (sequential starting from 1)
    localCategories.forEach((cat, index) => {
      const newOrder = index + 1;
      changes.push({
        id: cat.id,
        newOrder,
      });
    });

    if (changes.length > 0) {
      console.log('Saving order changes:', changes);

      // Send changes to server via thunk
      // The useEffect will automatically update local state when categories change
      dispatch(updateCategoryOrder(changes));
    }
  };

  /**
   * Cancels all order changes and resets to original state
   */
  const cancelOrderChanges = () => {
    console.log('Canceling order changes - resetting to original state');
    setLocalCategories(originalCategories);
    setHasOrderChanges(false);
  };

  const handleEditCategory = (category) => {
    // This function is called when edit button is clicked
    // The actual form population is handled by switchToEditMode
    switchToEditMode(category);
  };

  const handleUpdateCategory = (categoryId) => {
    clearFormErrors();

    if (!validateForm()) {
      return;
    }

    dispatch(
      updateCategory({
        id: categoryId,
        name: formData.categoryName.trim(),
        description: formData.categoryDescription.trim() || null,
      })
    );
  };

  return {
    formData,
    validationErrors,
    categories: localCategories, // Use local categories for display
    addMode,
    editingCategory,
    hasOrderChanges,
    handleEditCategory,
    handleDeleteCategory,
    handleMoveUp,
    handleMoveDown,
    saveOrderChanges,
    cancelOrderChanges,
    handleInputChange,
    switchToEditMode,
    switchToAddMode,
    handleSubmit,
  };
};

export default useCategoryManagerForm;
