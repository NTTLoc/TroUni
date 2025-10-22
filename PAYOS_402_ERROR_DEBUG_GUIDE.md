# 🚨 PayOS 402 Error Debug Guide

## 📋 Tổng quan
Lỗi 402 "Payment Required" khi gọi PayOS API có thể do nhiều nguyên nhân. Đã thêm debug tools và error handling để xác định nguyên nhân.

## 🔍 **Các nguyên nhân có thể gây lỗi 402:**

### 1. **Backend PayOS Configuration Issues**
```java
// Kiểm tra PayOSProperties trong application.yml
payos:
  client-id: YOUR_CLIENT_ID
  api-key: YOUR_API_KEY
  checksum-key: YOUR_CHECKSUM_KEY
```

### 2. **PayOS SDK Initialization**
```java
// Kiểm tra PayOS service initialization
@PostConstruct
public void initPayOS() {
    try {
        payOS = new PayOS(
            payOSProperties.getClientId(),
            payOSProperties.getApiKey(),
            payOSProperties.getChecksumKey()
        );
        log.info("✅ PayOS initialized successfully");
    } catch (Exception e) {
        log.error("❌ PayOS initialization failed", e);
    }
}
```

### 3. **Request Validation Issues**
- Amount phải là Integer và >= 1000
- Description không được null/empty
- returnUrl và cancelUrl phải là valid URLs
- roomId phải là valid UUID format

## 🛠️ **Debug Tools đã thêm:**

### 1. **Enhanced Error Logging**
```javascript
// Trong paymentApi.js
if (error.response.status === 402) {
  console.error('❌ 402 Payment Required - Possible causes:');
  console.error('   - PayOS API credentials invalid');
  console.error('   - PayOS service not configured properly');
  console.error('   - Amount validation failed on backend');
  console.error('   - PayOS SDK initialization failed');
}
```

### 2. **PayOS Debug Test Component**
- **URL**: `http://localhost:5173/debug/payos`
- **Features**:
  - Test PayOS payment với custom parameters
  - Quick test với 100k VND
  - Detailed error logging
  - Response data display
  - Debug information

### 3. **Request Validation**
```javascript
// Validate required fields
if (!payOSData.amount || payOSData.amount < 1000) {
  throw new Error('Amount phải lớn hơn hoặc bằng 1000 VND');
}

if (!payOSData.returnUrl || !payOSData.cancelUrl) {
  throw new Error('returnUrl và cancelUrl là bắt buộc');
}
```

## 🔧 **Cách debug lỗi 402:**

### **Bước 1: Kiểm tra Debug Page**
1. Truy cập: `http://localhost:5173/debug/payos`
2. Click "Quick Test (100k VND)"
3. Xem console logs và error details

### **Bước 2: Kiểm tra Backend Logs**
```bash
# Kiểm tra backend logs
tail -f logs/application.log | grep -i payos
```

### **Bước 3: Kiểm tra PayOS Configuration**
```yaml
# application.yml
payos:
  client-id: ${PAYOS_CLIENT_ID:your-client-id}
  api-key: ${PAYOS_API_KEY:your-api-key}
  checksum-key: ${PAYOS_CHECKSUM_KEY:your-checksum-key}
```

### **Bước 4: Test PayOS SDK trực tiếp**
```java
// Thêm vào PaymentController để test
@GetMapping("/test-payos")
public ResponseEntity<?> testPayOS() {
    try {
        // Test PayOS connection
        PayOSResponse response = payOS.getPaymentLinkInformation(1);
        return ResponseEntity.ok("PayOS connection OK");
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body("PayOS connection failed: " + e.getMessage());
    }
}
```

## 🎯 **Các bước khắc phục:**

### **1. Kiểm tra Environment Variables**
```bash
# Kiểm tra env vars
echo $PAYOS_CLIENT_ID
echo $PAYOS_API_KEY
echo $PAYOS_CHECKSUM_KEY
```

### **2. Kiểm tra PayOS Dashboard**
- Đăng nhập PayOS dashboard
- Kiểm tra API credentials
- Xem API usage và limits
- Kiểm tra webhook configuration

### **3. Test với Postman/curl**
```bash
# Test PayOS API trực tiếp
curl -X POST "https://api-merchant.payos.vn/v2/payment-requests" \
  -H "Content-Type: application/json" \
  -H "x-client-id: YOUR_CLIENT_ID" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "amount": 100000,
    "description": "Test payment",
    "returnUrl": "http://localhost:5173/payment-success",
    "cancelUrl": "http://localhost:5173/payment-cancel"
  }'
```

### **4. Kiểm tra Network/Firewall**
- Đảm bảo backend có thể kết nối tới PayOS API
- Kiểm tra firewall rules
- Test network connectivity

## 📊 **Debug Information:**

### **Frontend Debug Info:**
- Current URL
- Origin
- User Agent
- Timestamp
- Request payload
- Response data

### **Backend Debug Info:**
- PayOS SDK version
- Configuration status
- API credentials validation
- Network connectivity
- Error stack traces

## 🚀 **Quick Fixes:**

### **1. Restart Backend Service**
```bash
# Restart backend
./gradlew bootRun
# hoặc
mvn spring-boot:run
```

### **2. Clear Cache**
```bash
# Clear browser cache
# Clear backend cache
```

### **3. Check PayOS Status**
- Kiểm tra PayOS service status
- Xem có maintenance không
- Kiểm tra API rate limits

## ✅ **Checklist Debug:**

- [ ] PayOS credentials đúng
- [ ] Backend service running
- [ ] Network connectivity OK
- [ ] Request format đúng
- [ ] Amount >= 1000 VND
- [ ] URLs valid
- [ ] PayOS SDK initialized
- [ ] No firewall blocking
- [ ] API rate limits OK
- [ ] PayOS service status OK

## 📞 **Support:**

Nếu vẫn gặp lỗi 402, hãy:
1. Chạy debug page: `/debug/payos`
2. Copy error logs
3. Kiểm tra PayOS dashboard
4. Liên hệ PayOS support nếu cần

Debug tools đã sẵn sàng! 🎉
