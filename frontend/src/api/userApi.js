import axiosInstance from "./axiosInstance";

export const userApi = {
  updateProfile: (formData) =>
    axiosInstance.put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getSavedEvents: () => axiosInstance.get("/users/saved-events"),
  toggleSavedEvent: (eventId) => axiosInstance.put(`/users/saved-events/${eventId}`),
  addRecentlyViewed: (eventId) => axiosInstance.put(`/users/recently-viewed/${eventId}`),
  getUsers: (params) => axiosInstance.get("/users", { params }),
  getUserBookings: (id) => axiosInstance.get(`/users/${id}/bookings`),
  toggleBlock: (id) => axiosInstance.put(`/users/${id}/block`),
  remove: (id) => axiosInstance.delete(`/users/${id}`),
};
