import React from "react";
import "./PostOwner.scss";

const PostOwner = ({ owner }) => {
  return (
    <div className="post-owner">
      <div className="info">
        <img src={owner.avatar} alt={owner.name} className="avatar" />
        <div className="info__details">
          <h4>{owner.name}</h4>
          <p>Môi giới</p>
        </div>
      </div>

      <div className="activity">
        <p>Hoạt động 1 ngày trước</p>
        <p>Phản hồi: 90%</p>
      </div>

      <div className="total-act">
        <p>{owner.posts} tin đăng</p>
        <p>2 năm trên Trọ Uni</p>
      </div>

      <div className="btn">
        <button className="btn__chat">Chat</button>
        <button className="btn__call">Gọi ngay</button>
      </div>
    </div>
  );
};

export default PostOwner;
