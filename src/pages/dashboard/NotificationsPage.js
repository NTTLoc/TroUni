import React from "react";
import { Container } from "react-bootstrap";
import NotificationCenter from "../../components/notifications/NotificationCenter";

const NotificationsPage = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>
          <i className="bi bi-bell me-2"></i>
          Trung tâm thông báo
        </h2>
        <p className="text-muted">Xem và quản lý tất cả thông báo của bạn</p>
      </div>

      <NotificationCenter />
    </Container>
  );
};

export default NotificationsPage;
