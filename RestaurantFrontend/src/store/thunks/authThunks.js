import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../api/authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) { 
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ email, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
        const data = await authService.changePassword(email, oldPassword, newPassword);
        return data; // expect backend to return success message
    } catch (error) { 
        return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
