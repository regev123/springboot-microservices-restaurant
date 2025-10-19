import React from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../components/common/Table/Table';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import useDateFormat from '../../../../hooks/useDateFormat';

// ==================== CONSTANTS ====================
const TABLE_CONFIG = {
  PAGE_SIZE: 5,
  STATUS_DRAFT: 'DRAFT',
};

const TABLE_HEADERS = {
  MENU_NAME: 'Menu Name',
  STATUS: 'Status',
  CREATED_AT: 'Created At',
  UPDATED_AT: 'Updated At',
};

const BUTTON_TITLES = {
  EDIT: 'Edit Menu',
  DELETE: 'Delete Menu',
  ACTIVATE: 'Activate Menu',
};

const SECTION_CONFIG = {
  TITLE: 'Existing Menus',
  DESCRIPTION: 'Manage your restaurant menus',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Creates a status column configuration
 * @returns {Object} Status column configuration
 */
const createStatusColumn = () => ({
  header: TABLE_HEADERS.STATUS,
  render: (row) => (
    <div className="flex justify-center">
      <StatusBadge status={row.status} />
    </div>
  ),
});

/**
 * Creates a date column configuration
 * @param {string} header - Column header
 * @param {string} accessor - Data accessor
 * @param {Function} formatter - Date formatter function
 * @returns {Object} Date column configuration
 */
const createDateColumn = (header, accessor, formatter) => ({
  header,
  accessor,
  render: (row) => formatter(row[accessor]),
});

/**
 * Creates base action buttons for menu row
 * @param {Object} row - Menu row data
 * @param {Function} handleEditMenu - Edit menu handler
 * @param {Function} handleDeleteMenu - Delete menu handler
 * @returns {Array} Base action buttons
 */
const createBaseActionButtons = (row, handleEditMenu, handleDeleteMenu) => [
  {
    icon: 'edit',
    onClick: () => handleEditMenu(row),
    title: BUTTON_TITLES.EDIT,
  },
  {
    icon: 'delete',
    onClick: () => handleDeleteMenu(row.id),
    title: BUTTON_TITLES.DELETE,
  },
];

/**
 * Creates activate button for draft menus
 * @param {string} menuId - Menu ID
 * @param {Function} handleActivateMenu - Activate menu handler
 * @returns {Object} Activate button configuration
 */
const createActivateButton = (menuId, handleActivateMenu) => ({
  icon: 'power',
  onClick: () => handleActivateMenu(menuId),
  title: BUTTON_TITLES.ACTIVATE,
});

/**
 * Determines if menu can be activated
 * @param {Object} row - Menu row data
 * @returns {boolean} True if menu can be activated
 */
const canActivateMenu = (row) => row.status === TABLE_CONFIG.STATUS_DRAFT;

/**
 * Creates action buttons for menu row
 * @param {Object} row - Menu row data
 * @param {Function} handleEditMenu - Edit menu handler
 * @param {Function} handleDeleteMenu - Delete menu handler
 * @param {Function} handleActivateMenu - Activate menu handler
 * @returns {JSX.Element} Button group component
 */
const createActionButtons = (row, handleEditMenu, handleDeleteMenu, handleActivateMenu) => {
  const buttons = createBaseActionButtons(row, handleEditMenu, handleDeleteMenu);

  if (canActivateMenu(row)) {
    buttons.push(createActivateButton(row.id, handleActivateMenu));
  }

  return <ButtonGroup buttons={buttons} size="small" />;
};

/**
 * Component for displaying menus in a table format
 *
 * Features:
 * - Displays menu data in a structured table
 * - Provides action buttons for each menu (edit, delete, activate)
 * - Shows menu status with visual badges
 * - Formats dates consistently
 * - Handles different menu states (DRAFT, ACTIVE, etc.)
 *
 * @param {Object} props - Component props
 * @param {Function} props.handleEditMenu - Handler for editing a menu
 * @param {Function} props.handleDeleteMenu - Handler for deleting a menu
 * @param {Function} props.handleActivateMenu - Handler for activating a menu
 * @returns {JSX.Element} Menus table component
 */
const MenusTableForm = ({ handleEditMenu, handleDeleteMenu, handleActivateMenu }) => {
  // ==================== HOOKS ====================
  const menus = useSelector((state) => state.menu.menus);
  const { formatDateWithHour } = useDateFormat();

  // ==================== TABLE CONFIGURATION ====================

  /**
   * Table columns configuration
   * @type {Array<Object>}
   */
  const columns = [
    { header: TABLE_HEADERS.MENU_NAME, accessor: 'name' },
    createStatusColumn(),
    createDateColumn(TABLE_HEADERS.CREATED_AT, 'createdAt', formatDateWithHour),
    createDateColumn(TABLE_HEADERS.UPDATED_AT, 'updatedAt', formatDateWithHour),
  ];

  /**
   * Table actions configuration
   * @type {Array<Function>}
   */
  const actions = [
    (row) => createActionButtons(row, handleEditMenu, handleDeleteMenu, handleActivateMenu),
  ];

  // ==================== RENDER ====================
  return (
    <GlassCard>
      <SectionHeader title={SECTION_CONFIG.TITLE} description={SECTION_CONFIG.DESCRIPTION} />
      <Table columns={columns} data={menus} actions={actions} pageSize={TABLE_CONFIG.PAGE_SIZE} />
    </GlassCard>
  );
};

export default MenusTableForm;
