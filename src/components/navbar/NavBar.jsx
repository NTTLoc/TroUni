import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchbar/SearchBar";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  // const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth, setCurrent } = useContext(AuthContext);
  console.log(">>> Check auth: ", auth);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setCurrent("home");
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
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Liên hệ
        </NavLink>
        <NavLink
          to="/post"
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
              <span onClick={handleLogout} className="dropdown-item">
                Đăng xuất
              </span>
            ) : (
              <Link to="/login" className="dropdown-item">
                Đăng nhập
              </Link>
            )}
          </div>
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
