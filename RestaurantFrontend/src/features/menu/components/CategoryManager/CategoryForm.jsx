import React from 'react';
import Input from '../../../../components/common/Input/Input';
import TextArea from '../../../../components/common/TextArea/TextArea';
import ButtonForm from '../../../../components/common/Button2/FormButton';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

// ==================== CONSTANTS ====================
const FORM_CONFIG = {
  CSS_CLASSES: {
    CONTAINER: 'mb-6',
    FORM_LAYOUT: 'space-y-4',
    GRID_LAYOUT: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    BUTTON_CONTAINER: 'flex items-end',
  },
  FIELD_NAMES: {
    CATEGORY_NAME: 'categoryName',
    CATEGORY_DESCRIPTION: 'categoryDescription',
  },
  BUTTON_TYPES: {
    SUBMIT: 'green',
  },
  BUTTON_ICONS: {
    ADD: 'add',
  },
  TEXTAREA_CONFIG: {
    ROWS: 3,
    MAX_LENGTH: 500,
  },
};

const FORM_LABELS = {
  CATEGORY_NAME: 'Category Name',
  DESCRIPTION: 'Description',
  CREATE_CATEGORY: 'Create Category',
  UPDATE_CATEGORY: 'Update Category',
  CANCEL: 'Cancel',
};

const FORM_MESSAGES = {
  CREATE_TITLE: 'Create New Category',
  UPDATE_TITLE: 'Update Existing Category',
  CREATE_DESCRIPTION: 'Add a new category to organize your menu items',
  UPDATE_DESCRIPTION: 'Modify the details of an existing category',
  EDITING_TITLE: 'Editing Category',
  DESCRIPTION_PLACEHOLDER: 'Enter a description for this category (optional)',
  DESCRIPTION_HELPER: 'Provide a brief description to help organize your menu items',
  CREATING_SPINNER: 'Creating category...',
  UPDATING_SPINNER: 'Updating category...',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Gets input error message
 * @param {Object} validationErrors - Validation errors object
 * @param {string} fieldName - Field name to check
 * @returns {string} Error message or undefined
 */
const getInputError = (validationErrors, fieldName) => validationErrors?.[fieldName];

/**
 * Handles input change event
 * @param {Function} handleInputChange - Input change handler
 * @param {string} fieldName - Field name
 * @returns {Function} Event handler function
 */
const createInputChangeHandler = (handleInputChange, fieldName) => (e) =>
  handleInputChange(fieldName, e.target.value);

/**
 * Creates editing entity view text
 * @param {Object} editingCategory - Category being edited
 * @returns {string} Formatted editing text
 */
const createEditingText = (editingCategory) =>
  `Category #${editingCategory.id} - ${editingCategory.name}`;

/**
 * Gets form title based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Form title
 */
const getFormTitle = (addMode) =>
  addMode ? FORM_MESSAGES.CREATE_TITLE : FORM_MESSAGES.UPDATE_TITLE;

/**
 * Gets form description based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Form description
 */
const getFormDescription = (addMode) =>
  addMode ? FORM_MESSAGES.CREATE_DESCRIPTION : FORM_MESSAGES.UPDATE_DESCRIPTION;

/**
 * Gets submit button text based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Submit button text
 */
const getSubmitButtonText = (addMode) =>
  addMode ? FORM_LABELS.CREATE_CATEGORY : FORM_LABELS.UPDATE_CATEGORY;

// ==================== COMPONENT ====================

/**
 * Component for creating and editing categories
 *
 * Features:
 * - Displays form for creating new categories and editing existing ones
 * - Handles category name and description input
 * - Provides form validation and error display
 * - Responsive layout for different screen sizes
 * - Character limit for description field
 * - Helper text for better user experience
 * - Visual indicator when editing existing category
 * - Cancel button when in edit mode
 *
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data object
 * @param {Object} props.validationErrors - Validation errors object
 * @param {boolean} props.addMode - Whether form is in add mode
 * @param {Object} props.editingCategory - Category being edited
 * @param {Function} props.handleInputChange - Input change handler
 * @param {Function} props.handleEditCategory - Category edit handler
 * @param {Function} props.switchToEditMode - Switch to edit mode handler
 * @param {Function} props.switchToAddMode - Switch to add mode handler
 * @param {Function} props.handleSubmit - Form submission handler
 * @returns {JSX.Element} Category form component
 */
const CategoryForm = ({
  formData,
  validationErrors,
  addMode,
  editingCategory,
  handleInputChange,
  handleEditCategory,
  switchToEditMode,
  switchToAddMode,
  handleSubmit,
}) => {
  // ==================== EFFECTS ====================

  // Listen for edit category events from parent
  React.useEffect(() => {
    if (handleEditCategory) {
      // Store the edit handler for external calls
      window.switchToEditMode = switchToEditMode;
    }
  }, [handleEditCategory, switchToEditMode]);
  // ==================== RENDER ====================
  return (
    <GlassCard className={FORM_CONFIG.CSS_CLASSES.CONTAINER}>
      {/* Editing View */}
      {!addMode && editingCategory && (
        <EditableEntityView
          title={FORM_MESSAGES.EDITING_TITLE}
          text={createEditingText(editingCategory)}
        />
      )}

      <SectionHeader title={getFormTitle(addMode)} description={getFormDescription(addMode)} />

      <div className={FORM_CONFIG.CSS_CLASSES.FORM_LAYOUT}>
        <div className={FORM_CONFIG.CSS_CLASSES.GRID_LAYOUT}>
          <div>
            <Input
              label={FORM_LABELS.CATEGORY_NAME}
              value={formData.categoryName}
              onChange={createInputChangeHandler(
                handleInputChange,
                FORM_CONFIG.FIELD_NAMES.CATEGORY_NAME
              )}
              required={true}
              error={getInputError(validationErrors, 'name')}
            />
          </div>

          <div className={FORM_CONFIG.CSS_CLASSES.BUTTON_CONTAINER}>
            {/* Cancel Button (only in edit mode) */}
            {!addMode && (
              <ButtonForm
                text={FORM_LABELS.CANCEL}
                icon="cancel"
                type="red"
                onClick={switchToAddMode}
              />
            )}

            {/* Spacing between buttons */}
            {!addMode && <div className="w-3" />}

            {/* Submit Button */}
            <ButtonForm
              text={getSubmitButtonText(addMode)}
              icon={addMode ? FORM_CONFIG.BUTTON_ICONS.ADD : 'save'}
              type={FORM_CONFIG.BUTTON_TYPES.SUBMIT}
              onClick={handleSubmit}
            />
          </div>
        </div>

        <div>
          <TextArea
            label={FORM_LABELS.DESCRIPTION}
            placeholder={FORM_MESSAGES.DESCRIPTION_PLACEHOLDER}
            value={formData.categoryDescription}
            onChange={createInputChangeHandler(
              handleInputChange,
              FORM_CONFIG.FIELD_NAMES.CATEGORY_DESCRIPTION
            )}
            rows={FORM_CONFIG.TEXTAREA_CONFIG.ROWS}
            maxLength={FORM_CONFIG.TEXTAREA_CONFIG.MAX_LENGTH}
            helperText={FORM_MESSAGES.DESCRIPTION_HELPER}
            error={getInputError(validationErrors, 'description')}
            errorMessage={getInputError(validationErrors, 'description')}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default CategoryForm;
