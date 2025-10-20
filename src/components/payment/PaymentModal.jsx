import React, { useState, useEffect } from 'react';
import { CloseOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';
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

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!paymentData || !paymentData.transactionCode || !paymentData.amount) {
      alert('Không có thông tin thanh toán để xác nhận');
      return;
    }

    try {
      setIsConfirming(true);
      
      const webhookData = {
        transactionCode: paymentData.transactionCode,
        amount: paymentData.amount,
        status: 'PROCESSING',
        description: paymentData.description || `Đặt cọc phòng trọ`,
        bankCode: 'AGRIBANK',
        roomId: roomId // Sử dụng roomId từ props (từ URL params)
      };

      console.log('Sending webhook to backend. Backend will update payment status to PROCESSING and room status to WAITING:', webhookData);
      
      const response = await paymentApi.confirmPayment(webhookData);
      
      console.log('Payment confirmed:', response);
      
      // Backend đã xử lý webhook và tự động update:
      // 1. Payment status: PENDING → PROCESSING
      // 2. Room status: AVAILABLE → WAITING (nếu có roomId)
      console.log('Payment confirmed successfully. Backend has updated payment and room status.');
      
      // Call success callback
      if (onPaymentSuccess) {
        onPaymentSuccess(response);
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen || !paymentData) return null;

  // Debug log để kiểm tra payment data
  console.log('PaymentModal - paymentData:', {
    transactionCode: paymentData.transactionCode,
    amount: paymentData.amount,
    roomIdFromProps: roomId, // RoomId từ URL params
    roomIdFromPaymentData: paymentData.roomId, // RoomId từ payment data (có thể undefined)
    qrCodeUrl: paymentData.qrCodeUrl,
    bankName: paymentData.bankName,
    bankAccountNumber: paymentData.bankAccountNumber,
    bankAccountName: paymentData.bankAccountName
  });

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal__header">
          <h2>Thanh toán phòng trọ</h2>
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
              <span className="label">Mã giao dịch:</span>
              <div className="transaction-code">
                <span className="value">{paymentData.transactionCode}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(paymentData.transactionCode)}
                  title="Sao chép mã giao dịch"
                >
                  <CopyOutlined style={{ fontSize: '16px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="qr-section">
            <h3>Quét mã QR để thanh toán</h3>
            <div className="qr-container">
              {paymentData.qrCodeUrl ? (
                <img 
                  src={paymentData.qrCodeUrl}
                  alt="QR Code thanh toán"
                  className="qr-image"
                />
              ) : (
                <div className="qr-placeholder">
                  <p>Đang tạo QR code...</p>
                </div>
              )}
            </div>
            
            {/* Timer */}
            <div className={`timer ${isExpired ? 'expired' : ''}`}>
              <ClockCircleOutlined style={{ fontSize: '16px' }} />
              <span>QR code hết hạn sau: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bank-info">
            <h3>Thông tin chuyển khoản</h3>
            <div className="bank-details">
              <div className="bank-detail">
                <span className="label">Ngân hàng:</span>
                <span className="value">{paymentData.bankName}</span>
              </div>
              <div className="bank-detail">
                <span className="label">Số tài khoản:</span>
                <div className="account-number">
                  <span className="value">{paymentData.bankAccountNumber}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(paymentData.bankAccountNumber)}
                    title="Sao chép số tài khoản"
                  >
                    <CopyOutlined style={{ fontSize: '16px' }} />
                  </button>
                </div>
              </div>
              <div className="bank-detail">
                <span className="label">Tên tài khoản:</span>
                <span className="value">{paymentData.bankAccountName}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions">
            <h3>Hướng dẫn thanh toán</h3>
            <ol>
              <li>Mở ứng dụng ngân hàng trên điện thoại</li>
              <li>Quét mã QR hoặc chuyển khoản theo thông tin bên trên</li>
              <li>Nhập đúng số tiền và nội dung chuyển khoản</li>
              <li>Hoàn tất giao dịch và chờ xác nhận</li>
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
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
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
                <CheckCircleOutlined style={{ fontSize: '16px' }} />
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

