import React from 'react';
import CategoryForm from './CategoryForm';
import CategoriesTableForm from './CategoriesTableForm';
import useCategoryManagerForm from '../../hooks/useCategoryManagerForm';

const CategoryManagerForm = () => {
  const {
    formData,
    validationErrors,
    categories,
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
  } = useCategoryManagerForm();

  return (
    <>
      {/* Create/Edit Category Form Section */}
      <CategoryForm
        formData={formData}
        validationErrors={validationErrors}
        addMode={addMode}
        editingCategory={editingCategory}
        handleInputChange={handleInputChange}
        handleEditCategory={handleEditCategory}
        switchToEditMode={switchToEditMode}
        switchToAddMode={switchToAddMode}
        handleSubmit={handleSubmit}
      />

      {/* Existing Categories Table */}
      <CategoriesTableForm
        categories={categories}
        hasOrderChanges={hasOrderChanges}
        handleEditCategory={handleEditCategory}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleDeleteCategory={handleDeleteCategory}
        saveOrderChanges={saveOrderChanges}
        cancelOrderChanges={cancelOrderChanges}
      />
    </>
  );
};

export default CategoryManagerForm;
