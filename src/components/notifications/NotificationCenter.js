import React, { useState, useEffect } from "react";
import {
  Card,
  ListGroup,
  Badge,
  Button,
  Modal,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const NotificationCenter = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("recipientId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const notificationsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt?.seconds * 1000),
        });
      });

      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notif) => !notif.read);

      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }

      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông báo");
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      appointment_created: "bi-calendar-plus",
      appointment_confirmed: "bi-calendar-check",
      appointment_cancelled: "bi-calendar-x",
      appointment_reminder: "bi-bell",
    };
    return iconMap[type] || "bi-bell";
  };

  const getNotificationVariant = (type) => {
    const variantMap = {
      appointment_created: "info",
      appointment_confirmed: "success",
      appointment_cancelled: "danger",
      appointment_reminder: "warning",
    };
    return variantMap[type] || "primary";
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openNotificationDetail = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);

    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông báo...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-bell me-2"></i>
            Thông báo
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </h5>
          {unreadCount > 0 && (
            <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-bell-slash display-1 text-muted"></i>
              <h5 className="mt-3 text-muted">Chưa có thông báo nào</h5>
              <p className="text-muted">
                Bạn sẽ nhận được thông báo khi có hoạt động mới
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`cursor-pointer ${
                    !notification.read ? "bg-light" : ""
                  }`}
                  onClick={() => openNotificationDetail(notification)}
                >
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div
                        className={`bg-${getNotificationVariant(
                          notification.type
                        )} bg-opacity-10 rounded-circle p-2`}
                      >
                        <i
                          className={`bi ${getNotificationIcon(
                            notification.type
                          )} text-${getNotificationVariant(notification.type)}`}
                        ></i>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6
                            className={`mb-1 ${
                              !notification.read ? "fw-bold" : ""
                            }`}
                          >
                            {notification.title}
                          </h6>
                          <p className="mb-1 text-muted small">
                            {notification.message}
                          </p>
                          <small className="text-muted">
                            {formatDateTime(notification.createdAt)}
                          </small>
                        </div>
                        {!notification.read && (
                          <Badge bg="primary" className="rounded-pill">
                            Mới
                          </Badge>
                        )}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Notification Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i
              className={`bi ${
                selectedNotification
                  ? getNotificationIcon(selectedNotification.type)
                  : "bi-bell"
              } me-2`}
            ></i>
            Chi tiết thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <Alert
                variant={getNotificationVariant(selectedNotification.type)}
              >
                <h5>{selectedNotification.title}</h5>
                <p className="mb-0">{selectedNotification.message}</p>
              </Alert>

              <Row>
                <Col md={6}>
                  <h6>Thông tin cơ bản</h6>
                  <p>
                    <strong>Loại:</strong> {selectedNotification.type}
                  </p>
                  <p>
                    <strong>Thời gian:</strong>{" "}
                    {formatDateTime(selectedNotification.createdAt)}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>
                    <Badge
                      bg={selectedNotification.read ? "success" : "warning"}
                      className="ms-2"
                    >
                      {selectedNotification.read ? "Đã đọc" : "Chưa đọc"}
                    </Badge>
                  </p>
                </Col>
                {selectedNotification.data && (
                  <Col md={6}>
                    <h6>Chi tiết</h6>
                    {selectedNotification.type === "appointment_created" && (
                      <div>
                        <p>
                          <strong>Khách hàng:</strong>{" "}
                          {selectedNotification.data.visitorName}
                        </p>
                        <p>
                          <strong>Số điện thoại:</strong>{" "}
                          {selectedNotification.data.visitorPhone}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {selectedNotification.data.visitorEmail}
                        </p>
                        {selectedNotification.data.message && (
                          <p>
                            <strong>Lời nhắn:</strong>{" "}
                            {selectedNotification.data.message}
                          </p>
                        )}
                      </div>
                    )}
                    {selectedNotification.type === "appointment_confirmed" && (
                      <div>
                        <p>
                          <strong>Trạng thái:</strong> Đã xác nhận
                        </p>
                      </div>
                    )}
                    {selectedNotification.type === "appointment_cancelled" && (
                      <div>
                        <p>
                          <strong>Trạng thái:</strong> Đã hủy
                        </p>
                        <p>
                          <strong>Hủy bởi:</strong>{" "}
                          {selectedNotification.data.cancelledBy === "owner"
                            ? "Chủ trọ"
                            : "Khách hàng"}
                        </p>
                      </div>
                    )}
                  </Col>
                )}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: rgba(0, 123, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
