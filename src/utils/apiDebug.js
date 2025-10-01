import axios from "../utils/axios.customize";

/**
 * Test API connection và authentication
 */
export const testApiConnection = async () => {
  try {
    console.log("🔍 Testing API connection...");
    
    // Test 1: Kiểm tra base URL
    const baseURL = import.meta.env.VITE_BACKEND_URL;
    console.log("🌐 Base URL:", baseURL);
    
    // Test 2: Kiểm tra authentication token
    const token = localStorage.getItem("access_token");
    console.log("🔑 Auth token:", token ? "Present" : "Missing");
    
    // Test 3: Test simple GET request
    try {
      const response = await axios.get("/auth/me");
      console.log("✅ Auth test successful:", response);
    } catch (authError) {
      console.error("❌ Auth test failed:", authError);
    }
    
    return true;
  } catch (error) {
    console.error("❌ API connection test failed:", error);
    return false;
  }
};

/**
 * Test tạo phòng với dữ liệu đầy đủ và đúng format
 */
export const testCreateRoomComplete = async () => {
  try {
    console.log("🧪 Testing room creation with complete data...");
    
    const completeData = {
      title: "Phòng trọ test đầy đủ",
      description: "Mô tả phòng trọ test",
      roomType: "PHONG_TRO", // Đúng enum value của backend
      streetAddress: "123 Đường Test",
      city: "HCM", // Format của backend
      district: "Quan 1", // Format của backend
      ward: "Phuong 1",
      latitude: "10.762622", // String format
      longitude: "106.660172", // String format
      pricePerMonth: "3000000", // String format
      areaSqm: "25", // String format
      status: "available",
      images: [],
      amenityIds: []
    };
    
    console.log("📤 Sending complete test data:", completeData);
    
    const response = await axios.post("/rooms/room", completeData);
    console.log("✅ Complete test room created successfully:", response);
    
    return response;
  } catch (error) {
    console.error("❌ Complete test room creation failed:", error);
    throw error;
  }
};

/**
 * Test với dữ liệu tối thiểu nhưng đầy đủ required fields
 */
export const testCreateRoomMinimal = async () => {
  try {
    console.log("🧪 Testing room creation with minimal required data...");
    
    const minimalData = {
      title: "Test Room Minimal",
      roomType: "PHONG_TRO", // Đúng enum value của backend
      streetAddress: "123 Test Street",
      city: "HCM", // Format của backend
      district: "Quan 1", // Format của backend
      ward: "Phuong 1", 
      pricePerMonth: "3000000", // String format
      status: "available",
      images: [],
      amenityIds: []
    };
    
    console.log("📤 Sending minimal test data:", minimalData);
    
    const response = await axios.post("/rooms/room", minimalData);
    console.log("✅ Minimal test room created successfully:", response);
    
    return response;
  } catch (error) {
    console.error("❌ Minimal test room creation failed:", error);
    throw error;
  }
};

/**
 * Debug function để kiểm tra request headers
 */
export const debugRequestHeaders = () => {
  const token = localStorage.getItem("access_token");
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  
  console.log("🔍 Request Debug Info:");
  console.log("- Base URL:", baseURL);
  console.log("- Auth Token:", token ? `${token.substring(0, 20)}...` : "None");
  console.log("- Content-Type:", "application/json");
  console.log("- Accept:", "application/json");
  
  return {
    baseURL,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null
  };
};
