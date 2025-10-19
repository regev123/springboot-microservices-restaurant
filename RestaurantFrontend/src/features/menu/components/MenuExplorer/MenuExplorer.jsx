import React from 'react';
import Select from '../../../../components/common/Select/Select';
import Table from '../../../../components/common/Table/Table';
import Button from '../../../../components/common/Button/Button';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import './MenuExplorer.css';
import useMenuExplorer from '../../hooks/useMenuExplorer';

const MenuExplorer = () => {
  const {
    menus,
    categories,
    selectedMenu,
    filterCategory,
    setFilterCategory,
    filteredAssignedItems,
    filteredAvailableItems,
    handleMenuChange,
    handleAssignItem,
    handleRemoveItem,
  } = useMenuExplorer();

  // === Shared Table Columns ===
  const itemColumns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Name', accessor: 'name' },
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
          <ul className="ingredient-list">
            {row.ingredients.map((ing, idx) => (
              <li key={idx} className="ingredient-item">
                {ing.name} {ing.removable && <span className="removable-tag">(R)</span>}
              </li>
            ))}
          </ul>
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

  // === Actions ===
  const availableActions = [
    (row) => (
      <Button
        key={`assign-${row.id}`}
        text=""
        icon="add"
        variant="primary"
        onClick={() => handleAssignItem(row.id)}
      />
    ),
  ];

  const assignedActions = [
    (row) => (
      <Button
        key={`remove-${row.id}`}
        text=""
        icon="delete"
        variant="danger"
        onClick={() => handleRemoveItem(row.id)}
      />
    ),
  ];

  return (
    <>
      {/* === Menu Selection Section === */}
      <div className="menu-selector-row">
        <div className="menu-selector">
          <Select
            value={selectedMenu}
            options={menus.map((menu) => menu.name)}
            onChange={handleMenuChange}
            placeholder="Select a Menu"
          />
        </div>

        {selectedMenu && (
          <div className="menu-status">
            Status:{' '}
            <StatusBadge
              status={menus.find((menu) => menu.name === selectedMenu)?.status || 'UNKNOWN'}
            />
          </div>
        )}
      </div>
      <div className="filter-bar">
        <Select
          value={filterCategory}
          options={['All', ...categories]}
          onChange={(value) => setFilterCategory(value === 'All' ? '' : value)}
          placeholder="Filter by Category"
        />
      </div>

      {/* === Available Menu Items === */}
      {selectedMenu && (
        <Table
          columns={itemColumns}
          data={filteredAvailableItems}
          actions={availableActions}
          pageSize={5}
        />
      )}

      {/* === Assigned Menu Items === */}
      {selectedMenu && (
        <Table
          columns={itemColumns}
          data={filteredAssignedItems}
          actions={assignedActions}
          pageSize={5}
        />
      )}
    </>
  );
};

export default MenuExplorer;
