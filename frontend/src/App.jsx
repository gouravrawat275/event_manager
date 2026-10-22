import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";
import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import VerifyEmail from "./pages/user/VerifyEmail";
import EventListing from "./pages/user/EventListing";
import EventDetails from "./pages/user/EventDetails";
import BookingSuccess from "./pages/user/BookingSuccess";
import Profile from "./pages/user/Profile";
import MyBookings from "./pages/user/MyBookings";
import SavedEvents from "./pages/user/SavedEvents";
import NotificationsPage from "./pages/user/NotificationsPage";
import ChangePassword from "./pages/user/ChangePassword";
import NotFound from "./pages/user/NotFound";

import Dashboard from "./pages/admin/Dashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import EventForm from "./pages/admin/EventForm";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBookings from "./pages/admin/ManageBookings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/events" element={<EventListing />} />
              <Route path="/events/:id" element={<EventDetails />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/booking-success/:id" element={<BookingSuccess />} />
                <Route element={<ProfileLayout />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/bookings" element={<MyBookings />} />
                  <Route path="/profile/saved" element={<SavedEvents />} />
                  <Route path="/profile/notifications" element={<NotificationsPage />} />
                  <Route path="/profile/security" element={<ChangePassword />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<ManageEvents />} />
                <Route path="events/new" element={<EventForm />} />
                <Route path="events/:id/edit" element={<EventForm />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="bookings" element={<ManageBookings />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="activity-logs" element={<AdminActivityLogs />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>

          <ToastContainer position="top-right" autoClose={3500} theme="colored" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
