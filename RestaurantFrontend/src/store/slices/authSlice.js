import { createSlice } from '@reduxjs/toolkit';
import { loginUser, changePassword, fetchUser } from '../thunks/authThunks.js';

const setFulfilled = (state, updates = {}) => {
  Object.assign(state, updates);
};

const clearAuth = (state) => {
  state.user = null;
  state.token = null;
  localStorage.removeItem('token');
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isFetchingUser: false,
    shouldForceLogout: false,
  },
  reducers: {
    logout: (state) => {
      clearAuth(state);
      state.shouldForceLogout = false;
    },
    resetAllStore: () => {
      // This will be handled by the root reducer
      return {
        user: null,
        token: null,
        isFetchingUser: false,
        shouldForceLogout: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        setFulfilled(state, { token: action.payload.token, user: action.payload.user });
        localStorage.setItem('token', action.payload.token);
        state.shouldForceLogout = false;
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.isFetchingUser = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetchingUser = false;
        setFulfilled(state, { user: action.payload });
        state.shouldForceLogout = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isFetchingUser = false;
        if (state.token) {
          state.shouldForceLogout = true;
        }
      })

      // CHANGE PASSWORD
      .addCase(changePassword.fulfilled, (state) => {
        setFulfilled(state);
        clearAuth(state);
        state.shouldForceLogout = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        if (action.payload?.includes('401')) {
          clearAuth(state);
        }
      });
  },
});

export const { logout, resetAllStore } = authSlice.actions;
export default authSlice.reducer;
