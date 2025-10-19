import api from './axiosInstance';

const authService = {
  login: async (email, password) => (await api.post('/auth/login', { email, password })).data,

  changePassword: async (email, oldPassword, newPassword) =>
    (await api.post('/auth/changePassword', { email, oldPassword, newPassword })).data,

  getUser: async () => (await api.get('/auth/user')).data,
};

export default authService;
