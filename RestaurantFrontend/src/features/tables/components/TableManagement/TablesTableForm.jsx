import React from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../components/common/Table/Table';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import StatusBadge from '../../../../components/common/StatusBadge/StatusBadge';
import useDateFormat from '../../../../hooks/useDateFormat';

const TablesTableForm = ({ handleSwitchToEditMode, handleDeleteTable }) => {
  const tables = useSelector((state) => state.tables.tables);
  const { formatDateWithoutHour } = useDateFormat();

  // Sort tables by table number before displaying
  const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);

  const columns = [
    { header: 'Table Number', accessor: 'tableNumber' },
    { header: 'Capacity', accessor: 'capacity' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (row) => row.location || <span className="text-slate-500">—</span>,
    },
    {
      header: 'Active',
      accessor: 'isActive',
      render: (row) => (
        <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDateWithoutHour(row.createdAt),
    },
  ];

  const actions = [
    (row) => (
      <ButtonGroup
        buttons={[
          {
            icon: 'edit',
            onClick: () => handleSwitchToEditMode(row),
            title: 'Edit Table',
          },
          {
            icon: 'delete',
            onClick: () => handleDeleteTable(row.id),
            title: 'Delete Table',
          },
        ]}
        size="small"
        className="justify-center"
      />
    ),
  ];

  return <Table columns={columns} data={sortedTables} actions={actions} />;
};

export default TablesTableForm;

