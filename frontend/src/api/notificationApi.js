import axiosInstance from "./axiosInstance";

export const notificationApi = {
  getMy: () => axiosInstance.get("/notifications"),
  markRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllRead: () => axiosInstance.put("/notifications/read-all"),
  broadcast: (data) => axiosInstance.post("/notifications/broadcast", data),
};
