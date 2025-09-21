import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  fetchUsers,
  updateUserRole,
  registerUser,
} from '../../store/thunks/adminThunks';
import Table from '../../components/common/Table';
import PageWrapper from '../../components/layout/PageWrapper';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Message from '../../components/common/Message';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users, roles, loading, error, message } = useSelector((state) => state.admin);

  const [roleChanges, setRoleChanges] = useState({});
  const [addMode, setAddMode] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: roles?.length ? roles[0] : '', // Default to first role
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = (userId) => {
    const newRole = roleChanges[userId];
    dispatch(updateUserRole({ userId, role: newRole }));
    setRoleChanges((prev) => {
      const { [userId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewUser = () => {
    dispatch(registerUser(newUser)).then((res) => {
      if (!res.error) {
        setAddMode(false);
        setNewUser({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          role: roles?.length ? roles[0] : '',
        });
        dispatch(fetchUsers()); // Refresh list
      }
    });
  };

  const columns = [
    { header: 'Email', accessor: 'email' },
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Phone Number', accessor: 'phoneNumber' },
    {
      header: 'Role',
      render: (row) => {
        const pendingRole = roleChanges[row.id] || row.role;
        const roleChanged = pendingRole !== row.role;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Select
              value={pendingRole}
              options={roles}
              onChange={(val) => handleRoleChange(row.id, val)}
            />
            {roleChanged && (
              <Button
                text="Save"
                icon="save"
                variant="success"
                onClick={() => handleSaveRole(row.id)}
              />
            )}
          </div>
        );
      },
    },
  ];

  const actions = [
    (row) => (
      <Button
        text="Delete"
        icon="delete"
        variant="danger"
        onClick={() => dispatch(deleteUser(row.id))}
      />
    ),
  ];

  return (
    <PageWrapper title="User Management">
      {loading && <Message type="info">Loading users...</Message>}
      {error && <Message type="error">{error}</Message>}
      {message && <Message type="success">{message}</Message>}

      {/* Button to enable add mode */}
      <Button
        text="Register a new user"
        icon="edit"
        variant="primary"
        onClick={() => setAddMode(true)}
      />

      {/* Render new row for registration */}
      {addMode && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Register New User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange('email', e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange('password', e.target.value)}
            />
            <Input
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => handleNewUserChange('firstName', e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => handleNewUserChange('lastName', e.target.value)}
            />
            <Input
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={(e) => handleNewUserChange('phoneNumber', e.target.value)}
            />
            <Select
              value={newUser.role}
              options={roles}
              onChange={(val) => handleNewUserChange('role', val)}
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <Button text="Save" icon="save" variant="success" onClick={handleSaveNewUser} />
            <Button
              text="Cancel"
              icon="cancel"
              variant="secondary"
              onClick={() => setAddMode(false)}
            />
          </div>
        </div>
      )}

      {/* Table with existing users */}
      <Table columns={columns} data={users} actions={actions} pageSize={8} />
    </PageWrapper>
  );
};

export default AdminUsersPage;
