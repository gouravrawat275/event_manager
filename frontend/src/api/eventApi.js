import axiosInstance from "./axiosInstance";

export const eventApi = {
  getEvents: (params) => axiosInstance.get("/events", { params }),
  getFeatured: () => axiosInstance.get("/events/featured"),
  getUpcoming: () => axiosInstance.get("/events/upcoming"),
  getPopular: () => axiosInstance.get("/events/popular"),
  getById: (id) => axiosInstance.get(`/events/${id}`),
  getRelated: (id) => axiosInstance.get(`/events/${id}/related`),
  create: (formData) =>
    axiosInstance.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    axiosInstance.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateStatus: (id, status) => axiosInstance.patch(`/events/${id}/status`, { status }),
  remove: (id) => axiosInstance.delete(`/events/${id}`),
  removeImage: (id, publicId) => axiosInstance.put(`/events/${id}/images/remove`, { publicId }),
};
