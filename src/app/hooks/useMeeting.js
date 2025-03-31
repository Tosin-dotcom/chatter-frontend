"use client";

import { useState, useEffect, useRef } from "react";


export function useMeeting(meetingId, name, userId) {
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

  const handleIncomingCandidate = async (candidate) => {
    const peerObject = peers.find((peer) => peer.userId === candidate.userId);
    //if (localPeer.current.remoteDescription) {
    if (peerObject.peerConnection.remoteDescription) {
      await peerObject.peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
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

  const createPeer = async (stream, peerId, name) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams((prevStreams) => {
        const peerIndex = prevStreams.findIndex((entry) => entry.peerId === peerId);
    
        if (peerIndex !== -1) {
          const updatedStreams = [...prevStreams];
          updatedStreams[peerIndex] = {
            ...updatedStreams[peerIndex],
            stream: remoteStream,
          };
          return updatedStreams;
        }
  
        return [
          ...prevStreams,
          { peerId, name, audioEnabled: false, videoEnabled: false, stream: remoteStream },
        ];
      });
    };
    

    const temp = {
      userId: peerId,
      peerConnection,
    };
    const newPeers = peers.push(temp);
    setPeers(newPeers);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        setTimeout(() => {
          const candidateWithUserId = {
            ...JSON.parse(JSON.stringify(event.candidate)),
            userId,
          };
          socketRef.current.send(JSON.stringify(candidateWithUserId));
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
    setRemoteStreams((prevStreams) => {
      const updatedStreams = prevStreams.filter(
        (streamData) => streamData.peerId !== peerId
      );
      return updatedStreams;
    });
  };

  const handleUserAudioToggle = (peerId, enabled) => {
    setRemoteStreams((prevStreams) => {
      return prevStreams.map((stream) => {
        if (stream.peerId === peerId) {
          return { ...stream, audioEnabled: enabled };
        }
        return stream;
      });
    });
  };

  const handleUserVideoToggle = (peerId, enabled) => {
    setRemoteStreams((prevStreams) => {
      return prevStreams.map((stream) => {
        if (stream.peerId === peerId) {
          return { ...stream, videoEnabled: enabled };
        }
        return stream;
      });
    });
  };



  const initializeLocalPeerConnection = async (stream) => {
    const peerConnection = await createPeer(stream, userId, name);
    localPeer.current = peerConnection;

    return peerConnection;
  };

  const sendAudioEvent = (peerId, enabled) => {
    socketRef.current.send(
      JSON.stringify({
        type: "audio",
        enabled,
        userId: peerId,
      })
    );
  };

  const sendVideoEvent = (peerId, enabled) => {
    socketRef.current.send(
      JSON.stringify({
        type: "video",
        enabled,
        userId: peerId,
      })
    );
  }

  useEffect(() => {
    // socketRef.current = new WebSocket(
    //   `wss://localhost:8443/ws/signaling?roomId=${meetingId}`
    // );
    socketRef.current = new WebSocket(`wss://chatter-backend-oojzhg.fly.dev/ws/signaling?roomId=${meetingId}`);
   

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;
      initializeLocalPeerConnection(stream);
    });

    socketRef.current.addEventListener("open", () => {
      console.log("Name of user", name);
      setTimeout(() => {
        socketRef.current.send(
          JSON.stringify({
            message: "Connection established",
            type: "joined",
            userId,
            name,
          })
        );
      }, 1000);
    });

    socketRef.current.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "joined") {
        const peerCon = await createPeer(
          localStreamRef.current,
          message.userId,
          message.name
        );
        //const offer = await localPeer.current.createOffer();
        const offer = await peerCon.createOffer();
        const offerWithUserId = {
          ...offer,
          userId,
          name,
          to: message.userId,
        };
        //localPeer.current.setLocalDescription(offer);
        peerCon.setLocalDescription(offer);
        socketRef.current.send(JSON.stringify(offerWithUserId));
        flushPendingCandidates();
      } else if (message.type == "offer") {
        console.log("offer", message);
        if (message.to == userId) {
          const peerConnection = await createPeer(
            localStreamRef.current,
            message.userId,
            message.name
          );
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(message)
          );
          const answer = await peerConnection.createAnswer();
          const answerWithUserId = {
            ...answer,
            userId,
            to: message.userId,
          };
          await peerConnection.setLocalDescription(answer);
          socketRef.current.send(JSON.stringify(answerWithUserId));
          flushPendingCandidates();
        }
      } else if (message.type == "answer") {
        if (message.to == userId) {
          const peerObject = peers.find(
            (peer) => peer.userId === message.userId
          );
          const remoteDesc = new RTCSessionDescription(message);
          await peerObject.peerConnection.setRemoteDescription(remoteDesc);
        }
      } else if (message.type == "leave") {
        console.log("Leave event");
        handleUserLeave(message.userId);
      } else if (message.type == "audio") {
        handleUserAudioToggle(message.userId, message.enabled);
      } else if (message.type == "video") {
          handleUserVideoToggle(message.userId, message.enabled)
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
      peers.forEach((peer) => {
        peer.peerConnection.close();
      });
      socketRef.current.disconnect();
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [meetingId]);

  return { localVideoRef, remoteStreams, localStream, userId, sendAudioEvent, sendVideoEvent };
}


