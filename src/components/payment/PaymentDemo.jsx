import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import usePayment from '../../hooks/usePayment';
import { useAuth } from '../../hooks/useAuth';
import './PaymentDemo.scss';

const PaymentDemo = () => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(1000000); // 1 triệu VND
  const [description, setDescription] = useState('Test payment');
  
  const { user } = useAuth();
  const { 
    paymentData, 
    isLoading, 
    error, 
    paymentStatus,
    createPayOSPayment,
    confirmPayment,
    cancelPayment,
    resetPayment 
  } = usePayment();

  const handleCreatePayment = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để test payment');
      return;
    }

    try {
      // Test với roomId null (thanh toán thông thường)
      await createPayOSPayment(amount, description, null);
      setShowModal(true);
    } catch (error) {
      console.error('PayOS payment creation failed:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetPayment();
  };

  const handlePaymentSuccess = async (data) => {
    if (data.action === 'confirm') {
      try {
        await confirmPayment(
          data.transactionCode,
          data.amount,
          data.description,
          data.roomId
        );
        setShowModal(false);
        alert('Payment confirmed successfully!');
      } catch (error) {
        console.error('Payment confirmation error:', error);
        alert('Payment confirmation failed!');
      }
    } else {
      setShowModal(false);
      alert('Payment successful!');
    }
  };

  const handlePaymentError = async (data) => {
    if (data.action === 'cancel') {
      try {
        await cancelPayment(data.transactionCode, data.status);
        setShowModal(false);
        alert('Payment cancelled successfully!');
      } catch (error) {
        console.error('Payment cancellation error:', error);
        alert('Payment cancellation failed!');
      }
    } else {
      console.error('Payment error:', data);
      alert('Payment failed!');
    }
  };

  return (
    <div className="payment-demo">
      <div className="payment-demo__container">
        <h2>Payment Demo</h2>
        
        <div className="demo-form">
          <div className="form-group">
            <label>Payment Type:</label>
            <div className="payment-type-demo">
              <label className="demo-option">
                <input 
                  type="radio" 
                  name="paymentType" 
                  value="deposit"
                  checked={amount === 100000}
                  onChange={() => setAmount(100000)}
                />
                <span>Đặt cọc (100.000 ₫)</span>
              </label>
              
              <label className="demo-option">
                <input 
                  type="radio" 
                  name="paymentType" 
                  value="custom"
                  checked={amount !== 100000}
                  onChange={() => setAmount(1000000)}
                />
                <span>Custom Amount</span>
              </label>
            </div>
          </div>
          
          {amount !== 100000 && (
            <div className="form-group">
              <label>Amount (VND):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          
          <button 
            className="demo-btn"
            onClick={handleCreatePayment}
            disabled={isLoading || !user}
          >
            {isLoading ? 'Creating Payment...' : 'Create Payment'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {paymentData && (
          <div className="payment-info">
            <h3>PayOS QR Payment Created:</h3>
            <p><strong>Order Code:</strong> {paymentData.orderCode || paymentData.transactionCode}</p>
            <p><strong>Amount:</strong> {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(paymentData.amount)}</p>
            <p><strong>Status:</strong> {paymentStatus}</p>
            <p><strong>QR Code:</strong> {paymentData.qrCodeUrl ? 'Available' : 'Not available'}</p>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        paymentData={paymentData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default PaymentDemo;

