// src/features/menu/CreateMenuItemForm/CreateMenuItemForm.jsx
import React, { useRef } from 'react';
import Input from '../../../../components/common/Input/Input';
import Select from '../../../../components/common/Select/Select';
import Button from '../../../../components/common/Button/Button';
import Table from '../../../../components/common/Table/Table';
import './CreateMenuItemForm.css';
import useCreateMenuItemForm from '../../hooks/useCreateMenuItemForm';

const CreateMenuItemForm = () => {
  const formRef = useRef(null);

  const {
    // Form state
    category,
    setCategory,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    isAvailable,
    setIsAvailable,
    ingredients,
    setIngredients,
    newIngredient,
    setNewIngredient,

    // Data state
    menuItems,
    filterCategory,
    setFilterCategory,
    filteredItems,

    // Editing state
    isEditMode,
    editingItemId,

    // Constants
    categories,

    // Actions
    handleCreate,
    handleDelete,
    handleToggleAvailability,
    handleEdit,
    handleCancelEdit,
    resetForm,
    handleAddIngredient,
    handleRemoveIngredient,
    handleToggleIngredientRemovable,
  } = useCreateMenuItemForm();

  // === Custom Edit Handler with Scroll ===
  const handleEditWithScroll = (row) => {
    handleEdit(row);

    // Scroll to form with smooth behavior
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100); // Small delay to ensure form is populated first
  };

  // === Table Columns ===
  const columns = [
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => row.category,
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => row.name,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => row.description || <span className="muted-text">No description</span>,
    },
    {
      header: 'Ingredients',
      accessor: 'ingredients',
      render: (row) =>
        row.ingredients && row.ingredients.length > 0 ? (
          <div className="ingredients-display">
            {row.ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-display-item">
                {ing.name}
                {ing.removable && <span className="removable-tag">(R)</span>}
              </div>
            ))}
          </div>
        ) : (
          <span className="muted-text">No ingredients</span>
        ),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      header: 'Available',
      accessor: 'isAvailable',
      render: (row) => (row.isAvailable ? 'Yes' : 'No'),
    },
  ];

  // === Table Actions ===
  const actions = [
    (row) => (
      <div className="normal-action-buttons">
        <Button
          key={`edit-${row.id}`}
          text=""
          icon="edit"
          variant="primary"
          onClick={() => handleEditWithScroll(row)}
        />
        <Button
          key={`delete-${row.id}`}
          text=""
          icon="delete"
          variant="danger"
          onClick={() => handleDelete(row.id)}
        />
      </div>
    ),
  ];

  return (
    <>
      {/* === Modern Creation Form === */}
      <div ref={formRef}>
        <div className="modern-form-container">
          {/* Form Grid Layout */}
          <div className="form-grid">
            {/* Category Selection */}
            <div className="form-field-group">
              <Select
                value={category}
                options={categories}
                onChange={setCategory}
                placeholder="Select category"
              />
            </div>

            {/* Item Name */}
            <div className="form-field-group">
              <Input
                label="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
              />
            </div>

            {/* Price */}
            <div className="form-field-group">
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <Input
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required={true}
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="form-field-group">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required={false}
                label="Description"
              />
            </div>

            {/* Ingredients Section - Full Width */}
            <div className="form-field-group full-width">
              <div className="ingredients-section">
                <label className="ingredients-label">Ingredients</label>
                <div className="ingredient-input-group">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Enter ingredient name"
                    required={false}
                  />
                  <Button
                    text="Add"
                    variant="primary"
                    onClick={handleAddIngredient}
                    icon="add"
                    disabled={!newIngredient.trim()}
                  />
                </div>
                {ingredients.length > 0 && (
                  <div className="ingredients-list">
                    <div className="ingredients-list-header">
                      <span>Added Ingredients ({ingredients.length})</span>
                    </div>
                    <div className="ingredients-items">
                      {ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="ingredient-item">
                          <span className="ingredient-name">{ingredient.name}</span>
                          <div className="ingredient-controls">
                            <div
                              className={`removable-toggle ${ingredient.removable ? 'active' : ''}`}
                              onClick={() => handleToggleIngredientRemovable(ingredient.id)}
                            >
                              <span className="toggle-text">Removable</span>
                              <div className="toggle-switch">
                                <div className="toggle-slider"></div>
                              </div>
                            </div>
                            <Button
                              text=""
                              icon="delete"
                              variant="danger"
                              onClick={() => handleRemoveIngredient(ingredient.id)}
                              className="remove-ingredient-btn"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="form-field-group full-width">
              <div
                className={`availability-toggle ${isAvailable ? 'active' : ''}`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                <div className="toggle-content">
                  <h4 className="toggle-title">Available for Order</h4>
                  <p className="toggle-subtitle">Customers can order this item</p>
                </div>
                <div className="toggle-switch">
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="form-actions-modern">
            <div className="actions-buttons">
              <Button text="Cancel" variant="secondary" onClick={resetForm} />
              <Button
                text={isEditMode ? 'Update Menu Item' : 'Create Menu Item'}
                variant="primary"
                onClick={handleCreate}
                icon={isEditMode ? 'save' : 'add'}
              />
            </div>
          </div>
        </div>
      </div>
      {/* === Filter & Table Section === */}{' '}
      <div className="filter-bar">
        <Select
          value={filterCategory}
          options={['All', ...categories]}
          onChange={(value) => setFilterCategory(value === 'All' ? '' : value)}
          placeholder="Filter by Category"
        />
      </div>
      <Table columns={columns} data={filteredItems} actions={actions} pageSize={5} />
    </>
  );
};

export default CreateMenuItemForm;
