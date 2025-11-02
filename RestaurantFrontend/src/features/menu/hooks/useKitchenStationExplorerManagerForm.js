import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchKitchenStationMenuItems,
  updateKitchenStationMenuItems,
} from '../../../store/thunks/menuThunks';

const useKitchenStationExplorerManagerForm = () => {
  const { categories, menuItems, kitchenStations } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  // Filter states
  const [selectedKitchenStationId, setSelectedKitchenStationId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false);
  const [stationAssignments, setStationAssignments] = useState({});

  // Drag & Drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Prepare options for selects
  const kitchenStationOptions =
    kitchenStations?.map((station) => ({
      value: station.id,
      label: `${station.name} ${station.isActive ? '(Active)' : '(Inactive)'}`,
    })) || [];

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  // Sync fetched menu items to assignments map only for stations that don't have local assignments yet
  // This prevents overwriting local changes when switching between stations
  useEffect(() => {
    if (!kitchenStations) return;

    setStationAssignments((prev) => {
      let updated = { ...prev };

      // Loop over all kitchen stations
      kitchenStations.forEach((station) => {
        // Check if this kitchen station id is already in the assignment map
        if (prev[station.id] !== undefined) {
          // Already exists in map, continue (don't overwrite)
          return;
        }

        // Not in map yet, only add if station has menuItems that is not null
        // If menuItems is null, it means menu items haven't been loaded yet, so don't add to map
        if (station.menuItems !== null && station.menuItems !== undefined) {
          // Extract IDs from menuItems (can be array of IDs or array of MenuItemDto objects)
          const assignedItemIds = Array.isArray(station.menuItems)
            ? station.menuItems.map((item) =>
                typeof item === 'number' || typeof item === 'string'
                  ? Number(item)
                  : Number(item.id)
              )
            : [];
          updated[station.id] = assignedItemIds;
        }
        // If menuItems is null, don't add to map (station not loaded yet)
      });

      return updated;
    });
  }, [kitchenStations]);

  // Log stationAssignments whenever it changes
  useEffect(() => {
    console.log('stationAssignments changed:', stationAssignments);
  }, [stationAssignments]);

  const handleKitchenStationChange = (value) => {
    setSelectedKitchenStationId(value);
    setSelectedCategoryId(''); // Reset category when kitchen station changes
    handleFetchKitchenStationMenuItems(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategoryId(value);
  };

  const handleFetchKitchenStationMenuItems = (kitchenStationId) => {
    if (!kitchenStationId || !kitchenStations) return;

    // Check if menu items are already fetched for this kitchen station
    const station = kitchenStations.find((s) => s.id === kitchenStationId);
    if (station && station.menuItems !== null && station.menuItems !== undefined) {
      return;
    }

    // Menu items not fetched yet, dispatch the fetch action
    dispatch(fetchKitchenStationMenuItems(kitchenStationId));
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

    if (!draggedItem || !selectedKitchenStationId) return;

    // Update local assignment state
    setStationAssignments((prev) => {
      const currentAssignments = prev[selectedKitchenStationId] || [];
      let updatedAssignments;

      if (draggedItem.source === 'assigned' && targetColumn === 'available') {
        // Remove item from assignment
        updatedAssignments = {
          ...prev,
          [selectedKitchenStationId]: currentAssignments.filter((id) => id !== draggedItem.id),
        };
      } else if (draggedItem.source === 'available' && targetColumn === 'assigned') {
        // Add item to assignment
        updatedAssignments = {
          ...prev,
          [selectedKitchenStationId]: [...currentAssignments, draggedItem.id],
        };
      } else {
        return prev;
      }

      return updatedAssignments;
    });

    setDraggedItem(null);
  };

  // Get assigned items for the selected kitchen station
  const getAssignedItems = () => {
    if (!selectedKitchenStationId || !selectedCategoryId) return [];
    const assignedItemIds = stationAssignments[selectedKitchenStationId] || [];
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
    const assignedItemIds = stationAssignments[selectedKitchenStationId] || [];
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
  const canShowAssignmentPanel = selectedKitchenStationId && selectedCategoryId;

  // Save handler - sends all assignments to backend
  const handleSaveAssignments = async () => {
    if (!stationAssignments || Object.keys(stationAssignments).length === 0) {
      return;
    }

    setIsAssignmentLoading(true);
    try {
      // Format assignments as a map: { stationId: [menuItemId1, menuItemId2, ...] }
      // Convert station IDs and menu item IDs to numbers
      const assignmentsToSave = Object.entries(stationAssignments).reduce(
        (acc, [stationId, menuItemIds]) => {
          const numericStationId = Number(stationId);
          const numericMenuItemIds = (menuItemIds || []).map((id) => Number(id));
          acc[numericStationId] = numericMenuItemIds;
          return acc;
        },
        {}
      );

      // Wrap in request body format: { assignments: { ... } }
      const requestBody = { assignments: assignmentsToSave };

      await dispatch(updateKitchenStationMenuItems(requestBody)).unwrap();
    } catch (error) {
      console.error('Failed to save assignments:', error);
    } finally {
      setIsAssignmentLoading(false);
    }
  };

  return {
    // State
    selectedKitchenStationId,
    selectedCategoryId,
    isAssignmentLoading,
    stationAssignments,
    dragOverColumn,

    // Options
    kitchenStationOptions,
    categoryOptions,

    // Computed values
    canShowAssignmentPanel,
    assignedItems,
    availableItems,

    // Handlers
    handleKitchenStationChange,
    handleCategoryChange,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSaveAssignments,

    // Setters
    setSelectedKitchenStationId,
    setSelectedCategoryId,
    setIsAssignmentLoading,
    setStationAssignments,
    setDraggedItem,
    setDragOverColumn,
  };
};

export default useKitchenStationExplorerManagerForm;
