import React from 'react';
import Table from '../../../../components/common/Table/Table';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import useDateFormat from '../../../../hooks/useDateFormat';

const KitchenStationsTableForm = ({
  kitchenStations,
  handleSwitchToEditMode,
  handleDeleteKitchenStation,
}) => {
  const { formatDateWithHour } = useDateFormat();

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => {
        return <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />;
      },
    },
    {
      header: 'Menu Items',
      accessor: 'menuItemsCount',
      render: (row) => {
        return <span className="text-slate-300">{row.menuItemsCount || 0} items</span>;
      },
    },
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
          onClick: () => handleSwitchToEditMode(row),
          title: 'Edit Kitchen Station',
        },
        {
          icon: 'delete',
          onClick: () => handleDeleteKitchenStation(row.id),
          title: 'Delete Kitchen Station',
        },
      ];

      return <ButtonGroup buttons={buttons} size="small" />;
    },
  ];

  return (
    <GlassCard className="h-full">
      <SectionHeader
        title="Kitchen Stations"
        description="Manage your kitchen stations"
        className="mb-4"
      />

      <Table columns={columns} data={kitchenStations} actions={actions} pageSize={5} />
    </GlassCard>
  );
};

export default KitchenStationsTableForm;
