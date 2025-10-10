import axios from "../utils/axios.customize";

// LANDLORD & STUDENT
// Lấy thông tin chi tiết user hiện tại
const getUserDetailsApi = () => {
  const URL_API = "/profile/me";
  return axios.get(URL_API);
};

// Cập nhật thông tin chi tiết user hiện tại
const updateProfileApi = (data) => {
  const URL_API = "/profile/me";
  return axios.put(URL_API, data);
};

// ADMIN & MANAGER
// Lấy thông tin tất cả user
const getAllUsersApi = () => {
  const URL_API = "/user/users";
  return axios.get(URL_API);
};

export { getUserDetailsApi, updateProfileApi, getAllUsersApi };
