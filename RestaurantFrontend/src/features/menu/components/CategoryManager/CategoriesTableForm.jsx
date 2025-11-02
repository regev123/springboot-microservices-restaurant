import React, { useState, useCallback } from 'react';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import Table from '../../../../components/common/Table/Table';
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog/ConfirmationDialog';
import TableBadge from '../../../../components/common/TableBadge/TableBadge';
import ButtonForm from '../../../../components/common/Button2/FormButton';

/**
 * CategoriesTableForm Component
 *
 * A clean, well-structured component for displaying categories in a table format.
 * Follows SOLID principles and clean code concepts:
 * - Single Responsibility: Only handles category table display and interactions
 * - Open/Closed: Extensible through props and configuration
 * - Dependency Inversion: Depends on abstractions (props) not concretions
 *
 * Features:
 * - Displays category data in a structured table
 * - Shows category name, description, order, and item count
 * - Provides action buttons for each category (edit, move up/down, delete)
 * - Formats dates consistently
 * - Shows visual badges for order and item count
 * - Handles empty states gracefully
 * - Supports category reordering with up/down buttons
 * - Smart confirmation dialog for categories with menu items
 */
/**
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of categories to display
 * @param {boolean} props.hasOrderChanges - Whether there are pending order changes
 * @param {Function} props.handleSwitchToEditMode - Handler for editing a category
 * @param {Function} props.handleMoveUp - Handler for moving category up
 * @param {Function} props.handleMoveDown - Handler for moving category down
 * @param {Function} props.handleDeleteCategory - Handler for deleting a category
 * @param {Function} props.saveOrderChanges - Handler for saving order changes
 * @param {Function} props.cancelOrderChanges - Handler for canceling order changes
 * @returns {JSX.Element} Categories table form component
 */
const CategoriesTableForm = ({
  categories,
  hasOrderChanges,
  handleSwitchToEditMode,
  handleMoveUp,
  handleMoveDown,
  handleDeleteCategory,
  saveOrderChanges,
  cancelOrderChanges,
}) => {
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: '',
    itemsCount: 0,
    onConfirm: null,
  });

  /**
   * Handles delete button click with smart confirmation logic
   * @param {string} categoryId - Category ID to delete
   * @param {Function} deleteHandler - Original delete handler
   */
  const handleDeleteClick = useCallback(
    (categoryId, deleteHandler) => {
      const category = categories.find((cat) => cat.id === categoryId);
      const itemsCount = category?.menuItems?.length || 0;

      if (itemsCount > 0) {
        // Show confirmation dialog for categories with items
        setConfirmationDialog({
          isOpen: true,
          categoryId,
          categoryName: category?.name || 'Unknown Category',
          itemsCount,
          onConfirm: () => {
            deleteHandler(categoryId);
            setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
          },
        });
      } else {
        // Direct delete for categories without items
        deleteHandler(categoryId);
      }
    },
    [categories]
  );

  /**
   * Closes the confirmation dialog
   */
  const handleCloseConfirmation = useCallback(() => {
    setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);
  // ==================== COMPUTED VALUES ====================

  /**
   * Table columns configuration
   */
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-white">{row.name}</div>
            {row.description && <div className="text-sm text-gray-400">{row.description}</div>}
          </div>
        </div>
      ),
    },
    {
      header: 'Order',
      render: (row) => <TableBadge text={`#${row.sortOrder}`} color="blue" centered />,
    },
    {
      header: 'Items Count',
      render: (row) => (
        <TableBadge text={`${row.menuItems?.length || 0} items`} color="green" centered />
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Updated',
      accessor: 'updatedAt',
      render: (row) => (
        <span className="text-sm text-gray-400">
          {new Date(row.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    (row) => {
      const currentIndex = categories.findIndex((cat) => cat.id === row.id);
      const buttons = [
        {
          icon: 'edit',
          onClick: () => handleSwitchToEditMode(row),
          title: 'Edit Category',
        },
      ];

      // Conditionally add move up button (not for first item)
      if (currentIndex > 0) {
        buttons.push({
          icon: 'arrow-up',
          onClick: () => handleMoveUp(row),
          title: 'Move Category Up',
        });
      }

      // Conditionally add move down button (not for last item)
      if (currentIndex < categories.length - 1) {
        buttons.push({
          icon: 'arrow-down',
          onClick: () => handleMoveDown(row),
          title: 'Move Category Down',
        });
      }

      // Always add delete button
      buttons.push({
        icon: 'delete',
        onClick: () => handleDeleteClick(row.id, handleDeleteCategory),
        title: 'Delete Category',
      });

      return <ButtonGroup buttons={buttons} size="small" />;
    },
  ];

  // ==================== RENDER ====================

  return (
    <>
      {/* Main Table Container */}
      <GlassCard>
        <div className="flex items-center justify-between">
          <SectionHeader title="Existing Categories" description="Manage your menu categories" />
          {hasOrderChanges && (
            <div className="flex items-center gap-3">
              <ButtonForm
                text="Cancel Changes"
                icon="cancel"
                type="red"
                onClick={cancelOrderChanges}
              />
              <ButtonForm
                text="Save Order Changes"
                icon="save"
                type="green"
                onClick={saveOrderChanges}
              />
            </div>
          )}
        </div>

        <Table columns={columns} data={categories} actions={actions} pageSize={5} />
      </GlassCard>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmationDialog.onConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${confirmationDialog.categoryName}"? This will also delete all ${confirmationDialog.itemsCount} menu item${confirmationDialog.itemsCount !== 1 ? 's' : ''} in this category. This action cannot be undone.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default CategoriesTableForm;
