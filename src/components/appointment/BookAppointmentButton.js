import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import BookingCalendar from './BookingCalendar';

const BookAppointmentButton = ({ propertyId, propertyOwnerId, propertyTitle }) => {
  const { currentUser } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookAppointment = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để đặt lịch xem phòng');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (appointment) => {
    toast.success('Đặt lịch xem phòng thành công! Chủ trọ sẽ xác nhận và liên hệ với bạn.');
    setShowBookingModal(false);
  };

  return (
    <>
      <Button 
        variant="success" 
        size="lg" 
        className="w-100 mb-2"
        onClick={handleBookAppointment}
      >
        <i className="bi bi-calendar-check me-2"></i>
        Đặt lịch xem phòng
      </Button>
      
      <Button 
        variant="outline-primary" 
        className="w-100 mb-2"
        onClick={handleBookAppointment}
      >
        <i className="bi bi-calendar-week me-2"></i>
        Xem lịch trống
      </Button>

      <Modal 
        show={showBookingModal} 
        onHide={() => setShowBookingModal(false)} 
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-check me-2"></i>
            Đặt lịch xem phòng - {propertyTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Hướng dẫn đặt lịch:</strong>
            <ul className="mb-0 mt-2">
              <li>Chọn ngày và giờ phù hợp từ lịch bên dưới</li>
              <li>Điền đầy đủ thông tin liên hệ</li>
              <li>Chủ trọ sẽ xác nhận lịch hẹn trong vòng 24h</li>
              <li>Bạn sẽ nhận được thông báo khi có phản hồi</li>
            </ul>
          </Alert>
          
          <BookingCalendar
            propertyId={propertyId}
            propertyOwnerId={propertyOwnerId}
            onBookingSuccess={handleBookingSuccess}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookAppointmentButton;
