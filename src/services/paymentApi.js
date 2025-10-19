import axios from '../utils/axios.customize';

const paymentApi = {
  /**
   * Tạo thanh toán VietQR cho một phòng
   * @param {Object} data - { roomId, amount, description? }
   * @returns {Promise<Object>} VietQRPaymentResponse
   */
  createRoomPayment: async (data) => {
    try {
      const response = await axios.post('/payments/room-payment', data);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error creating room payment:', error);
      throw error;
    }
  },

  /**
   * Tạo thanh toán VietQR thông thường
   * @param {Object} data - { amount, description?, subscriptionId? }
   * @returns {Promise<Object>} VietQRPaymentResponse
   */
  createVietQRPayment: async (data) => {
    try {
      const response = await axios.post('/payments/viet-qr', data);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error creating VietQR payment:', error);
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
   * Gửi webhook để xác nhận thanh toán (PENDING → PROCESSING) và update room status
   * @param {Object} data - { transactionCode, amount, status, description, bankCode, roomId }
   * @returns {Promise<Object>} PaymentResponse
   */
  confirmPayment: async (data) => {
    try {
      const response = await axios.post('/payments/webhook', data);
      return response; // Axios interceptor đã extract data rồi
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
};

export default paymentApi;

