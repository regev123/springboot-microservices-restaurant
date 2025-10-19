import React from 'react';
import MenuForm from './MenuForm';
import MenusTableForm from './MenusTableForm';
import useMenuManagerForm from '../../hooks/useMenuManagerForm';

const MenuManagerForm = () => {
  const {
    formData,
    handleInputChange,
    onSubmit,
    handleActivateMenu,
    handleDelete,
    switchToEditMode,
    switchToAddMode,
    addMode,
    editingMenu,
    hasChanges,
    isSubmitting,
    hasError,
    getError,
  } = useMenuManagerForm();

  return (
    <>
      {/* Create/Edit Menu Form Section */}
      <MenuForm
        addMode={addMode}
        editingMenu={editingMenu}
        formData={formData}
        handleInputChange={handleInputChange}
        hasError={hasError}
        getError={getError}
        hasChanges={hasChanges}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        switchToAddMode={switchToAddMode}
      />

      {/* Existing Menus Table */}
      <MenusTableForm
        handleEditMenu={switchToEditMode}
        handleDeleteMenu={handleDelete}
        handleActivateMenu={handleActivateMenu}
      />
    </>
  );
};

export default MenuManagerForm;
