import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Spinner full />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
