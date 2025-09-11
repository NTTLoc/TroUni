import React, { useState, useEffect } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";

function ChatList() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        // Get all chat rooms where the current user is a participant
        const chatsRef = collection(db, "chats");
        const q = query(
          chatsRef,
          where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const chatPromises = snapshot.docs.map(async (doc) => {
            const chatData = doc.data();
            const otherUserId = chatData.participants.find(
              (id) => id !== currentUser.uid
            );

            // Get the other user's details
            const userDoc = await getDocs(
              query(collection(db, "users"), where("uid", "==", otherUserId))
            );
            const otherUser = userDoc.docs[0]?.data();

            // Get the last message
            const messagesRef = collection(db, `chats/${doc.id}/messages`);
            const lastMessageQuery = query(
              messagesRef,
              orderBy("createdAt", "desc"),
              limit(1)
            );
            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data();

            return {
              id: doc.id,
              otherUser,
              lastMessage,
              unreadCount: chatData.unreadCount || 0,
            };
          });

          const chatList = await Promise.all(chatPromises);
          setChats(chatList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Card>
        <Card.Body className="text-center">
          <p>Vui lòng đăng nhập để xem tin nhắn</p>
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <p>Đang tải tin nhắn...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Tin nhắn của bạn</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {chats.length === 0 ? (
          <ListGroup.Item className="text-center">
            Chưa có tin nhắn nào
          </ListGroup.Item>
        ) : (
          chats.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              as={Link}
              to={`/chat/${chat.id}`}
              className="d-flex justify-content-between align-items-center p-3"
              action
            >
              <div>
                <h6 className="mb-1">
                  {chat.otherUser?.displayName || "Người dùng"}
                </h6>
                <p className="mb-0 text-muted small">
                  {chat.lastMessage?.text || "Chưa có tin nhắn"}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <Badge bg="primary" pill>
                  {chat.unreadCount}
                </Badge>
              )}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
}

export default ChatList;
