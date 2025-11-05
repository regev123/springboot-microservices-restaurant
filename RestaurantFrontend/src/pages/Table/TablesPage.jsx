import React from 'react';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import TablesForm from '../../features/tables/components/Tables/TablesForm';

const TablesPage = () => {
  return (
    <PageLayout title="Restaurant Tables">
      <TablesForm />
    </PageLayout>
  );
};

export default TablesPage;

