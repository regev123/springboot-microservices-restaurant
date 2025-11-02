import React from 'react';
import MenuForm from './MenuForm';
import MenusTableForm from './MenusTableForm';
import useMenuManagerForm from '../../hooks/useMenuManagerForm';

const MenuManagerForm = () => {
  const {
    menus,
    formData,
    addMode,
    editingMenu,
    handleInputChange,
    handleAddOrEditMenu,
    handleDeleteMenu,
    handleActivateMenu,
    handleSwitchToAddMode,
    handleSwitchToEditMode,
    formErrors,
    isSubmitting,
  } = useMenuManagerForm();

  return (
    <div className="grid grid-cols-5 gap-6 ">
      {/* Left Side - Create/Edit Menu Form Section (20%) */}
      <div className="col-span-1">
        <MenuForm
          addMode={addMode}
          editingMenu={editingMenu}
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          handleAddOrEditMenu={handleAddOrEditMenu}
          handleSwitchToAddMode={handleSwitchToAddMode}
        />
      </div>

      {/* Right Side - Existing Menus Table (80%) */}
      <div className="col-span-4">
        <MenusTableForm
          switchToEditMode={handleSwitchToEditMode}
          handleDeleteMenu={handleDeleteMenu}
          handleActivateMenu={handleActivateMenu}
          menus={menus}
        />
      </div>
    </div>
  );
};

export default MenuManagerForm;
