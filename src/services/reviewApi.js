import axios from "../utils/axios.customize";

const createReviewApi = (roomId, data) => {
  const URL_API = `/reviews/${roomId}`;
  return axios.post(URL_API, data);
};

const getReviewApi = (roomId, data) => {
  const URL_API = `/reviews/${roomId}`;
  return axios.get(URL_API, data);
};

const getAllReviewsApi = () => {
  const URL_API = "/reviews";
  return axios.get(URL_API);
};

export { createReviewApi, getReviewApi, getAllReviewsApi };
