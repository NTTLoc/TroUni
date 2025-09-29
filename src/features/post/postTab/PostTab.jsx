import React, { useState } from "react";
import "./PostTab.scss";

const PostTab = () => {
  const [active, setActive] = useState("all");

  return (
    <div className="post-tabs">
      <button
        className={active === "all" ? "active" : ""}
        onClick={() => setActive("all")}
      >
        Tất cả
      </button>
      <button
        className={active === "personal" ? "active" : ""}
        onClick={() => setActive("personal")}
      >
        Cá nhân
      </button>
      <button
        className={active === "agent" ? "active" : ""}
        onClick={() => setActive("agent")}
      >
        Môi giới
      </button>
    </div>
  );
};

export default PostTab;
