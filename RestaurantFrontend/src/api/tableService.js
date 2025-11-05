import api from './axiosInstance';

const tableService = {
  getAllTables: async () => (await api.get('/table-order-service/tables/admin/all')).data,

  getAllActiveTables: async () => (await api.get('/table-order-service/tables/all')).data,

  createTable: async (table) =>
    (await api.post('/table-order-service/tables/admin/create', table)).data,

  updateTable: async (tableData) =>
    (await api.put('/table-order-service/tables/admin/update', tableData)).data,

  deleteTable: async (tableId) =>
    (await api.delete(`/table-order-service/tables/admin/delete/${tableId}`)).data,

  changeTableStatus: async (tableId, status) =>
    (await api.put('/table-order-service/tables/change-status', { tableId, status })).data,
};

export default tableService;

