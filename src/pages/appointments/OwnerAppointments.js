import React from 'react';
import { Container } from 'react-bootstrap';
import { AppointmentList } from '../../components/appointment';

const OwnerAppointments = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>
          <i className="bi bi-calendar-check me-2"></i>
          Quản lý lịch hẹn xem phòng
        </h2>
        <p className="text-muted">
          Xác nhận và quản lý các lịch hẹn xem phòng từ khách hàng
        </p>
      </div>
      
      <AppointmentList userRole="owner" />
    </Container>
  );
};

export default OwnerAppointments;
