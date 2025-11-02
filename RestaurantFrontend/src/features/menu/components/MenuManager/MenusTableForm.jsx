import React from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../components/common/Table/Table';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import useDateFormat from '../../../../hooks/useDateFormat';

const MenusTableForm = ({ switchToEditMode, handleDeleteMenu, handleActivateMenu, menus }) => {
  const { formatDateWithHour } = useDateFormat();

  const columns = [
    { header: 'Menu Name', accessor: 'name' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDateWithHour(row.createdAt),
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      render: (row) => formatDateWithHour(row.updatedAt),
    },
  ];

  const actions = [
    (row) => {
      const buttons = [
        {
          icon: 'edit',
          onClick: () => switchToEditMode(row),
          title: 'Edit Menu',
        },
        {
          icon: 'delete',
          onClick: () => handleDeleteMenu(row.id),
          title: 'Delete Menu',
        },
      ];

      if (row.status === 'DRAFT') {
        buttons.push({
          icon: 'power',
          onClick: () => handleActivateMenu(row.id),
          title: 'Activate Menu',
        });
      }

      return <ButtonGroup buttons={buttons} size="small" />;
    },
  ];

  return (
    <GlassCard>
      <SectionHeader title="Existing Menus" description="Manage your restaurant menus" />
      <Table columns={columns} data={menus} actions={actions} pageSize={5} />
    </GlassCard>
  );
};

export default MenusTableForm;
