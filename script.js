const joinContainer = document.getElementById("join-container");
const videosContainer = document.getElementById("videos-container");
const nameInput = document.getElementById("name");
const roomIdInput = document.getElementById("roomId");
const joinButton = document.getElementById("joinButton");
const hangupButton = document.getElementById("hangupButton");
const localVideo = document.getElementById("localVideo");
const localVideoWrapper = document.getElementById("local-video-wrapper");
const localNameTag = document.getElementById("local-name-tag");

let localStream;
let socket;
const peerConnections = {};
// A queue for ICE candidates that arrive before the remote description is set
const iceCandidateQueue = {};

const configuration = {
  // iceServers: [{ urls: 'stun:stun.l.cloudflare.com:3478' }]
};

if (location.hostname === "localhost") {
  configuration.server = {
    iceServers: [{ urls: "stun:stun.l.cloudflare.com:3478" }],
  };
} else {
  configuration.server = await fetch("./turn.json").then((r) => r.json());
}
// configuration.server = await fetch('./turn.json').then(r => r.json());
joinButton.onclick = async () => {
  const name = nameInput.value.trim();
  const roomId = roomIdInput.value.trim();
  if (name && roomId) {
    joinContainer.style.display = "none";
    hangupButton.style.display = "block";
    localVideoWrapper.style.display = "block";
    localNameTag.innerText = `You (${name})`;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.srcObject = localStream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera or microphone. Please check permissions.");
      return;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsHost = window.location.host;
    socket = new WebSocket(`${wsProtocol}://${wsHost}/socket?room=${roomId}`);
    // socket = new WebSocket(`wss://video3-dot-trouni-473709.de.r.appspot.com/socket?room=${roomId}`);

    setupSocketListeners();

    socket.onopen = () => {
      console.log("WebSocket connected, sending join message.");
      socket.send(JSON.stringify({ type: "join", name: name }));
    };
  } else {
    alert("Please enter your name and a Room ID.");
  }
};

function setupSocketListeners() {
  socket.onmessage = async (event) => {
    const msg = JSON.parse(event.data);
    const fromId = msg.from;
    const fromName = msg.name || msg.fromName;

    console.log("Received message:", msg);

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
    }
  };
  socket.onclose = () => console.log("WebSocket connection closed.");
  socket.onerror = (error) => console.error("WebSocket error:", error);
}

function createPeerConnection(peerId, peerName, isInitiator) {
  if (peerConnections[peerId]) {
    console.warn(`Connection with ${peerId} already exists.`);
    return null;
  }

  console.log(
    `Creating peer connection for ${peerName} (${peerId}), initiator: ${isInitiator}`
  );
  const pc = new RTCPeerConnection(configuration.server);
  peerConnections[peerId] = pc;
  iceCandidateQueue[peerId] = [];

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(
        JSON.stringify({
          type: "candidate",
          to: peerId,
          candidate: event.candidate,
        })
      );
    }
  };

  pc.ontrack = (event) => {
    console.log(`Received remote track from ${peerName} (${peerId})`);
    addRemoteVideo(peerId, peerName, event.streams[0]);
  };

  pc.onconnectionstatechange = () => {
    console.log(`Connection state for ${peerId}: ${pc.connectionState}`);
    if (["disconnected", "closed", "failed"].includes(pc.connectionState)) {
      removePeer(peerId);
    }
  };

  if (isInitiator) {
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        console.log(`Sending offer to ${peerId}`);
        socket.send(
          JSON.stringify({
            type: "offer",
            to: peerId,
            sdp: pc.localDescription,
          })
        );
      })
      .catch((e) => console.error("Error creating offer:", e));
  }
  return pc;
}

function handleOffer(fromId, fromName, sdp) {
  console.log(`Handling offer from ${fromId}`);
  const pc =
    peerConnections[fromId] || createPeerConnection(fromId, fromName, false);
  pc.setRemoteDescription(new RTCSessionDescription(sdp))
    .then(() => pc.createAnswer())
    .then((answer) => pc.setLocalDescription(answer))
    .then(() => {
      console.log(`Sending answer to ${fromId}`);
      socket.send(
        JSON.stringify({ type: "answer", to: fromId, sdp: pc.localDescription })
      );
      // Process any queued candidates
      processIceCandidateQueue(fromId);
    })
    .catch((e) => console.error("Error handling offer:", e));
}

function handleAnswer(fromId, sdp) {
  console.log(`Handling answer from ${fromId}`);
  const pc = peerConnections[fromId];
  if (pc) {
    pc.setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        // Process any queued candidates
        processIceCandidateQueue(fromId);
      })
      .catch((e) => console.error("Error setting remote description:", e));
  }
}

function handleCandidate(fromId, candidate) {
  const pc = peerConnections[fromId];
  if (pc && candidate) {
    // If the remote description isn't set yet, queue the candidate
    if (pc.remoteDescription && pc.remoteDescription.type) {
      console.log(`Adding ICE candidate for ${fromId}`);
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
        console.error("Error adding ICE candidate:", e)
      );
    } else {
      console.log(`Queuing ICE candidate for ${fromId}`);
      iceCandidateQueue[fromId].push(candidate);
    }
  }
}

function processIceCandidateQueue(peerId) {
  const pc = peerConnections[peerId];
  if (pc && iceCandidateQueue[peerId]) {
    while (iceCandidateQueue[peerId].length > 0) {
      const candidate = iceCandidateQueue[peerId].shift();
      console.log(`Processing queued ICE candidate for ${peerId}`);
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
        console.error("Error adding queued ICE candidate:", e)
      );
    }
  }
}

function addRemoteVideo(peerId, name, stream) {
  const videoWrapperId = `wrapper-${peerId}`;
  if (document.getElementById(videoWrapperId)) return;

  const videoWrapper = document.createElement("div");
  videoWrapper.className = "video-wrapper";
  videoWrapper.id = videoWrapperId;

  const nameTag = document.createElement("p");
  nameTag.innerText = name;

  const remoteVideo = document.createElement("video");
  remoteVideo.autoplay = true;
  remoteVideo.playsInline = true;
  remoteVideo.srcObject = stream;

  videoWrapper.appendChild(nameTag);
  videoWrapper.appendChild(remoteVideo);
  videosContainer.appendChild(videoWrapper);
}

function removePeer(peerId) {
  console.log(`Removing peer ${peerId}`);
  if (peerConnections[peerId]) {
    peerConnections[peerId].close();
    delete peerConnections[peerId];
  }
  const videoWrapper = document.getElementById(`wrapper-${peerId}`);
  if (videoWrapper) {
    videoWrapper.remove();
  }
}

hangupButton.onclick = () => {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  for (const id in peerConnections) {
    removePeer(id);
  }
  if (socket) {
    socket.close();
  }

  joinContainer.style.display = "flex";
  hangupButton.style.display = "none";
  localVideoWrapper.style.display = "none";
  document
    .querySelectorAll(".video-wrapper:not(#local-video-wrapper)")
    .forEach((v) => v.remove());
};
