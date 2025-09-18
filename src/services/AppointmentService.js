import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export class AppointmentService {
  static async createAppointment(appointmentData) {
    try {
      const appointmentRef = collection(db, "appointments");
      const docRef = await addDoc(appointmentRef, {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { success: false, error: error.message };
    }
  }

  static async updateAppointment(appointmentId, updateData) {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { success: false, error: error.message };
    }
  }

  static async deleteAppointment(appointmentId) {
    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return { success: false, error: error.message };
    }
  }

  static async getAppointmentsByProperty(propertyId) {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("propertyId", "==", propertyId),
        orderBy("startTime", "asc")
      );

      const querySnapshot = await getDocs(q);
      const appointments = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate
            ? data.startTime.toDate()
            : new Date(data.startTime?.seconds * 1000),
          endTime: data.endTime?.toDate
            ? data.endTime.toDate()
            : new Date(data.endTime?.seconds * 1000),
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt?.seconds * 1000),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt?.seconds * 1000),
        });
      });

      return { success: true, appointments };
    } catch (error) {
      console.error("Error getting appointments by property:", error);
      return { success: false, error: error.message };
    }
  }

  static async getAppointmentsByUser(userId, userRole = "tenant") {
    try {
      const appointmentsRef = collection(db, "appointments");
      let q;

      if (userRole === "owner") {
        q = query(
          appointmentsRef,
          where("propertyOwnerId", "==", userId),
          orderBy("startTime", "desc")
        );
      } else {
        q = query(
          appointmentsRef,
          where("visitorId", "==", userId),
          orderBy("startTime", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const appointments = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate
            ? data.startTime.toDate()
            : new Date(data.startTime?.seconds * 1000),
          endTime: data.endTime?.toDate
            ? data.endTime.toDate()
            : new Date(data.endTime?.seconds * 1000),
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt?.seconds * 1000),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : new Date(data.updatedAt?.seconds * 1000),
        });
      });

      return { success: true, appointments };
    } catch (error) {
      console.error("Error getting appointments by user:", error);
      return { success: false, error: error.message };
    }
  }

  static subscribeToAppointmentsByUser(userId, userRole = "tenant", callback) {
    const appointmentsRef = collection(db, "appointments");
    let q;

    if (userRole === "owner") {
      q = query(
        appointmentsRef,
        where("propertyOwnerId", "==", userId),
        orderBy("startTime", "desc")
      );
    } else {
      q = query(
        appointmentsRef,
        where("visitorId", "==", userId),
        orderBy("startTime", "desc")
      );
    }

    return onSnapshot(
      q,
      (querySnapshot) => {
        const appointments = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointments.push({
            id: doc.id,
            ...data,
            startTime: data.startTime?.toDate
              ? data.startTime.toDate()
              : new Date(data.startTime?.seconds * 1000),
            endTime: data.endTime?.toDate
              ? data.endTime.toDate()
              : new Date(data.endTime?.seconds * 1000),
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt?.seconds * 1000),
            updatedAt: data.updatedAt?.toDate
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt?.seconds * 1000),
          });
        });
        callback(appointments);
      },
      (error) => {
        console.error("Error in appointment subscription:", error);
        callback([]);
      }
    );
  }

  static async getAvailableTimeSlots(propertyId, date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("propertyId", "==", propertyId),
        where("startTime", ">=", startOfDay),
        where("startTime", "<=", endOfDay),
        where("status", "in", ["pending", "confirmed"])
      );

      const querySnapshot = await getDocs(q);
      const bookedSlots = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookedSlots.push({
          start: data.startTime?.toDate
            ? data.startTime.toDate()
            : new Date(data.startTime?.seconds * 1000),
          end: data.endTime?.toDate
            ? data.endTime.toDate()
            : new Date(data.endTime?.seconds * 1000),
        });
      });

      // Generate available slots (9 AM - 6 PM, 1-hour intervals)
      const availableSlots = [];
      const startHour = 9;
      const endHour = 18;

      for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check if slot conflicts with booked slots
        const isBooked = bookedSlots.some((bookedSlot) => {
          return (
            (slotStart >= bookedSlot.start && slotStart < bookedSlot.end) ||
            (slotEnd > bookedSlot.start && slotEnd <= bookedSlot.end) ||
            (slotStart <= bookedSlot.start && slotEnd >= bookedSlot.end)
          );
        });

        if (!isBooked) {
          availableSlots.push({
            start: slotStart,
            end: slotEnd,
            time: `${hour.toString().padStart(2, "0")}:00`,
            display: `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
              .toString()
              .padStart(2, "0")}:00`,
          });
        }
      }

      return { success: true, availableSlots };
    } catch (error) {
      console.error("Error getting available time slots:", error);
      return { success: false, error: error.message };
    }
  }

  static validateAppointmentTime(startTime, endTime, propertyId) {
    const now = new Date();

    // Check if appointment is in the future
    if (startTime <= now) {
      return {
        valid: false,
        message: "Không thể đặt lịch cho thời gian trong quá khứ",
      };
    }

    // Check if appointment is not too far in the future (max 30 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (startTime > maxDate) {
      return {
        valid: false,
        message: "Không thể đặt lịch quá 30 ngày trong tương lai",
      };
    }

    // Check if duration is reasonable (min 30 min, max 3 hours)
    const durationMinutes = (endTime - startTime) / (1000 * 60);
    if (durationMinutes < 30) {
      return {
        valid: false,
        message: "Thời gian xem phòng tối thiểu là 30 phút",
      };
    }
    if (durationMinutes > 180) {
      return { valid: false, message: "Thời gian xem phòng tối đa là 3 giờ" };
    }

    // Check if appointment is during business hours (9 AM - 6 PM)
    const startHour = startTime.getHours();
    if (startHour < 9 || startHour >= 18) {
      return { valid: false, message: "Chỉ có thể đặt lịch từ 9:00 đến 18:00" };
    }

    return { valid: true };
  }
}

export default AppointmentService;
