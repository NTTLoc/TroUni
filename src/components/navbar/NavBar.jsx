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
    // Lấy data từ localStorage
    const savedUser = localStorage.getItem("user");
    const savedProfile = localStorage.getItem("profile");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAuth({
      isAuthenticated: false,
      user: {
        id: "",
        email: "",
        username: "",
        role: "",
        googleAccount: false,
        phoneVerified: false,
        idVerificationStatus: "",
        status: "",
        createdAt: "",
        updatedAt: "",
      },
    });
    navigate("/");
  };

  // Custom dropdown content
  const accountPanel = (
    <div className="account-dropdown">
      {/* Header user info */}
      <div className="user-info">
        <Avatar src={profile?.avatarUrl || avatar} />
        <div className="details">
          <h4
            onClick={() => navigate(path.ACCOUNT)}
            style={{ cursor: "pointer" }}
          >
            {user?.username || "Nguyễn Thanh Thiên Lộc"}
          </h4>
          <p>Người theo dõi 0 · Đang theo dõi 0</p>
          <p className="userid">TK Định danh: VO888292117776</p>
        </div>
      </div>

      {/* Coin section */}
      <div className="wallet">
        <span>
          Số dư tài khoản: <b>0</b>
        </span>
        <Button type="primary" size="small">
          Nạp ngay
        </Button>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Tiện ích */}
      <div className="menu-section">
        <Link to={path.SAVED}>❤️ Tin đăng đã lưu</Link>
        <Link to={path.SAVED_SEARCH}>🔖 Tìm kiếm đã lưu</Link>
        <Link to={path.HISTORY}>🕑 Lịch sử xem tin</Link>
        <Link to={path.REVIEWS}>⭐ Đánh giá từ tôi</Link>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Dịch vụ trả phí */}
      <div className="menu-section">
        <Link to={path.PREMIUM}>💰 Số dư:</Link>
        <Link to={path.PRO}>⚡ Gói PRO</Link>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Logout */}
      <div className="menu-section logout" onClick={handleLogout}>
        🚪 Đăng xuất
      </div>
    </div>
  );

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <Link to="/">TroUni</Link>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Links */}
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
          <button className="btn-outline">Quản lý tin</button>
          <button className="btn-solid">Đăng tin</button>

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

        {/* Theme toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
