import React from 'react';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import Table from '../../../../components/common/Table/Table';
import ButtonForm from '../../../../components/common/Button2/FormButton';

// ==================== CONSTANTS ====================
const TABLE_CONFIG = {
  PAGE_SIZE: 5,
};

const TABLE_HEADERS = {
  NAME: 'Name',
  ORDER: 'Order',
  ITEMS_COUNT: 'Items Count',
  CREATED: 'Created',
  UPDATED: 'Updated',
};

const BUTTON_TITLES = {
  EDIT: 'Edit Category',
  DELETE: 'Delete Category',
  MOVE_UP: 'Move Category Up',
  MOVE_DOWN: 'Move Category Down',
};

const SECTION_CONFIG = {
  TITLE: 'Existing Categories',
  DESCRIPTION: 'Manage your menu categories',
};

const SAVE_ORDER_CONFIG = {
  SAVE_BUTTON_TEXT: 'Save Order Changes',
  SAVE_BUTTON_ICON: 'save',
  SAVE_BUTTON_TYPE: 'green',
  CANCEL_BUTTON_TEXT: 'Cancel Changes',
  CANCEL_BUTTON_ICON: 'cancel',
  CANCEL_BUTTON_TYPE: 'red',
};

const CSS_CLASSES = {
  NAME_CONTAINER: 'flex items-center gap-3',
  NAME_PRIMARY: 'font-medium text-white',
  NAME_DESCRIPTION: 'text-sm text-gray-400',
  ORDER_CONTAINER: 'text-center',
  ORDER_BADGE: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  ITEMS_CONTAINER: 'text-center',
  ITEMS_BADGE: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  DATE_TEXT: 'text-sm text-gray-400',
  HEADER_ROW: 'flex items-center justify-between',
  SAVE_BUTTON_CONTAINER: 'flex items-center gap-3',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Creates save and cancel order buttons component
 * @param {boolean} hasOrderChanges - Whether there are pending order changes
 * @param {Function} saveOrderChanges - Function to save order changes
 * @param {Function} cancelOrderChanges - Function to cancel order changes
 * @returns {JSX.Element|null} Save and cancel buttons or null
 */
const createOrderActionButtons = (hasOrderChanges, saveOrderChanges, cancelOrderChanges) => {
  if (!hasOrderChanges) return null;

  return (
    <div className={CSS_CLASSES.SAVE_BUTTON_CONTAINER}>
      <ButtonForm
        text={SAVE_ORDER_CONFIG.CANCEL_BUTTON_TEXT}
        icon={SAVE_ORDER_CONFIG.CANCEL_BUTTON_ICON}
        type={SAVE_ORDER_CONFIG.CANCEL_BUTTON_TYPE}
        onClick={cancelOrderChanges}
      />
      <ButtonForm
        text={SAVE_ORDER_CONFIG.SAVE_BUTTON_TEXT}
        icon={SAVE_ORDER_CONFIG.SAVE_BUTTON_ICON}
        type={SAVE_ORDER_CONFIG.SAVE_BUTTON_TYPE}
        onClick={saveOrderChanges}
      />
    </div>
  );
};

/**
 * Creates name column configuration
 * @returns {Object} Name column configuration
 */
const createNameColumn = () => ({
  header: TABLE_HEADERS.NAME,
  accessor: 'name',
  render: (row) => (
    <div className={CSS_CLASSES.NAME_CONTAINER}>
      <div>
        <div className={CSS_CLASSES.NAME_PRIMARY}>{row.name}</div>
        {row.description && <div className={CSS_CLASSES.NAME_DESCRIPTION}>{row.description}</div>}
      </div>
    </div>
  ),
});

/**
 * Creates order column configuration
 * @returns {Object} Order column configuration
 */
const createOrderColumn = () => ({
  header: TABLE_HEADERS.ORDER,
  render: (row) => (
    <div className={CSS_CLASSES.ORDER_CONTAINER}>
      <span className={CSS_CLASSES.ORDER_BADGE}>#{row.sortOrder}</span>
    </div>
  ),
});

/**
 * Creates items count column configuration
 * @returns {Object} Items count column configuration
 */
const createItemsCountColumn = () => ({
  header: TABLE_HEADERS.ITEMS_COUNT,
  render: (row) => (
    <div className={CSS_CLASSES.ITEMS_CONTAINER}>
      <span className={CSS_CLASSES.ITEMS_BADGE}>{row.menuItems?.length || 0} items</span>
    </div>
  ),
});

/**
 * Creates date column configuration
 * @param {string} header - Column header
 * @param {string} accessor - Data accessor
 * @returns {Object} Date column configuration
 */
const createDateColumn = (header, accessor) => ({
  header,
  accessor,
  render: (row) => (
    <span className={CSS_CLASSES.DATE_TEXT}>{new Date(row[accessor]).toLocaleDateString()}</span>
  ),
});

/**
 * Creates edit button for category row
 * @param {Object} category - Category object
 * @param {Function} handleEditCategory - Edit category handler
 * @returns {Object} Edit button configuration
 */
const createEditButton = (category, handleEditCategory) => ({
  icon: 'edit',
  onClick: () => handleEditCategory(category),
  title: BUTTON_TITLES.EDIT,
});

/**
 * Creates move up button for category row
 * @param {Object} category - Category object
 * @param {Function} handleMoveUp - Move up handler
 * @returns {Object} Move up button configuration
 */
const createMoveUpButton = (category, handleMoveUp) => ({
  icon: 'arrow-up',
  onClick: () => handleMoveUp(category),
  title: BUTTON_TITLES.MOVE_UP,
});

/**
 * Creates move down button for category row
 * @param {Object} category - Category object
 * @param {Function} handleMoveDown - Move down handler
 * @returns {Object} Move down button configuration
 */
const createMoveDownButton = (category, handleMoveDown) => ({
  icon: 'arrow-down',
  onClick: () => handleMoveDown(category),
  title: BUTTON_TITLES.MOVE_DOWN,
});

/**
 * Creates delete button for category row
 * @param {string} categoryId - Category ID
 * @param {Function} handleDeleteCategory - Delete category handler
 * @returns {Object} Delete button configuration
 */
const createDeleteButton = (categoryId, handleDeleteCategory) => ({
  icon: 'delete',
  onClick: () => handleDeleteCategory(categoryId),
  title: BUTTON_TITLES.DELETE,
});

/**
 * Creates action buttons for category row
 * @param {Object} row - Category row data
 * @param {Function} handleEditCategory - Edit category handler
 * @param {Function} handleMoveUp - Move up handler
 * @param {Function} handleMoveDown - Move down handler
 * @param {Function} handleDeleteCategory - Delete category handler
 * @param {number} currentIndex - Current index of the category
 * @param {number} totalItems - Total number of categories
 * @returns {JSX.Element} Button group component
 */
const createActionButtons = (
  row,
  handleEditCategory,
  handleMoveUp,
  handleMoveDown,
  handleDeleteCategory,
  currentIndex,
  totalItems
) => {
  const buttons = [createEditButton(row, handleEditCategory)];

  // Add move up button (not for first item)
  if (currentIndex > 0 && handleMoveUp) {
    buttons.push(createMoveUpButton(row, handleMoveUp));
  }

  // Add move down button (not for last item)
  if (currentIndex < totalItems - 1 && handleMoveDown) {
    buttons.push(createMoveDownButton(row, handleMoveDown));
  }

  buttons.push(createDeleteButton(row.id, handleDeleteCategory));

  return <ButtonGroup buttons={buttons} size="small" />;
};

/**
 * Component for displaying categories in a table format
 *
 * Features:
 * - Displays category data in a structured table
 * - Shows category name, description, order, and item count
 * - Provides action buttons for each category (edit, move up/down, delete)
 * - Formats dates consistently
 * - Shows visual badges for order and item count
 * - Handles empty states gracefully
 * - Supports category reordering with up/down buttons
 *
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of categories to display
 * @param {boolean} props.hasOrderChanges - Whether there are pending order changes
 * @param {Function} props.handleEditCategory - Handler for editing a category
 * @param {Function} props.handleMoveUp - Handler for moving category up
 * @param {Function} props.handleMoveDown - Handler for moving category down
 * @param {Function} props.handleDeleteCategory - Handler for deleting a category
 * @param {Function} props.saveOrderChanges - Handler for saving order changes
 * @param {Function} props.cancelOrderChanges - Handler for canceling order changes
 * @returns {JSX.Element} Categories table component
 */
const CategoriesTableForm = ({
  categories,
  hasOrderChanges,
  handleEditCategory,
  handleMoveUp,
  handleMoveDown,
  handleDeleteCategory,
  saveOrderChanges,
  cancelOrderChanges,
}) => {
  // ==================== TABLE CONFIGURATION ====================

  /**
   * Table columns configuration
   * @type {Array<Object>}
   */
  const columns = [
    createNameColumn(),
    createOrderColumn(),
    createItemsCountColumn(),
    createDateColumn(TABLE_HEADERS.CREATED, 'createdAt'),
    createDateColumn(TABLE_HEADERS.UPDATED, 'updatedAt'),
  ];

  /**
   * Table actions configuration
   * @type {Array<Function>}
   */
  const actions = [
    (row) => {
      // Calculate the index based on sortOrder since Table component doesn't pass it
      const currentIndex = categories.findIndex((category) => category.sortOrder === row.sortOrder);
      return createActionButtons(
        row,
        handleEditCategory,
        handleMoveUp,
        handleMoveDown,
        handleDeleteCategory,
        currentIndex,
        categories.length
      );
    },
  ];

  // ==================== RENDER ====================
  return (
    <GlassCard>
      <div className={CSS_CLASSES.HEADER_ROW}>
        <SectionHeader title={SECTION_CONFIG.TITLE} description={SECTION_CONFIG.DESCRIPTION} />
        {createOrderActionButtons(hasOrderChanges, saveOrderChanges, cancelOrderChanges)}
      </div>
      <Table
        columns={columns}
        data={categories}
        actions={actions}
        pageSize={TABLE_CONFIG.PAGE_SIZE}
      />
    </GlassCard>
  );
};

export default CategoriesTableForm;
