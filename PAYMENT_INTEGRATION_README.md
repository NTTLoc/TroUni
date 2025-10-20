# Payment Integration Guide

## Tổng quan

Hệ thống thanh toán đã được tích hợp vào ứng dụng TroUni với các tính năng chính:

- **VietQR Payment**: Tạo QR code để thanh toán qua ngân hàng
- **Real-time Status Tracking**: Theo dõi trạng thái thanh toán real-time
- **Payment Modal**: Giao diện thanh toán thân thiện
- **Polling Mechanism**: Tự động kiểm tra trạng thái thanh toán

## Cấu trúc Files

```
src/
├── components/payment/
│   ├── PaymentModal.jsx          # Modal hiển thị QR code và thông tin thanh toán
│   ├── PaymentModal.scss         # Styles cho PaymentModal
│   ├── PaymentDemo.jsx           # Component demo để test payment
│   └── PaymentDemo.scss          # Styles cho PaymentDemo
├── services/
│   └── paymentApi.js             # API service cho payment endpoints
├── hooks/
│   └── usePayment.js             # Custom hook quản lý payment logic
└── pages/postDetail/
    ├── PostDetail.jsx            # Đã tích hợp payment section
    └── PostDetail.scss           # Styles cho payment section
```

## Cách sử dụng

### 1. Trong PostDetail Page

Payment đã được tích hợp sẵn vào PostDetail page. Khi user xem chi tiết phòng trọ:

1. User click nút "Thanh toán ngay"
2. Hệ thống tạo payment request với `roomId`, `amount`, `description`
3. Backend trả về QR code và thông tin thanh toán
4. PaymentModal hiển thị QR code và thông tin chuyển khoản
5. Hệ thống tự động polling để check trạng thái thanh toán

### 2. Sử dụng usePayment Hook

```javascript
import usePayment from '../hooks/usePayment';

const MyComponent = () => {
  const {
    paymentData,
    isLoading,
    error,
    paymentStatus,
    createRoomPayment,
    createVietQRPayment,
    resetPayment
  } = usePayment();

  const handlePayment = async () => {
    try {
      await createRoomPayment(roomId, amount, description);
      // Payment modal sẽ hiển thị tự động
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    // Your component JSX
  );
};
```

### 3. Sử dụng PaymentModal

```javascript
import PaymentModal from '../components/payment/PaymentModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  return (
    <>
      {/* Your component content */}
      
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        paymentData={paymentData}
        onPaymentSuccess={() => {
          setShowModal(false);
          // Handle success
        }}
        onPaymentError={(error) => {
          // Handle error
        }}
      />
    </>
  );
};
```

## API Endpoints

### Backend Endpoints (đã có sẵn)

- `POST /api/payments/room-payment` - Tạo thanh toán cho phòng
- `POST /api/payments/viet-qr` - Tạo thanh toán VietQR thông thường
- `GET /api/payments/{id}` - Lấy thông tin payment theo ID
- `GET /api/payments/transaction/{code}` - Lấy payment theo transaction code
- `GET /api/payments/status/{code}` - Kiểm tra trạng thái thanh toán
- `GET /api/payments/my-history` - Lịch sử thanh toán
- `DELETE /api/payments/{id}/cancel` - Hủy thanh toán

### Request/Response Format

#### RoomPaymentRequest
```javascript
{
  roomId: "uuid",
  amount: 1000000,
  description: "Thanh toán phòng trọ"
}
```

#### VietQRPaymentResponse
```javascript
{
  paymentId: "uuid",
  transactionCode: "TRO1234567890",
  amount: 1000000,
  status: "PENDING",
  qrCodeBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  qrCodeUrl: "https://img.vietqr.io/image/...",
  description: "Thanh toán phòng trọ",
  createdAt: "2024-01-01T10:00:00",
  expiresAt: "2024-01-01T10:15:00",
  bankAccountNumber: "1234567890",
  bankAccountName: "TROUNI COMPANY",
  bankName: "MB Bank"
}
```

## Tính năng chính

### 1. QR Code Generation
- Tự động tạo QR code từ VietQR API
- Hiển thị QR code dạng base64 trong modal
- QR code có thời hạn 15 phút

### 2. Real-time Status Tracking
- Polling mechanism kiểm tra trạng thái mỗi 10 giây
- Tự động dừng polling sau 15 phút
- Cập nhật UI khi payment status thay đổi

### 3. Payment Status
- `PENDING`: Đang chờ thanh toán
- `COMPLETED`: Thanh toán thành công
- `CANCELLED`: Thanh toán bị hủy
- `FAILED`: Thanh toán thất bại

### 4. User Experience
- Loading states khi tạo payment
- Error handling với thông báo rõ ràng
- Copy to clipboard cho transaction code và account number
- Responsive design cho mobile
- Dark mode support

## Testing

### 1. Sử dụng PaymentDemo Component

```javascript
import PaymentDemo from '../components/payment/PaymentDemo';

// Thêm vào route để test
<Route path="/payment-demo" element={<PaymentDemo />} />
```

### 2. Test Flow
1. Đăng nhập vào hệ thống
2. Truy cập `/payment-demo`
3. Nhập amount và description
4. Click "Create Payment"
5. Kiểm tra QR code và thông tin thanh toán
6. Test polling mechanism

## Lưu ý quan trọng

### 1. Authentication
- Tất cả payment endpoints yêu cầu authentication
- User phải đăng nhập để tạo thanh toán

### 2. Polling Mechanism
- Polling tự động dừng sau 15 phút (thời gian QR code hết hạn)
- Có thể dừng polling thủ công bằng `stopPolling()`
- Polling chỉ chạy khi có payment đang pending

### 3. Error Handling
- Tất cả API calls đều có error handling
- UI hiển thị error messages rõ ràng
- Network errors không dừng polling

### 4. Security
- Transaction codes được generate unique
- Payment amounts được validate
- Webhook endpoints cần signature validation (TODO)

## Troubleshooting

### 1. QR Code không hiển thị
- Kiểm tra `qrCodeBase64` trong response
- Kiểm tra network connection
- Kiểm tra browser console cho errors

### 2. Polling không hoạt động
- Kiểm tra `transactionCode` có đúng không
- Kiểm tra API endpoint `/api/payments/status/{code}`
- Kiểm tra network requests trong DevTools

### 3. Payment status không update
- Backend cần implement webhook để update status
- Hoặc cần endpoint PUT để update status manually
- Hiện tại chỉ có polling để check status

## Future Enhancements

1. **Webhook Implementation**: Implement webhook để update payment status real-time
2. **Payment History**: Trang lịch sử thanh toán chi tiết
3. **Multiple Payment Methods**: Hỗ trợ thêm các phương thức thanh toán khác
4. **Payment Notifications**: Thông báo khi payment thành công/thất bại
5. **Refund System**: Hệ thống hoàn tiền
6. **Payment Analytics**: Thống kê và báo cáo thanh toán

