import React from 'react';
import Input from '../../../../components/common/Input/Input';
import ButtonForm from '../../../../components/common/Button2/FormButton';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

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
 * @param {Object} props - Props for the MenuForm component
 * @param {boolean} props.addMode - Whether form is in add mode
 * @param {Object|null} props.editingMenu - Menu being edited
 * @param {Object} props.formData - Form data object
 * @param {Function} props.handleInputChange - Input change handler
 * @param {Object} props.formErrors - Form errors object
 * @param {boolean} props.isSubmitting - Whether form is being submitted
 * @param {Function} props.handleAddOrEditMenu - Form submission handler
 * @param {Function} props.handleSwitchToAddMode - Switch to add mode handler
 * @returns {JSX.Element} Menu form for managing menus
 */
const MenuForm = ({
  addMode,
  editingMenu,
  formData,
  handleInputChange,
  formErrors,
  isSubmitting,
  handleAddOrEditMenu,
  handleSwitchToAddMode,
}) => {
  return (
    <GlassCard className="mb-6">
      {!addMode && editingMenu && (
        <EditableEntityView
          title="Editing Menu"
          text={`Menu #${editingMenu.id} - ${editingMenu.name} (${editingMenu.status})`}
        />
      )}

      <SectionHeader
        title=""
        description={
          addMode ? 'Add a new menu to your restaurant' : 'Modify the details of an existing menu'
        }
      />

      <div className="space-y-4">
        <div>
          <Input
            label="Menu Name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required={true}
            error={formErrors.name}
          />
        </div>

        <div className="flex gap-3">
          {!addMode && (
            <ButtonForm text="" icon="cancel" type="red" onClick={handleSwitchToAddMode} />
          )}

          <ButtonForm
            text="Submit"
            icon="save"
            type="green"
            onClick={handleAddOrEditMenu}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <FormSpinner show={isSubmitting} text="Submitting menu..." />
    </GlassCard>
  );
};

export default MenuForm;
