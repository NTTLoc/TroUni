import React, { useState } from "react";
import "./PostTab.scss";

const PostTab = ({ onTabChange }) => {
  const [active, setActive] = useState("all");

  const handleTabClick = (tab) => {
    setActive(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="post-tabs">
      <button
        className={active === "all" ? "active" : ""}
        onClick={() => handleTabClick("all")}
      >
        Tất cả
      </button>
      <button
        className={active === "personal" ? "active" : ""}
        onClick={() => handleTabClick("personal")}
      >
        Cá nhân
      </button>
      <button
        className={active === "agent" ? "active" : ""}
        onClick={() => handleTabClick("agent")}
      >
        Môi giới
      </button>
      <button
        className={active === "rooms" ? "active" : ""}
        onClick={() => handleTabClick("rooms")}
      >
        Phòng trọ
      </button>
    </div>
  );
};

export default PostTab;
