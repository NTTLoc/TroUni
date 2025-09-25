import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function TenantDashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <Link
              to="/dashboard/tenant/profile"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/tenant/profile")
                  ? " active"
                  : ""
              }`}
            >
              Thông tin cá nhân
            </Link>
            <Link
              to="/dashboard/tenant/favorites"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/tenant/favorites")
                  ? " active"
                  : ""
              }`}
            >
              Phòng yêu thích
            </Link>
            <Link
              to="/dashboard/tenant/appointments"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/tenant/appointments")
                  ? " active"
                  : ""
              }`}
            >
              Lịch hẹn xem phòng
            </Link>
            <Link
              to="/dashboard/tenant/notifications"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/tenant/notifications")
                  ? " active"
                  : ""
              }`}
            >
              Thông báo
            </Link>
            <Link
              to="/dashboard/tenant/settings"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/tenant/settings")
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
