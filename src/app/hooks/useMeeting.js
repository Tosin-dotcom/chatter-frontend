"use client";

import { useState, useEffect, useRef } from "react";

export function useMeeting(meetingId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const localPeer = useRef(null);
  const pendingCandidates = useRef([]);

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

  const handleIncomingCandidate = async (candidate) => {
    if (localPeer.current.remoteDescription) {
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Added ICE candidate:", candidate);
    } else {
      pendingCandidates.current.push(candidate);
      console.log("Queued ICE candidate:", candidate);
    }
  };

  const flushPendingCandidates = async () => {
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Flushed ICE candidate:", candidate);
    }
  };

  const createPeer = async (stream) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
    console.log("Peer connection added");

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams((prev) => [...prev, remoteStream]);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        setTimeout(() => {
          socketRef.current.send(JSON.stringify(event.candidate));
        }, 500);
      }
    };

    peerConnection.addEventListener("connectionstatechange", (event) => {
      if (peerConnection.connectionState === "connected") {
        console.log("Peers connections successful");
      }
    });

    return peerConnection;
  };

  const initializeLocalPeerConnection = async (stream) => {
    const peerConnection = await createPeer(stream);
    localPeer.current = peerConnection;

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
      initializeLocalPeerConnection(stream);
    });

    socketRef.current.addEventListener("open", () => {
      setTimeout(() => {
        socketRef.current.send(
          JSON.stringify({
            message: "Connection established",
            type: "joined",
          })
        );
      }, 1000);
    });

    socketRef.current.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "joined") {
        const offer = await localPeer.current.createOffer();
        localPeer.current.setLocalDescription(offer);
        socketRef.current.send(JSON.stringify(offer));
        flushPendingCandidates();
        console.log("offer sent", offer);
      } else if (message.type == "offer") {
        const peerConnection = await createPeer(localStreamRef.current);
        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current.send(JSON.stringify(answer));
        flushPendingCandidates();
      } else if (message.type == "answer") {
        console.log("Answer received", message);
        const remoteDesc = new RTCSessionDescription(message);
        await localPeer.current.setRemoteDescription(remoteDesc);
      } else if (message.candidate) {
        console.log("Candidate received for connection");
        await handleIncomingCandidate(message);
      }
    });
  }, []);

  return { localVideoRef, remoteStreams };
}
