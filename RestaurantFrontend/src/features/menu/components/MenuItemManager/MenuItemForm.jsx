import React from 'react';
import Select from '../../../../components/common/Select/Select';
import Input from '../../../../components/common/Input/Input';
import TextArea from '../../../../components/common/TextArea/TextArea';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import MenuItemIngredientsManagerForm from './MenuItemIngridientsManager/MenuItemIngridientsManagerForm';
import ToggleCard from '../../../../components/common/ToggleCard/ToggleCard';
import FormButton from '../../../../components/common/Button2/FormButton';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

const MenuItemForm = ({
  categories,
  addMode,
  editingMenuItem,
  formData,
  formErrors,
  handleInputChange,
  handleAddOrEditMenuItem,
  handleSwitchToAddMode,
  isSubmitting,
}) => {
  return (
    <GlassCard className="w-full">
      {!addMode && editingMenuItem && (
        <EditableEntityView
          title="Editing Menu Item"
          text={`Menu Item #${editingMenuItem.id} - ${editingMenuItem.name} (${editingMenuItem.category?.name || 'No Category'})`}
        />
      )}

      <SectionHeader
        title=""
        description={addMode ? 'Create a new menu item' : 'Edit an existing menu item'}
      />

      <div className="flex gap-4">
        <Select
          label="Category"
          value={formData.categoryId}
          onChange={(value) => handleInputChange('categoryId', value)}
          options={categories?.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          required={true}
          error={formErrors.categoryId}
        />
        <Input
          label="Name"
          placeholder="Enter menu item name..."
          required={true}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={formErrors.name}
        />
        <Input
          label="Price"
          placeholder="Enter price..."
          type="number"
          prefix="$"
          required={true}
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          error={formErrors.price}
        />
      </div>

      <div className="mt-4">
        <TextArea
          label="Description"
          placeholder="Enter menu item description..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={formErrors.description}
        />
      </div>

      <MenuItemIngredientsManagerForm
        ingredients={formData.ingredients}
        setIngredients={(ingredients) => handleInputChange('ingredients', ingredients)}
        error={formErrors.ingredients}
      />

      <ToggleCard
        className="mt-6"
        title="Availability"
        description="Whether the menu item is available for ordering"
        checked={formData.isAvailable}
        onChange={(value) => handleInputChange('isAvailable', value)}
        error={formErrors.isAvailable}
      />

      <div className="flex justify-end gap-3 mt-6">
        {!addMode && (
          <FormButton
            text="Cancel"
            icon="cancel"
            onClick={handleSwitchToAddMode}
            type="red"
            className="w-auto"
            disabled={isSubmitting}
          />
        )}
        <FormButton
          text={addMode ? 'Create Menu Item' : 'Edit Menu Item'}
          icon="save"
          onClick={handleAddOrEditMenuItem}
          type="green"
          className="w-auto"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
      </div>
    </GlassCard>
  );
};

export default MenuItemForm;
