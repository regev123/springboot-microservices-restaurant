import React from 'react';
import CategoryForm from './CategoryForm';
import CategoriesTableForm from './CategoriesTableForm';
import useCategoryManagerForm from '../../hooks/useCategoryManagerForm';

const CategoryManagerForm = () => {
  const {
    formData,
    categories,
    addMode,
    editingCategory,
    hasOrderChanges,
    handleSwitchToEditMode,
    handleSwitchToAddMode,
    handleDeleteCategory,
    handleMoveUp,
    handleMoveDown,
    saveOrderChanges,
    cancelOrderChanges,
    handleInputChange,
    handleAddOrEditCategory,
    formErrors,
    isSubmitting,
  } = useCategoryManagerForm();

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left Side - Create/Edit Category Form Section (20%) */}
      <div className="col-span-1">
        <CategoryForm
          formData={formData}
          addMode={addMode}
          editingCategory={editingCategory}
          handleInputChange={handleInputChange}
          handleSwitchToAddMode={handleSwitchToAddMode}
          handleAddOrEditCategory={handleAddOrEditCategory}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Right Side - Existing Categories Table (80%) */}
      <div className="col-span-4">
        <CategoriesTableForm
          categories={categories}
          hasOrderChanges={hasOrderChanges}
          handleSwitchToEditMode={handleSwitchToEditMode}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleDeleteCategory={handleDeleteCategory}
          saveOrderChanges={saveOrderChanges}
          cancelOrderChanges={cancelOrderChanges}
        />
      </div>
    </div>
  );
};

export default CategoryManagerForm;
