import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const restrictedRoutes = ["/login", "/signup"];
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated && restrictedRoutes.includes(location.pathname)) {
    const dashboardPath = user.role === "developer" ? "/profile/create" : "/";
    return <Navigate to={dashboardPath} replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;
