import { createAsyncThunk } from '@reduxjs/toolkit';
import menuService from '../../api/menuService';
import { addToast } from '../slices/uiSlice';

export const MENU_MESSAGES = {
  CATEGORY_DELETED: 'Category deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_ORDER_UPDATED: 'Category order updated successfully!',
  MENU_DELETED: 'Menu deleted successfully!',
  MENU_CREATED: 'Menu created successfully!',
  MENU_ACTIVATED: 'Menu activated successfully!',
  MENU_UPDATED: 'Menu updated successfully!',
};

export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.getAllCategories();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { dispatch, rejectWithValue }) => {
    try {
      await menuService.deleteCategory(categoryId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.CATEGORY_DELETED }));
      return categoryId;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (category, { dispatch, rejectWithValue }) => {
    try {
      const newCategory = await menuService.createCategory(category);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.CATEGORY_CREATED }));
      return newCategory;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, name, description }, { dispatch, rejectWithValue }) => {
    try {
      const updatedCategory = await menuService.updateCategory(id, { name, description });
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.CATEGORY_UPDATED }));
      return updatedCategory;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategoryOrder = createAsyncThunk(
  'admin/updateCategoryOrder',
  async (orderChanges, { dispatch, rejectWithValue }) => {
    try {
      const result = await menuService.updateCategoryOrder(orderChanges);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.CATEGORY_ORDER_UPDATED }));
      return result;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMenus = createAsyncThunk('admin/fetchMenus', async (_, { rejectWithValue }) => {
  try {
    return await menuService.fetchMenus();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createMenu = createAsyncThunk(
  'admin/createMenu',
  async (menu, { dispatch, rejectWithValue }) => {
    try {
      const newMenu = await menuService.createMenu(menu);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_CREATED }));
      return newMenu;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const deleteMenu = createAsyncThunk(
  'admin/deleteMenu',
  async (menuId, { dispatch, rejectWithValue }) => {
    try {
      await menuService.deleteMenu(menuId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_DELETED }));
      return menuId;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const activateMenu = createAsyncThunk(
  'admin/activateMenu',
  async (menuId, { dispatch, rejectWithValue }) => {
    try {
      const result = await menuService.activateMenu(menuId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_ACTIVATED }));
      return result;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateMenu = createAsyncThunk(
  'admin/updateMenu',
  async ({ menuId, menuData }, { dispatch, rejectWithValue }) => {
    try {
      await menuService.updateMenu(menuId, menuData);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_UPDATED }));
      return { menuId, menuData };
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);
