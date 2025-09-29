import React from "react";
import "./PostContact.scss";
import { MessageOutlined } from "@ant-design/icons";
import { IoMdSend } from "react-icons/io";
import { assets } from "../../../assets/assets";

const PostContactForm = () => {
  return (
    <div className="post-comments">
      <h3>Bình luận</h3>

      {/* Trường hợp chưa có bình luận */}
      <div className="empty-comments">
        <MessageOutlined className="icon" />
        <p>Chưa có bình luận nào.</p>
        <span>Hãy để lại bình luận cho người bán.</span>
      </div>

      {/* Ô nhập bình luận */}
      <div className="comment-input">
        <img src={assets.avatar} alt="avatar" className="avatar" />
        <input type="text" placeholder="Bình luận..." />
        <button type="button" className="send-btn">
          <IoMdSend />
        </button>
      </div>
    </div>
  );
};

export default PostContactForm;
