# 🏠 Room Management System - Frontend Integration

## 📋 Tổng quan

Đã tích hợp thành công backend Room API vào frontend React của dự án TroUni. Hệ thống bao gồm các chức năng quản lý phòng trọ đầy đủ với UI/UX hiện đại.

## 🚀 Các tính năng đã implement

### ✅ **API Services** (`src/services/roomApi.js`)
- ✅ `createRoomApi()` - Tạo phòng trọ mới
- ✅ `getRoomByIdApi()` - Lấy thông tin phòng theo ID
- ✅ `updateRoomApi()` - Cập nhật thông tin phòng
- ✅ `deleteRoomApi()` - Xóa phòng trọ
- ✅ `getAllRoomsApi()` - Lấy danh sách phòng (có pagination)
- ✅ `searchRoomsApi()` - Tìm kiếm phòng với filters
- ✅ `getMyRoomsApi()` - Lấy phòng của user hiện tại
- ✅ Utility functions: `formatRoomData()`, `formatUpdateRoomData()`

### ✅ **Constants & Types** (`src/utils/roomConstants.js`)
- ✅ Room Type enum (STUDIO, APARTMENT, HOUSE, etc.)
- ✅ Room Status enum (AVAILABLE, RENTED, etc.)
- ✅ Validation constants
- ✅ Vietnam cities & districts data
- ✅ Utility functions: `formatPrice()`, `formatArea()`, `formatFullAddress()`

### ✅ **Custom Hooks** (`src/hooks/useRooms.js`)
- ✅ `useRooms()` - Quản lý danh sách phòng với pagination & search
- ✅ `useRoom()` - Quản lý một phòng cụ thể
- ✅ `useRoomManagement()` - CRUD operations cho phòng
- ✅ `useMyRooms()` - Quản lý phòng của user hiện tại

### ✅ **UI Components**
- ✅ `RoomList` - Danh sách phòng với search & filters
- ✅ `RoomForm` - Form tạo/cập nhật phòng trọ
- ✅ Responsive design với SCSS styling
- ✅ Dark/Light theme support

### ✅ **Routing Integration**
- ✅ `/rooms` - Danh sách phòng trọ
- ✅ `/rooms/create` - Tạo phòng mới
- ✅ `/rooms/edit/:id` - Chỉnh sửa phòng

## 🛠️ Cách sử dụng

### **1. Hiển thị danh sách phòng trọ**

```jsx
import RoomList from './components/room/RoomList';

function App() {
  return (
    <div>
      <RoomList />
    </div>
  );
}
```

### **2. Tạo phòng trọ mới**

```jsx
import RoomForm from './components/room/RoomForm';

function CreateRoom() {
  const handleSuccess = (roomData) => {
    console.log('Room created:', roomData);
    // Redirect hoặc show success message
  };

  return (
    <RoomForm 
      onSuccess={handleSuccess}
      onCancel={() => window.history.back()}
    />
  );
}
```

### **3. Sử dụng custom hooks**

```jsx
import { useRooms, useRoomManagement } from './hooks/useRooms';

function MyComponent() {
  const { rooms, loading, error, searchRooms } = useRooms();
  const { createRoom, updateRoom, deleteRoom } = useRoomManagement();

  const handleCreateRoom = async (roomData) => {
    try {
      const result = await createRoom(roomData);
      console.log('Created:', result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {rooms.map(room => (
        <div key={room.id}>{room.title}</div>
      ))}
    </div>
  );
}
```

### **4. Search và Filter**

```jsx
import { useRooms } from './hooks/useRooms';

function SearchComponent() {
  const { searchRooms } = useRooms();

  const handleSearch = () => {
    searchRooms({
      city: "Hồ Chí Minh",
      district: "Quận 1",
      minPrice: 2000000,
      maxPrice: 5000000,
      roomType: "APARTMENT"
    });
  };

  return <button onClick={handleSearch}>Search</button>;
}
```

## 📁 Cấu trúc files đã tạo

```
src/
├── services/
│   └── roomApi.js              # API service functions
├── utils/
│   └── roomConstants.js        # Constants, enums, utilities
├── hooks/
│   └── useRooms.js            # Custom hooks for room management
├── components/
│   └── room/
│       ├── RoomList.jsx       # Room list component
│       ├── RoomList.scss      # Room list styles
│       ├── RoomForm.jsx       # Room form component
│       └── RoomForm.scss      # Room form styles
└── routes/
    └── publicRoutes/
        └── PublicRoutes.jsx   # Updated with room routes
```

## 🔧 Configuration

### **Environment Variables**
Đảm bảo có các biến môi trường sau trong `.env`:

```env
VITE_BACKEND_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### **Backend API Endpoints**
API sẽ gọi đến các endpoints sau:
- `POST /rooms/room` - Tạo phòng
- `GET /rooms/{id}` - Lấy phòng theo ID
- `PUT /rooms/{id}` - Cập nhật phòng
- `DELETE /rooms/{id}` - Xóa phòng
- `GET /rooms` - Danh sách phòng
- `GET /rooms/search` - Tìm kiếm phòng
- `GET /rooms/my-rooms` - Phòng của user

## 🎨 UI Features

### **RoomList Component**
- ✅ Responsive grid layout
- ✅ Search bar với real-time search
- ✅ Advanced filters (city, district, price, area, type)
- ✅ Pagination với page size options
- ✅ Room cards với hover effects
- ✅ Boost badge cho phòng nổi bật
- ✅ Rating display
- ✅ Empty state handling

### **RoomForm Component**
- ✅ Multi-step form layout
- ✅ Form validation với Ant Design
- ✅ Image upload với preview
- ✅ Address autocomplete
- ✅ Price formatting
- ✅ Responsive design
- ✅ Dark theme support

## 🚀 Next Steps

### **Có thể mở rộng thêm:**

1. **Room Detail Page**
   ```jsx
   // src/pages/room/RoomDetail.jsx
   ```

2. **My Rooms Management**
   ```jsx
   // src/pages/room/MyRooms.jsx
   ```

3. **Room Booking System**
   ```jsx
   // src/components/room/RoomBooking.jsx
   ```

4. **Room Reviews & Ratings**
   ```jsx
   // src/components/room/RoomReviews.jsx
   ```

5. **Room Analytics Dashboard**
   ```jsx
   // src/pages/admin/RoomAnalytics.jsx
   ```

## 🐛 Troubleshooting

### **Common Issues:**

1. **API không kết nối được**
   - Kiểm tra `VITE_BACKEND_URL` trong `.env`
   - Đảm bảo backend đang chạy

2. **Authentication errors**
   - Kiểm tra JWT token trong localStorage
   - Đảm bảo user đã đăng nhập

3. **Image upload không hoạt động**
   - Cần implement image upload service
   - Hiện tại chỉ mock data

4. **Search không trả về kết quả**
   - Kiểm tra backend search endpoint
   - Verify search parameters format

## 📞 Support

Nếu có vấn đề gì, hãy kiểm tra:
1. Console logs trong browser
2. Network tab trong DevTools
3. Backend API responses
4. Authentication status

---

**🎉 Chúc mừng! Bạn đã có một hệ thống quản lý phòng trọ hoàn chỉnh!**
