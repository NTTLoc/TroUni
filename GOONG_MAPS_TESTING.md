# 🧪 Goong Maps Testing Guide

Hướng dẫn test và debug Goong Maps integration sau khi sửa lỗi.

## 🚨 Các lỗi đã được sửa:

### 1. ✅ Lỗi không parse được địa chỉ cụ thể
- **Vấn đề**: Chỉ hiển thị tọa độ thay vì địa chỉ cụ thể
- **Nguyên nhân**: Goong API có cấu trúc response khác với Google Maps
- **Giải pháp**: 
  - Cập nhật `extractGoongAddressComponent()` method
  - Xử lý nhiều field có thể có trong Goong API response
  - Thêm fallback logic cho các trường hợp không có dữ liệu

### 2. ✅ Lỗi bản đồ không hiển thị
- **Vấn đề**: Goong tiles URL không đúng format
- **Nguyên nhân**: Goong Maps tiles có format khác với OpenStreetMap
- **Giải pháp**:
  - Cập nhật tiles URL format: `goong_map_web` thay vì `goong-map-mt`
  - Tạo `GoongTileLayer` component với fallback về OpenStreetMap
  - Tự động detect và switch sang fallback nếu Goong tiles không hoạt động

## 🧪 Test Components

### 1. SimpleGoongTest Component
```jsx
import SimpleGoongTest from '../components/debug/SimpleGoongTest';

// Sử dụng trong page hoặc component
<SimpleGoongTest />
```

**Chức năng:**
- Test reverse geocoding với tọa độ tùy chỉnh
- Hiển thị kết quả API response
- Test với các tọa độ phổ biến ở TP.HCM

### 2. GoongMapsTest Component
```jsx
import GoongMapsTest from '../components/debug/GoongMapsTest';

// Sử dụng trong page hoặc component
<GoongMapsTest />
```

**Chức năng:**
- Test search places
- Test search with detail
- Test forward geocoding
- Test smart search
- Hiển thị API configuration

## 🔧 Cách test:

### Bước 1: Test API
1. Mở `SimpleGoongTest` component
2. Nhập tọa độ: `10.8231, 106.6297` (TP.HCM center)
3. Click "Test Reverse Geocoding"
4. Kiểm tra kết quả có hiển thị địa chỉ cụ thể không

### Bước 2: Test Map Display
1. Mở trang có `MapSelector` hoặc `MapModal`
2. Kiểm tra bản đồ có hiển thị không
3. Nếu không hiển thị, check console để xem có lỗi gì

### Bước 3: Test Map Interaction
1. Click vào bản đồ để chọn vị trí
2. Kiểm tra có hiển thị địa chỉ cụ thể không
3. Test search địa điểm

## 📊 Expected Results:

### ✅ API Test Success:
```json
{
  "display_name": "123 Đường ABC, Phường 1, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
  "address": {
    "city": "Thành phố Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường 1",
    "street": "Đường ABC",
    "country": "Việt Nam"
  }
}
```

### ✅ Map Display Success:
- Bản đồ hiển thị với tiles của Goong Maps
- Nếu Goong tiles fail, tự động fallback về OpenStreetMap
- Attribution hiển thị đúng

## 🚨 Troubleshooting:

### Nếu API không hoạt động:
1. Kiểm tra API key: `bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE`
2. Kiểm tra network connectivity
3. Check console errors
4. Test với tọa độ khác

### Nếu Map không hiển thị:
1. Kiểm tra MapTiles key: `B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI`
2. Check `GoongTileLayer` component
3. Kiểm tra fallback có hoạt động không
4. Check browser console

### Nếu địa chỉ không parse được:
1. Check `extractGoongAddressComponent` method
2. Kiểm tra Goong API response format
3. Test với tọa độ khác nhau
4. Check fallback logic

## 📝 Test Cases:

### Test Case 1: TP.HCM Center
- **Input**: `10.8231, 106.6297`
- **Expected**: Địa chỉ ở trung tâm TP.HCM

### Test Case 2: Quận 1
- **Input**: `10.7769, 106.7009`
- **Expected**: Địa chỉ ở Quận 1

### Test Case 3: Quận 7
- **Input**: `10.7377, 106.7225`
- **Expected**: Địa chỉ ở Quận 7

### Test Case 4: Invalid Coordinates
- **Input**: `999, 999`
- **Expected**: Error message hoặc fallback

## 🔄 Fallback Strategy:

1. **API Fallback**: Nếu Goong API fail → sử dụng mock data
2. **Tiles Fallback**: Nếu Goong tiles fail → sử dụng OpenStreetMap
3. **Address Fallback**: Nếu không parse được → hiển thị tọa độ

## 📞 Support:

Nếu vẫn có vấn đề:
1. Check console logs
2. Test với `SimpleGoongTest` component
3. Verify API keys
4. Check Goong API documentation

---

**Lưu ý**: Các test components chỉ dùng để debug, nhớ remove khỏi production build.


