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

  const userId = generateRandomString();

  const handleIncomingCandidate = async (candidate) => {
    if (localPeer.current.remoteDescription) {
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      pendingCandidates.current.push(candidate);
    }
  };

  const flushPendingCandidates = async () => {
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeer = async (stream, peerId) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;

      setRemoteStreams((prev) => {
        const isPeerPresent = prev.some(
          (entry) => entry.peerId === peerId
        );
        if (isPeerPresent) return prev;
        return [...prev, { peerId, stream: remoteStream }];
      });
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

  const handleUserLeave = (peerId) => {
    // Remove the remote stream for the user that left
    setRemoteStreams((prev) =>
      prev.filter((streamData) => streamData.peerId !== peerId)
    );
    console.log("User left")
    console.log("remote stream inside hook", remoteStreams)
  };

  const initializeLocalPeerConnection = async (stream) => {
    const peerConnection = await createPeer(stream, userId);
    localPeer.current = peerConnection;

    return peerConnection;
  };

  useEffect(() => {
    socketRef.current = new WebSocket(
      `wss://192.168.221.152:8443/ws/signaling?roomId=${meetingId}`
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
      } else if (message.type == "offer") {
        //const peerConnection = await createPeer(localStreamRef.current);
        localPeer.current.setRemoteDescription(
          new RTCSessionDescription(message)
        );
        const answer = await localPeer.current.createAnswer();
        await localPeer.current.setLocalDescription(answer);
        socketRef.current.send(JSON.stringify(answer));
        flushPendingCandidates();
      } else if (message.type == "answer") {
        const remoteDesc = new RTCSessionDescription(message);
        await localPeer.current.setRemoteDescription(remoteDesc);
      } else if (message.type == "leave") {
        console.log("Leave event")
        handleUserLeave(message.userId);
      } else if (message.candidate) {
        await handleIncomingCandidate(message);
      }
    });


    const handleTabClose = () => {
      socketRef.current.send(
        JSON.stringify({
          message: "Leave Meeting",
          type: "leave",
          userId,
        })
      );
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      localPeer.current?.close();
      // peers.forEach((peer) => {
      //   peer.connection.close();
      // });
   
      socketRef.current.disconnect();
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return { localVideoRef, remoteStreams };
}
