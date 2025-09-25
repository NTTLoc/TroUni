import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <Link
              to="/dashboard/admin/profile"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/admin/profile")
                  ? " active"
                  : ""
              }`}
            >
              Thông tin cá nhân
            </Link>
            <Link
              to="/dashboard/admin/users"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/admin/users")
                  ? " active"
                  : ""
              }`}
            >
              Quản lý người dùng
            </Link>
            <Link
              to="/dashboard/admin/posts"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/admin/posts")
                  ? " active"
                  : ""
              }`}
            >
              Duyệt tin đăng
            </Link>
            <Link
              to="/dashboard/admin/reports"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/admin/reports")
                  ? " active"
                  : ""
              }`}
            >
              Thống kê & báo cáo
            </Link>
            <Link
              to="/dashboard/admin/settings"
              className={`list-group-item list-group-item-action${
                location.pathname.includes("/dashboard/admin/settings")
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
