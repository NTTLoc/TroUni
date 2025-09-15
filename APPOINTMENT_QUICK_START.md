# Hướng dẫn sử dụng hệ thống đặt lịch xem phòng

## 🚀 Cài đặt nhanh

```bash
npm install react-big-calendar moment
```

## 📋 Tính năng đã hoàn thành

### ✅ Đặt lịch xem phòng
- Lịch tương tác với react-big-calendar
- Chọn ngày/giờ phù hợp (9h-18h)
- Form điền thông tin liên hệ
- Validation thời gian hợp lệ

### ✅ Quản lý lịch hẹn
- Dashboard cho tenant và owner
- Real-time updates
- Xác nhận/hủy lịch hẹn
- Xem chi tiết lịch hẹn

### ✅ Hệ thống thông báo
- Thông báo in-app
- Email notifications (có thể mở rộng)
- Trung tâm thông báo
- Đánh dấu đã đọc

## 🎯 Cách sử dụng

### Cho khách hàng (Tenant):
1. Vào trang chi tiết phòng
2. Nhấn "Đặt lịch xem phòng"
3. Chọn ngày/giờ từ lịch
4. Điền thông tin và xác nhận
5. Xem lịch hẹn trong Dashboard → Lịch hẹn xem phòng

### Cho chủ trọ (Owner):
1. Vào Dashboard → Quản lý lịch hẹn
2. Xem danh sách lịch hẹn từ khách hàng
3. Xác nhận hoặc hủy lịch hẹn
4. Xem thông báo trong Dashboard → Thông báo

## 📁 Cấu trúc file

```
src/
├── components/
│   ├── appointment/
│   │   ├── BookingCalendar.js      # Lịch đặt lịch
│   │   ├── AppointmentList.js      # Danh sách lịch hẹn
│   │   ├── BookAppointmentButton.js # Nút đặt lịch
│   │   └── index.js
│   └── notifications/
│       ├── NotificationCenter.js   # Trung tâm thông báo
│       └── index.js
├── pages/
│   ├── appointments/
│   │   ├── TenantAppointments.js   # Trang lịch hẹn cho khách
│   │   └── OwnerAppointments.js    # Trang lịch hẹn cho chủ trọ
│   └── dashboard/
│       └── NotificationsPage.js    # Trang thông báo
└── services/
    ├── AppointmentService.js       # Service xử lý lịch hẹn
    └── NotificationService.js      # Service xử lý thông báo
```

## 🔧 Cấu hình Firebase

Hệ thống sử dụng 2 collections:
- `appointments`: Lưu thông tin lịch hẹn
- `notifications`: Lưu thông báo

## 🎨 UI/UX Features

- Responsive design với Bootstrap
- Dark/Light theme support
- Real-time updates
- Toast notifications
- Modal dialogs
- Loading states

## 🔒 Bảo mật

- Authentication required
- Role-based access (tenant/owner)
- Data validation
- Error handling

## 🚀 Sẵn sàng sử dụng!

Hệ thống đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng. Tất cả các tính năng cơ bản đã được implement và test.

---

*Hệ thống đặt lịch xem phòng - Rental Housing App* 🏠
