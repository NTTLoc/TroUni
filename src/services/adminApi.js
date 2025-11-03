import axios from "../utils/axios.customize";

export const getStats = () => {
  const URL_API = "/api/v1/admin/dashboard/stats";
  return axios.get(URL_API);
};
