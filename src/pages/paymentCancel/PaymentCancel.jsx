import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import paymentApi from '../../services/paymentApi';
import './PaymentCancel.scss';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const orderCode = searchParams.get('orderCode');
  const transactionCode = searchParams.get('transactionCode');
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const id = searchParams.get('id');
  const cancel = searchParams.get('cancel');

  useEffect(() => {
    const handlePaymentCancel = async () => {
      try {
        setLoading(true);
        
        // Gọi webhook để xác nhận hủy thanh toán
        if (orderCode || transactionCode) {
          console.log('Handling payment cancel with params:', {
            orderCode,
            transactionCode,
            status,
            code,
            id,
            cancel,
            allParams: Object.fromEntries(searchParams.entries())
          });

          try {
            // Gọi handlePayOSCancel để cập nhật trạng thái với đầy đủ tham số
            const response = await paymentApi.handlePayOSCancel(
              orderCode || transactionCode,
              status || 'CANCELLED'
            );
            console.log('Payment cancelled successfully:', response);
            setPaymentData(response);
          } catch (cancelError) {
            console.warn('Cancel webhook call failed:', cancelError);
            // Không set error vì cancel có thể đã được xử lý
            // Tạo mock data để hiển thị thông tin cancel
            setPaymentData({
              transactionCode: orderCode || transactionCode,
              amount: 0, // Không biết amount khi cancel
              status: 'CANCELLED'
            });
          }
        }

        // Không auto redirect về trang chủ
        // User có thể ở lại trang để xem thông tin chi tiết

      } catch (err) {
        console.error('Error handling payment cancel:', err);
        setError('Có lỗi xảy ra khi xử lý hủy thanh toán');
      } finally {
        setLoading(false);
      }
    };

    if (orderCode || transactionCode) {
      handlePaymentCancel();
    } else {
      setError('Không tìm thấy thông tin thanh toán');
      setLoading(false);
    }
  }, [orderCode, transactionCode, status, code, id, cancel, navigate]);

  if (loading) {
    return (
      <div className="payment-cancel-page">
        <div className="payment-cancel-container">
          <div className="loading-section">
            <LoadingOutlined style={{ fontSize: '48px', color: '#ff7875' }} />
            <h2>Đang xử lý hủy thanh toán...</h2>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-cancel-page">
        <div className="payment-cancel-container">
          <div className="error-section">
            <div className="error-icon">Error</div>
            <h2>Lỗi xử lý hủy thanh toán</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-cancel-page">
      <div className="payment-cancel-container">
        <div className="cancel-section">
          <div className="cancel-icon">
            <ExclamationCircleOutlined className="cancel-icon-main" />
            <div className="cancel-waves">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
            </div>
          </div>
          
          <div className="cancel-header">
            <h1>Thanh toán đã bị hủy</h1>
            <p className="cancel-subtitle">Giao dịch của bạn đã được hủy thành công</p>
          </div>
          
          <div className="payment-details">
            <div className="details-header">
              <h3>Chi tiết giao dịch</h3>
            </div>
            
            {paymentData && (
                     <div className="details-grid">
                       <div className="detail-item">
                         <div className="detail-content">
                           <span className="label">Mã giao dịch</span>
                           <span className="value">{paymentData.transactionCode}</span>
                         </div>
                       </div>
                       
                       <div className="detail-item">
                         <div className="detail-content">
                           <span className="label">Số tiền</span>
                           <span className="value amount">
                             {new Intl.NumberFormat('vi-VN', {
                               style: 'currency',
                               currency: 'VND'
                             }).format(paymentData.amount)}
                           </span>
                         </div>
                       </div>
                       
                       <div className="detail-item">
                         <div className="detail-content">
                           <span className="label">Trạng thái</span>
                           <span className="value status-cancelled">
                             <span className="status-dot"></span>
                             Đã hủy
                           </span>
                         </div>
                       </div>
                     </div>
            )}
            
            {(orderCode || status) && (
              <div className="order-info">
                {orderCode && (
                  <div className="order-badge">
                    <span className="order-label">Mã đơn hàng</span>
                    <span className="order-value">{orderCode}</span>
                  </div>
                )}
                
                {status && (
                  <div className="status-badge">
                    <span className="status-label">Trạng thái PayOS</span>
                    <span className="status-value">{status}</span>
                  </div>
                )}
              </div>
            )}
          </div>

                 <div className="cancel-message">
                   <div className="message-content">
                     <h4>Thanh toán đã bị hủy</h4>
                     <div className="message-list">
                       <div className="message-item">
                         <span className="item-text">Không có khoản phí nào được tính từ tài khoản của bạn.</span>
                       </div>
                       <div className="message-item">
                         <span className="item-text">Bạn có thể thử thanh toán lại bất cứ lúc nào.</span>
                       </div>
                       <div className="message-item">
                         <span className="item-text">Bạn có thể tiếp tục sử dụng dịch vụ hoặc quay về trang chủ.</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="action-buttons">
                   <button 
                     className="btn btn-secondary"
                     onClick={() => navigate('/posts')}
                   >
                     Tìm phòng trọ khác
                   </button>
                   <button 
                     className="btn btn-primary"
                     onClick={() => navigate('/')}
                   >
                     Về trang chủ
                   </button>
                 </div>

                 <div className="support-section">
                   <div className="support-card">
                     <div className="support-content">
                       <h4>Cần hỗ trợ?</h4>
                       <p>Nếu bạn gặp vấn đề với thanh toán, đừng ngần ngại liên hệ với chúng tôi</p>
                       <div className="support-contacts">
                         <a href="mailto:support@trouni.com" className="contact-link">
                           support@trouni.com
                         </a>
                         <a href="tel:1900-xxxx" className="contact-link">
                           1900-xxxx
                         </a>
                       </div>
                     </div>
                   </div>
                 </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
