import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ManagerDashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <Link
              to="/dashboard/manager/profile"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/manager/profile")
                  ? " active"
                  : ""
              }`}
            >
              Thông tin cá nhân
            </Link>
            <Link
              to="/dashboard/manager/notifications"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/manager/notifications")
                  ? " active"
                  : ""
              }`}
            >
              Thông báo
            </Link>
            <Link
              to="/dashboard/manager/settings"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/manager/settings")
                  ? " active"
                  : ""
              }`}
            >
              Cài đặt tài khoản
            </Link>
          </div>
        </div>
        {/* Main content */}
        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
