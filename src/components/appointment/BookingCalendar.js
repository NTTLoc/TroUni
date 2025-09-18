import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { AppointmentService } from "../../services/AppointmentService";
import { NotificationService } from "../../services/NotificationService";

// Set Vietnamese locale
moment.locale("vi");
const localizer = momentLocalizer(moment);

const BookingCalendar = ({ propertyId, propertyOwnerId, onBookingSuccess }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    date: "",
    time: "",
    duration: 60,
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate available time slots (9 AM - 6 PM, 1-hour intervals)
  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        display: `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
          .toString()
          .padStart(2, "0")}:00`,
      });
    }
    return slots;
  };

  // Load existing appointments
  useEffect(() => {
    const loadAppointments = async () => {
      if (!propertyId) return;

      try {
        const result = await AppointmentService.getAppointmentsByProperty(
          propertyId
        );

        if (result.success) {
          const appointments = result.appointments.map((appointment) => ({
            id: appointment.id,
            title: `Lịch hẹn - ${appointment.visitorName}`,
            start: appointment.startTime,
            end: appointment.endTime,
            resource: {
              type: "appointment",
              visitorName: appointment.visitorName,
              visitorPhone: appointment.visitorPhone,
              visitorEmail: appointment.visitorEmail,
              status: appointment.status,
              message: appointment.message,
            },
          }));

          setEvents(appointments);
        } else {
          toast.error("Không thể tải lịch hẹn");
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error("Không thể tải lịch hẹn");
      }
    };

    loadAppointments();
  }, [propertyId]);

  const handleSelectSlot = ({ start, end }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.warning("Không thể đặt lịch cho ngày trong quá khứ");
      return;
    }

    // Check if slot is already booked
    const isBooked = events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (start >= eventStart && start < eventEnd) ||
        (end > eventStart && end <= eventEnd) ||
        (start <= eventStart && end >= eventEnd)
      );
    });

    if (isBooked) {
      toast.warning("Khung giờ này đã được đặt");
      return;
    }

    setSelectedSlot({ start, end });
    setBookingForm((prev) => ({
      ...prev,
      date: start.toISOString().split("T")[0],
      time: start.toTimeString().slice(0, 5),
    }));
    setAvailableSlots(generateTimeSlots(start));
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để đặt lịch");
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(selectedSlot.start);
      const endTime = new Date(selectedSlot.end);

      // Validate appointment time
      const validation = AppointmentService.validateAppointmentTime(
        startTime,
        endTime,
        propertyId
      );
      if (!validation.valid) {
        toast.error(validation.message);
        setLoading(false);
        return;
      }

      const appointmentData = {
        propertyId,
        propertyOwnerId,
        visitorId: currentUser.uid,
        visitorName: bookingForm.name,
        visitorPhone: bookingForm.phone,
        visitorEmail: bookingForm.email,
        message: bookingForm.message,
        startTime,
        endTime,
        status: "pending",
      };

      const result = await AppointmentService.createAppointment(
        appointmentData
      );

      if (!result.success) {
        toast.error(result.error || "Có lỗi xảy ra khi đặt lịch");
        setLoading(false);
        return;
      }

      // Send notification to property owner
      try {
        await NotificationService.notifyAppointmentCreated({
          ...appointmentData,
          id: result.id,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        // Don't fail the booking if notification fails
      }

      // Add to local events
      const newEvent = {
        id: result.id,
        title: `Lịch hẹn - ${bookingForm.name}`,
        start: startTime,
        end: endTime,
        resource: {
          type: "appointment",
          visitorName: bookingForm.name,
          visitorPhone: bookingForm.phone,
          visitorEmail: bookingForm.email,
          status: "pending",
          message: bookingForm.message,
        },
      };

      setEvents((prev) => [...prev, newEvent]);
      setShowBookingModal(false);
      setBookingForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        date: "",
        time: "",
        duration: 60,
      });

      toast.success("Đặt lịch xem phòng thành công!");

      if (onBookingSuccess) {
        onBookingSuccess(newEvent);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Có lỗi xảy ra khi đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";

    if (event.resource?.status === "confirmed") {
      backgroundColor = "#28a745";
    } else if (event.resource?.status === "cancelled") {
      backgroundColor = "#dc3545";
    } else if (event.resource?.status === "pending") {
      backgroundColor = "#ffc107";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-calendar-check me-2"></i>
            Lịch xem phòng
          </h5>
          <div>
            <Badge bg="warning" className="me-2">
              Chờ xác nhận
            </Badge>
            <Badge bg="success" className="me-2">
              Đã xác nhận
            </Badge>
            <Badge bg="danger">Đã hủy</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <div style={{ height: "500px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              selectable
              views={["month", "week", "day"]}
              defaultView="week"
              step={60}
              timeslots={1}
              eventPropGetter={eventStyleGetter}
              messages={{
                next: "Tiếp",
                previous: "Trước",
                today: "Hôm nay",
                month: "Tháng",
                week: "Tuần",
                day: "Ngày",
                agenda: "Lịch trình",
                date: "Ngày",
                time: "Thời gian",
                event: "Sự kiện",
                allDay: "Cả ngày",
                noEventsInRange:
                  "Không có lịch hẹn nào trong khoảng thời gian này.",
                showMore: (total) => `+ Xem thêm ${total} lịch hẹn`,
              }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            Đặt lịch xem phòng
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Bạn đang đặt lịch xem phòng vào ngày{" "}
              <strong>
                {selectedSlot?.start?.toLocaleDateString("vi-VN")}
              </strong>
              từ{" "}
              <strong>
                {selectedSlot?.start?.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              đến{" "}
              <strong>
                {selectedSlot?.end?.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
            </Alert>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên *</Form.Label>
                  <Form.Control
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    placeholder="Nhập họ và tên"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                placeholder="Nhập email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lời nhắn cho chủ trọ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingForm.message}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Ví dụ: Tôi muốn xem phòng vào buổi chiều, có thể gọi trước không?"
              />
            </Form.Group>

            <Alert variant="warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Lưu ý:</strong> Lịch hẹn sẽ được gửi cho chủ trọ để xác
              nhận. Bạn sẽ nhận được thông báo khi chủ trọ phản hồi.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowBookingModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xử lý...
                </>
              ) : (
                "Đặt lịch"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
