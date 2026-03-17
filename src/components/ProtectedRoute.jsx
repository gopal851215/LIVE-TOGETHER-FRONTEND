import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export const HostRoute = ({ redirectTo = "/" }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "host" ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
