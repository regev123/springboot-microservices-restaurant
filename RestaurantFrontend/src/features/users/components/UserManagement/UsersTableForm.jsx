import React from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../components/common/Table/Table';
import ButtonGroup from '../../../../components/common/ButtonGroup/ButtonGroup';
import useDateFormat from '../../../../hooks/useDateFormat';

const UsersTableForm = ({ handleSwitchToEditMode, handleDeleteUser }) => {
  const users = useSelector((state) => state.admin.users);
  const { formatDateWithoutHour } = useDateFormat();

  const columns = [
    { header: 'Employee Number', accessor: 'id' },
    { header: 'Email', accessor: 'email' },
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Phone Number', accessor: 'phoneNumber' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Starting Date',
      accessor: 'createdDate',
      render: (row) => formatDateWithoutHour(row.createdDate),
    },
  ];

  const actions = [
    (row) => (
      <ButtonGroup
        buttons={[
          {
            icon: 'edit',
            onClick: () => handleSwitchToEditMode(row),
            title: 'Edit User',
          },
          {
            icon: 'delete',
            onClick: () => handleDeleteUser(row.id),
            title: 'Delete User',
          },
        ]}
        size="small"
        className="justify-center"
      />
    ),
  ];

  return <Table columns={columns} data={users} actions={actions} />;
};

export default UsersTableForm;
