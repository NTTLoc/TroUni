import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { AppointmentService } from '../../services/AppointmentService';
import { NotificationService } from '../../services/NotificationService';

const AppointmentList = ({ userRole = 'visitor' }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    // Use real-time subscription for appointments
    const unsubscribe = AppointmentService.subscribeToAppointmentsByUser(
      currentUser.uid,
      userRole,
      (appointmentsData) => {
        setAppointments(appointmentsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userRole]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const result = await AppointmentService.updateAppointment(appointmentId, {
        status: newStatus
      });

      if (result.success) {
        // Send notification
        const appointment = appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          if (newStatus === 'confirmed') {
            await NotificationService.notifyAppointmentConfirmed(appointment);
          } else if (newStatus === 'cancelled') {
            await NotificationService.notifyAppointmentCancelled(appointment, userRole);
          }
        }

        toast.success(`Cập nhật trạng thái thành ${getStatusText(newStatus)}`);
        setShowModal(false);
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi cập nhật lịch hẹn');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Có lỗi xảy ra khi cập nhật lịch hẹn');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  const getStatusVariant = (status) => {
    const variantMap = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info'
    };
    return variantMap[status] || 'secondary';
  };

  const openModal = (appointment, action) => {
    setSelectedAppointment(appointment);
    setModalAction(action);
    setShowModal(true);
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải danh sách lịch hẹn...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-calendar-check me-2"></i>
            {userRole === 'owner' ? 'Lịch hẹn xem phòng' : 'Lịch hẹn của tôi'}
          </h5>
        </Card.Header>
        <Card.Body>
          {appointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <h5 className="mt-3 text-muted">Chưa có lịch hẹn nào</h5>
              <p className="text-muted">
                {userRole === 'owner' 
                  ? 'Chưa có ai đặt lịch xem phòng của bạn'
                  : 'Bạn chưa đặt lịch xem phòng nào'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>{userRole === 'owner' ? 'Khách hàng' : 'Phòng'}</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div>
                          <strong>{formatDateTime(appointment.startTime)}</strong>
                          <br />
                          <small className="text-muted">
                            {Math.round((appointment.endTime - appointment.startTime) / (1000 * 60))} phút
                          </small>
                        </div>
                      </td>
                      <td>
                        {userRole === 'owner' ? (
                          <div>
                            <strong>{appointment.visitorName}</strong>
                            <br />
                            <small className="text-muted">{appointment.visitorPhone}</small>
                            <br />
                            <small className="text-muted">{appointment.visitorEmail}</small>
                          </div>
                        ) : (
                          <div>
                            <strong>Phòng ID: {appointment.propertyId}</strong>
                            <br />
                            <small className="text-muted">
                              Đặt ngày: {appointment.createdAt.toLocaleDateString('vi-VN')}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openModal(appointment, 'view')}
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          {userRole === 'owner' && appointment.status === 'pending' && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => openModal(appointment, 'confirm')}
                              >
                                <i className="bi bi-check"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => openModal(appointment, 'cancel')}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            </>
                          )}
                          {userRole === 'visitor' && appointment.status === 'pending' && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => openModal(appointment, 'cancel')}
                            >
                              <i className="bi bi-x"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-check me-2"></i>
            Chi tiết lịch hẹn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Thông tin lịch hẹn</h6>
                  <p><strong>Thời gian:</strong> {formatDateTime(selectedAppointment.startTime)}</p>
                  <p><strong>Kết thúc:</strong> {formatDateTime(selectedAppointment.endTime)}</p>
                  <p><strong>Trạng thái:</strong> 
                    <Badge bg={getStatusVariant(selectedAppointment.status)} className="ms-2">
                      {getStatusText(selectedAppointment.status)}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin {userRole === 'owner' ? 'khách hàng' : 'chủ trọ'}</h6>
                  <p><strong>Tên:</strong> {selectedAppointment.visitorName}</p>
                  <p><strong>Số điện thoại:</strong> {selectedAppointment.visitorPhone}</p>
                  <p><strong>Email:</strong> {selectedAppointment.visitorEmail}</p>
                </Col>
              </Row>
              
              {selectedAppointment.message && (
                <div className="mt-3">
                  <h6>Lời nhắn:</h6>
                  <Alert variant="info">{selectedAppointment.message}</Alert>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          {modalAction === 'confirm' && (
            <Button 
              variant="success" 
              onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
            >
              Xác nhận lịch hẹn
            </Button>
          )}
          {modalAction === 'cancel' && (
            <Button 
              variant="danger" 
              onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
            >
              Hủy lịch hẹn
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentList;
