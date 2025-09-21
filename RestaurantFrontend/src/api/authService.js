import api from "./axiosInstance";

const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  changePassword: async (email, oldPassword, newPassword) => {
    const response = await api.post("/auth/changePassword", {
      email,
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/auth/user");
    return response.data;
  },
};

export default authService;

