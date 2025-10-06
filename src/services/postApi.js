import axios from "../utils/axios.customize";

// Lấy danh sách tất cả phòng
const getAllPostsAPI = () => {
  const URL_API = "/rooms";
  return axios.get(URL_API);
};

// Lấy chi tiết phòng/post theo id
const getPostById = (roomId) => {
  const URL_API = `/rooms/${roomId}/details`;
  return axios.get(URL_API);
};

// Lấy danh sách phòng theo user id
// const getPostByUserIdApi = (roomId) => {
//   const URL_API = `/rooms/${roomId}/details`;
//   return axios.get(URL_API);
// };

export { getAllPostsAPI, getPostById };
