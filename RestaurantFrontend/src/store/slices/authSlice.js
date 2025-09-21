import { createSlice } from "@reduxjs/toolkit";
import { loginUser, changePassword, fetchUser } from "../thunks/authThunks.js";
import { resetStatusAll } from "../globalActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      
      // fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch user Please login again.";
        
        console.log("Fetch user rejected:", action.payload, action.meta?.response);
        // ✅ Auto-logout if token invalid/expired
        if (
          action.payload?.includes("401") ||
          action.payload?.includes("failed")
        ) {
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
        }
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password change failed";
      })

      // ✅ Listen to the global reset action
      .addCase(resetStatusAll, (state) => {
        state.error = null;
        state.message = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
