import React, { useState, useEffect } from 'react';
import { CloseOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';
import paymentApi from '../../services/paymentApi';
import './PaymentModal.scss';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  paymentData, 
  roomId, // Nhận roomId từ props
  onPaymentSuccess,
  onPaymentError 
}) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !paymentData) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentData]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen && paymentData) {
      setTimeLeft(15 * 60);
      setIsExpired(false);
    }
  }, [isOpen, paymentData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    if (!paymentData || !paymentData.transactionCode || !paymentData.amount) {
      alert('Không có thông tin thanh toán để xác nhận');
      return;
    }

    try {
      setIsConfirming(true);
      
      // Call success callback để xử lý confirm
      if (onPaymentSuccess) {
        await onPaymentSuccess({
          action: 'confirm',
          transactionCode: paymentData.transactionCode,
          amount: paymentData.amount,
          description: paymentData.description,
          roomId: roomId
        });
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      if (onPaymentError) {
        onPaymentError(error);
      } else {
        alert('Có lỗi xảy ra khi xác nhận thanh toán');
      }
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle cancel payment
  const handleCancelPayment = async () => {
    if (!paymentData || !paymentData.transactionCode) {
      alert('Không có thông tin thanh toán để hủy');
      return;
    }

    try {
      setIsConfirming(true);
      
      // Call error callback để xử lý cancel
      if (onPaymentError) {
        await onPaymentError({
          action: 'cancel',
          transactionCode: paymentData.transactionCode,
          status: 'CANCELLED'
        });
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error cancelling payment:', error);
      alert('Có lỗi xảy ra khi hủy thanh toán');
    } finally {
      setIsConfirming(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen || !paymentData) return null;

  // Debug log để kiểm tra payment data
  console.log('PaymentModal - PayOS QR paymentData:', {
    orderCode: paymentData.orderCode,
    transactionCode: paymentData.transactionCode,
    amount: paymentData.amount,
    roomIdFromProps: roomId, // RoomId từ URL params
    roomIdFromPaymentData: paymentData.roomId, // RoomId từ payment data (có thể undefined)
    qrCodeUrl: paymentData.qrCodeUrl, // QR code từ PayOS
    checkoutUrl: paymentData.checkoutUrl,
    description: paymentData.description
  });

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal__header">
          <h2>Thanh toán PayOS QR</h2>
          <button className="payment-modal__close" onClick={onClose}>
            <CloseOutlined style={{ fontSize: '24px' }} />
          </button>
        </div>

        <div className="payment-modal__content">
          {/* Payment Info */}
          <div className="payment-info">
            <div className="payment-info__item">
              <span className="label">Số tiền:</span>
              <span className="value amount">{formatAmount(paymentData.amount)}</span>
            </div>
            <div className="payment-info__item">
              <span className="label">Nội dung:</span>
              <span className="value">{paymentData.description}</span>
            </div>
            <div className="payment-info__item">
              <span className="label">Mã đơn hàng:</span>
              <div className="transaction-code">
                <span className="value">{paymentData.orderCode || paymentData.transactionCode}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(paymentData.orderCode || paymentData.transactionCode)}
                  title="Sao chép mã đơn hàng"
                >
                  <CopyOutlined style={{ fontSize: '16px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* PayOS QR Code */}
      <div className="payos-section">
        <h3>Thanh toán qua PayOS</h3>
        <div className="payos-container">
          {paymentData.checkoutUrl ? (
            <div className="checkout-container">
              <div className="checkout-info">
                <h4>Chuyển hướng đến PayOS</h4>
                <p>Bạn sẽ được chuyển hướng đến trang thanh toán PayOS để hoàn tất giao dịch.</p>
                <div className="payment-methods">
                  <span className="method">Thẻ ATM/Visa/Mastercard</span>
                  <span className="method">Ví điện tử (MoMo, ZaloPay, VNPay)</span>
                  <span className="method">Chuyển khoản ngân hàng</span>
                </div>
                
                <button 
                  className="payos-checkout-btn"
                  onClick={() => window.open(paymentData.checkoutUrl, '_blank')}
                >
                  Mở PayOS Checkout
                </button>
                
                <p className="checkout-note">
                  Sau khi thanh toán thành công, bạn sẽ được chuyển hướng về trang này.
                </p>
              </div>
            </div>
          ) : paymentData.qrCodeUrl ? (
            <div className="qr-container">
              <img 
                src={paymentData.qrCodeUrl}
                alt="PayOS QR Code thanh toán"
                className="qr-image"
              />
              <div className="payos-info">
                <p>Quét mã QR để thanh toán qua PayOS</p>
                <div className="payment-methods">
                  <span className="method">Thẻ ATM/Visa/Mastercard</span>
                  <span className="method">Ví điện tử (MoMo, ZaloPay, VNPay)</span>
                  <span className="method">Chuyển khoản ngân hàng</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading-container">
              <p>Đang tạo thanh toán PayOS...</p>
            </div>
          )}
        </div>
        
        {/* Timer */}
        <div className={`timer ${isExpired ? 'expired' : ''}`}>
          <ClockCircleOutlined style={{ fontSize: '16px' }} />
          <span>Thanh toán hết hạn sau: {formatTime(timeLeft)}</span>
        </div>
      </div>

          {/* Instructions */}
          <div className="instructions">
            <h3>Hướng dẫn thanh toán</h3>
            <ol>
              <li>Mở ứng dụng ngân hàng hoặc ví điện tử trên điện thoại</li>
              <li>Quét mã QR PayOS bên trên</li>
              <li>Nhập đúng số tiền và nội dung chuyển khoản</li>
              <li>Hoàn tất giao dịch và nhấn "Xác nhận" bên dưới</li>
            </ol>
          </div>

          {/* Status Messages */}
          {copied && (
            <div className="status-message success">
              <CheckCircleOutlined style={{ fontSize: '16px' }} />
              <span>Đã sao chép!</span>
            </div>
          )}

          {isExpired && (
            <div className="status-message error">
              <ExclamationCircleOutlined style={{ fontSize: '16px' }} />
              <span>QR code đã hết hạn. Vui lòng tạo thanh toán mới.</span>
            </div>
          )}
        </div>

        <div className="payment-modal__footer">
          <button 
            className="btn btn-secondary"
            onClick={handleCancelPayment}
            disabled={isExpired || isConfirming}
          >
            <ExclamationCircleOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
            Hủy
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleConfirmPayment}
            disabled={isExpired || isConfirming}
          >
            {isConfirming ? (
              <>
                <div className="spinner"></div>
                Đang xác nhận...
              </>
            ) : (
              <>
                <CheckCircleOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

