import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Typography, message } from "antd";
import {
  VideoCameraOutlined,
  PhoneOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraAddOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import VideoGrid from "../../features/call/videoGrid/VideoGrid";
import "./VideoCallPage.scss";

const { Title } = Typography;

const SIGNALING_SERVER =
  "wss://video3-dot-trouni-473709.de.r.appspot.com/socket";

const VideoCallPage = () => {
  const [name, setName] = useState(sessionStorage.getItem("name") || "");
  const [roomId, setRoomId] = useState(sessionStorage.getItem("roomId") || "");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [remotePeers, setRemotePeers] = useState([]); // {id, name, stream, cameraOff}

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const iceCandidateQueue = useRef({});
  const [config, setConfig] = useState({ iceServers: [] });

  /** -------------------- TURN/STUN config -------------------- **/
  useEffect(() => {
    if (location.hostname === "localhost") {
      setConfig({ iceServers: [{ urls: "stun:stun.l.cloudflare.com:3478" }] });
    } else {
      fetch("/turn.json")
        .then((r) => r.json())
        .then(setConfig)
        .catch(() =>
          message.warning("Không tải được TURN config, dùng STUN mặc định.")
        );
    }
  }, []);

  /** -------------------- INIT CAMERA -------------------- **/
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        await localVideoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera error:", err);
      message.error("Không thể truy cập camera hoặc micro!");
      throw err;
    }
  };

  /** -------------------- JOIN ROOM -------------------- **/
  const handleJoin = async () => {
    if (!name || !roomId) return message.warning("Nhập tên và mã phòng trước!");
    setLoading(true);

    try {
      await initCamera();

      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsHost = window.location.host;
      const ws = new WebSocket(
        `${wsProtocol}://${wsHost}${SIGNALING_SERVER}?room=${roomId}`
      );
      socketRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", name }));
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("roomId", roomId);
        setJoined(true);
        setLoading(false);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const fromId = msg.from;
        const fromName = msg.name || msg.fromName;

        switch (msg.type) {
          case "room-state":
            for (const peerId in msg.peers) {
              createPeerConnection(peerId, msg.peers[peerId].name, true);
            }
            break;
          case "peer-join":
            createPeerConnection(fromId, fromName, false);
            break;
          case "offer":
            handleOffer(fromId, fromName, msg.sdp);
            break;
          case "answer":
            handleAnswer(fromId, msg.sdp);
            break;
          case "candidate":
            handleCandidate(fromId, msg.candidate);
            break;
          case "peer-leave":
            removePeer(fromId);
            break;
          default:
            console.log("Unknown message:", msg);
        }
      };

      ws.onclose = () => console.log("WebSocket closed");
      ws.onerror = (err) => console.error("WebSocket error:", err);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /** -------------------- PEER CONNECTION -------------------- **/
  const createPeerConnection = (peerId, peerName, isInitiator) => {
    if (peerConnections.current[peerId]) return;

    const pc = new RTCPeerConnection(config);
    peerConnections.current[peerId] = pc;
    iceCandidateQueue.current[peerId] = [];

    localStreamRef.current
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStreamRef.current));

    pc.ontrack = (event) => {
      setRemotePeers((prev) => {
        if (prev.find((p) => p.id === peerId)) return prev;
        return [
          ...prev,
          {
            id: peerId,
            name: peerName,
            stream: event.streams[0],
            cameraOff: false,
          },
        ];
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.send(
          JSON.stringify({
            type: "candidate",
            to: peerId,
            candidate: event.candidate,
          })
        );
      }
    };

    pc.onconnectionstatechange = () => {
      if (["disconnected", "closed", "failed"].includes(pc.connectionState))
        removePeer(peerId);
    };

    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() =>
          socketRef.current?.send({
            type: "offer",
            to: peerId,
            sdp: pc.localDescription,
          })
        )
        .catch(console.error);
    }
    return pc;
  };

  const handleOffer = (fromId, fromName, sdp) => {
    const pc =
      peerConnections.current[fromId] ||
      createPeerConnection(fromId, fromName, false);
    pc.setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => pc.createAnswer())
      .then((answer) => pc.setLocalDescription(answer))
      .then(() =>
        socketRef.current?.send({
          type: "answer",
          to: fromId,
          sdp: pc.localDescription,
        })
      )
      .then(() => processIceCandidateQueue(fromId))
      .catch(console.error);
  };

  const handleAnswer = (fromId, sdp) => {
    const pc = peerConnections.current[fromId];
    if (pc)
      pc.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => processIceCandidateQueue(fromId))
        .catch(console.error);
  };

  const handleCandidate = (fromId, candidate) => {
    const pc = peerConnections.current[fromId];
    if (!pc || !candidate) return;

    if (pc.remoteDescription && pc.remoteDescription.type) {
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    } else {
      iceCandidateQueue.current[fromId].push(candidate);
    }
  };

  const processIceCandidateQueue = (peerId) => {
    const pc = peerConnections.current[peerId];
    if (!pc || !iceCandidateQueue.current[peerId]) return;

    while (iceCandidateQueue.current[peerId].length) {
      const candidate = iceCandidateQueue.current[peerId].shift();
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    }
  };

  const removePeer = (peerId) => {
    if (peerConnections.current[peerId]) {
      peerConnections.current[peerId].close();
      delete peerConnections.current[peerId];
    }
    setRemotePeers((prev) => prev.filter((p) => p.id !== peerId));
  };

  /** -------------------- HANGUP -------------------- **/
  const handleHangup = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    Object.keys(peerConnections.current).forEach(removePeer);
    socketRef.current?.close();
    setJoined(false);
    setRemotePeers([]);
    sessionStorage.clear();
  };

  /** -------------------- MUTE / CAMERA -------------------- **/
  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMuted(!audioTrack.enabled);
    }
  };
  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOff(!videoTrack.enabled);
    }
  };

  /** -------------------- RENDER -------------------- **/
  return (
    <div className="video-call-container">
      {!joined ? (
        <Card className="join-room-card">
          <Title level={3}>
            <VideoCameraOutlined /> Tham gia phòng họp
          </Title>
          <Input
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <Input
            placeholder="Mã phòng"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Button
            type="primary"
            block
            icon={<VideoCameraOutlined />}
            loading={loading}
            onClick={handleJoin}
          >
            Tham gia
          </Button>
        </Card>
      ) : (
        <div className="meeting-room">
          <div className="videos-grid">
            {/* Local video */}
            <VideoGrid
              peer={{
                name: `${name} (Bạn)`,
                stream: localStreamRef.current,
                cameraOff,
              }}
            />
            {/* Remote peers */}
            {remotePeers.map((peer) => (
              <VideoGrid key={peer.id} peer={peer} />
            ))}
          </div>

          <div className="toolbar">
            <Button
              shape="circle"
              icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={toggleMute}
            />
            <Button
              shape="circle"
              icon={
                cameraOff ? <VideoCameraAddOutlined /> : <VideoCameraFilled />
              }
              onClick={toggleCamera}
            />
            <Button
              danger
              type="primary"
              shape="circle"
              size="large"
              icon={<PhoneOutlined />}
              onClick={handleHangup}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;
