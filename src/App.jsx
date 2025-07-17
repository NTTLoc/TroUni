import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import axios from "./utils/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);

      const res = await axios.get(`/v1/api/account`);
      if (res) {
        setAuth({
          isAuthenticated: false,
          user: {
            email: res.email,
            name: res.name,
          },
        });
      }
      setAppLoading(false);
    };

    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
