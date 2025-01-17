"use client";

import { useState, useEffect, useRef } from "react";

export function useMeeting(meetingId) {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const localPeer = useRef(null);

  const constraints = {
    video: { width: 640, height: 360, frameRate: 15 },
    audio: true,
  };
  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  function generateRandomString() {
    return Array(4)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("");
  }

  const createPeer = async (stream) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    const peer = {
      peerId: generateRandomString(),
      connection: peerConnection,
    };

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        //console.log("candidate", event.candidate);
        const candidate = event.candidate;
        socketRef.current.send(JSON.stringify(event.candidate));
      }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    peerConnection.addEventListener("connectionstatechange", (event) => {
      if (peerConnection.connectionState === "connected") {
        console.log("Peers connected");
      }
    });

    console.log("Peer connection", peerConnection);
    peers.push(peer);
    setPeers(peers);
    return peerConnection;
  };

  const createPeerConnection = async (stream) => {
    const peerConnection = await createPeer(stream);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("offer", offer);
    socketRef.current.send(JSON.stringify(offer));
    return peerConnection;
  };

  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://localhost:8081/ws/signaling?roomId=${meetingId}`
    );

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
      const peer = createPeerConnection(stream);
      localPeer.current = peer;
    });

    socketRef.current.addEventListener("open", (event) => {
      socketRef.current.send(
        JSON.stringify({
          message: "Connection established",
          type: "connection-est",
        })
      );
    });

    socketRef.current.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "offer") {
        const peerConnection = await createPeer(localStreamRef.current);
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("answer", answer);
        socketRef.current.send(JSON.stringify(answer));
      } else if (message.candidate) {

        const p = await localPeer.current;
        console.log("Local peer", p);
        p.addIceCandidate(message);
      }
    });
  }, []);

  return { localVideoRef, peers };
}
