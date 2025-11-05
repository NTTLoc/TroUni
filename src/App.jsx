import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import { Spin } from "antd";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { getUserApi } from "./services/authApi";
import ScrollToTop from "./ScrollToTop";

function App() {
  const { setAuth, appLoading, setAppLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const res = await getUserApi();

        if (isMounted && res?.data) {
          setAuth({
            isAuthenticated: true,
            user: res.data,
          });
        }
      } catch (error) {
        console.warn("Không lấy được tài khoản:", error?.message);
        if (isMounted) {
          setAuth({
            isAuthenticated: false,
            user: null,
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

  // 🟢 Xác định các trang đặc biệt
  const isCallPage = location.pathname.startsWith("/call");
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="app-layout">
      {appLoading ? (
        <div className="loading-overlay">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 🔴 Ẩn Navbar chỉ ở trang /call */}
          {!isCallPage && <Navbar />}

          <ScrollToTop />
          <main className="main-content">
            <Outlet />
          </main>

          {/* 🔴 Ẩn Footer ở /chat và /call */}
          {!isChatPage && !isCallPage && <Footer />}
        </>
      )}
    </div>
  );
}

export default App;
