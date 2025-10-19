import React from 'react';
import Input from '../../../../components/common/Input/Input';
import ButtonForm from '../../../../components/common/Button2/FormButton';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

// ==================== CONSTANTS ====================
const FORM_CONFIG = {
  CSS_CLASSES: {
    CONTAINER: 'mb-6',
    FORM_LAYOUT: 'flex flex-col sm:flex-row gap-4 items-start',
    INPUT_CONTAINER: 'flex-1',
  },
  FIELD_NAMES: {
    MENU_NAME: 'menuName',
  },
  BUTTON_TYPES: {
    CANCEL: 'red',
    SUBMIT: 'green',
  },
  BUTTON_ICONS: {
    CANCEL: 'cancel',
    ADD: 'add',
    SAVE: 'save',
  },
};

const FORM_LABELS = {
  MENU_NAME: 'Menu Name',
  CANCEL: 'Cancel',
  CREATE_MENU: 'Create Menu',
  UPDATE_MENU: 'Update Menu',
};

const FORM_MESSAGES = {
  EDITING_TITLE: 'Editing Menu',
  CREATE_TITLE: 'Create New Menu',
  UPDATE_TITLE: 'Update Existing Menu',
  CREATE_DESCRIPTION: 'Add a new menu to your restaurant',
  UPDATE_DESCRIPTION: 'Modify the details of an existing menu',
  CREATING_SPINNER: 'Creating menu...',
  UPDATING_SPINNER: 'Updating menu...',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Creates editing entity view text
 * @param {Object} editingMenu - Menu being edited
 * @returns {string} Formatted editing text
 */
const createEditingText = (editingMenu) =>
  `Menu #${editingMenu.id} - ${editingMenu.name} (${editingMenu.status})`;

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
  addMode ? FORM_MESSAGES.CREATE_DESCRIPTION : FORM_MESSAGES.UPDATING_DESCRIPTION;

/**
 * Gets submit button text based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Submit button text
 */
const getSubmitButtonText = (addMode) =>
  addMode ? FORM_LABELS.CREATE_MENU : FORM_LABELS.UPDATE_MENU;

/**
 * Gets submit button icon based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Submit button icon
 */
const getSubmitButtonIcon = (addMode) =>
  addMode ? FORM_CONFIG.BUTTON_ICONS.ADD : FORM_CONFIG.BUTTON_ICONS.SAVE;

/**
 * Gets spinner text based on mode
 * @param {boolean} addMode - Whether form is in add mode
 * @returns {string} Spinner text
 */
const getSpinnerText = (addMode) =>
  addMode ? FORM_MESSAGES.CREATING_SPINNER : FORM_MESSAGES.UPDATING_SPINNER;

/**
 * Determines if submit button should be disabled
 * @param {boolean} addMode - Whether form is in add mode
 * @param {boolean} hasChanges - Whether form has changes
 * @returns {boolean} True if button should be disabled
 */
const isSubmitButtonDisabled = (addMode, hasChanges) => !addMode && !hasChanges;

/**
 * Gets input error message
 * @param {Function} hasError - Error check function
 * @param {Function} getError - Error getter function
 * @param {string} fieldName - Field name to check
 * @returns {string} Error message or empty string
 */
const getInputError = (hasError, getError, fieldName) =>
  hasError(fieldName) ? getError(fieldName) : '';

// ==================== COMPONENT ====================

/**
 * Component for displaying and managing menu form
 *
 * Features:
 * - Displays form for creating or editing menus
 * - Shows editing context when in edit mode
 * - Handles form validation and error display
 * - Provides submit and cancel actions
 * - Shows loading state during submission
 * - Responsive layout for different screen sizes
 *
 * @param {Object} props - Component props
 * @param {boolean} props.addMode - Whether form is in add mode
 * @param {Object|null} props.editingMenu - Menu being edited
 * @param {Object} props.formData - Form data object
 * @param {Function} props.handleInputChange - Input change handler
 * @param {Function} props.hasError - Error check function
 * @param {Function} props.getError - Error getter function
 * @param {boolean} props.hasChanges - Whether form has unsaved changes
 * @param {boolean} props.isSubmitting - Whether form is being submitted
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.switchToAddMode - Switch to add mode handler
 * @returns {JSX.Element} Menu form component
 */
const MenuForm = ({
  addMode,
  editingMenu,
  formData,
  handleInputChange,
  hasError,
  getError,
  hasChanges,
  isSubmitting,
  onSubmit,
  switchToAddMode,
}) => {
  // ==================== RENDER HELPERS ====================

  /**
   * Renders editing entity view when in edit mode
   * @returns {JSX.Element|null} Editing entity view or null
   */
  const renderEditingView = () => {
    if (!addMode && editingMenu) {
      return (
        <EditableEntityView
          title={FORM_MESSAGES.EDITING_TITLE}
          text={createEditingText(editingMenu)}
        />
      );
    }
    return null;
  };

  /**
   * Renders cancel button when in edit mode
   * @returns {JSX.Element|null} Cancel button or null
   */
  const renderCancelButton = () => {
    if (!addMode) {
      return (
        <ButtonForm
          text={FORM_LABELS.CANCEL}
          icon={FORM_CONFIG.BUTTON_ICONS.CANCEL}
          type={FORM_CONFIG.BUTTON_TYPES.CANCEL}
          onClick={switchToAddMode}
        />
      );
    }
    return null;
  };

  // ==================== RENDER ====================
  return (
    <GlassCard className={FORM_CONFIG.CSS_CLASSES.CONTAINER}>
      {renderEditingView()}

      <SectionHeader title={getFormTitle(addMode)} description={getFormDescription(addMode)} />

      <div className={FORM_CONFIG.CSS_CLASSES.FORM_LAYOUT}>
        <div className={FORM_CONFIG.CSS_CLASSES.INPUT_CONTAINER}>
          <Input
            label={FORM_LABELS.MENU_NAME}
            value={formData.menuName}
            onChange={handleInputChange(FORM_CONFIG.FIELD_NAMES.MENU_NAME)}
            required={true}
            error={getInputError(hasError, getError, FORM_CONFIG.FIELD_NAMES.MENU_NAME)}
          />
        </div>

        {renderCancelButton()}

        <ButtonForm
          text={getSubmitButtonText(addMode)}
          icon={getSubmitButtonIcon(addMode)}
          type={FORM_CONFIG.BUTTON_TYPES.SUBMIT}
          onClick={onSubmit}
          disabled={isSubmitButtonDisabled(addMode, hasChanges)}
        />
      </div>

      <FormSpinner show={isSubmitting} text={getSpinnerText(addMode)} />
    </GlassCard>
  );
};

export default MenuForm;
