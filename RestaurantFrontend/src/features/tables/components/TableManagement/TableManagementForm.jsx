import React from 'react';
import Input from '../../../../components/common/Input/Input';
import FormButton from '../../../../components/common/Button2/FormButton';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import Toggle from '../../../../components/common/Toggle/Toggle';

const TableManagementForm = ({
  formData,
  addMode,
  editingTable,
  handleInputChange,
  handleAddOrEditTable,
  handleSwitchToAddMode,
  formErrors,
  isSubmitting,
}) => {
  return (
    <GlassCard className="mb-8">
      <div className="space-y-8">
        {/* Header Section with Edit Indicator */}
        <div className="space-y-4">
          {!addMode && editingTable && (
            <div className="mb-4">
              <EditableEntityView
                title="Editing Table"
                text={`Table #${editingTable.tableNumber} - Capacity: ${editingTable.capacity}${editingTable.location ? ` (${editingTable.location})` : ''}`}
              />
            </div>
          )}
          
          <SectionHeader
            title={addMode ? 'Create New Table' : 'Update Table'}
            description={addMode ? 'Fill in the details to create a new restaurant table' : 'Update the table information below'}
          />
        </div>

        {/* Form Fields Section */}
        <div className="space-y-6">
          {/* Basic Information Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {addMode && (
                <div className="md:col-span-2">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                      <span className="font-semibold">ℹ️ Table Number:</span> Will be automatically assigned by the system (fills gaps from deleted tables first)
                    </p>
                  </div>
                </div>
              )}
              
              <div className="md:col-span-1">
                <Input
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  required={true}
                  error={formErrors.capacity}
                  placeholder="e.g., 2, 4, 6..."
                />
              </div>
              
              <div className="md:col-span-1">
                <Input
                  label="Location (Optional)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required={false}
                  error={formErrors.location}
                  placeholder="e.g., Window, Patio, Bar..."
                />
              </div>
            </div>
          </div>

          {/* Status & Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50">
              <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Status & Settings</h3>
            </div>
            
            <div className="bg-slate-700/20 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-300">Table Status</label>
                  <p className="text-xs text-slate-400">
                    {formData.isActive 
                      ? 'This table will be available for reservations and orders' 
                      : 'This table will be hidden and unavailable for use'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 rounded-lg border border-slate-600/40">
                    <Toggle
                      checked={formData.isActive}
                      onChange={(checked) => handleInputChange('isActive', checked)}
                      variant="success"
                      size="large"
                      ariaLabel="Toggle table active status"
                    />
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold transition-colors duration-200 ${
                        formData.isActive ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formData.isActive ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 flex justify-center sm:justify-start">
              <FormSpinner
                show={isSubmitting}
                text={addMode ? 'Creating Table...' : 'Updating Table...'}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {!addMode && (
                <FormButton 
                  type="red" 
                  icon="cancel" 
                  text="Cancel" 
                  onClick={handleSwitchToAddMode}
                  className="w-full sm:w-auto"
                />
              )}
              <FormButton
                type="green"
                icon="save"
                text={addMode ? 'Create Table' : 'Update Table'}
                onClick={handleAddOrEditTable}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default TableManagementForm;

