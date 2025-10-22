import axios from '../utils/axios.customize';
import { createPayOSPaymentData } from '../utils/paymentUtils';

const paymentApi = {
  /**
   * Tạo thanh toán PayOS
   * @param {Object} data - { amount, description?, returnUrl?, cancelUrl?, roomId? }
   * @returns {Promise<Object>} PayOSPaymentResponse
   */
  createPayOSPayment: async (data) => {
    try {
      console.log('🚀 Creating PayOS payment with data:', data);
      
      // Format data theo PayOSPaymentRequest DTO using utility function
      const payOSData = createPayOSPaymentData({
        amount: data.amount,
        description: data.description,
        returnUrl: data.returnUrl || `${window.location.origin}/payment-success`,
        cancelUrl: data.cancelUrl || `${window.location.origin}/payment-cancel`,
        roomId: data.roomId || null,
        type: 'general'
      });

      console.log('📤 Sending PayOS data:', payOSData);
      console.log('📤 PayOS data type check:', {
        amount: typeof payOSData.amount,
        description: typeof payOSData.description,
        returnUrl: typeof payOSData.returnUrl,
        cancelUrl: typeof payOSData.cancelUrl,
        roomId: typeof payOSData.roomId
      });
      
      const response = await axios.post('/payments/payos', payOSData);
      console.log('✅ PayOS payment created successfully:', response);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('❌ Error creating PayOS payment:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('❌ Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Handle specific error codes
        if (error.response.status === 402) {
          console.error('❌ 402 Payment Required - Possible causes:');
          console.error('   - PayOS API credentials invalid');
          console.error('   - PayOS service not configured properly');
          console.error('   - Amount validation failed on backend');
          console.error('   - PayOS SDK initialization failed');
        }
      } else if (error.request) {
        console.error('❌ Request error:', error.request);
      } else {
        console.error('❌ Error message:', error.message);
      }
      
      throw error;
    }
  },

  /**
   * Tạo QR thanh toán PayOS cho một phòng
   * @param {Object} data - { roomId, amount, description? }
   * @returns {Promise<Object>} PayOSPaymentResponse với QR code
   */
  createRoomPayment: async (data) => {
    try {
      console.log('🏠 Creating PayOS QR payment for room:', data);
      
      // Sử dụng createPayOSPayment với roomId
      const response = await paymentApi.createPayOSPayment({
        amount: data.amount,
        description: data.description,
        returnUrl: `${window.location.origin}/payment-success`, // Success page
        cancelUrl: `${window.location.origin}/payment-cancel`, // Cancel page
        roomId: data.roomId, // UUID roomId
        type: 'room' // Specify type for room payment
      });

      console.log('✅ PayOS QR payment created successfully:', response);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('❌ Error creating PayOS QR payment:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin payment theo ID
   * @param {string} paymentId - UUID của payment
   * @returns {Promise<Object>} PaymentResponse
   */
  getPaymentById: async (paymentId) => {
    try {
      const response = await axios.get(`/payments/${paymentId}`);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      throw error;
    }
  },

  /**
   * Lấy payment theo transaction code
   * @param {string} transactionCode - Mã giao dịch
   * @returns {Promise<Object>} PaymentResponse
   */
  getPaymentByTransactionCode: async (transactionCode) => {
    try {
      const response = await axios.get(`/payments/transaction/${transactionCode}`);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error getting payment by transaction code:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái thanh toán
   * @param {string} transactionCode - Mã giao dịch
   * @returns {Promise<Object>} { transactionCode, status, amount }
   */
  checkPaymentStatus: async (transactionCode) => {
    try {
      const response = await axios.get(`/payments/status/${transactionCode}`);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  },

  /**
   * Lấy lịch sử thanh toán của user hiện tại
   * @returns {Promise<Array>} List<PaymentResponse>
   */
  getMyPaymentHistory: async () => {
    try {
      const response = await axios.get('/payments/my-history');
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  },

  /**
   * Lấy lịch sử thanh toán với phân trang
   * @param {Object} params - { page, size, sort? }
   * @returns {Promise<Object>} Page<PaymentResponse>
   */
  getMyPaymentHistoryPaginated: async (params = {}) => {
    try {
      const response = await axios.get('/payments/my-history/paginated', {
        params: {
          page: params.page || 0,
          size: params.size || 10,
          sort: params.sort || 'createdAt,desc'
        }
      });
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error getting paginated payment history:', error);
      throw error;
    }
  },

  /**
   * Hủy thanh toán
   * @param {string} paymentId - UUID của payment
   * @returns {Promise<Object>} PaymentResponse
   */
  cancelPayment: async (paymentId) => {
    try {
      const response = await axios.delete(`/payments/${paymentId}/cancel`);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error cancelling payment:', error);
      throw error;
    }
  },

  /**
   * Confirm thanh toán qua webhook
   * @param {Object} data - { transactionCode, amount, status, description, roomId }
   * @returns {Promise<Object>} PaymentResponse
   */
  confirmPayment: async (data) => {
    try {
      console.log('✅ Confirming payment via webhook:', data);
      const response = await axios.post('/payments/webhook', data);
      console.log('✅ Payment confirmed successfully:', response);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      throw error;
    }
  },

  /**
   * Xử lý callback từ PayOS khi người dùng hủy thanh toán
   * @param {string} transactionCode - Mã giao dịch
   * @param {string} status - Trạng thái thanh toán
   * @returns {Promise<Object>} PaymentResponse
   */
  handlePayOSCancel: async (transactionCode, status) => {
    try {
      console.log('🔄 Handling PayOS cancel for transaction:', transactionCode);
      
      // Gọi endpoint cancel với đầy đủ tham số từ PayOS
      const response = await axios.get(`/payments/cancel`, {
        params: {
          orderCode: transactionCode,
          status: status || 'CANCELLED',
          code: '00', // PayOS cancel code
          id: transactionCode,
          cancel: 'true'
        }
      });
      
      console.log('✅ PayOS cancel handled successfully:', response);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('❌ Error handling PayOS cancel:', error);
      throw error;
    }
  }
};

export default paymentApi;

