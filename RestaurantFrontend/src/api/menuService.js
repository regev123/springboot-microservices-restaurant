import api from './axiosInstance';

const menuService = {
  getAllCategories: async () => (await api.get('/menu/categories')).data,

  createCategory: async (category) =>
    (await api.post('/menu/categories/admin/create', category)).data,

  deleteCategory: async (categoryId) =>
    (await api.delete(`/menu/categories/admin/${categoryId}`)).data,

  updateCategory: async (categoryId, categoryData) =>
    (await api.put(`/menu/categories/admin/${categoryId}`, categoryData)).data,

  updateCategoryOrder: async (orderChanges) =>
    (await api.put('/menu/categories/admin/update-order', orderChanges)).data,

  fetchMenus: async () => (await api.get('/menu/all')).data,

  createMenu: async (menu) => (await api.post('/menu/admin/create', menu)).data,

  deleteMenu: async (menuId) => (await api.delete(`/menu/admin/delete/${menuId}`)).data,

  activateMenu: async (menuId) => (await api.put(`/menu/admin/${menuId}/activate`)).data,

  updateMenu: async (menuId, menuData) =>
    (await api.put('/menu/admin/update', { id: menuId, ...menuData })).data,
};

export default menuService;
