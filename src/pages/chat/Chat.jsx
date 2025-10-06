import React, { useState } from "react";
import { Layout, Input, Button, List, Avatar } from "antd";
import "./ChatPage.scss";

const { Sider, Content } = Layout;

const dummyChats = [
  { id: 1, name: "Nguyễn A", message: "Xin chào, bạn có rảnh trao đổi không?" },
  { id: 2, name: "Trần B", message: "Phòng này còn chỗ không bạn?" },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { sender: "Me", text: input }]);
    setInput("");
  };

  return (
    <Layout className="chat-page">
      {/* Sidebar danh sách chat */}
      <Sider width={250} className="chat-sider">
        <List
          itemLayout="horizontal"
          dataSource={dummyChats}
          renderItem={(chat) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{chat.name[0]}</Avatar>}
                title={chat.name}
                description={chat.message}
              />
            </List.Item>
          )}
        />
      </Sider>

      {/* Nội dung chat */}
      <Content className="chat-content">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.sender === "Me" ? "me" : ""}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="input-box">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhắn tin..."
            onPressEnter={handleSend}
          />
          <Button type="primary" onClick={handleSend}>
            Gửi
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Chat;
