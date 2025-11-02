import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  registerUser,
} from '../../../store/thunks/adminThunks';

export const useAdminUsers = () => {
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
    role: '',
  });

  // Load users on page mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Set default role after roles are loaded
  useEffect(() => {
    if (roles?.length) {
      setNewUser((prev) => ({ ...prev, role: roles[0] }));
    }
  }, [roles]);

  // === Handlers ===
  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = (userId) => {
    dispatch(updateUserRole({ id: userId, newRole: roleChanges[userId] }));
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

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  return {
    users,
    roles,
    loading,
    error,
    message,
    roleChanges,
    addMode,
    newUser,
    setAddMode,
    handleRoleChange,
    handleSaveRole,
    handleNewUserChange,
    handleSaveNewUser,
    handleDeleteUser,
  };
};
