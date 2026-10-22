import axiosInstance from "./axiosInstance";

export const bookingApi = {
  create: (data) => axiosInstance.post("/bookings", data),
  getMy: (params) => axiosInstance.get("/bookings/my", { params }),
  getById: (id) => axiosInstance.get(`/bookings/${id}`),
  cancel: (id, data) => axiosInstance.put(`/bookings/${id}/cancel`, data),
  getAll: (params) => axiosInstance.get("/bookings", { params }),
  updateStatus: (id, bookingStatus) => axiosInstance.put(`/bookings/${id}/status`, { bookingStatus }),
  exportCsv: () => axiosInstance.get("/bookings/export/csv", { responseType: "blob" }),
};
