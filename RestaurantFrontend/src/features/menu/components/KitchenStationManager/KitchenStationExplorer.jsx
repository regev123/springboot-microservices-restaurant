import React from 'react';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import Select from '../../../../components/common/Select/Select';
import Spinner from '../../../../components/common/Spinner/Spinner';
import FormButton from '../../../../components/common/Button2/FormButton';
import TableBadge from '../../../../components/common/TableBadge/TableBadge';
import Tooltip from '../../../../components/common/Tooltip/Tooltip';
import DragDropAssignment from '../../../../components/common/DragDropAssignment/DragDropAssignment';
import useKitchenStationExplorerManagerForm from '../../hooks/useKitchenStationExplorerManagerForm';

const KitchenStationExplorer = () => {
  const {
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
  } = useKitchenStationExplorerManagerForm();

  // Custom renderer for menu items
  const renderMenuItem = (item, source) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, item, source)}
      className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg cursor-move transition-colors duration-200 border border-slate-600 hover:border-slate-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-slate-200">{item.name}</h4>
          <p className="text-sm text-slate-400">${item.price}</p>
        </div>
        <div className="flex items-center gap-2">
          {item.ingredients?.slice(0, 2).map((ing, index) => (
            <TableBadge
              key={index}
              text={`${ing.name}${ing.removable ? ' (R)' : ''}`}
              color="purple"
            />
          ))}
          {item.ingredients?.length > 2 && (
            <Tooltip
              content={
                <div className="space-y-1">
                  <p className="font-medium text-slate-200">Remaining ingredients:</p>
                  {item.ingredients.slice(2).map((ing, index) => (
                    <p key={index} className="text-sm text-slate-300">
                      • {ing.name}
                      {ing.removable ? ' (R)' : ''}
                    </p>
                  ))}
                </div>
              }
              position="top"
            >
              <TableBadge text={`+${item.ingredients.length - 2}`} color="gray" />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filters Panel */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Kitchen Station Selection */}
          <div>
            <Select
              label="Select Kitchen Station"
              options={kitchenStationOptions}
              value={selectedKitchenStationId}
              onChange={handleKitchenStationChange}
              placeholder="Choose a station..."
              required={true}
            />
          </div>

          {/* Category Selection */}
          <div>
            <Select
              label="Select Category"
              options={categoryOptions}
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              placeholder="Choose a category..."
              disabled={!selectedKitchenStationId}
              required={true}
            />
          </div>

          {/* Status Display */}
          <div>
            <div className="text-sm text-slate-400">
              {canShowAssignmentPanel ? (
                <span className="text-green-400">✓ Ready to assign items</span>
              ) : (
                <span>Select kitchen station and category</span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Assignment Panel */}
      {canShowAssignmentPanel && (
        <DragDropAssignment
          assignedItems={assignedItems}
          availableItems={availableItems}
          assignedTitle="Assigned to Station"
          availableTitle="Available Items"
          assignedEmptyMessage="No items assigned yet"
          availableEmptyMessage="No available items"
          assignedEmptyDescription="Drag items from the right panel"
          availableEmptyDescription="All items are already assigned"
          assignedEmptyIcon="🏪"
          availableEmptyIcon="🍽️"
          assignedDropColor="orange"
          availableDropColor="blue"
          renderItem={renderMenuItem}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          dragOverColumn={dragOverColumn}
          minHeight="400px"
        />
      )}

      {/* Save Changes Button */}
      {canShowAssignmentPanel && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Changes are saved locally. Click "Save Changes" to update the server.
            </div>
            <FormButton
              type="green"
              text="Save Changes"
              icon="save"
              onClick={handleSaveAssignments}
              disabled={isAssignmentLoading}
              className="w-auto"
            />
          </div>
        </GlassCard>
      )}

      {/* Instructions */}
      {!canShowAssignmentPanel && (
        <GlassCard className="p-6">
          <div className="text-center text-slate-400">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-xl mb-2">Welcome to Kitchen Station Explorer</p>
            <p>Please select a kitchen station and category to start assigning menu items.</p>
            <div className="mt-4 text-sm">
              <p>• Choose a kitchen station from the dropdown</p>
              <p>• Select a category to filter items</p>
              <p>• Drag items between assigned and available lists</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Loading Overlay */}
      {isAssignmentLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Spinner size="large" />
            <p className="text-slate-200 mt-4">Updating station assignments...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenStationExplorer;
