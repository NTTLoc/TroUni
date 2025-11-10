import React, { useEffect, useState } from "react";
import "./PostDetail.scss";
import { useParams } from "react-router-dom";
import { CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";
import PostGallery from "../../features/postDetail/postGallery/PostGallery";
import PostMainInfo from "../../features/postDetail/postMainInfo/PostMainInfo";
import PostOwner from "../../features/postDetail/postOwner/PostOwner";
import PostContact from "../../features/postDetail/postContact/PostContact";
import RelatedPosts from "../../features/postDetail/relatedPosts/RelatedPosts";
import PostDescription from "../../features/postDetail/postDescription/PostDescription";
import PaymentModal from "../../components/payment/PaymentModal";
import { getRoomByIdApi } from "../../services/postApi";
import usePayment from "../../hooks/usePayment";
import { useAuth } from "../../hooks/useAuth";
import { formatPayOSDescription } from "../../utils/paymentUtils";

const PostDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [roomStatus, setRoomStatus] = useState(null);

  const { auth } = useAuth();
  const {
    paymentData,
    isLoading: paymentLoading,
    error: paymentError,
    paymentStatus,
    createRoomPayment,
    confirmPayment,
    cancelPayment,
    resetPayment,
  } = usePayment();

  useEffect(() => {
    setLoading(true);
    getRoomByIdApi(id)
      .then((res) => {
        setPost(res.data);
        setRoomStatus(res.data.status || "AVAILABLE"); // Set room status từ response
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tìm thấy bài đăng");
        setLoading(false);
      });
  }, [id]);

  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    if (response.action === "confirm") {
      try {
        await confirmPayment(
          response.transactionCode,
          response.amount,
          response.description,
          response.roomId
        );
        setShowPaymentModal(false);
        reloadRoomData();
        alert(
          "Đặt cọc thành công! Chủ trọ sẽ xác nhận và cập nhật trạng thái phòng."
        );
      } catch (error) {
        console.error("Payment confirmation error:", error);
        alert("Có lỗi xảy ra khi xác nhận thanh toán");
      }
    } else {
      setShowPaymentModal(false);
      reloadRoomData();
      console.log("Payment success:", response);
      alert(
        "Đặt cọc thành công! Chủ trọ sẽ xác nhận và cập nhật trạng thái phòng."
      );
    }
  };

  // Reload room data from backend
  const reloadRoomData = () => {
    getRoomByIdApi(id)
      .then((res) => {
        setPost(res.data);
        setRoomStatus(res.data.status || "AVAILABLE");
      })
      .catch((err) => {
        console.error("Error reloading room data:", err);
      });
  };

  // Handle payment error
  const handlePaymentError = async (error) => {
    if (error.action === "cancel") {
      try {
        await cancelPayment(error.transactionCode, error.status);
        setShowPaymentModal(false);
        alert("Thanh toán đã được hủy");
      } catch (cancelError) {
        console.error("Payment cancellation error:", cancelError);
        alert("Có lỗi xảy ra khi hủy thanh toán");
      }
    } else {
      console.error("Payment error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán");
    }
  };

  // Handle payment button click - chỉ đặt cọc
  const handlePaymentClick = async () => {
    if (!auth.user) {
      alert("Vui lòng đăng nhập để đặt cọc");
      return;
    }

    if (!post) {
      alert("Không tìm thấy thông tin phòng");
      return;
    }

    // Test với 3000 VND
    const amount = 50000;
    const description = formatPayOSDescription(
      `Đặt cọc phòng ${post.title}`,
      "room"
    );

    try {
      const response = await createRoomPayment(post.id, amount, description);

      // Redirect luôn tới PayOS checkout nếu có checkoutUrl
      if (response.checkoutUrl) {
        console.log("🔄 Redirecting to PayOS checkout:", response.checkoutUrl);
        window.open(response.checkoutUrl, "_blank");
      } else {
        // Fallback: mở modal nếu không có checkoutUrl
        setShowPaymentModal(true);
      }
    } catch (error) {
      handlePaymentError(error);
    }
  };

  // Close payment modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    resetPayment();
  };

  if (loading) {
    return <div className="post-detail">Đang tải bài đăng...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail">{error || "Không tìm thấy bài đăng"}</div>
    );
  }

  return (
    <div className="post-detail">
      {/* Cột trái */}
      <div className="post-detail__left">
        <div className="left-top">
          <PostGallery images={post.images} />
          <PostMainInfo post={post} />
        </div>

        <PostDescription
          description={post.description}
          phone={post.owner?.profile?.phoneNumber || "Không có SĐT"}
        />

        <PostContact roomId={post.id} />

        <RelatedPosts />
      </div>

      {/* Cột phải */}
      <div className="post-detail__right">
        <PostOwner owner={post.owner} />

        {/* Payment Section - Chỉ hiển thị khi room chưa được đặt cọc */}
        {roomStatus !== "rented" && (
          <div className="payment-section">
            <div className="payment-card">
              <div className="payment-info">
                <h3>Đặt cọc phòng trọ</h3>

                <div className="deposit-info">
                  <div className="deposit-amount">
                    <span className="amount-label">Số tiền đặt cọc:</span>
                    <span className="amount-value">50.000 ₫</span>
                  </div>

                  <div className="deposit-benefits">
                    <h4>Lợi ích khi đặt cọc:</h4>
                    <ul>
                      <li>Giữ chỗ phòng trọ</li>
                      <li>Ưu tiên xem phòng</li>
                      <li>Bảo vệ quyền lợi của bạn</li>
                    </ul>
                  </div>
                </div>

                <p className="payment-description">
                  Đặt cọc 50.000 ₫ để giữ chỗ phòng trọ. Số tiền còn lại sẽ được
                  thanh toán khi nhận phòng và ký hợp đồng.
                </p>
              </div>

              <button
                className={`payment-btn ${paymentLoading ? "loading" : ""}`}
                onClick={handlePaymentClick}
                disabled={paymentLoading || !auth.user}
              >
                {paymentLoading ? (
                  <>
                    <div className="spinner"></div>
                    Đang tạo đặt cọc...
                  </>
                ) : (
                  <>
                    <CreditCardOutlined style={{ fontSize: "20px" }} />
                    {auth.user ? "Đặt cọc ngay" : "Đăng nhập để đặt cọc"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Status Message khi đã đặt cọc */}
        {roomStatus === "rented" && (
          <div className="room-status-message">
            <div className="status-card">
              <div className="status-info">
                <h3>Phòng đã được đặt cọc</h3>
                <div className="status-badge">
                  <CheckCircleOutlined
                    style={{ fontSize: "20px", color: "#10b981" }}
                  />
                  <span>Đã giữ chỗ</span>
                </div>
                <p className="status-description">
                  Phòng này đã được đặt cọc và đang chờ xác nhận từ chủ trọ. Vui
                  lòng liên hệ trực tiếp để hoàn tất thủ tục thuê phòng.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        paymentData={paymentData}
        roomId={id} // Truyền roomId từ URL params
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default PostDetail;
