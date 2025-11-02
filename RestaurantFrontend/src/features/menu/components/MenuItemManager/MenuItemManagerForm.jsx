import React from 'react';
import MenuItemForm from './MenuItemForm';
import MenuItemsTableForm from './MenuItemsTableForm';
import useMenuItemManagerForm from '../../hooks/useMenuItemMangaerForm';

const MenuItemManagerForm = () => {
  const {
    categories,
    addMode,
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    handleAddOrEditMenuItem,
    handleSwitchToEditMode,
    handleSwitchToAddMode,
    handleDeleteMenuItem,
    menuItems,
  } = useMenuItemManagerForm();

  return (
    <>
      <MenuItemForm
        categories={categories}
        addMode={addMode}
        formData={formData}
        isSubmitting={isSubmitting}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        handleAddOrEditMenuItem={handleAddOrEditMenuItem}
        handleSwitchToAddMode={handleSwitchToAddMode}
      />

      {menuItems && menuItems.length > 0 && (
        <MenuItemsTableForm
          menuItems={menuItems}
          categories={categories}
          handleSwitchToEditMode={handleSwitchToEditMode}
          handleDeleteMenuItem={handleDeleteMenuItem}
        />
      )}
    </>
  );
};

export default MenuItemManagerForm;
