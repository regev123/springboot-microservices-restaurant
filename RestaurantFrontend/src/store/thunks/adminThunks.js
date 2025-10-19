import { createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../api/adminService';
import { addToast } from '../slices/uiSlice';

export const ADMIN_MESSAGES = {
  USER_DELETED: 'User deleted successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_REGISTERED: 'User registered successfully!',
};

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await adminService.getAllUsers();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      dispatch(addToast({ type: 'success', message: ADMIN_MESSAGES.USER_DELETED }));
      return userId;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      await adminService.updateUser(userData);
      dispatch(addToast({ type: 'success', message: ADMIN_MESSAGES.USER_UPDATED }));
      return userData;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'admin/registerUser',
  async (newUser, { dispatch, rejectWithValue }) => {
    try {
      const registerUser = await adminService.registerUser(newUser);
      dispatch(addToast({ type: 'success', message: ADMIN_MESSAGES.USER_REGISTERED }));
      return registerUser;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);
