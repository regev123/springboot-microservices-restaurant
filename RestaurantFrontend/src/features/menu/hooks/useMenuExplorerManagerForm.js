import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuMenuItems, updateMenuMenuItems } from '../../../store/thunks/menuThunks';

const useMenuExplorerManagerForm = () => {
  const { menus, categories, menuItems } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  // Filter states
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false);
  const [menuAssignments, setMenuAssignments] = useState({});

  // Drag & Drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Prepare options for selects
  const menuOptions =
    menus?.map((menu) => ({
      value: menu.id,
      label: `${menu.name} ${menu.status === 'ACTIVE' ? '(Active)' : '(Inactive)'}`,
    })) || [];

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  // Sync fetched menu items to assignments map only for menus that don't have local assignments yet
  // This prevents overwriting local changes when switching between menus
  useEffect(() => {
    if (!menus) return;

    setMenuAssignments((prev) => {
      let updated = { ...prev };

      // Loop over all menus
      menus.forEach((menu) => {
        // Check if this menu id is already in the assignment map
        if (prev[menu.id] !== undefined) {
          // Already exists in map, continue (don't overwrite)
          return;
        }

        // Not in map yet, only add if menu has menuItems that is not null
        // If menuItems is null, it means menu items haven't been loaded yet, so don't add to map
        if (menu.menuItems !== null && menu.menuItems !== undefined) {
          // Extract IDs from menuItems (can be array of IDs or array of MenuItemDto objects)
          const assignedItemIds = Array.isArray(menu.menuItems)
            ? menu.menuItems.map((item) =>
                typeof item === 'number' || typeof item === 'string'
                  ? Number(item)
                  : Number(item.id)
              )
            : [];
          updated[menu.id] = assignedItemIds;
        }
        // If menuItems is null, don't add to map (menu not loaded yet)
      });

      return updated;
    });
  }, [menus]);

  const handleMenuChange = (value) => {
    setSelectedMenuId(value);
    setSelectedCategoryId(''); // Reset category when menu changes
    handleFetchMenuMenuItems(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategoryId(value);
  };

  const handleFetchMenuMenuItems = (menuId) => {
    if (!menuId || !menus) return;

    // Check if menu items are already fetched for this menu
    const menu = menus.find((m) => m.id === menuId);
    if (menu && menu.menuItems !== null && menu.menuItems !== undefined) {
      return;
    }

    // Menu items not fetched yet, dispatch the fetch action
    dispatch(fetchMenuMenuItems(menuId));
  };

  // Drag & Drop handlers
  const handleDragStart = (e, item, source) => {
    setDraggedItem({ ...item, source });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e, targetColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(targetColumn);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem || !selectedMenuId) return;

    // Update local assignment state
    setMenuAssignments((prev) => {
      const currentAssignments = prev[selectedMenuId] || [];
      let updatedAssignments;

      if (draggedItem.source === 'assigned' && targetColumn === 'available') {
        // Remove item from assignment
        updatedAssignments = {
          ...prev,
          [selectedMenuId]: currentAssignments.filter((id) => id !== draggedItem.id),
        };
      } else if (draggedItem.source === 'available' && targetColumn === 'assigned') {
        // Add item to assignment
        updatedAssignments = {
          ...prev,
          [selectedMenuId]: [...currentAssignments, draggedItem.id],
        };
      } else {
        return prev;
      }

      return updatedAssignments;
    });

    setDraggedItem(null);
  };

  // Get assigned items for the selected menu
  const getAssignedItems = () => {
    if (!selectedMenuId || !selectedCategoryId) return [];
    const assignedItemIds = menuAssignments[selectedMenuId] || [];
    // Convert all IDs to numbers for consistent comparison
    const assignedItemIdsNumeric = assignedItemIds.map((id) => Number(id));
    return (
      menuItems?.filter(
        (item) =>
          item.category?.id === selectedCategoryId &&
          assignedItemIdsNumeric.includes(Number(item.id))
      ) || []
    );
  };

  const getAvailableItems = () => {
    if (!selectedCategoryId) return [];
    const assignedItemIds = menuAssignments[selectedMenuId] || [];
    // Convert all IDs to numbers for consistent comparison
    const assignedItemIdsNumeric = assignedItemIds.map((id) => Number(id));
    return (
      menuItems?.filter(
        (item) =>
          item.category?.id === selectedCategoryId &&
          !assignedItemIdsNumeric.includes(Number(item.id))
      ) || []
    );
  };

  const assignedItems = getAssignedItems();
  const availableItems = getAvailableItems();
  const canShowAssignmentPanel = selectedMenuId && selectedCategoryId;

  // Save handler - sends all assignments to backend
  const handleSaveAssignments = async () => {
    if (!menuAssignments || Object.keys(menuAssignments).length === 0) {
      return;
    }

    setIsAssignmentLoading(true);
    try {
      // Format assignments as a map: { menuId: [menuItemId1, menuItemId2, ...] }
      // Convert menu IDs and menu item IDs to numbers
      const assignmentsToSave = Object.entries(menuAssignments).reduce(
        (acc, [menuId, menuItemIds]) => {
          const numericMenuId = Number(menuId);
          const numericMenuItemIds = (menuItemIds || []).map((id) => Number(id));
          acc[numericMenuId] = numericMenuItemIds;
          return acc;
        },
        {}
      );

      // Wrap in request body format: { assignments: { ... } }
      const requestBody = { assignments: assignmentsToSave };

      await dispatch(updateMenuMenuItems(requestBody)).unwrap();

      // Refresh menu items for all updated menus
      Object.keys(assignmentsToSave).forEach((menuId) => {
        dispatch(fetchMenuMenuItems(menuId));
      });
    } catch (error) {
      console.error('Failed to save assignments:', error);
    } finally {
      setIsAssignmentLoading(false);
    }
  };

  return {
    // State
    selectedMenuId,
    selectedCategoryId,
    isAssignmentLoading,
    menuAssignments,
    dragOverColumn,

    // Options
    menuOptions,
    categoryOptions,

    // Computed values
    canShowAssignmentPanel,
    assignedItems,
    availableItems,

    // Handlers
    handleMenuChange,
    handleCategoryChange,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSaveAssignments,

    // Setters
    setSelectedMenuId,
    setSelectedCategoryId,
    setIsAssignmentLoading,
    setMenuAssignments,
    setDraggedItem,
    setDragOverColumn,
  };
};

export default useMenuExplorerManagerForm;
