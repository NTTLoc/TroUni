import axios from "../axios.customize";

// Đăng ký user
const createUserApi = (username, email, password) => {
  const URL_API = "/auth/signup";
  return axios.post(URL_API, {
    username,
    email,
    password,
    role: "STUDENT",
  });
};

// Đăng nhập
const loginApi = (usernameOrEmail, password) => {
  const URL_API = "/auth/login";
  return axios.post(URL_API, {
    usernameOrEmail,
    password,
  });
};

// Đăng nhập
const loginGoogleApi = (accessToken) => {
  const URL_API = "/auth/google-login";
  return axios.post(URL_API, {
    accessToken,
  });
};

// Xác thực email bằng mã code 6 số
const verifyEmailApi = (email, code) => {
  const URL_API = "/email-verification/verify";
  return axios.post(URL_API, {
    email,
    verificationCode: code,
  });
};

// Lấy thông tin user hiện tại
const getUserApi = () => {
  const URL_API = "/auth/me";
  return axios.get(URL_API);
};

export { createUserApi, loginApi, getUserApi, loginGoogleApi, verifyEmailApi };
