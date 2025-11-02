import api from './axiosInstance';

const menuService = {
  getAllCategories: async () => (await api.get('/menu/categories')).data,

  createCategory: async (category) =>
    (await api.post('/menu/categories/admin/create', category)).data,

  deleteCategory: async (categoryId) =>
    (await api.delete(`/menu/categories/admin/${categoryId}`)).data,

  updateCategory: async (categoryId, categoryData) =>
    (await api.put('/menu/categories/admin/update', { id: categoryId, ...categoryData })).data,

  updateCategoryOrder: async (orderChanges) =>
    (await api.put('/menu/categories/admin/update-order', orderChanges)).data,

  fetchMenus: async () => (await api.get('/menu/all')).data,

  createMenu: async (menu) => (await api.post('/menu/admin/create', menu)).data,

  deleteMenu: async (menuId) => (await api.delete(`/menu/admin/delete/${menuId}`)).data,

  activateMenu: async (menuId) => (await api.put(`/menu/admin/${menuId}/activate`)).data,

  updateMenu: async (id, name) => (await api.put('/menu/admin/update', { id, name })).data,

  fetchMenuItems: async () => (await api.get('/menu/items/all')).data,

  createMenuItem: async (menuItem) => (await api.post('/menu/items/admin/create', menuItem)).data,

  updateMenuItem: async (menuItem) => (await api.put('/menu/items/admin/update', menuItem)).data,

  deleteMenuItem: async (menuItemId) =>
    (await api.delete(`/menu/items/admin/delete/${menuItemId}`)).data,

  fetchKitchenStations: async () => (await api.get('/menu/kitchen-stations/all')).data,

  createKitchenStation: async (kitchenStation) =>
    (await api.post('/menu/kitchen-stations/admin/create', kitchenStation)).data,

  updateKitchenStation: async (kitchenStation) =>
    (await api.put('/menu/kitchen-stations/admin/update', kitchenStation)).data,

  deleteKitchenStation: async (kitchenStationId) =>
    (await api.delete(`/menu/kitchen-stations/admin/delete/${kitchenStationId}`)).data,

  fetchKitchenStationMenuItems: async (kitchenStationId) =>
    (await api.get(`/menu/kitchen-stations/${kitchenStationId}/menu-items`)).data,

  updateKitchenStationMenuItems: async (assignments) =>
    (await api.put('/menu/kitchen-stations/admin/update-menu-items', assignments)).data,

  fetchMenuMenuItems: async (menuId) =>
    (await api.get(`/menu/${menuId}/menu-items`)).data,

  updateMenuMenuItems: async (assignments) =>
    (await api.put('/menu/admin/update-menu-items', assignments)).data,
};

export default menuService;
