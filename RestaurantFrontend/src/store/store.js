import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import menuReducer from './slices/menuSlice';
import uiReducer from './slices/uiSlice';

import { resetAllStore } from './slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  menu: menuReducer,
  ui: uiReducer,
});

const appReducer = (state, action) => {
  if (action.type === resetAllStore.type) {
    state = undefined;
  }
  return rootReducer(state, action);
};

const store = configureStore({
  reducer: appReducer,
});

export default store;
