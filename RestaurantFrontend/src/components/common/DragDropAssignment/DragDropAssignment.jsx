import React from 'react';
import GlassCard from '../GlassCard/GlassCard';

const DragDropAssignment = ({
  // Data
  assignedItems = [],
  availableItems = [],

  // Configuration
  assignedTitle = 'Assigned Items',
  availableTitle = 'Available Items',
  assignedEmptyMessage = 'No items assigned yet',
  availableEmptyMessage = 'No available items',
  assignedEmptyDescription = 'Drag items from the right panel',
  availableEmptyDescription = 'All items are already assigned',

  // Styling
  assignedEmptyIcon = '📋',
  availableEmptyIcon = '🎯',
  assignedDropColor = 'green',
  availableDropColor = 'blue',

  // Item rendering - REQUIRED
  renderItem, // Custom item renderer (required)

  // Event handlers
  onDragStart = () => {},
  onDragOver = () => {},
  onDragLeave = () => {},
  onDrop = () => {},

  // State
  dragOverColumn = null,

  // Layout
  minHeight = '400px',
  className = '',
}) => {
  // Get drop zone styles
  const getDropZoneStyles = (column) => {
    const isDragOver = dragOverColumn === column;
    const colorClass = column === 'assigned' ? assignedDropColor : availableDropColor;

    if (isDragOver) {
      return `border-${colorClass}-400 bg-${colorClass}-400/10`;
    }
    return 'border-slate-600 hover:border-slate-500';
  };

  // Render empty state
  const renderEmptyState = (icon, message, description) => (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <p>{message}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Assigned Items Column */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">
            {assignedTitle} ({assignedItems.length})
          </h3>
          <div className="text-sm text-slate-400">Drag items here to assign</div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-200 overflow-y-auto ${getDropZoneStyles('assigned')}`}
          style={{
            minHeight: minHeight,
            maxHeight: minHeight,
          }}
          onDragOver={(e) => onDragOver(e, 'assigned')}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, 'assigned')}
        >
          {assignedItems.length === 0 ? (
            renderEmptyState(assignedEmptyIcon, assignedEmptyMessage, assignedEmptyDescription)
          ) : (
            <div className="space-y-2">
              {assignedItems.map((item) => renderItem(item, 'assigned'))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Available Items Column */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">
            {availableTitle} ({availableItems.length})
          </h3>
          <div className="text-sm text-slate-400">Drag items to assign to menu</div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-200 overflow-y-auto ${getDropZoneStyles('available')}`}
          style={{
            minHeight: minHeight,
            maxHeight: minHeight,
          }}
          onDragOver={(e) => onDragOver(e, 'available')}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, 'available')}
        >
          {availableItems.length === 0 ? (
            renderEmptyState(availableEmptyIcon, availableEmptyMessage, availableEmptyDescription)
          ) : (
            <div className="space-y-2">
              {availableItems.map((item) => renderItem(item, 'available'))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default DragDropAssignment;
