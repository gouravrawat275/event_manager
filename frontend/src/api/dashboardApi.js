import axiosInstance from "./axiosInstance";

export const dashboardApi = {
  getStats: () => axiosInstance.get("/dashboard/stats"),
  getMonthlyBookings: () => axiosInstance.get("/dashboard/monthly-bookings"),
  getCategoryDistribution: () => axiosInstance.get("/dashboard/category-distribution"),
  getActivityLogs: () => axiosInstance.get("/dashboard/activity-logs"),
};
