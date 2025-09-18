import React from "react";
import { Container } from "react-bootstrap";
import { AppointmentList } from "../../components/appointment";

const TenantAppointments = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>
          <i className="bi bi-calendar-check me-2"></i>
          Lịch hẹn xem phòng của tôi
        </h2>
        <p className="text-muted">
          Quản lý và theo dõi các lịch hẹn xem phòng bạn đã đặt
        </p>
      </div>

      <AppointmentList userRole="tenant" />
    </Container>
  );
};

export default TenantAppointments;
