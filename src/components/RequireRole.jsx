import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";

const RequireRole = ({ role, children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role: userRole, loading: roleLoading } = useRole(user?.id);

  if (authLoading || roleLoading) return <div>Loading</div>;
  if (!user || userRole !== role) return <Navigate to="/" />;

  return children;
};

export default RequireRole;
