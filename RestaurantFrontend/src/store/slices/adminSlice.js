import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, deleteUser, updateUserRole, registerUser } from '../thunks/adminThunks';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    roles: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log('Fetched users:', action.payload);
        state.loading = false;
        state.users = action.payload.users;
        state.roles = action.payload.roles;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.message = 'User deleted successfully';
        state.error = null;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, newRole } = action.payload;
        state.users = state.users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
        state.message = 'User role updated successfully';
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.message = 'New user register successfully';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.message = null;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
