import axiosInstance from "./axiosInstance";

export const settingsApi = {
  get: () => axiosInstance.get("/settings"),
  update: (data) => axiosInstance.put("/settings", data),
};
