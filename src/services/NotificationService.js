import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export class NotificationService {
  static async sendAppointmentNotification(notificationData) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const docRef = await addDoc(notificationsRef, {
        ...notificationData,
        createdAt: serverTimestamp(),
        read: false
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  static async notifyAppointmentCreated(appointmentData) {
    const notificationData = {
      type: 'appointment_created',
      recipientId: appointmentData.propertyOwnerId,
      title: 'Có lịch hẹn xem phòng mới',
      message: `${appointmentData.visitorName} đã đặt lịch xem phòng vào ${this.formatDateTime(appointmentData.startTime)}`,
      appointmentId: appointmentData.id,
      data: {
        visitorName: appointmentData.visitorName,
        visitorPhone: appointmentData.visitorPhone,
        visitorEmail: appointmentData.visitorEmail,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        message: appointmentData.message
      }
    };

    return await this.sendAppointmentNotification(notificationData);
  }

  static async notifyAppointmentConfirmed(appointmentData) {
    const notificationData = {
      type: 'appointment_confirmed',
      recipientId: appointmentData.visitorId,
      title: 'Lịch hẹn xem phòng đã được xác nhận',
      message: `Lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)} đã được chủ trọ xác nhận`,
      appointmentId: appointmentData.id,
      data: {
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        status: 'confirmed'
      }
    };

    return await this.sendAppointmentNotification(notificationData);
  }

  static async notifyAppointmentCancelled(appointmentData, cancelledBy) {
    const notificationData = {
      type: 'appointment_cancelled',
      recipientId: cancelledBy === 'owner' ? appointmentData.visitorId : appointmentData.propertyOwnerId,
      title: 'Lịch hẹn xem phòng đã bị hủy',
      message: `Lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)} đã bị hủy`,
      appointmentId: appointmentData.id,
      data: {
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        status: 'cancelled',
        cancelledBy
      }
    };

    return await this.sendAppointmentNotification(notificationData);
  }

  static async notifyAppointmentReminder(appointmentData) {
    const notificationData = {
      type: 'appointment_reminder',
      recipientId: appointmentData.visitorId,
      title: 'Nhắc nhở lịch hẹn xem phòng',
      message: `Bạn có lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)}. Vui lòng chuẩn bị!`,
      appointmentId: appointmentData.id,
      data: {
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime
      }
    };

    return await this.sendAppointmentNotification(notificationData);
  }

  static formatDateTime(date) {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Email notification methods (would integrate with email service)
  static async sendEmailNotification(recipientEmail, subject, message, htmlMessage) {
    // This would integrate with an email service like SendGrid, Nodemailer, etc.
    console.log('Email notification:', {
      to: recipientEmail,
      subject,
      message,
      htmlMessage
    });
    
    // For now, just log the email
    return { success: true, message: 'Email notification logged' };
  }

  static async sendAppointmentEmailNotification(appointmentData, notificationType) {
    let subject, message, htmlMessage;

    switch (notificationType) {
      case 'created':
        subject = 'Có lịch hẹn xem phòng mới';
        message = `${appointmentData.visitorName} đã đặt lịch xem phòng vào ${this.formatDateTime(appointmentData.startTime)}`;
        htmlMessage = `
          <h3>Có lịch hẹn xem phòng mới</h3>
          <p><strong>Khách hàng:</strong> ${appointmentData.visitorName}</p>
          <p><strong>Số điện thoại:</strong> ${appointmentData.visitorPhone}</p>
          <p><strong>Email:</strong> ${appointmentData.visitorEmail}</p>
          <p><strong>Thời gian:</strong> ${this.formatDateTime(appointmentData.startTime)}</p>
          ${appointmentData.message ? `<p><strong>Lời nhắn:</strong> ${appointmentData.message}</p>` : ''}
        `;
        break;
      case 'confirmed':
        subject = 'Lịch hẹn xem phòng đã được xác nhận';
        message = `Lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)} đã được xác nhận`;
        htmlMessage = `
          <h3>Lịch hẹn xem phòng đã được xác nhận</h3>
          <p>Chúc mừng! Lịch hẹn xem phòng của bạn đã được chủ trọ xác nhận.</p>
          <p><strong>Thời gian:</strong> ${this.formatDateTime(appointmentData.startTime)}</p>
          <p>Vui lòng đến đúng giờ và liên hệ với chủ trọ nếu có thay đổi.</p>
        `;
        break;
      case 'cancelled':
        subject = 'Lịch hẹn xem phòng đã bị hủy';
        message = `Lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)} đã bị hủy`;
        htmlMessage = `
          <h3>Lịch hẹn xem phòng đã bị hủy</h3>
          <p>Rất tiếc, lịch hẹn xem phòng của bạn đã bị hủy.</p>
          <p><strong>Thời gian đã hủy:</strong> ${this.formatDateTime(appointmentData.startTime)}</p>
          <p>Bạn có thể đặt lịch hẹn mới bất kỳ lúc nào.</p>
        `;
        break;
      case 'reminder':
        subject = 'Nhắc nhở lịch hẹn xem phòng';
        message = `Bạn có lịch hẹn xem phòng vào ${this.formatDateTime(appointmentData.startTime)}`;
        htmlMessage = `
          <h3>Nhắc nhở lịch hẹn xem phòng</h3>
          <p>Bạn có lịch hẹn xem phòng sắp tới:</p>
          <p><strong>Thời gian:</strong> ${this.formatDateTime(appointmentData.startTime)}</p>
          <p>Vui lòng chuẩn bị và đến đúng giờ!</p>
        `;
        break;
      default:
        return { success: false, error: 'Invalid notification type' };
    }

    // For owner notifications, use property owner email
    // For visitor notifications, use visitor email
    const recipientEmail = notificationType === 'created' 
      ? 'property-owner@example.com' // This would be fetched from user profile
      : appointmentData.visitorEmail;

    return await this.sendEmailNotification(recipientEmail, subject, message, htmlMessage);
  }
}

export default NotificationService;
