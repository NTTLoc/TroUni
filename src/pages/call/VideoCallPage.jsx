import React, { useEffect, useRef, useState } from "react";
import { Layout, Button, Input, message, Space } from "antd";
import { VideoCameraOutlined, AudioOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const SIGNALING_SERVER =
  "wss://video3-dot-trouni-473709.de.r.appspot.com/socket";

const VideoCallPage = () => {
  const [name, setName] = useState(() => sessionStorage.getItem("name") || "");
  const [roomId, setRoomId] = useState(
    () => sessionStorage.getItem("roomId") || ""
  );
  const [joined, setJoined] = useState(
    () => sessionStorage.getItem("joined") === "true"
  );
  const [micOff, setMicOff] = useState(false);
  const [camOff, setCamOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);
  const ws = useRef(null);
  const myId = useRef(Math.random().toString(36).substring(2, 10));

  const joinRoom = () => {
    if (!name || !roomId) {
      message.error("Vui lòng nhập tên và Room ID");
      return;
    }
    setJoined(true);
    sessionStorage.setItem("joined", "true");
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("roomId", roomId);
  };

  useEffect(() => {
    if (!joined) return;

    // 1. Tạo peer connection
    pc.current = new RTCPeerConnection();

    // 2. Lấy local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));
      })
      .catch((err) => console.error(err));

    // 3. Nhận remote track
    pc.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // 4. ICE candidates
    pc.current.onicecandidate = (event) => {
      if (event.candidate && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            room: roomId,
            from: myId.current,
          })
        );
      }
    };

    // 5. Kết nối WebSocket thuần
    ws.current = new WebSocket(SIGNALING_SERVER);

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({ type: "join", room: roomId, from: myId.current })
      );
      console.log("Connected to signaling server");
    };

    ws.current.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      if (data.from === myId.current) return;

      console.log("Received message:", data);

      switch (data.type) {
        case "room-state": {
          const peers = Object.keys(data.peers).filter(
            (id) => id !== myId.current
          );
          if (peers.length > 0 && pc.current.signalingState === "stable") {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            ws.current.send(
              JSON.stringify({
                type: "offer",
                offer,
                room: roomId,
                from: myId.current,
              })
            );
          }
          break;
        }
        case "offer":
          await pc.current.setRemoteDescription(data.offer);
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          ws.current.send(
            JSON.stringify({
              type: "answer",
              answer,
              room: roomId,
              from: myId.current,
            })
          );
          break;
        case "answer":
          await pc.current.setRemoteDescription(data.answer);
          break;
        case "ice-candidate":
          if (data.candidate) {
            try {
              await pc.current.addIceCandidate(data.candidate);
            } catch (e) {
              console.error(e);
            }
          }
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };

    ws.current.onerror = console.error;
    ws.current.onclose = () => console.log("WebSocket closed");

    return () => {
      pc.current.close();
      ws.current.close();
    };
  }, [joined, roomId]);

  const toggleMic = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => (track.enabled = micOff));
    setMicOff(!micOff);
  };

  const toggleCam = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => (track.enabled = camOff));
    setCamOff(!camOff);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ background: "#fff" }}>
        <h2 style={{ color: "#1890ff", textAlign: "center" }}>
          Video Call App
        </h2>
      </Header>
      <Content style={{ padding: 50 }}>
        {!joined ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Input
              placeholder="Tên bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={joinRoom}
              size="large"
            >
              Tham gia phòng
            </Button>
          </Space>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
            <div>
              <h3>Video của bạn</h3>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{ width: 300, borderRadius: 8 }}
              />
              <Space style={{ marginTop: 10 }}>
                <Button
                  type={micOff ? "default" : "primary"}
                  icon={<AudioOutlined />}
                  onClick={toggleMic}
                >
                  {micOff ? "Bật Micro" : "Tắt Micro"}
                </Button>
                <Button
                  type={camOff ? "default" : "primary"}
                  icon={<VideoCameraOutlined />}
                  onClick={toggleCam}
                >
                  {camOff ? "Bật Camera" : "Tắt Camera"}
                </Button>
              </Space>
            </div>
            <div>
              <h3>Video người khác</h3>
              <video
                ref={remoteVideoRef}
                autoPlay
                style={{ width: 300, borderRadius: 8 }}
              />
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default VideoCallPage;
