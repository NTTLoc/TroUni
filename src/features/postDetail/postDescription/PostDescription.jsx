import React, { useState } from "react";
import "./PostDescription.scss";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const PostDescription = ({ description, phone }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const maskedPhone = phone?.slice(0, phone.length - 3) + "***"; // ẩn 3 số cuối

  return (
    <div className="post-description">
      <h3>Mô tả chi tiết</h3>

      {/* Nội dung mô tả */}
      <p className={`desc ${expanded ? "expanded" : ""}`}>{description}</p>

      {/* SDT liên hệ */}
      <div className="phone-box">
        <strong>SDT Liên hệ:</strong> {showPhone ? phone : maskedPhone}
        {!showPhone && (
          <button onClick={() => setShowPhone(true)} className="show-btn">
            Hiện SDT
          </button>
        )}
      </div>

      {/* Nút xem thêm / thu gọn */}
      <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? (
          <>
            Thu gọn <IoMdArrowDropup />
          </>
        ) : (
          <>
            Xem thêm <IoMdArrowDropdown />
          </>
        )}
      </div>
    </div>
  );
};

export default PostDescription;
