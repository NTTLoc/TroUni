import { useState, useEffect, useCallback, useRef } from 'react';
import paymentApi from '../services/paymentApi';

const usePayment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, pending, completed, failed, cancelled
  const [isPolling, setIsPolling] = useState(false);
  
  const pollingIntervalRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

  // Cleanup polling when component unmounts
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  /**
   * Tạo thanh toán cho phòng
   */
  const createRoomPayment = useCallback(async (roomId, amount, description = null) => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus('pending');

      const response = await paymentApi.createRoomPayment({
        roomId,
        amount,
        description: description || `Thanh toán phòng trọ - ${new Date().toLocaleDateString('vi-VN')}`
      });

      // Validate response
      if (!response || !response.transactionCode) {
        console.error('Invalid payment response:', response);
        throw new Error('Invalid payment response format');
      }

      setPaymentData(response);
      setPaymentStatus('pending');
      
      // Bắt đầu polling để check status
      startPolling(response.transactionCode);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán');
      setPaymentStatus('failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Tạo thanh toán VietQR thông thường
   */
  const createVietQRPayment = useCallback(async (amount, description = null, subscriptionId = null) => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus('pending');

      const response = await paymentApi.createVietQRPayment({
        amount,
        description: description || `Thanh toán TroUni - ${new Date().toLocaleDateString('vi-VN')}`,
        subscriptionId
      });

      // Validate response
      if (!response || !response.transactionCode) {
        console.error('Invalid payment response:', response);
        throw new Error('Invalid payment response format');
      }

      setPaymentData(response);
      setPaymentStatus('pending');
      
      // Bắt đầu polling để check status
      startPolling(response.transactionCode);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán');
      setPaymentStatus('failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Kiểm tra trạng thái thanh toán
   */
  const checkPaymentStatus = useCallback(async (transactionCode) => {
    try {
      const response = await paymentApi.checkPaymentStatus(transactionCode);
      return response;
    } catch (err) {
      console.error('Error checking payment status:', err);
      throw err;
    }
  }, []);

  /**
   * Bắt đầu polling để check payment status
   */
  const startPolling = useCallback((transactionCode) => {
    if (isPolling) return;

    setIsPolling(true);
    
    // Polling interval: 10 giây
    const POLLING_INTERVAL = 10000;
    // Timeout: 15 phút (thời gian QR code hết hạn)
    const POLLING_TIMEOUT = 15 * 60 * 1000;

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await checkPaymentStatus(transactionCode);
        
        if (statusResponse.status === 'COMPLETED') {
          setPaymentStatus('completed');
          stopPolling();
          
          // Cập nhật payment data với status mới
          if (paymentData) {
            setPaymentData(prev => ({
              ...prev,
              status: 'COMPLETED'
            }));
          }
        } else if (statusResponse.status === 'CANCELLED') {
          setPaymentStatus('cancelled');
          stopPolling();
        } else if (statusResponse.status === 'FAILED') {
          setPaymentStatus('failed');
          stopPolling();
        }
      } catch (err) {
        console.error('Error during polling:', err);
        // Không dừng polling nếu có lỗi network, chỉ log
      }
    }, POLLING_INTERVAL);

    // Set timeout để dừng polling sau 15 phút
    pollingTimeoutRef.current = setTimeout(() => {
      console.log('Polling timeout reached');
      stopPolling();
    }, POLLING_TIMEOUT);
  }, [isPolling, checkPaymentStatus, paymentData]);

  /**
   * Dừng polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    
    setIsPolling(false);
  }, []);

  /**
   * Hủy thanh toán
   */
  const cancelPayment = useCallback(async (paymentId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await paymentApi.cancelPayment(paymentId);
      
      setPaymentStatus('cancelled');
      stopPolling();
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi hủy thanh toán');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stopPolling]);

  /**
   * Lấy lịch sử thanh toán
   */
  const getPaymentHistory = useCallback(async (paginated = false, params = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = paginated 
        ? await paymentApi.getMyPaymentHistoryPaginated(params)
        : await paymentApi.getMyPaymentHistory();
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lấy lịch sử thanh toán');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset payment state
   */
  const resetPayment = useCallback(() => {
    setPaymentData(null);
    setError(null);
    setPaymentStatus('idle');
    stopPolling();
  }, [stopPolling]);

  /**
   * Lấy payment theo transaction code
   */
  const getPaymentByTransactionCode = useCallback(async (transactionCode) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await paymentApi.getPaymentByTransactionCode(transactionCode);
      setPaymentData(response);
      setPaymentStatus(response.status.toLowerCase());
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin thanh toán');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    paymentData,
    isLoading,
    error,
    paymentStatus,
    isPolling,
    
    // Actions
    createRoomPayment,
    createVietQRPayment,
    checkPaymentStatus,
    cancelPayment,
    getPaymentHistory,
    resetPayment,
    getPaymentByTransactionCode,
    
    // Polling controls
    startPolling,
    stopPolling
  };
};

export default usePayment;

