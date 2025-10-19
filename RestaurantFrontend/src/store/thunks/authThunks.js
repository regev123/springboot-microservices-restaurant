import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';
import { addToast } from '../slices/uiSlice';

export const AUTH_MESSAGES = {
  PASSWORD_CHANGED: 'Password changed successfully!',
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      dispatch(addToast({ type: 'error', message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ email, oldPassword, newPassword }, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.changePassword(email, oldPassword, newPassword);
      dispatch(addToast({ type: 'success', message: AUTH_MESSAGES.PASSWORD_CHANGED }));
      return data;
    } catch (error) {
      dispatch(addToast({ type: 'error', message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getUser();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
