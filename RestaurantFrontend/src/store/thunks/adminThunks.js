import { createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../api/adminService';

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await adminService.getAllUsers();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const updatedUser = await adminService.updateUserRole(userId, role);
      return updatedUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'admin/registerUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const registerUser = await adminService.registerUser(newUser);
      return registerUser;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
