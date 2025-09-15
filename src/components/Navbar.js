// import React from "react";
// import { Navbar, Nav, Container, Button } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { useTheme } from "../contexts/ThemeContext";

// function NavigationBar() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/");
//     } catch (error) {
//       console.error("Failed to log out:", error);
//     }
//   };

//   return (
//     <Navbar bg="white" variant="dark" expand="lg" className="py-3">
//       <Container>
//         <Navbar.Brand
//           as={Link}
//           to="/"
//           className="d-flex align-items-center brand-logo"
//           style={{
//             fontSize: "1.8rem",
//             fontWeight: "700",
//             letterSpacing: "0.5px",
//             background: "linear-gradient(45deg, #00ff87, #60efff)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             textShadow: "0 2px 10px rgba(0,255,135,0.2)",
//             transition: "all 0.3s ease",
//             position: "relative",
//             animation: "pulse 2s infinite",
//           }}
//           onMouseOver={(e) => {
//             e.target.style.transform = "scale(1.05) rotate(-2deg)";
//             e.target.style.textShadow = "0 4px 15px rgba(0,255,135,0.3)";
//             e.target.style.animation =
//               "glow 1.5s ease-in-out infinite alternate";
//           }}
//           onMouseOut={(e) => {
//             e.target.style.transform = "scale(1) rotate(0deg)";
//             e.target.style.textShadow = "0 2px 10px rgba(0,255,135,0.2)";
//             e.target.style.animation = "pulse 2s infinite";
//           }}
//         >
//           <style>
//             {`
//               @keyframes pulse {
//                 0% { transform: scale(1); }
//                 50% { transform: scale(1.02); }
//                 100% { transform: scale(1); }
//               }
//               @keyframes glow {
//                 from {
//                   text-shadow: 0 0 5px #00ff87,
//                               0 0 10px #00ff87,
//                               0 0 15px #00ff87;
//                 }
//                 to {
//                   text-shadow: 0 0 10px #60efff,
//                               0 0 20px #60efff,
//                               0 0 30px #60efff;
//                 }
//               }
//             `}
//           </style>
//           <i
//             className="bi bi-house-gear-fill me-2"
//             style={{
//               fontSize: "1.5rem",
//               animation: "spin 4s linear infinite",
//               display: "inline-block",
//             }}
//           ></i>
//           <style>
//             {`
//               @keyframes spin {
//                 from { transform: rotate(0deg); }
//                 to { transform: rotate(360deg); }
//               }
//             `}
//           </style>
//           Trọ UNI
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/">
//               Trang Chủ
//             </Nav.Link>
//             <Nav.Link as={Link} to="/properties">
//               Phòng Trọ
//             </Nav.Link>
//             <Nav.Link as={Link} to="/about">
//               Về chúng tôi
//             </Nav.Link>
//             <Nav.Link as={Link} to="/contact">
//               Liên Hệ
//             </Nav.Link>
//           </Nav>
//           <Nav className="align-items-center gap-2 flex-lg-row flex-column">
//             <Button
//               variant={theme === "light" ? "outline-light" : "outline-warning"}
//               onClick={toggleTheme}
//               className="me-lg-2 mb-2 mb-lg-0"
//               title={
//                 theme === "light"
//                   ? "Chuyển sang Dark Mode"
//                   : "Chuyển sang Light Mode"
//               }
//               style={{
//                 fontSize: 22,
//                 borderRadius: 50,
//                 width: 44,
//                 height: 44,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {theme === "light" ? (
//                 <i className="bi bi-moon-stars-fill"></i>
//               ) : (
//                 <i className="bi bi-sun-fill"></i>
//               )}
//             </Button>
//             {currentUser ? (
//               <>
//                 <Nav.Link
//                   as={Link}
//                   to="/my-properties"
//                   className="me-lg-2 mb-2 mb-lg-0 w-100 text-center"
//                 >
//                   <Button variant="outline-primary" className="w-100">
//                     Phòng Của Tôi
//                   </Button>
//                 </Nav.Link>
//                 <Nav.Link
//                   as={Link}
//                   to="/post-property"
//                   className="me-lg-2 mb-2 mb-lg-0 w-100 text-center"
//                 >
//                   <Button variant="outline-primary" className="w-100">
//                     Đăng Tin
//                   </Button>
//                 </Nav.Link>
//                 <Button
//                   variant="primary"
//                   onClick={handleLogout}
//                   className="w-100 mb-2 mb-lg-0"
//                 >
//                   Đăng Xuất
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Nav.Link
//                   as={Link}
//                   to="/login"
//                   className="me-lg-2 mb-2 mb-lg-0 w-100 text-center"
//                 >
//                   <Button variant="outline-primary" className="w-100">
//                     Đăng Nhập
//                   </Button>
//                 </Nav.Link>
//                 <Nav.Link
//                   as={Link}
//                   to="/register"
//                   className="mb-2 mb-lg-0 w-100 text-center"
//                 >
//                   <Button variant="primary" className="w-100">
//                     Đăng Ký
//                   </Button>
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default NavigationBar;
import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [userPlan, setUserPlan] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  useEffect(() => {
    if (!currentUser) {
      setUnreadNotifications(0);
      setUserPlan(null);
      return;
    }
    setUserPlan(currentUser.plan || localStorage.getItem("userPlan") || null);
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.uid),
      where("read", "==", false)
    );
    const unsub = onSnapshot(q, (snap) => {
      setUnreadNotifications(snap.size || 0);
    });
    return () => unsub();
  }, [currentUser]);

  const handleSelectPlan = async (plan) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { plan, planUpdatedAt: serverTimestamp() });
      localStorage.setItem("userPlan", plan);
      setUserPlan(plan);
      toast.success(`Đã cập nhật gói: ${plan.toUpperCase()}`);
    } catch (e) {
      console.error("Failed to update plan", e);
      toast.error("Cập nhật gói thất bại");
    }
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      bg={theme === "light" ? "light" : "dark"}
      variant={theme === "light" ? "light" : "dark"}
      expand="lg"
      expanded={expanded}
      className="py-3"
      style={{
        boxShadow: theme === "light" ? "0 2px 8px #0001" : "0 2px 8px #0008",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center brand-logo"
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            letterSpacing: "0.5px",
            background:
              theme === "dark"
                ? "linear-gradient(45deg, #00ff87, #60efff)"
                : undefined,
            WebkitBackgroundClip: theme === "dark" ? "text" : undefined,
            WebkitTextFillColor: theme === "dark" ? "transparent" : undefined,
            color: theme === "light" ? "#00c6fb" : undefined,
            textShadow:
              theme === "light"
                ? "0 2px 10px rgba(0,198,251,0.08)"
                : "0 2px 10px rgba(0,255,135,0.2)",
            transition: "all 0.3s ease",
            position: "relative",
            animation: "pulse 2s infinite",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05) rotate(-2deg)";
            e.target.style.textShadow = "0 4px 15px rgba(0,255,135,0.3)";
            e.target.style.animation =
              "glow 1.5s ease-in-out infinite alternate";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1) rotate(0deg)";
            e.target.style.textShadow = "0 2px 10px rgba(0,255,135,0.2)";
            e.target.style.animation = "pulse 2s infinite";
          }}
        >
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
              }
              @keyframes glow {
                from {
                  text-shadow: 0 0 5px #00ff87,
                              0 0 10px #00ff87,
                              0 0 15px #00ff87;
                }
                to {
                  text-shadow: 0 0 10px #60efff,
                              0 0 20px #60efff,
                              0 0 30px #60efff;
                }
              }
            `}
          </style>
          <i
            className="bi bi-house-gear-fill me-2"
            style={{
              fontSize: "1.5rem",
              animation: "spin 4s linear infinite",
              display: "inline-block",
              color: theme === "dark" ? "#00ff87" : "#00c6fb",
            }}
          ></i>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          Trọ UNI
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={theme === "dark" ? "dark" : ""}
        >
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleNavClick}
              style={
                theme === "dark"
                  ? { color: "#fff", borderBottom: "1px solid #333" }
                  : {}
              }
            >
              Trang Chủ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/properties"
              onClick={handleNavClick}
              style={
                theme === "dark"
                  ? { color: "#fff", borderBottom: "1px solid #333" }
                  : {}
              }
            >
              Phòng Trọ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={handleNavClick}
              style={
                theme === "dark"
                  ? { color: "#fff", borderBottom: "1px solid #333" }
                  : {}
              }
            >
              Về chúng tôi
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              onClick={handleNavClick}
              style={
                theme === "dark"
                  ? { color: "#fff", borderBottom: "1px solid #333" }
                  : {}
              }
            >
              Liên Hệ
            </Nav.Link>
            {currentUser?.role === "owner" ? (
              <Nav.Link
                as={Link}
                to="/roommate-matching"
                onClick={handleNavClick}
                style={
                  theme === "dark"
                    ? { color: "#fff", borderBottom: "1px solid #333" }
                    : {}
                }
              >
                Ghép trọ
              </Nav.Link>
            ) : null}
          </Nav>
        </Navbar.Collapse>
        <div className="d-flex align-items-center ms-auto gap-2">
          {currentUser?.role === "owner" && (
            <Button
              variant={theme === "light" ? "outline-warning" : "outline-light"}
              onClick={() => setShowPremium(true)}
              style={{
                fontSize: 22,
                borderRadius: 50,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg,#FDE68A,#F59E0B)"
                    : undefined,
                color: theme === "dark" ? "#1f2937" : "#F59E0B",
                borderColor: "#F59E0B",
              }}
              title="Gói Premium cho chủ trọ"
            >
              <i className="bi bi-crown" />
              {userPlan && userPlan !== "basic" && (
                <span
                  className="badge text-bg-warning"
                  style={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    fontSize: 10,
                  }}
                >
                  {userPlan === "elite" ? "Elite" : "Pro"}
                </span>
              )}
            </Button>
          )}
          <Button
            variant={theme === "light" ? "outline-dark" : "outline-warning"}
            onClick={toggleTheme}
            style={{
              fontSize: 22,
              borderRadius: 50,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={
              theme === "light"
                ? "Chuyển sang Dark Mode"
                : "Chuyển sang Light Mode"
            }
          >
            {theme === "light" ? (
              <i
                className="bi bi-moon-stars-fill"
                style={{ color: "#005bea" }}
              ></i>
            ) : (
              <i className="bi bi-sun-fill" style={{ color: "#FFD600" }}></i>
            )}
          </Button>
          {currentUser && (
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/dashboard/notifications")}
              style={{
                fontSize: 22,
                borderRadius: 50,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              title="Thông báo"
            >
              <i className="bi bi-bell"></i>
              {unreadNotifications > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#dc2626",
                    color: "#fff",
                    borderRadius: 999,
                    fontSize: 10,
                    lineHeight: "14px",
                    padding: "0 5px",
                    minWidth: 14,
                    textAlign: "center",
                  }}
                >
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Button>
          )}
          {currentUser ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                id="userDropdown"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  background: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: 40,
                    height: 40,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  ) : (
                    (currentUser.displayName || currentUser.name || "U")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <span style={{ fontWeight: 600 }}>
                  {currentUser.displayName || currentUser.name || "User"}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                <div className="px-3 py-2">
                  <div style={{ fontWeight: 600 }}>
                    {currentUser.displayName || currentUser.name || "User"}
                  </div>
                  <div
                    style={{
                      color: theme === "light" ? "#444" : "#b0eaff",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    {currentUser.email}
                  </div>
                </div>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => navigate("/account/profile")}
                  style={{
                    color: theme === "light" ? "#005bea" : "#fff",
                    fontWeight: 600,
                  }}
                >
                  Thông tin tài khoản
                </Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  Đăng Xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/login"
                className="me-lg-2 mb-2 mb-lg-0 w-100 text-center"
                onClick={handleNavClick}
              >
                <Button variant="outline-primary" className="w-100">
                  Đăng Nhập
                </Button>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/register"
                className="mb-2 mb-lg-0 w-100 text-center"
                onClick={handleNavClick}
              >
                <Button variant="primary" className="w-100">
                  Đăng Ký
                </Button>
              </Nav.Link>
            </>
          )}
        </div>
        {/* Premium Modal for Owners */}
        <Modal
          show={showPremium}
          onHide={() => setShowPremium(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-crown me-2" /> Gói Premium cho Chủ trọ
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card h-100 premium-basic">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Basic</h5>
                    <p className="text-muted">Miễn phí</p>
                    <ul className="mb-3">
                      <li>Đăng tin thường</li>
                      <li>Giới hạn nổi bật</li>
                      <li>Hỗ trợ qua email</li>
                    </ul>
                    <Button
                      variant="outline-secondary"
                      className="w-100 mt-auto"
                      onClick={() => handleSelectPlan("basic")}
                    >
                      Giữ gói
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 premium-pro">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Pro</h5>
                    <p className="text-muted">299.000đ/tháng</p>
                    <ul className="mb-3">
                      <li>+ Ưu tiên hiển thị 3 ngày</li>
                      <li>+ Huy hiệu "Tin uy tín"</li>
                      <li>+ Thống kê lượt xem</li>
                    </ul>
                    <Button
                      variant="primary"
                      className="w-100 mt-auto"
                      onClick={() => handleSelectPlan("pro")}
                    >
                      Nâng cấp Pro
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 premium-elite">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Elite</h5>
                    <p className="text-muted">599.000đ/tháng</p>
                    <ul className="mb-3">
                      <li>+ Ưu tiên hiển thị 7 ngày</li>
                      <li>+ Huy hiệu "Top chủ trọ"</li>
                      <li>+ Gợi ý đẩy tin tự động</li>
                      <li>+ Hỗ trợ ưu tiên</li>
                    </ul>
                    <Button
                      variant={theme === "dark" ? "warning" : "dark"}
                      className="w-100 mt-auto"
                      onClick={() => handleSelectPlan("elite")}
                    >
                      Nâng cấp Elite
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
