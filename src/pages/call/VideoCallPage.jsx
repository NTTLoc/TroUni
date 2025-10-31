import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { path } from "../../utils/constants";
import "./VideoCallPage.scss";

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("name") || "";
  const roomId = searchParams.get("roomId") || "";
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joined, setJoined] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [endCountdown, setEndCountdown] = useState(3);
  const [remoteStreams, setRemoteStreams] = useState({});

  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const iceCandidateQueueRef = useRef({});
  const localStreamRef = useRef(null);
  const configuration = useRef({});
  const countdownIntervalRef = useRef(null);

  // ===== ICE SERVER CONFIG =====
  useEffect(() => {
    const setupConfig = async () => {
      if (location.hostname === "localhost") {
        configuration.current = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };
      } else {
        configuration.current = await fetch("./turn.json").then((r) =>
          r.json()
        );
      }
    };
    setupConfig();
  }, []);

  // ===== JOIN CALL =====
  useEffect(() => {
    if (username && roomId && !joined) joinCall();
    return () => hangupCall();
  }, [username, roomId]);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const socket = new WebSocket(
        `wss://video3-dot-trouni-473709.de.r.appspot.com/socket?room=${roomId}`
      );
      socketRef.current = socket;
      setupSocketListeners(socket);

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join", name: username }));
        setJoined(true);
      };
    } catch (err) {
      console.error("Cannot access camera/microphone", err);
      alert("Không thể truy cập camera/micro. Kiểm tra quyền.");
    }
  };

  // ===== SOCKET =====
  const setupSocketListeners = (socket) => {
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      const fromId = msg.from;
      const fromName = msg.name || msg.fromName;

      switch (msg.type) {
        case "room-state":
          for (const peerId in msg.peers) {
            if (peerId !== msg.youId)
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
      }
    };

    socket.onclose = () => {
      console.warn("WebSocket closed. Trying to reconnect...");
      setTimeout(() => {
        if (!joined) return;
        joinCall(); // thử kết nối lại nếu user vẫn đang trong phòng
      }, 3000);
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
  };

  // ===== CREATE PEER CONNECTION =====
  const createPeerConnection = (peerId, peerName, isInitiator) => {
    if (peerConnectionsRef.current[peerId])
      return peerConnectionsRef.current[peerId];

    const pc = new RTCPeerConnection(configuration.current);
    peerConnectionsRef.current[peerId] = pc;
    iceCandidateQueueRef.current[peerId] = [];

    // Attach local tracks safely
    const attachLocalTracks = () => {
      if (!localStreamRef.current) return;
      const senders = pc.getSenders();
      localStreamRef.current.getTracks().forEach((track) => {
        if (!senders.find((s) => s.track === track)) {
          pc.addTrack(track, localStreamRef.current);
        }
      });
    };
    attachLocalTracks();

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "candidate",
            to: peerId,
            candidate: event.candidate,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: { name: peerName, stream: event.streams[0] },
      }));
    };

    pc.onconnectionstatechange = () => {
      if (["disconnected", "closed", "failed"].includes(pc.connectionState))
        removePeer(peerId);
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        if (
          !localStreamRef.current ||
          !socketRef.current ||
          socketRef.current.readyState !== WebSocket.OPEN
        )
          return;
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current.send(
            JSON.stringify({
              type: "offer",
              to: peerId,
              sdp: pc.localDescription,
            })
          );
        } catch (err) {
          console.error(err);
        }
      };
    }

    return pc;
  };

  // ===== HANDLE OFFER / ANSWER / CANDIDATE =====
  const handleOffer = async (fromId, fromName, sdp) => {
    const pc =
      peerConnectionsRef.current[fromId] ||
      createPeerConnection(fromId, fromName, false);
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    processIceCandidateQueue(fromId);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.send(
      JSON.stringify({ type: "answer", to: fromId, sdp: pc.localDescription })
    );
  };

  const handleAnswer = async (fromId, sdp) => {
    const pc = peerConnectionsRef.current[fromId];
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    processIceCandidateQueue(fromId);
  };

  const handleCandidate = (fromId, candidate) => {
    const pc = peerConnectionsRef.current[fromId];
    if (!pc || !candidate) return;
    if (pc.remoteDescription && pc.remoteDescription.type) {
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    } else {
      iceCandidateQueueRef.current[fromId].push(candidate);
    }
  };

  const processIceCandidateQueue = (peerId) => {
    const pc = peerConnectionsRef.current[peerId];
    const queue = iceCandidateQueueRef.current[peerId];
    if (pc && queue)
      while (queue.length)
        pc.addIceCandidate(new RTCIceCandidate(queue.shift())).catch(
          console.error
        );
  };

  // ===== REMOVE PEER =====
  const removePeer = (peerId) => {
    peerConnectionsRef.current[peerId]?.close();
    delete peerConnectionsRef.current[peerId];
    delete iceCandidateQueueRef.current[peerId];
    setRemoteStreams((prev) => {
      const copy = { ...prev };
      delete copy[peerId];
      return copy;
    });
  };

  // ===== HANGUP =====
  const hangupCall = () => {
    if (isEndingCall) return;
    setIsEndingCall(true);
    setEndCountdown(3);
    socketRef.current?.send(JSON.stringify({ type: "leave" }));
    socketRef.current?.close();

    countdownIntervalRef.current = setInterval(() => {
      setEndCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          Object.keys(peerConnectionsRef.current).forEach(removePeer);
          peerConnectionsRef.current = {};
          iceCandidateQueueRef.current = {};
          localStreamRef.current = null;
          setJoined(false);
          setIsEndingCall(false);
          navigate(path.CHAT, { state: { fromCall: true } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===== TOGGLE AUDIO / VIDEO =====
  const toggleAudio = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setMicOn((prev) => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setCamOn((prev) => !prev);
  };

  return (
    <div className="video-call-page">
      <div className="video-container">
        <div id="local-video-wrapper" className="video-wrapper">
          <p>{`Bạn (${username})`}</p>
          <video ref={localVideoRef} autoPlay playsInline muted />
        </div>

        {Object.entries(remoteStreams).map(([peerId, { name, stream }]) => (
          <div key={peerId} className="video-wrapper">
            <p>{name}</p>
            <video
              ref={(v) => v && (v.srcObject = stream)}
              autoPlay
              playsInline
            />
          </div>
        ))}
      </div>

      {joined && (
        <div className="controls-container">
          <Button
            shape="circle"
            size="large"
            onClick={toggleAudio}
            icon={micOn ? <AudioOutlined /> : <AudioMutedOutlined />}
          />
          <Button
            shape="circle"
            size="large"
            onClick={toggleVideo}
            icon={camOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
          />
          <Button
            shape="circle"
            size="large"
            onClick={hangupCall}
            danger
            icon={<PhoneOutlined />}
          />
        </div>
      )}

      {isEndingCall && (
        <div className="call-overlay">
          <div className="spinner" />
          <div>
            Đang kết thúc cuộc gọi... Quay lại chat trong {endCountdown}s
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;
