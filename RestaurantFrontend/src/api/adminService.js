import api from './axiosInstance';

const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/auth/admin/users');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId, newRole) => {
    const response = await api.put(`/auth/admin/users/${userId}/role`, { newRole });
    return response.data;
  },

  registerUser: async (newUser) => {
    console.log('Registering user:', newUser);
    const response = await api.post(`/auth/admin/register`, newUser);
    return response.data;
  },
};

export default adminService;
