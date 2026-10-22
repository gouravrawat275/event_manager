import axiosInstance from "./axiosInstance";

export const categoryApi = {
  getAll: () => axiosInstance.get("/categories"),
  getAllAdmin: () => axiosInstance.get("/categories/admin"),
  create: (data) => axiosInstance.post("/categories", data),
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  remove: (id) => axiosInstance.delete(`/categories/${id}`),
};
