import { createContext, useState, useEffect } from "react";
import { getUserDetailsApi, updateProfileApi } from "../../utils/api/userApi";

export const ProfileContext = createContext({
  profile: null,
  setProfile: () => {},
  fetchProfile: async () => {},
  updateProfile: async () => {},
});

export const ProfileWrapper = ({ children }) => {
  const [profile, setProfile] = useState(null);

  // Lấy từ localStorage khi load trang
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      fetchProfile(); // fallback gọi API nếu chưa có
    }
  }, []);

  // Hàm fetch profile từ API
  const fetchProfile = async () => {
    try {
      const res = await getUserDetailsApi();
      if (res?.data) {
        setProfile(res.data);
        localStorage.setItem("profile", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Không thể fetch profile:", err);
    }
  };

  // Hàm update profile
  const updateProfile = async (payload) => {
    try {
      const res = await updateProfileApi(payload);
      if (res?.data) {
        setProfile(res.data);
        localStorage.setItem("profile", JSON.stringify(res.data));
      }
      return res;
    } catch (err) {
      console.error("Update profile lỗi:", err);
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
