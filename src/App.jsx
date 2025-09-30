import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import { Spin } from "antd";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { getUserApi } from "./services/authApi";
import ScrollToTop from "./ScrollToTop";

function App() {
  const { setAuth, appLoading, setAppLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const res = await getUserApi();

        if (isMounted && res?.data) {
          const userData = res.data;
          setAuth({
            isAuthenticated: true,
            user: userData,
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
