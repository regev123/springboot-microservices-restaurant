import { createAsyncThunk } from '@reduxjs/toolkit';
import tableService from '../../api/tableService';
import orderService from '../../api/orderService';
import { addToast } from '../slices/uiSlice';

export const TABLE_MESSAGES = {
  ORDER_CREATED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
};

// Fetch all tables (Admin)
export const fetchTables = createAsyncThunk('tables/fetchTables', async (_, { rejectWithValue }) => {
  try {
    const response = await tableService.getAllTables();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Fetch active tables (User/Waitress)
export const fetchActiveTables = createAsyncThunk('tables/fetchActiveTables', async (_, { rejectWithValue }) => {
  try {
    const response = await tableService.getAllActiveTables();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Create table
export const createTable = createAsyncThunk(
  'tables/createTable',
  async (tableData, { dispatch, rejectWithValue }) => {
    try {
      const response = await tableService.createTable(tableData);
      dispatch(addToast({ message: 'Table created successfully', type: 'success' }));
      return response;
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to create table', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Update table
export const updateTable = createAsyncThunk(
  'tables/updateTable',
  async (tableData, { dispatch, rejectWithValue }) => {
    try {
      const response = await tableService.updateTable(tableData);
      dispatch(addToast({ message: 'Table updated successfully', type: 'success' }));
      return response;
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to update table', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Delete table
export const deleteTable = createAsyncThunk(
  'tables/deleteTable',
  async (tableId, { dispatch, rejectWithValue }) => {
    try {
      await tableService.deleteTable(tableId);
      dispatch(addToast({ message: 'Table deleted successfully', type: 'success' }));
      return tableId;
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to delete table', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Create order for a table
export const createOrder = createAsyncThunk(
  'tables/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      dispatch(addToast({ message: TABLE_MESSAGES.ORDER_CREATED, type: 'success' }));
      return { order: response, tableId: orderData.tableId };
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to place order', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Fetch orders by table
export const fetchOrdersByTable = createAsyncThunk(
  'tables/fetchOrdersByTable',
  async (tableId, { rejectWithValue }) => {
    try {
      return { tableId, orders: await orderService.getOrdersByTable(tableId) };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  'tables/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(orderId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'tables/cancelOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      dispatch(addToast({ message: TABLE_MESSAGES.ORDER_CANCELLED, type: 'success' }));
      return response;
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to cancel order', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

// Change table status
export const changeTableStatus = createAsyncThunk(
  'tables/changeTableStatus',
  async ({ tableId, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await tableService.changeTableStatus(tableId, status);
      dispatch(addToast({ message: 'Table status updated successfully', type: 'success' }));
      return { tableId, table: response };
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Failed to change table status', type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);

