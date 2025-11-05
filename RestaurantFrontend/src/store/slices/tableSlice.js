import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTables,
  fetchActiveTables,
  createTable,
  updateTable,
  deleteTable,
  createOrder,
  fetchOrdersByTable,
  fetchOrderById,
  cancelOrder,
  changeTableStatus,
} from '../thunks/tableThunks';

const setPending = (uiState, key) => {
  uiState[key] = true;
};

const setFulfilled = (uiState, key) => {
  uiState[key] = false;
};

const setRejected = (uiState, key) => {
  uiState[key] = false;
};

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    tables: [],
    tablesUI: {
      FetchingTables: false,
      FetchingOrdersByTable: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH TABLES (Admin)
      .addCase(fetchTables.pending, (state) => setPending(state.tablesUI, 'FetchingTables'))
      .addCase(fetchTables.fulfilled, (state, action) => {
        setFulfilled(state.tablesUI, 'FetchingTables');
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => setRejected(state.tablesUI, 'FetchingTables'))

      // FETCH ACTIVE TABLES (User/Waitress)
      .addCase(fetchActiveTables.pending, (state) => setPending(state.tablesUI, 'FetchingTables'))
      .addCase(fetchActiveTables.fulfilled, (state, action) => {
        setFulfilled(state.tablesUI, 'FetchingTables');
        state.tables = action.payload;
      })
      .addCase(fetchActiveTables.rejected, (state, action) => setRejected(state.tablesUI, 'FetchingTables'))

      // CREATE TABLE
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.push(action.payload);
      })

      // UPDATE TABLE
      .addCase(updateTable.fulfilled, (state, action) => {
        const index = state.tables.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })

      // DELETE TABLE
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.tables = state.tables.filter((t) => t.id !== action.payload);
      })

      // CREATE ORDER
      .addCase(createOrder.fulfilled, (state, action) => {
        const { order, tableId } = action.payload;
        const table = state.tables.find((t) => t.id === tableId);
        if (table) {
          if (!table.orders) {
            table.orders = [];
          }
          table.orders.push(order);
        }
      })

      // FETCH ORDERS BY TABLE
      .addCase(fetchOrdersByTable.pending, (state) => setPending(state.tablesUI, 'FetchingOrdersByTable'))
      .addCase(fetchOrdersByTable.fulfilled, (state, action) => {
        setFulfilled(state.tablesUI, 'FetchingOrdersByTable');
        const { tableId, orders } = action.payload;
        console.log(tableId,'tableId',orders,'orders');
        const table = state.tables.find((t) => t.id === tableId);
        console.log(table);
        if (table) {
          table.orders = orders;
        }
      })
      .addCase(fetchOrdersByTable.rejected, (state) => setRejected(state.tablesUI, 'FetchingOrdersByTable'))

      // FETCH ORDER BY ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        // Order fetched but not stored in state - can be accessed from action.payload if needed
      })

      // CANCEL ORDER
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        // Update order in all tables that have this order
        state.tables.forEach((table) => {
          if (table.orders) {
            table.orders = table.orders.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order
            );
          }
        });
      })

      // CHANGE TABLE STATUS
      .addCase(changeTableStatus.fulfilled, (state, action) => {
        const { tableId, table } = action.payload;
        const index = state.tables.findIndex((t) => t.id === tableId);
        if (index !== -1) {
          state.tables[index] = { ...state.tables[index], ...table };
        }
      });
  },
});

export default tableSlice.reducer;

