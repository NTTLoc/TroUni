import axios from "axios";

// Tạo instance axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json", // mặc định gửi JSON
    Accept: "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  function (response) {
    // Chỉ trả về response.data cho gọn
    return response?.data ?? response;
  },
  function (error) {
    console.error(">>> Axios error:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error.message,
      data: error?.response?.data,
    });

    // Nếu backend trả JSON (Spring Boot thường có body với `message`)
    if (error?.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default instance;
