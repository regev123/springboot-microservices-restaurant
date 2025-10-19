import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, deleteUser, updateUser, registerUser } from '../thunks/adminThunks';

const setPending = (state) => {
  state.loading = true;
};

const setFulfilled = (state, updates = {}) => {
  state.loading = false;
  Object.assign(state, updates);
};

const setRejected = (state, action) => {
  state.loading = false;
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    roles: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => setPending(state))
      .addCase(fetchUsers.fulfilled, (state, action) => {
        setFulfilled(state, { users: action.payload.users, roles: action.payload.roles });
      })
      .addCase(fetchUsers.rejected, (state, action) => setRejected(state, action))

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u
        );
      })

      // REGISTER USER
      .addCase(registerUser.fulfilled, (state, action) => {
        const newUser = action.payload;
        state.users.push(newUser);
      })
      .addCase(registerUser.rejected, (state, action) => {
        setRejected(state, action);
      });
  },
});

export default adminSlice.reducer;
