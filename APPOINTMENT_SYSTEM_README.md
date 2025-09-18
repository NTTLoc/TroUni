# Hệ thống đặt lịch xem phòng - Appointment Scheduling System

## Tổng quan

Hệ thống đặt lịch xem phòng được tích hợp vào ứng dụng rental housing, cho phép người dùng đặt lịch xem phòng trọ một cách thuận tiện và quản lý lịch hẹn hiệu quả.

## Tính năng chính

### 1. Đặt lịch xem phòng
- **Lịch tương tác**: Sử dụng react-big-calendar để hiển thị lịch trực quan
- **Chọn thời gian**: Khách hàng có thể chọn ngày và giờ phù hợp
- **Thông tin chi tiết**: Điền đầy đủ thông tin liên hệ và lời nhắn
- **Xác thực**: Kiểm tra tính hợp lệ của thời gian đặt lịch

### 2. Quản lý lịch hẹn
- **Xem danh sách**: Hiển thị tất cả lịch hẹn của người dùng
- **Cập nhật trạng thái**: Xác nhận, hủy hoặc hoàn thành lịch hẹn
- **Chi tiết lịch hẹn**: Xem thông tin đầy đủ về từng lịch hẹn
- **Lọc theo trạng thái**: Dễ dàng tìm kiếm lịch hẹn theo trạng thái

### 3. Thông báo
- **Thông báo real-time**: Cập nhật ngay lập tức khi có thay đổi
- **Email notifications**: Gửi email thông báo cho người dùng
- **Trung tâm thông báo**: Giao diện quản lý tất cả thông báo
- **Đánh dấu đã đọc**: Theo dõi trạng thái đọc của thông báo

### 4. Quyền truy cập
- **Chủ trọ**: Xem và quản lý lịch hẹn cho phòng của mình
- **Khách hàng**: Đặt lịch và xem lịch hẹn của mình
- **Bảo mật**: Chỉ cho phép truy cập dữ liệu liên quan đến người dùng

## Cấu trúc thư mục

```
src/
├── components/
│   ├── appointment/
│   │   ├── BookingCalendar.js      # Lịch đặt lịch tương tác
│   │   ├── AppointmentList.js      # Danh sách lịch hẹn
│   │   ├── BookAppointmentButton.js # Nút đặt lịch
│   │   └── index.js               # Export các component
│   └── notifications/
│       └── NotificationCenter.js   # Trung tâm thông báo
├── pages/
│   ├── appointments/
│   │   ├── TenantAppointments.js   # Trang lịch hẹn cho khách hàng
│   │   └── OwnerAppointments.js    # Trang lịch hẹn cho chủ trọ
│   └── dashboard/
│       └── NotificationsPage.js    # Trang thông báo
└── services/
    ├── AppointmentService.js       # Service xử lý lịch hẹn
    └── NotificationService.js      # Service xử lý thông báo
```

## Cài đặt và sử dụng

### 1. Cài đặt dependencies

```bash
npm install react-big-calendar moment
```

### 2. Cấu hình Firebase

Đảm bảo Firebase đã được cấu hình với các collection sau:
- `appointments`: Lưu trữ thông tin lịch hẹn
- `notifications`: Lưu trữ thông báo

### 3. Cấu trúc dữ liệu

#### Appointments Collection
```javascript
{
  id: "appointment_id",
  propertyId: "property_id",
  propertyOwnerId: "owner_uid",
  visitorId: "visitor_uid",
  visitorName: "Tên khách hàng",
  visitorPhone: "Số điện thoại",
  visitorEmail: "Email",
  message: "Lời nhắn",
  startTime: Timestamp,
  endTime: Timestamp,
  status: "pending|confirmed|cancelled|completed",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Notifications Collection
```javascript
{
  id: "notification_id",
  type: "appointment_created|appointment_confirmed|appointment_cancelled|appointment_reminder",
  recipientId: "user_uid",
  title: "Tiêu đề thông báo",
  message: "Nội dung thông báo",
  appointmentId: "appointment_id",
  data: {}, // Dữ liệu bổ sung
  read: false,
  createdAt: Timestamp
}
```

## API và Services

### AppointmentService

#### Tạo lịch hẹn mới
```javascript
const result = await AppointmentService.createAppointment(appointmentData);
```

#### Cập nhật lịch hẹn
```javascript
const result = await AppointmentService.updateAppointment(appointmentId, updateData);
```

#### Lấy lịch hẹn theo property
```javascript
const result = await AppointmentService.getAppointmentsByProperty(propertyId);
```

#### Lấy lịch hẹn theo user
```javascript
const result = await AppointmentService.getAppointmentsByUser(userId, userRole);
```

#### Subscribe real-time updates
```javascript
const unsubscribe = AppointmentService.subscribeToAppointmentsByUser(userId, userRole, callback);
```

### NotificationService

#### Gửi thông báo tạo lịch hẹn
```javascript
await NotificationService.notifyAppointmentCreated(appointmentData);
```

#### Gửi thông báo xác nhận lịch hẹn
```javascript
await NotificationService.notifyAppointmentConfirmed(appointmentData);
```

#### Gửi thông báo hủy lịch hẹn
```javascript
await NotificationService.notifyAppointmentCancelled(appointmentData, cancelledBy);
```

## Quy trình hoạt động

### 1. Khách hàng đặt lịch
1. Truy cập trang chi tiết phòng
2. Nhấn nút "Đặt lịch xem phòng"
3. Chọn ngày và giờ từ lịch
4. Điền thông tin liên hệ và lời nhắn
5. Xác nhận đặt lịch

### 2. Chủ trọ quản lý lịch hẹn
1. Nhận thông báo về lịch hẹn mới
2. Xem danh sách lịch hẹn trong dashboard
3. Xác nhận hoặc hủy lịch hẹn
4. Liên hệ với khách hàng nếu cần

### 3. Thông báo và cập nhật
1. Hệ thống tự động gửi thông báo khi có thay đổi
2. Người dùng nhận thông báo trong trung tâm thông báo
3. Email notification được gửi (nếu được cấu hình)

## Tùy chỉnh và mở rộng

### 1. Thêm validation rules
Chỉnh sửa `AppointmentService.validateAppointmentTime()` để thêm quy tắc validation mới.

### 2. Tùy chỉnh thông báo
Chỉnh sửa `NotificationService` để thêm các loại thông báo mới.

### 3. Tích hợp email service
Cấu hình email service trong `NotificationService.sendEmailNotification()`.

### 4. Thêm tính năng nhắc nhở
Tạo cron job để gửi nhắc nhở trước giờ hẹn.

## Bảo mật

### 1. Quyền truy cập
- Chỉ cho phép người dùng xem lịch hẹn liên quan đến mình
- Validate quyền owner trước khi cho phép quản lý lịch hẹn

### 2. Validation
- Kiểm tra thời gian đặt lịch hợp lệ
- Validate thông tin người dùng
- Kiểm tra conflict với lịch hẹn khác

### 3. Rate limiting
- Giới hạn số lần đặt lịch trong ngày
- Prevent spam booking

## Troubleshooting

### 1. Lịch không hiển thị
- Kiểm tra Firebase connection
- Verify propertyId được truyền đúng
- Check console for errors

### 2. Thông báo không gửi được
- Kiểm tra Firebase rules
- Verify notification service configuration
- Check recipient ID

### 3. Real-time updates không hoạt động
- Kiểm tra Firebase onSnapshot listener
- Verify user authentication
- Check network connection

## Kế hoạch phát triển

### Phase 1 (Hiện tại)
- ✅ Đặt lịch cơ bản
- ✅ Quản lý lịch hẹn
- ✅ Thông báo in-app

### Phase 2 (Tương lai)
- 📧 Email notifications
- 📱 SMS notifications
- 🔔 Push notifications
- 📊 Analytics và reporting
- 🤖 Auto-confirmation rules
- 📅 Recurring appointments
- 🎥 Video call integration

## Hỗ trợ

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra console logs
2. Verify Firebase configuration
3. Check network connectivity
4. Contact development team

---

*Hệ thống đặt lịch xem phòng được phát triển để cải thiện trải nghiệm người dùng và tối ưu hóa quy trình quản lý phòng trọ.*
