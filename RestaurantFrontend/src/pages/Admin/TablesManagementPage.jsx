import React from 'react';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import TableManagementForm from '../../features/tables/components/TableManagement/TableManagementForm';
import TablesTableForm from '../../features/tables/components/TableManagement/TablesTableForm';
import useTableManagementForm from '../../features/tables/hooks/useTableManagementForm';
import usePageData from '../../hooks/usePageData';
import { fetchTables } from '../../store/thunks/tableThunks';
import { SimplePageDataStrategy } from '../../hooks/usePageData';
import ConfirmationDialog from '../../components/common/ConfirmationDialog/ConfirmationDialog';

const TablesManagementPage = () => {
  const tableDataStrategy = new SimplePageDataStrategy(
    fetchTables,
    (state) => state.tables,
    'loading',
    'Loading tables...'
  );

  const { renderPage } = usePageData(tableDataStrategy);

  const {
    formData,
    addMode,
    editingTable,
    handleInputChange,
    handleAddOrEditTable,
    handleSwitchToEditMode,
    handleDeleteTable,
    handleSwitchToAddMode,
    handleConfirmDelete,
    handleCancelDelete,
    formErrors,
    isSubmitting,
    confirmationDialog,
  } = useTableManagementForm();

  return renderPage(
    <PageLayout>
      {/* Table Management Form */}
      <TableManagementForm
        formData={formData}
        addMode={addMode}
        editingTable={editingTable}
        handleInputChange={handleInputChange}
        handleAddOrEditTable={handleAddOrEditTable}
        handleSwitchToAddMode={handleSwitchToAddMode}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
      />

      {/* Tables Table Section */}
      <GlassCard>
        <SectionHeader title="Tables List" description="Manage existing restaurant tables" />
        <TablesTableForm
          handleSwitchToEditMode={handleSwitchToEditMode}
          handleDeleteTable={handleDeleteTable}
        />
      </GlassCard>

      {/* Confirmation Dialog for Reserved Tables */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Reserved Table"
        message={`Table #${confirmationDialog.tableNumber} is currently reserved. Are you sure you want to delete this table? This action cannot be undone.`}
        confirmText="Delete Table"
        cancelText="Cancel"
        type="warning"
      />
    </PageLayout>
  );
};

export default TablesManagementPage;

