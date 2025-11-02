import { useState } from 'react';

const useDragDropAssignment = (initialAssignments = {}) => {
  // Drag & Drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Local assignment state - tracks which items are assigned
  const [localAssignments, setLocalAssignments] = useState(initialAssignments);

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

  const handleDrop = (e, targetColumn, selectedId = null) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedItem || !selectedId) return;

    // Update local assignment state
    setLocalAssignments((prev) => {
      const currentAssignments = prev[selectedId] || [];

      if (draggedItem.source === 'assigned' && targetColumn === 'available') {
        // Remove item from assignment
        return {
          ...prev,
          [selectedId]: currentAssignments.filter((id) => id !== draggedItem.id),
        };
      } else if (draggedItem.source === 'available' && targetColumn === 'assigned') {
        // Add item to assignment
        return {
          ...prev,
          [selectedId]: [...currentAssignments, draggedItem.id],
        };
      }

      return prev;
    });

    setDraggedItem(null);
  };

  // Helper function to get assigned items for a specific ID
  const getAssignedItems = (selectedId, allItems, filterFn = null) => {
    if (!selectedId) return [];

    const assignedItemIds = localAssignments[selectedId] || [];

    return allItems.filter((item) => {
      const isAssigned = assignedItemIds.includes(item.id);
      const passesFilter = filterFn ? filterFn(item) : true;
      return isAssigned && passesFilter;
    });
  };

  // Helper function to get available items for a specific ID
  const getAvailableItems = (selectedId, allItems, filterFn = null) => {
    if (!selectedId) return [];

    const assignedItemIds = localAssignments[selectedId] || [];

    return allItems.filter((item) => {
      const isNotAssigned = !assignedItemIds.includes(item.id);
      const passesFilter = filterFn ? filterFn(item) : true;
      return isNotAssigned && passesFilter;
    });
  };

  return {
    // State
    draggedItem,
    dragOverColumn,
    localAssignments,

    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // Setters
    setLocalAssignments,
    setDraggedItem,
    setDragOverColumn,

    // Helper functions
    getAssignedItems,
    getAvailableItems,
  };
};

export default useDragDropAssignment;
