import React from 'react';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import EmptyStateCard from '../../../../components/common/EmptyStateCard/EmptyStateCard';
import TablesHeaderForm from './TablesHeaderForm';
import FloorPlanViewForm from './FloorPlanViewForm';
import useTablesForm from '../../hooks/useTablesForm';

const TablesForm = () => {
  const {
    loading,
    tablesByStatus,
    totalActiveTables,
    allActiveTables,
    getStatusConfig,
    getStatusIcon,
    arrangeTablesForFloorPlan,
  } = useTablesForm();

  if (loading) {
    return <FormSpinner show={true} text="Loading tables..." />;
  }

  return (
    <div className="space-y-6">
      {/* Compact Header Section */}
      <TablesHeaderForm 
        totalActiveTables={totalActiveTables}
        tablesByStatus={tablesByStatus}
      />

      {/* Tables View */}
      {totalActiveTables === 0 ? (
        <EmptyStateCard
          title="No Active Tables"
          description="There are no active tables available at the moment."
          icon="🪑"
        />
      ) : (
        <FloorPlanViewForm 
          tables={allActiveTables}
          arrangeTablesForFloorPlan={arrangeTablesForFloorPlan}
          getStatusConfig={getStatusConfig}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
};

export default TablesForm;

