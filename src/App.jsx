import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import { Spin } from "antd";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { getUserDetailsApi } from "./utils/api/userApi";
import ScrollToTop from "./ScrollToTop";

function App() {
  const { setAuth, appLoading, setAppLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const res = await getUserDetailsApi();

        if (isMounted && res?.data) {
          const userData = res.data;
          setAuth({
            isAuthenticated: true,
            user: {
              id: userData.id,
              email: userData.email ?? "",
              username: userData.username ?? "",
              role: userData.role ?? "STUDENT",
              googleAccount: userData.googleAccount ?? false,
              phoneVerified: userData.phoneVerified ?? false,
              idVerificationStatus: userData.idVerificationStatus ?? "",
              status: userData.status ?? "",
              createdAt: userData.createdAt ?? "",
              updatedAt: userData.updatedAt ?? "",
            },
          });
        }
      } catch (error) {
        console.warn("Không lấy được tài khoản:", error?.message);
        if (isMounted) {
          setAuth({
            isAuthenticated: false,
            user: {
              id: "",
              email: "",
              username: "",
              role: "",
              googleAccount: false,
              phoneVerified: false,
              idVerificationStatus: "",
              status: "",
              createdAt: "",
              updatedAt: "",
            },
          });
        }
      } finally {
        if (isMounted) setAppLoading(false);
      }
    };

    fetchAccount();
    return () => {
      isMounted = false;
    };
  }, [setAuth, setAppLoading]);

  return (
    <div className="app-layout">
      {appLoading ? (
        <div className="loading-overlay">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Navbar />
          <ScrollToTop />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
