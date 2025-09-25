import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchbar/SearchBar";
import { path } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  // const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setAuth({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">TroUni</Link>
      </div>

      <SearchBar />

      <nav className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Trang chủ
        </NavLink>
        <NavLink
          to={path.ABOUT}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to={path.CONTACT}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Liên hệ
        </NavLink>
        <NavLink
          to={path.POST}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Danh sách trọ
        </NavLink>

        <div className="dropdown">
          <button className="dropdown-btn">
            👤 Welcome {auth?.user?.email}
          </button>
          <div className="dropdown-content">
            {auth.isAuthenticated ? (
              <div>
                <Link to={path.ACCOUNT} className="dropdown-item">
                  Tài khoản
                </Link>
                <span onClick={handleLogout} className="dropdown-item">
                  Đăng xuất
                </span>
              </div>
            ) : (
              <Link to={path.LOGIN} className="dropdown-item">
                Đăng nhập
              </Link>
            )}
          </div>

          <button onClick={toggleTheme} className="theme-btn">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* <div
          className="navbar__account"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          tabIndex={0}
        >
          <span className="account-icon">👤</span>
          {showAccountMenu && (
            <div className="account-menu">
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </div>
          )}
        </div> */}
      </nav>
    </header>
  );
};

export default Navbar;
