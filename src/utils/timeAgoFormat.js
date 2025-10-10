// src/utils/formatTimeAgo.js
export const timeAgoFormat = (dateString) => {
  if (!dateString) return "Không xác định";

  const updatedDate = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - updatedDate) / 1000); // chênh lệch tính theo giây

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} tháng trước`;
  return `${Math.floor(diff / 31104000)} năm trước`;
};
