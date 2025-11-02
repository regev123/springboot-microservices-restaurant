import { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import ToggleCard from '../../../../components/common/ToggleCard/ToggleCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import FormButton from '../../../../components/common/Button2/FormButton';

const KitchenStationForm = ({
  formData,
  formErrors,
  isSubmitting,
  addMode,
  handleInputChange,
  handleAddOrEditKitchenStation,
  handleSwitchToAddMode,
}) => {
  return (
    <GlassCard className="">
      <SectionHeader
        title=""
        description={
          addMode
            ? 'Add a new kitchen station to organize menu item preparation'
            : 'Edit the kitchen station details'
        }
      />

      {/* Form Row */}
      <div className="space-y-4">
        {/* Station Name Input */}
        <Input
          label="Station Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Grill Station"
          required
          disabled={isSubmitting}
          error={formErrors.name}
        />

        {/* Active Status Toggle */}
        <ToggleCard
          title="Station Status"
          description="Whether this kitchen station is currently active"
          checked={formData.isActive}
          onChange={(checked) => handleInputChange('isActive', checked)}
          disabled={isSubmitting}
          error={formErrors.isActive}
        />

        {/* Form Buttons */}
        <div className="flex gap-3">
          {!addMode && (
            <FormButton
              type="red"
              text=""
              icon="cancel"
              onClick={handleSwitchToAddMode}
              disabled={isSubmitting}
              className="w-auto"
            />
          )}
          <FormButton
            type="green"
            text={addMode ? 'Create Station' : 'Update Station'}
            icon={addMode ? 'add' : 'save'}
            onClick={handleAddOrEditKitchenStation}
            disabled={isSubmitting}
            className="w-auto"
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default KitchenStationForm;
