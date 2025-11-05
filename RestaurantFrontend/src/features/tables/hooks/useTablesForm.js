import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActiveTables } from '../../../store/thunks/tableThunks';

// Helper function to generate status config from color name
const createStatusConfig = (color) => ({
  gradient: `from-${color}-500/15 via-${color}-500/8 to-transparent`,
  border: `border-${color}-500/25`,
  glow: `hover:shadow-${color}-500/20`,
  iconBg: `bg-${color}-500/20`,
  floorBg: `bg-${color}-500/30`,
  floorBorder: `border-${color}-500/50`,
  floorShadow: `shadow-${color}-500/30`,
});

// Status configuration constants
const STATUS_CONFIG = {
  AVAILABLE: createStatusConfig('emerald'),
  OCCUPIED: createStatusConfig('red'),
  RESERVED: createStatusConfig('amber'),
  CLEANING: createStatusConfig('blue'),
};

// Status icon constants
const STATUS_ICONS = {
  AVAILABLE: '✓',
  OCCUPIED: '👥',
  RESERVED: '📅',
  CLEANING: '🧹',
  DEFAULT: '🪑',
};

const useTablesForm = () => {
  const dispatch = useDispatch();
  const { tables, tablesUI } = useSelector((state) => state.tables);
  const loading = tablesUI?.FetchingTables || false;

  useEffect(() => {
    dispatch(fetchActiveTables());
  }, [dispatch]);

  // Sort tables by table number
  const sortedTables = [...(tables || [])].sort((a, b) => a.tableNumber - b.tableNumber);

  // Group tables by status
  const tablesByStatus = {
    AVAILABLE: sortedTables.filter((t) => t.status === 'AVAILABLE' && t.isActive),
    OCCUPIED: sortedTables.filter((t) => t.status === 'OCCUPIED' && t.isActive),
    RESERVED: sortedTables.filter((t) => t.status === 'RESERVED' && t.isActive),
    CLEANING: sortedTables.filter((t) => t.status === 'CLEANING' && t.isActive),
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status?.toUpperCase()] || createStatusConfig('slate');
  };

  const getStatusIcon = (status) => {
    return STATUS_ICONS[status?.toUpperCase()] || STATUS_ICONS.DEFAULT;
  };

  // Floor Plan Layout - Arrange tables in a restaurant-like grid
  const arrangeTablesForFloorPlan = (tablesList) => {
    const cols = Math.ceil(Math.sqrt(tablesList.length)) || 6;
    const rows = Math.ceil(tablesList.length / cols) || 4;
    return { tables: tablesList, cols, rows };
  };

  const totalActiveTables = sortedTables.filter((t) => t.isActive).length;
  const allActiveTables = sortedTables.filter((t) => t.isActive);

  return {
    loading,
    sortedTables,
    tablesByStatus,
    totalActiveTables,
    allActiveTables,
    getStatusConfig,
    getStatusIcon,
    arrangeTablesForFloorPlan,
  };
};

export default useTablesForm;

