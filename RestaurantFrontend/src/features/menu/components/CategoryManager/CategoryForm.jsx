import React from 'react';
import Input from '../../../../components/common/Input/Input';
import TextArea from '../../../../components/common/TextArea/TextArea';
import ButtonForm from '../../../../components/common/Button2/FormButton';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

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
 * @param {Object} props - Props for the CategoryForm component
 * @param {Object} props.formData - Form data object
 * @param {Object} props.validationErrors - Validation errors object
 * @param {boolean} props.addMode - Whether form is in add mode
 * @param {Object} props.editingCategory - Category being edited
 * @param {Function} props.handleInputChange - Input change handler
 * @param {Function} props.handleSwitchToAddMode - Switch to add mode handler
 * @param {Function} props.handleAddOrEditCategory - Form submission handler
 * @param {boolean} props.isSubmitting - Whether form is being submitted
 * @returns {JSX.Element} Category form component
 */
const CategoryForm = ({
  formData,
  addMode,
  editingCategory,
  handleInputChange,
  handleSwitchToAddMode,
  handleAddOrEditCategory,
  formErrors,
  isSubmitting,
}) => {
  return (
    <GlassCard className="mb-6">
      {!addMode && editingCategory && (
        <EditableEntityView
          title="Editing Category"
          text={`Category #${editingCategory.id} - ${editingCategory.name}`}
        />
      )}

      <SectionHeader
        title=""
        description={
          addMode
            ? 'Add a new category to organize your menu items'
            : 'Modify the details of an existing category'
        }
      />

      <div className="space-y-4">
        <div>
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required={true}
            error={formErrors.name}
          />
        </div>

        <div>
          <TextArea
            label="Description"
            placeholder="Enter a description for this category (optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            maxLength={500}
            error={formErrors.description}
          />
        </div>

        <div className="flex gap-3">
          {!addMode && (
            <ButtonForm
              text=""
              icon="cancel"
              type="red"
              onClick={handleSwitchToAddMode}
              size="small"
            />
          )}
          <ButtonForm
            text={addMode ? 'Create Category' : 'Update Category'}
            icon={addMode ? 'add' : 'save'}
            type="green"
            onClick={handleAddOrEditCategory}
            disabled={isSubmitting}
            size="small"
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default CategoryForm;
