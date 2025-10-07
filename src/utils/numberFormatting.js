// ==================== NUMBER FORMATTING UTILITIES ====================

/**
 * Format số tiền với dấu phẩy
 * @param {string|number} value - Giá trị cần format
 * @returns {string} Số đã format với dấu phẩy
 */
export const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const cleanValue = String(value).replace(/\D/g, '');
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Loại bỏ dấu phẩy khỏi số
 * @param {string} value - Số có dấu phẩy
 * @returns {string} Số không có dấu phẩy
 */
export const removeCommasFromNumber = (value) => {
  if (!value) return '';
  return String(value).replace(/,/g, '');
};

/**
 * Format số tiền VNĐ
 * @param {string|number} value - Giá trị
 * @returns {string} Format "1,000,000 VNĐ"
 */
export const formatVND = (value) => {
  if (!value) return '0 VNĐ';
  const cleanValue = removeCommasFromNumber(value);
  const formatted = formatNumberWithCommas(cleanValue);
  return `${formatted} VNĐ`;
};

/**
 * Format diện tích
 * @param {string|number} value - Giá trị
 * @returns {string} Format "25 m²"
 */
export const formatArea = (value) => {
  if (!value) return '0 m²';
  const cleanValue = removeCommasFromNumber(value);
  return `${cleanValue} m²`;
};

/**
 * Validate số tiền
 * @param {string} value - Giá trị cần validate
 * @returns {boolean} True nếu hợp lệ
 */
export const isValidPrice = (value) => {
  if (!value) return false;
  const cleanValue = removeCommasFromNumber(value);
  return /^\d+$/.test(cleanValue) && parseInt(cleanValue) > 0;
};

/**
 * Validate diện tích
 * @param {string} value - Giá trị cần validate
 * @returns {boolean} True nếu hợp lệ
 */
export const isValidArea = (value) => {
  if (!value) return true; // Area có thể để trống
  const cleanValue = removeCommasFromNumber(value);
  return /^\d+$/.test(cleanValue) && parseInt(cleanValue) > 0;
};
