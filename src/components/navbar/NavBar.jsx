import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchbar/SearchBar";
import { path } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { Dropdown, Avatar, Space, Badge, Divider, Button } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  DownOutlined,
  UserOutlined,
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import avatar from "../../assets/image/avatar.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Đồng bộ user và profile khi auth.user thay đổi
    if (auth.user) {
      setUser(auth.user);

      const savedProfile = localStorage.getItem("profile");
      setProfile(savedProfile ? JSON.parse(savedProfile) : null);
    } else {
      setUser(null);
      setProfile(null);
    }
  }, [auth.user]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    navigate("/");
  };

  // Custom dropdown content
  const accountPanel = (
    <div className="account-dropdown">
      {/* Header user info */}
      <div className="user-info">
        <Avatar src={profile?.avatarUrl || avatar} />
        <div>
          <h4
            onClick={() => navigate(path.ACCOUNT)}
            style={{ cursor: "pointer" }}
          >
            {user?.username || "Nguyễn Thanh Thiên Lộc"}
          </h4>
          {/* Role-based info */}
          {user?.role === "STUDENT" && (
            <p>Người theo dõi 0 · Đang theo dõi 0</p>
          )}

          {user?.role === "LANDLORD" && <p>Chủ trọ · Số phòng đăng: 5</p>}

          {user?.role === "ADMIN" && <p>👑 Quản trị viên hệ thống</p>}

          <p className="userid">
            TK Định danh: <br />
            {user?.id}
          </p>
        </div>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Menu theo role */}
      {auth.user?.role === "ADMIN" ? (
        <div className="menu-section">
          <Link to={path.ADMIN}>📊 Dashboard Admin</Link>
          <Link to={path.MANAGE_USERS}>👥 Quản lý người dùng</Link>
          <Link to={path.MANAGE_POSTS}>📝 Quản lý tin</Link>
        </div>
      ) : (
        <div className="menu-section">
          <Link to={path.SAVED}>❤️ Tin đăng đã lưu</Link>
          <Link to={path.SAVED_SEARCH}>🔖 Tìm kiếm đã lưu</Link>
          <Link to={path.HISTORY}>🕑 Lịch sử xem tin</Link>
          <Link to={path.REVIEWS}>⭐ Đánh giá từ tôi</Link>
        </div>
      )}

      <Divider style={{ margin: "8px 0" }} />

      {/* Logout */}
      <div className="menu-section logout" onClick={handleLogout}>
        🚪 Đăng xuất
      </div>
    </div>
  );

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">TroUni</Link>
      </div>

      <SearchBar />

      <nav className="navbar__links">
        <Link to={path.SAVED} className="icon-btn">
          <HeartOutlined />
        </Link>
        <Link to={path.NOTIFICATIONS} className="icon-btn">
          <Badge count={1} size="small">
            <BellOutlined />
          </Badge>
        </Link>

        <div className="navbar__right">
          {auth.user?.role === "ADMIN" ? (
            <></>
          ) : (
            <>
              <Link to={path.MANAGE} className="btn-outline">
                Quản lý tin
              </Link>
              <button className="btn-solid">Đăng tin</button>
            </>
          )}

          {/* Avatar dropdown */}
          {auth.isAuthenticated ? (
            <Dropdown
              menu={{ items: [] }}
              dropdownRender={() => accountPanel}
              trigger={["click"]}
              placement="bottomRight"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space className="avatar-menu">
                  <Avatar
                    src={profile?.avatarUrl || avatar}
                    size={30}
                    icon={<UserOutlined />}
                  />
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <Link to={path.LOGIN} className="btn-login">
              Đăng nhập
            </Link>
          )}
        </div>

        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
