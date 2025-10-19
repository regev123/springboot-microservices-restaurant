import api from './axiosInstance';

const adminService = {
  getAllUsers: async () => (await api.get('/auth/admin/users')).data,

  deleteUser: async (userId) => (await api.delete(`/auth/admin/user/${userId}/delete`)).data,

  updateUser: async (updateUserObject) => {
    await api.put('/auth/admin/user/update', updateUserObject);
    return updateUserObject;
  },

  registerUser: async (newUser) => (await api.post(`/auth/admin/register`, newUser)).data,
};

export default adminService;
