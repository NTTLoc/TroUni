import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function OwnerDashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <Link
              to="/dashboard/owner/profile"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/owner/profile")
                  ? " active"
                  : ""
              }`}
            >
              Thông tin cá nhân
            </Link>
            <Link
              to="/dashboard/owner/my-properties"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/owner/my-properties")
                  ? " active"
                  : ""
              }`}
            >
              Quản lý phòng
            </Link>
            <Link
              to="/dashboard/owner/post-property"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/owner/post-property")
                  ? " active"
                  : ""
              }`}
            >
              Đăng tin mới
            </Link>
            <Link
              to="/dashboard/owner/settings"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/owner/settings")
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
