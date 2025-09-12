import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PostProperty from "./components/property/PostProperty";
import MyProperties from "./components/property/MyProperties";
import Footer from "./components/Footer";
import ChatList from "./components/chat/ChatList";
import Chat from "./components/chat/Chat";
import About from "./pages/About";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/account/Dashboard";
import MyPropertiesPage from "./pages/account/MyProperties";
import CreditCardsPage from "./pages/account/CreditCards";
import AccountProfileRedirect from "./pages/account/AccountProfileRedirect";
import ScrollToTop from "./components/ScrollToTop";
import TenantDashboard from "./pages/dashboard/TenantDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import ProfilePage from "./pages/account/Profile";
import SettingsPage from "./pages/dashboard/SettingsPage";
import { StudentRoommateMatchForm, RoommateMatchingPage } from "./components";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/post-property"
                element={
                  <PrivateRoute>
                    <PostProperty />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-properties"
                element={
                  <PrivateRoute>
                    <MyProperties />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <ChatList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:chatId"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/roommate-matching"
                element={<RoommateMatchingPage />}
              />
              <Route
                path="/account/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/my-properties"
                element={
                  <PrivateRoute>
                    <MyPropertiesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/credit-cards"
                element={
                  <PrivateRoute>
                    <CreditCardsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/profile"
                element={<AccountProfileRedirect />}
              />
              <Route
                path="/account/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/tenant"
                element={
                  <PrivateRoute allowedRoles={["tenant"]}>
                    <TenantDashboard />
                  </PrivateRoute>
                }
              >
                <Route path="profile" element={<ProfilePage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route
                path="/dashboard/owner"
                element={
                  <PrivateRoute allowedRoles={["owner"]}>
                    <OwnerDashboard />
                  </PrivateRoute>
                }
              >
                <Route path="profile" element={<ProfilePage />} />
                <Route path="my-properties" element={<MyProperties />} />
                <Route path="post-property" element={<PostProperty />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route
                path="/dashboard/admin"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              >
                <Route index element={<ProfilePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AdminUsersPage = () => (
  <div>
    <h3>Quản lý người dùng</h3>
    <p>(Chức năng này sẽ cập nhật sau)</p>
  </div>
);
const AdminPostsPage = () => (
  <div>
    <h3>Duyệt tin đăng</h3>
    <p>(Chức năng này sẽ cập nhật sau)</p>
  </div>
);
const AdminReportsPage = () => (
  <div>
    <h3>Thống kê & báo cáo</h3>
    <p>(Chức năng này sẽ cập nhật sau)</p>
  </div>
);

export default App;
