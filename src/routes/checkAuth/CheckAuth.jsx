import React from "react";
import { path } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const CheckAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();

  const userRole = auth?.user?.role;

  if (!auth.isAuthenticated) {
    return <Navigate to={path.LOGIN} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default CheckAuth;
