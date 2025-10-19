import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // New toast system
    toasts: [],
  },
  reducers: {
    // New toast system
    addToast: (state, action) => {
      const { type = 'info', message, duration = 5000 } = action.payload;
      const toast = {
        id: Date.now() + Math.random(), // unique ID
        type,
        message,
        duration,
      };
      state.toasts.push(toast);

      // Keep only last 5 toasts
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(-5);
      }
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = uiSlice.actions;
export default uiSlice.reducer;
