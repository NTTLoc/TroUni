import React, { useState, useEffect } from "react";
import "./PostContact.scss";
import {
  MessageOutlined,
  StarFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { IoMdSend } from "react-icons/io";
import { assets } from "../../../assets/assets";
import { createReviewApi, getReviewApi } from "../../../services/reviewApi";
import useMessage from "../../../hooks/useMessage";

const PostContactForm = ({ roomId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const avatarUser = profile?.avatarUrl || assets.avatar;
  const message = useMessage();

  // ✅ Lấy danh sách bình luận khi vào trang
  useEffect(() => {
    if (!roomId) return;
    const fetchReviews = async () => {
      try {
        const res = await getReviewApi(roomId);
        if (res.code === "SUCCESS") {
          setReviews(res.data || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("❌ Lỗi lấy danh sách review:", err);
        message.error("Không thể tải danh sách bình luận!");
      }
    };
    fetchReviews();
  }, [roomId]);

  // ✅ Gửi bình luận
  const handleSubmit = async () => {
    if (!roomId) {
      message.error("Không xác định được phòng để gửi đánh giá!");
      return;
    }
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    if (rating < 1 || rating > 5) {
      message.warning("Vui lòng chọn điểm đánh giá (1-5 sao)");
      return;
    }

    const data = { comment, score: rating };

    try {
      setLoading(true);
      const res = await createReviewApi(roomId, data);

      if (res.code === "SUCCESS") {
        message.success(res?.message || "Đã gửi bình luận thành công!");

        // ✅ Chèn bình luận mới vào đầu danh sách ngay lập tức
        const newReview = {
          comment,
          score: rating,
          user: {
            id: profile?.id,
            username: profile?.username || "Bạn",
            profile: { avatarUrl: avatarUser },
          },
        };
        setReviews((prev) => [newReview, ...prev]);

        // Reset input
        setComment("");
        setRating(0);
      } else {
        message.error(res?.message || "Không thể gửi bình luận!");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi bình luận:", err.response?.data || err.message);
      message.error("Lỗi không thể gửi bình luận! Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-comments">
      <h3>Bình luận</h3>

      {/* Danh sách bình luận */}
      <div className="scrollable-reviews">
        {reviews.length > 0 ? (
          <div className="comments-list">
            {reviews.map((review, index) => {
              const isCurrentUser =
                currentUser?.id && review?.user?.id === currentUser?.id;
              return (
                <div key={index} className="comment-item">
                  <img
                    src={review?.user?.profile?.avatarUrl || assets.avatar}
                    alt="avatar"
                    className="avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>
                        {isCurrentUser
                          ? "Bạn"
                          : review?.user?.username || "Người dùng ẩn danh"}
                      </strong>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarFilled
                            key={star}
                            className={`star ${
                              review.score >= star ? "active" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-comments">
            <MessageOutlined className="icon" />
            <p>Chưa có bình luận nào.</p>
            <span>Hãy để lại bình luận cho người bán.</span>
          </div>
        )}
      </div>

      {/* Ô nhập bình luận */}
      <div className="comment-input">
        <img
          src={avatarUser || assets.avatar}
          alt="avatar"
          className="avatar"
        />

        <div className="comment-box">
          {/* ⭐ Hàng riêng cho phần đánh giá sao */}
          <div className="rating-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarFilled
                key={star}
                className={`star ${rating >= star ? "active" : ""}`}
                onClick={() => !loading && setRating(star)}
              />
            ))}
          </div>

          {/* 💬 Ô nhập bình luận */}
          <input
            type="text"
            placeholder="Viết bình luận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="button"
          className="send-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <LoadingOutlined /> : <IoMdSend />}
        </button>
      </div>
    </div>
  );
};

export default PostContactForm;
