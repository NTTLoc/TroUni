/**
 * Payment utilities for PayOS integration
 */

/**
 * Format description for PayOS (max 25 characters)
 * @param {string} description - Original description
 * @param {string} type - Payment type ('room', 'general', etc.)
 * @returns {string} Formatted description
 */
export const formatPayOSDescription = (description, type = 'general') => {
  if (!description) {
    // Default descriptions based on type
    const defaults = {
      room: 'Dat coc phong tro',
      general: 'Thanh toan Trouni',
      deposit: 'Dat coc',
      rent: 'Tien phong'
    };
    return defaults[type] || 'Thanh toan Trouni';
  }

  // If description is already short enough, return as is
  if (description.length <= 25) {
    return description;
  }

  // Try to create a meaningful short description
  const shortDescriptions = {
    room: 'Dat coc phong tro',
    general: 'Thanh toan Trouni',
    deposit: 'Dat coc',
    rent: 'Tien phong'
  };

  // If we have a type-specific short description, use it
  if (shortDescriptions[type]) {
    return shortDescriptions[type];
  }

  // Otherwise, truncate the original description
  return description.substring(0, 25);
};

/**
 * Validate PayOS payment data
 * @param {Object} data - Payment data
 * @returns {Object} Validation result
 */
export const validatePayOSData = (data) => {
  const errors = [];

  // Validate amount
  if (!data.amount || data.amount < 1000) {
    errors.push('Amount phải lớn hơn hoặc bằng 1000 VND');
  }

  // Validate description
  if (!data.description || data.description.length === 0) {
    errors.push('Description không được để trống');
  }

  if (data.description && data.description.length > 25) {
    errors.push('Description không được quá 25 ký tự');
  }

  // Validate URLs
  if (!data.returnUrl) {
    errors.push('Return URL là bắt buộc');
  }

  if (!data.cancelUrl) {
    errors.push('Cancel URL là bắt buộc');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format amount for PayOS (ensure it's an integer)
 * @param {number|string} amount - Amount in VND
 * @returns {number} Formatted amount
 */
export const formatPayOSAmount = (amount) => {
  const numAmount = parseInt(amount);
  if (isNaN(numAmount) || numAmount < 1000) {
    throw new Error('Amount phải là số và lớn hơn hoặc bằng 1000 VND');
  }
  return numAmount;
};

/**
 * Create PayOS payment data with proper formatting
 * @param {Object} data - Raw payment data
 * @returns {Object} Formatted PayOS data
 */
export const createPayOSPaymentData = (data) => {
  const validation = validatePayOSData(data);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  return {
    amount: formatPayOSAmount(data.amount),
    description: formatPayOSDescription(data.description, data.type),
    returnUrl: data.returnUrl,
    cancelUrl: data.cancelUrl,
    roomId: data.roomId || null
  };
};
