import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

function MobileTabBar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setUnreadNotifications(0);
      setUnreadChats(0);
      return;
    }
    const notifQuery = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.uid),
      where("read", "==", false)
    );
    const unsubNotif = onSnapshot(notifQuery, (snap) =>
      setUnreadNotifications(snap.size || 0)
    );

    const chatQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );
    const unsubChat = onSnapshot(chatQuery, (snap) => {
      let total = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        if (data?.unreadBy && data.unreadBy.includes(currentUser.uid))
          total += 1;
      });
      setUnreadChats(total);
    });

    return () => {
      unsubNotif();
      unsubChat();
    };
  }, [currentUser]);

  const tabs = [
    { to: "/", icon: "bi-house", label: "Trang chủ" },
    { to: "/properties", icon: "bi-building", label: "Phòng" },
    {
      to: currentUser ? "/messages" : "/login",
      icon: "bi-chat-dots",
      label: "Chat",
      badge: unreadChats,
    },
    {
      to: currentUser ? "/dashboard/tenant/appointments" : "/login",
      icon: "bi-calendar-event",
      label: "Lịch",
    },
    {
      to: currentUser ? "/dashboard/notifications" : "/login",
      icon: "bi-bell",
      label: "Thông báo",
      badge: unreadNotifications,
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
          <div style={{ position: "relative" }}>
            <i className={`bi ${tab.icon}`}></i>
            {tab.badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -10,
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 10,
                  lineHeight: "14px",
                  padding: "0 5px",
                  minWidth: 14,
                  textAlign: "center",
                }}
              >
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </div>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;
