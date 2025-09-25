import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";

function Chat({ propertyId, ownerId }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUser) return;

    const chatId = [currentUser.uid, ownerId].sort().join("_");
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [currentUser, ownerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn!");
      return;
    }

    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const chatId = [currentUser.uid, ownerId].sort().join("_");

      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "Khách",
        createdAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      toast.error("Gửi tin nhắn thất bại!");
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <Card>
        <Card.Body className="text-center">
          <p>Vui lòng đăng nhập để chat với chủ phòng trọ</p>
          <Button variant="primary" href="/login">
            Đăng nhập
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Chat với chủ phòng trọ</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <div
          className="chat-messages"
          style={{ height: "400px", overflowY: "auto", padding: "1rem" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.senderId === currentUser.uid ? "text-end" : "text-start"
              } mb-3`}
            >
              <div
                className={`d-inline-block p-2 rounded ${
                  message.senderId === currentUser.uid
                    ? "bg-primary text-white"
                    : "bg-light"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <small className="d-block text-muted mb-1">
                  {message.senderName}
                </small>
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card.Body>
      <Card.Footer>
        <Form onSubmit={handleSendMessage}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </Form>
      </Card.Footer>
    </Card>
  );
}

export default Chat;
