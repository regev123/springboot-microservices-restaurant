import KitchenStationForm from './KitchenStationForm';
import useKitchenStationManagerForm from '../../hooks/useKitchenStationManagerForm';
import KitchenStationsTableForm from './KitchenStationsTableForm';

const KitchenStationManagerForm = () => {
  const {
    formData,
    formErrors,
    isSubmitting,
    addMode,
    handleSwitchToAddMode,
    handleSwitchToEditMode,
    handleInputChange,
    handleAddOrEditKitchenStation,
    kitchenStations,
    handleDeleteKitchenStation,
  } = useKitchenStationManagerForm();
  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left Side - Create/Edit Kitchen Station Form Section (20%) */}
      <div className="col-span-1">
        <KitchenStationForm
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          addMode={addMode}
          handleInputChange={handleInputChange}
          handleAddOrEditKitchenStation={handleAddOrEditKitchenStation}
          handleSwitchToAddMode={handleSwitchToAddMode}
        />
      </div>

      {/* Right Side - Existing Kitchen Stations Table (80%) */}
      <div className="col-span-4">
        <KitchenStationsTableForm
          kitchenStations={kitchenStations}
          handleSwitchToEditMode={handleSwitchToEditMode}
          handleDeleteKitchenStation={handleDeleteKitchenStation}
        />
      </div>
    </div>
  );
};

export default KitchenStationManagerForm;
