import axios from "../axios.customize";

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

export { getUserDetailsApi, updateProfileApi };
