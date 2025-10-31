import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchbar/SearchBar";
import { path } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { Dropdown, Avatar, Space, Badge, Divider } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  DownOutlined,
  UserOutlined,
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import avatar from "../../assets/image/avatar.jpg";
import { ProfileContext } from "../context/profile.context";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const { profile, setProfile } = useContext(ProfileContext);

  const roleRoutes = {
    STUDENT: path.ACCOUNT,
    LANDLORD: path.LANDLORD_DASHBOARD,
    ADMIN: path.ADMIN,
    MANAGER: path.MANAGER_DASHBOARD,
  };

  useEffect(() => {
    // Đồng bộ user và profile khi auth.user thay đổi
    if (auth.user) {
      setUser(auth.user);

      const savedProfile = localStorage.getItem("profile");

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
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

    setProfile(null);

    navigate("/");
  };

  // Custom dropdown content
  const accountPanel = (
    <div className="account-dropdown">
      {/* Header user info */}
      <div className="user-info">
        <Avatar src={profile?.avatarUrl || avatar} />
        <div>
          {/* Role-based info */}
          <h4
            onClick={() => {
              if (user?.role && roleRoutes[user.role]) {
                navigate(roleRoutes[user.role]);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {user?.username || ""}
          </h4>

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
          <Link to={path.ADMIN}>Dashboard Admin</Link>
          <Link to={path.MANAGE_USERS}>Quản lý người dùng</Link>
          <Link to={path.MANAGE_POSTS}>Quản lý tin</Link>
        </div>
      ) : (
        <div className="menu-section">
          <Link to={path.SAVED}>Tin đăng đã lưu</Link>
          <Link to={path.CHAT}>Chat</Link>
          {/* <Link to={path.REVIEWS}>Đánh giá từ tôi</Link> */}
        </div>
      )}

      <Divider style={{ margin: "8px 0" }} />

      {/* Logout */}
      <div className="menu-section logout" onClick={handleLogout}>
        Đăng xuất
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
          {auth.user?.role === "LANDLORD" && (
            <Link to={path.ROOM_CREATE} className="btn-solid">
              Đăng tin
            </Link>
          )}

          {auth.user?.role === "STUDENT" && (
            <Link to={path.ROOMS_MATCHING} className="btn-solid">
              Ghép trọ
            </Link>
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
                    key={profile?.avatarUrl} // <== ép render lại khi có avatar
                    src={profile?.avatarUrl || avatar}
                    size={30}
                    icon={<UserOutlined />}
                    onError={(e) => {
                      e.currentTarget.src = avatar;
                      return false;
                    }}
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
