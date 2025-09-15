import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function MobileTabBar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const tabs = [
    { to: "/", icon: "bi-house", label: "Trang chủ" },
    { to: "/properties", icon: "bi-building", label: "Phòng" },
    {
      to: currentUser ? "/messages" : "/login",
      icon: "bi-chat-dots",
      label: "Chat",
    },
    {
      to: currentUser ? "/dashboard/tenant/appointments" : "/login",
      icon: "bi-calendar-event",
      label: "Lịch",
    },
    {
      to: currentUser ? "/account/profile" : "/login",
      icon: "bi-person",
      label: "Tôi",
    },
  ];

  return (
    <nav className="mobile-tabbar d-md-none">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(tab.to);
          }}
        >
          <i className={`bi ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;
