Registered a new model: claude-3-5-sonnet-20241022

# 🔄 PayOS Backend Integration Update

## 📋 Tổng quan
Đã cập nhật toàn bộ frontend để tích hợp với backend PayOS service mới theo DTOs và service bạn cung cấp.

## 🔧 Các thay đổi chính

### 1. **paymentApi.js** - Cập nhật theo PayOSPaymentRequest DTO
- ✅ **PayOSPaymentRequest format**: `{ amount, description, returnUrl, cancelUrl, roomId }`
- ✅ **createPayOSPayment**: Format data theo DTO với roomId optional
- ✅ **createRoomPayment**: Sử dụng createPayOSPayment với roomId
- ✅ **confirmPayment**: Thêm lại function cho webhook confirm
- ✅ **handlePayOSCancel**: Xử lý PayOS cancel callback

### 2. **usePayment.js** - Cập nhật hook logic
- ✅ **createRoomPayment**: Sử dụng PayOS với roomId
- ✅ **createPayOSPayment**: Nhận roomId parameter
- ✅ **confirmPayment**: Thêm lại function cho confirm payment
- ✅ **cancelPayment**: Cập nhật để xử lý cancel với transactionCode
- ✅ **Validation**: Kiểm tra response có qrCodeUrl hoặc checkoutUrl

### 3. **PaymentModal.jsx** - Cập nhật UI cho PayOS QR
- ✅ **QR Code Display**: Hiển thị QR code từ PayOS response
- ✅ **Confirm/Cancel**: Thêm lại nút xác nhận và hủy
- ✅ **handleConfirmPayment**: Xử lý confirm payment với roomId
- ✅ **handleCancelPayment**: Xử lý cancel payment
- ✅ **Instructions**: Cập nhật hướng dẫn quét QR code

### 4. **PaymentDemo.jsx** - Cập nhật demo
- ✅ **createPayOSPayment**: Test với roomId null
- ✅ **handlePaymentSuccess**: Xử lý confirm payment
- ✅ **handlePaymentError**: Xử lý cancel payment
- ✅ **Display**: Hiển thị QR Code thay vì Checkout URL

### 5. **PaymentModal.scss** - Cập nhật styling
- ✅ **QR Container**: Thêm styling cho QR code display
- ✅ **QR Placeholder**: Styling cho loading state
- ✅ **Dark Mode**: Cập nhật dark mode cho QR container

## 🎯 Backend Integration

### PayOSPaymentRequest DTO:
```javascript
{
  amount: Integer,           // Minimum 1000
  description: String,       // Optional
  returnUrl: String,         // Required
  cancelUrl: String,         // Required
  roomId: UUID              // Optional
}
```

### PayOSPaymentResponse:
```javascript
{
  paymentId: UUID,
  transactionCode: String,
  amount: Integer,
  status: PaymentStatus,
  checkoutUrl: String,      // PayOS checkout URL
  qrCodeUrl: String,        // PayOS QR code URL
  description: String,
  createdAt: DateTime,
  expiresAt: DateTime
}
```

### PayOSWebhookRequest:
```javascript
{
  code: String,             // "00" = success
  desc: String,
  success: Boolean,
  orderCode: Long,
  amount: BigDecimal,
  description: String,
  accountNumber: String,
  reference: String,
  transactionDateTime: String,
  currency: String,
  paymentLinkId: String,
  signature: String,
  status: String
}
```

## 🔄 Payment Flow

### 1. **Tạo thanh toán PayOS**:
```javascript
// Cho phòng trọ
const response = await createRoomPayment(roomId, amount, description);

// Thanh toán thông thường
const response = await createPayOSPayment(amount, description, roomId);
```

### 2. **Hiển thị QR Code**:
- Backend trả về `qrCodeUrl` trong PayOSPaymentResponse
- Frontend hiển thị QR code trong PaymentModal
- User quét QR code để thanh toán

### 3. **Webhook xác nhận**:
- PayOS gọi webhook khi thanh toán thành công
- Backend tự động cập nhật payment status và room status
- Frontend polling để check status

### 4. **Cancel payment**:
- User có thể hủy thanh toán
- Frontend gọi cancelPayment function
- Backend cập nhật status và room status

## 🎨 UI/UX Features

### PayOS QR Modal:
- ✅ **QR Code Display**: Hiển thị QR code từ PayOS
- ✅ **Payment Methods**: Hiển thị các phương thức thanh toán
- ✅ **Timer**: Countdown 15 phút cho QR code
- ✅ **Confirm/Cancel**: Nút xác nhận và hủy
- ✅ **Copy Function**: Sao chép mã đơn hàng
- ✅ **Dark Mode**: Hỗ trợ dark mode

### Responsive Design:
- ✅ **Mobile**: Tối ưu cho mobile
- ✅ **Tablet**: Responsive trên tablet
- ✅ **Desktop**: Hiển thị tốt trên desktop

## 🚀 Cách sử dụng

### Tạo thanh toán cho phòng:
```javascript
const { createRoomPayment } = usePayment();

await createRoomPayment(roomId, amount, description);
```

### Tạo thanh toán thông thường:
```javascript
const { createPayOSPayment } = usePayment();

await createPayOSPayment(amount, description, roomId);
```

### Xác nhận thanh toán:
```javascript
const { confirmPayment } = usePayment();

await confirmPayment(transactionCode, amount, description, roomId);
```

### Hủy thanh toán:
```javascript
const { cancelPayment } = usePayment();

await cancelPayment(transactionCode, 'CANCELLED');
```

## ✅ Hoàn thành
- [x] Cập nhật paymentApi.js theo PayOSPaymentRequest DTO
- [x] Cập nhật usePayment hook với roomId support
- [x] Cập nhật PaymentModal hiển thị QR code
- [x] Cập nhật PaymentDemo với confirm/cancel
- [x] Cập nhật CSS styling cho QR code
- [x] Kiểm tra linting errors
- [x] Tạo documentation

## 🔮 Tính năng đã tích hợp
- ✅ **PayOS QR Code**: Hiển thị QR code từ PayOS
- ✅ **Room Payment**: Thanh toán cho phòng trọ
- ✅ **Webhook Integration**: Tích hợp webhook confirm
- ✅ **Cancel Payment**: Hủy thanh toán
- ✅ **Status Polling**: Theo dõi trạng thái thanh toán
- ✅ **Error Handling**: Xử lý lỗi đầy đủ
- ✅ **Dark Mode**: Hỗ trợ dark mode
- ✅ **Responsive**: Tối ưu cho mọi thiết bị

Frontend đã sẵn sàng tích hợp với backend PayOS service! 🎉
