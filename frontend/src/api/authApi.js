import axiosInstance from "./axiosInstance";

export const authApi = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  logout: () => axiosInstance.post("/auth/logout"),
  getMe: () => axiosInstance.get("/auth/me"),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
  resetPassword: (token, data) => axiosInstance.put(`/auth/reset-password/${token}`, data),
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
};
