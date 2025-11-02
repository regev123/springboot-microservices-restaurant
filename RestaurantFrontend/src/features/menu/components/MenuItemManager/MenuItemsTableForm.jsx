import React, { useState, useEffect } from 'react';
import Table from '../../../../components/common/Table/Table';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import TableBadge from '../../../../components/common/TableBadge/TableBadge';
import Tooltip from '../../../../components/common/Tooltip/Tooltip';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import Select from '../../../../components/common/Select/Select';
import useDateFormat from '../../../../hooks/useDateFormat';

const MenuItemsTableForm = ({
  menuItems,
  categories,
  handleSwitchToEditMode,
  handleDeleteMenuItem,
}) => {
  const { formatDateWithHour } = useDateFormat();
  const [selectedCategoryId, setSelectedCategoryId] = useState(String(categories[0].id));

  // Create category options for the select dropdown
  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));
  // Filter menu items by selected category
  const filteredMenuItems = menuItems.filter(
    (item) => item.category && String(item.category.id) === selectedCategoryId
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => {
        if (!row.description) {
          return <span className="text-slate-400">N/A</span>;
        }

        if (row.description.length > 100) {
          return (
            <Tooltip content={row.description} position="top">
              <span className="cursor-help">{row.description.substring(0, 100) + '...'}</span>
            </Tooltip>
          );
        }

        return row.description;
      },
    },
    {
      header: 'Ingredients',
      accessor: 'ingredients',
      render: (row) => {
        if (!row.ingredients || row.ingredients.length === 0) {
          return <span className="text-slate-400">None</span>;
        }
        const remainingIngredients = row.ingredients.slice(3);
        const remainingNames = remainingIngredients
          .map((ing) => `${ing.name}${ing.removable ? ' (R)' : ''}`)
          .join(', ');

        return (
          <div className="flex flex-wrap gap-1">
            {row.ingredients.slice(0, 3).map((ing, index) => (
              <TableBadge
                key={index}
                text={
                  <span>
                    {ing.name}
                    {ing.removable && <span className="text-green-400 font-bold"> (R)</span>}
                  </span>
                }
                color="purple"
              />
            ))}
            {row.ingredients.length > 3 && (
              <Tooltip content={remainingNames} position="top">
                <div className="cursor-help">
                  <TableBadge text={`+${row.ingredients.length - 3}`} color="gray" />
                </div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => `$${parseFloat(row.price).toFixed(2)}`,
    },
    {
      header: 'Availability',
      accessor: 'isAvailable',
      render: (row) => {
        return <StatusBadge status={row.isAvailable ? 'ACTIVE' : 'INACTIVE'} />;
      },
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDateWithHour(row.createdAt),
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      render: (row) => formatDateWithHour(row.updatedAt),
    },
  ];

  const actions = [
    (row) => {
      const buttons = [
        {
          icon: 'edit',
          onClick: () => handleSwitchToEditMode(row),
          title: 'Edit Menu Item',
        },
        {
          icon: 'delete',
          onClick: () => handleDeleteMenuItem(row.id),
          title: 'Delete Menu Item',
        },
      ];

      return <ButtonGroup buttons={buttons} size="small" />;
    },
  ];

  return (
    <GlassCard className="mt-6">
      <SectionHeader
        title="Existing Menu Items"
        description="Manage your menu items"
        className="mb-4"
      />

      {/* Category Filter */}
      <div className="mb-6 max-w-xs">
        <Select
          label="Filter by Category"
          value={selectedCategoryId}
          options={categoryOptions}
          onChange={setSelectedCategoryId}
          placeholder="Select a category..."
        />
      </div>

      {/* Display count */}
      <div className="mb-4 ml-1 text-sm text-slate-400">
        Showing {filteredMenuItems.length} of {menuItems.length} items
      </div>

      <Table columns={columns} data={filteredMenuItems} actions={actions} pageSize={5} />
    </GlassCard>
  );
};

export default MenuItemsTableForm;
