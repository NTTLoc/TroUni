# Accessibility Improvements - Trọ UNI

## Tổng quan

Ứng dụng Trọ UNI đã được cải thiện để thân thiện hơn với người dùng ở mọi độ tuổi, đặc biệt là người cao tuổi và người khuyết tật.

## Các cải thiện đã thực hiện

### 1. Font chữ và Typography

- **Font size tối thiểu**: Tăng từ 14px lên 16px cho tất cả text
- **Line height**: Tăng lên 1.6 để dễ đọc hơn
- **Font family**: Sử dụng system fonts (Segoe UI, Roboto) - dễ đọc trên mọi thiết bị
- **Responsive font size**: Tự động tăng font size trên màn hình lớn

### 2. Touch Targets

- **Button size**: Tối thiểu 44px chiều cao cho dễ nhấn
- **Form controls**: Tăng padding và chiều cao
- **Navigation links**: Đủ lớn để dễ nhấn trên mobile

### 3. Focus Indicators

- **Focus outline**: Thêm outline rõ ràng khi focus
- **Focus offset**: Tạo khoảng cách để dễ nhìn
- **Keyboard navigation**: Hỗ trợ điều hướng bằng bàn phím

### 4. Color và Contrast

- **High contrast mode**: Hỗ trợ chế độ contrast cao
- **Text color**: Đảm bảo contrast ratio đạt chuẩn WCAG
- **Primary color**: Sử dụng màu xanh đậm để dễ nhìn

### 5. Motion và Animation

- **Reduced motion**: Hỗ trợ người dùng nhạy cảm với animation
- **Smooth transitions**: Giảm thiểu animation gây chóng mặt

### 6. Mobile Responsiveness

- **Touch-friendly**: Tất cả elements đủ lớn để nhấn
- **Font scaling**: Tự động tăng font size trên mobile
- **Navigation**: Menu mobile dễ sử dụng

### 7. Screen Reader Support

- **Skip links**: Link bỏ qua navigation cho screen reader
- **ARIA labels**: Thêm labels cho các elements quan trọng
- **Semantic HTML**: Sử dụng đúng thẻ HTML

## CSS Variables được sử dụng

```css
:root {
  --font-size-base: 1rem; /* 16px */
  --font-size-large: 1.125rem; /* 18px */
  --font-size-small: 1rem; /* 16px - tăng từ 14px */
  --line-height-base: 1.6;
  --touch-target-size: 44px;
  --focus-outline-width: 2px;
  --focus-outline-color: #2563eb;
}
```

## Media Queries

### Mobile (max-width: 768px)

- Tăng font size cho navigation, buttons, forms
- Tăng padding cho touch targets

### Large screens (min-width: 1200px)

- Tăng font size cho body text
- Cải thiện readability trên màn hình lớn

### Accessibility preferences

- `prefers-contrast: high` - Chế độ contrast cao
- `prefers-reduced-motion` - Giảm animation

## Testing Checklist

- [ ] Font size đủ lớn (tối thiểu 16px)
- [ ] Touch targets đủ lớn (tối thiểu 44px)
- [ ] Focus indicators rõ ràng
- [ ] Keyboard navigation hoạt động
- [ ] Screen reader compatibility
- [ ] High contrast mode
- [ ] Mobile responsiveness
- [ ] Reduced motion support

## Hướng dẫn sử dụng

### Cho người dùng cao tuổi:

1. Sử dụng chế độ dark mode để giảm mỏi mắt
2. Zoom in browser nếu cần font lớn hơn
3. Sử dụng keyboard navigation thay vì mouse

### Cho người khuyết tật:

1. Sử dụng screen reader với skip links
2. Dùng keyboard để điều hướng
3. Bật high contrast mode nếu cần

## Tương lai

Các cải thiện tiếp theo có thể bao gồm:

- Voice navigation
- Gesture controls
- Customizable font sizes
- More color themes
- Advanced screen reader support
