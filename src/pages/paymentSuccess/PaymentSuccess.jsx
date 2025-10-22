import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import paymentApi from '../../services/paymentApi';
import './PaymentSuccess.scss';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const orderCode = searchParams.get('orderCode');
  const transactionCode = searchParams.get('transactionCode');
  const status = searchParams.get('status');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        setLoading(true);
        
        // Gọi webhook để xác nhận thanh toán thành công
        if (orderCode || transactionCode) {
          const webhookData = {
            transactionCode: orderCode || transactionCode,
            amount: 0, // Amount sẽ được lấy từ payment data
            status: 'COMPLETED',
            description: 'Thanh toán thành công qua PayOS',
            code: '00', // PayOS success code
            success: true
          };

          console.log('Calling webhook for payment success:', webhookData);
          
          try {
            const response = await paymentApi.confirmPayment(webhookData);
            console.log('Payment confirmed successfully:', response);
            setPaymentData(response);
          } catch (webhookError) {
            console.warn('Webhook call failed, but payment might still be successful:', webhookError);
            // Không set error vì payment có thể đã thành công
          }
        }

        // Không auto redirect về trang chủ
        // User có thể ở lại trang để xem thông tin chi tiết

      } catch (err) {
        console.error('Error handling payment success:', err);
        setError('Có lỗi xảy ra khi xử lý thanh toán thành công');
      } finally {
        setLoading(false);
      }
    };

    if (orderCode || transactionCode) {
      handlePaymentSuccess();
    } else {
      setError('Không tìm thấy thông tin thanh toán');
      setLoading(false);
    }
  }, [orderCode, transactionCode, navigate]);

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-container">
          <div className="loading-section">
            <LoadingOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <h2>Đang xử lý thanh toán...</h2>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-container">
          <div className="error-section">
            <div className="error-icon">Error</div>
            <h2>Lỗi xử lý thanh toán</h2>
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
    <div className="payment-success-page">
      <div className="payment-success-container">
        <div className="success-section">
          <div className="success-icon">
            <CheckCircleOutlined className="success-icon-main" />
            <div className="success-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
            </div>
          </div>
          
          <div className="success-header">
            <h1>Thanh toán thành công!</h1>
            <p className="success-subtitle">Giao dịch của bạn đã được xử lý hoàn tất</p>
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
                           <span className="value status-completed">
                             <span className="status-dot"></span>
                             Đã hoàn thành
                           </span>
                         </div>
                       </div>
                     </div>
            )}
            
            {orderCode && (
              <div className="order-info">
                <div className="order-badge">
                  <span className="order-label">Mã đơn hàng</span>
                  <span className="order-value">{orderCode}</span>
                </div>
              </div>
            )}
          </div>

                 <div className="success-message">
                   <div className="message-content">
                     <h4>Chúc mừng bạn!</h4>
                     <p>Thanh toán đã được xử lý thành công và bạn sẽ nhận được email xác nhận trong vài phút tới.</p>
                   </div>
                 </div>

                 <div className="action-buttons">
                   <button 
                     className="btn btn-secondary"
                     onClick={() => navigate('/account')}
                   >
                     Xem lịch sử thanh toán
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
                       <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi</p>
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

export default PaymentSuccess;
