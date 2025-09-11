import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function AccountProfileRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role === "tenant")
    return <Navigate to="/dashboard/tenant/profile" />;
  if (currentUser.role === "owner")
    return <Navigate to="/dashboard/owner/profile" />;
  if (currentUser.role === "admin")
    return <Navigate to="/dashboard/admin/profile" />;
  return <Navigate to="/" />;
}
