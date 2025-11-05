import api from './axiosInstance';

const orderService = {
  createOrder: async (orderData) =>
    (await api.post('/table-order-service/orders/create', orderData)).data,

  getOrdersByTable: async (tableId) =>
    (await api.get(`/table-order-service/orders/table/${tableId}`)).data,

  getOrderById: async (orderId) =>
    (await api.get(`/table-order-service/orders/${orderId}`)).data,

  cancelOrder: async (orderId) =>
    (await api.put(`/table-order-service/orders/${orderId}/cancel`)).data,
};

export default orderService;

