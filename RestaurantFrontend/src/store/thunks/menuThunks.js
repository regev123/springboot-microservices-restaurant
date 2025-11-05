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
  MENU_ITEM_CREATED: 'Menu item created successfully!',
  MENU_ITEM_UPDATED: 'Menu item updated successfully!',
  MENU_ITEM_DELETED: 'Menu item deleted successfully!',
  KITCHEN_STATION_CREATED: 'Kitchen station created successfully!',
  KITCHEN_STATION_UPDATED: 'Kitchen station updated successfully!',
  KITCHEN_STATION_DELETED: 'Kitchen station deleted successfully!',
  KITCHEN_STATION_MENU_ITEMS_FETCHED: 'Kitchen station menu items fetched successfully!',
  KITCHEN_STATION_MENU_ITEMS_UPDATED: 'Kitchen station menu items updated successfully!',
  MENU_MENU_ITEMS_FETCHED: 'Menu items fetched successfully!',
  MENU_MENU_ITEMS_UPDATED: 'Menu items updated successfully!',
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
      const updatedCategories = await menuService.deleteCategory(categoryId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.CATEGORY_DELETED }));
      return updatedCategories; // Return the complete updated categories list
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

export const fetchActiveMenu = createAsyncThunk(
  'menu/fetchActiveMenu',
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.getActiveMenu();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await menuService.updateMenu(id, name);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_UPDATED }));
      return { id, name };
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  'admin/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.fetchMenuItems();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'admin/createMenuItem',
  async (menuItem, { dispatch, rejectWithValue }) => {
    try {
      const newMenuItem = await menuService.createMenuItem(menuItem);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_ITEM_CREATED }));
      return newMenuItem;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'admin/updateMenuItem',
  async (menuItem, { dispatch, rejectWithValue }) => {
    try {
      const updatedMenuItem = await menuService.updateMenuItem(menuItem);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_ITEM_UPDATED }));
      return updatedMenuItem;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'admin/deleteMenuItem',
  async (menuItemId, { dispatch, rejectWithValue }) => {
    try {
      await menuService.deleteMenuItem(menuItemId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_ITEM_DELETED }));
      return menuItemId;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchKitchenStations = createAsyncThunk(
  'admin/fetchKitchenStations',
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.fetchKitchenStations();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createKitchenStation = createAsyncThunk(
  'admin/createKitchenStation',
  async (kitchenStation, { dispatch, rejectWithValue }) => {
    try {
      const newKitchenStation = await menuService.createKitchenStation(kitchenStation);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.KITCHEN_STATION_CREATED }));
      return newKitchenStation;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateKitchenStation = createAsyncThunk(
  'admin/updateKitchenStation',
  async (kitchenStation, { dispatch, rejectWithValue }) => {
    try {
      const updatedKitchenStation = await menuService.updateKitchenStation(kitchenStation);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.KITCHEN_STATION_UPDATED }));
      return updatedKitchenStation;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const deleteKitchenStation = createAsyncThunk(
  'admin/deleteKitchenStation',
  async (kitchenStationId, { dispatch, rejectWithValue }) => {
    try {
      await menuService.deleteKitchenStation(kitchenStationId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.KITCHEN_STATION_DELETED }));
      return kitchenStationId;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchKitchenStationMenuItems = createAsyncThunk(
  'admin/fetchKitchenStationMenuItems',
  async (kitchenStationId, { dispatch, rejectWithValue }) => {
    try {
      const menuItems = await menuService.fetchKitchenStationMenuItems(kitchenStationId);
      dispatch(
        addToast({ type: 'success', message: MENU_MESSAGES.KITCHEN_STATION_MENU_ITEMS_FETCHED })
      );
      // Return with station ID and menu items (now as DTOs)
      return { stationId: kitchenStationId, menuItems };
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateKitchenStationMenuItems = createAsyncThunk(
  'admin/updateKitchenStationMenuItems',
  async (assignmentsMap, { dispatch, rejectWithValue }) => {
    try {
    const result = await menuService.updateKitchenStationMenuItems(assignmentsMap);
    dispatch(
      addToast({ type: 'success', message: MENU_MESSAGES.KITCHEN_STATION_MENU_ITEMS_UPDATED })
    );
    return result;
  } catch (err) {
    dispatch(addToast({ type: 'error', message: err.message }));
    return rejectWithValue(err.message);
  }
  }
);

export const fetchMenuMenuItems = createAsyncThunk(
  'admin/fetchMenuMenuItems',
  async (menuId, { dispatch, rejectWithValue }) => {
    try {
      const menuItems = await menuService.fetchMenuMenuItems(menuId);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_MENU_ITEMS_FETCHED }));
      return { menuId, menuItems };
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);

export const updateMenuMenuItems = createAsyncThunk(
  'admin/updateMenuMenuItems',
  async (assignmentsMap, { dispatch, rejectWithValue }) => {
    try {
      const result = await menuService.updateMenuMenuItems(assignmentsMap);
      dispatch(addToast({ type: 'success', message: MENU_MESSAGES.MENU_MENU_ITEMS_UPDATED }));
      return result;
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
      return rejectWithValue(err.message);
    }
  }
);
