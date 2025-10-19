import React from 'react';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import UserManagementForm from '../../features/users/components/UserManagement/UserManagementForm';
import UsersTableForm from '../../features/users/components/UserManagement/UsersTableForm';
import usePageData from '../../hooks/usePageData';
import useUserManagementForm from '../../features/users/hooks/useUserManagementForm';
import { UsersPageStrategy } from '../strategies/pageDataStrategies';

const UsersManagementPage = () => {
  const { renderPage } = usePageData(new UsersPageStrategy());

  // Single instance of the hook at page level
  const userManagementProps = useUserManagementForm();

  return renderPage(
    <PageLayout>
      {/* User Management Form - receives props from page-level hook */}
      <UserManagementForm {...userManagementProps} />

      {/* Users Table Section - receives only the handlers it needs */}
      <GlassCard>
        <SectionHeader title="Users List" description="Manage existing users and their roles" />
        <UsersTableForm
          handleEditUser={userManagementProps.handleEditUser}
          handleDeleteUser={userManagementProps.handleDeleteUser}
        />
      </GlassCard>
    </PageLayout>
  );
};

export default UsersManagementPage;
