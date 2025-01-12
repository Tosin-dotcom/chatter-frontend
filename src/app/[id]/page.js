"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { LuMonitorUp } from "react-icons/lu";
import { FiPhoneOff } from "react-icons/fi";
import MeetingTile from "../components/MeetingTile";
import Peer from "simple-peer";

export default function Page() {
  const params = useParams();
  const { id } = params;

  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  const participants = [
    { id: 1, name: "You", isLocal: true },
    { id: 2, name: "John Doe" },
    { id: 3, name: "Jane Smith" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
    { id: 4, name: "Mike Johnson" },
  ];

  const constraints = {
    video: { width: 640, height: 360, frameRate: 5 },
    audio: true,
  };
 

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8081/ws/signaling?roomId=${id}`);

    socketRef.current.onmessage = (message) => {
        const data = JSON.parse(message.data)

        if (data.offer) {
            peerRef.current.signal(data.offer)
        } else if (data.answer) {
            peerRef.current.signal(data.answer)
        } else if (data.candidate) {
            peerRef.current.signal(data.candidate)
        }
    }

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            localVideoRef.current.srcObject = stream
            
            const peer = new Peer({initiator: true, trickle: false, stream})
         
            peer.on("signal", (signal) => {

                socketRef.current.send(JSON.stringify({signal}))
            })

            peer.on("stream", (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream
            })

            stream.getTracks().forEach((track) => {
              const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      
              recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  socketRef.current.send(event.data); 
                }
              };
      
              recorder.start(100);
            });
            peerRef.current = peer
        })

        return () => {
            socketRef.current.close()
        }

  }, []);


  const handleMicClick = () => {
    setMicOn(!micOn);
  };


  const handleVideoClick = () => {
    setVideoOn(!videoOn);
  };


  

  return (
    <div className="h-screen w-screen bg-[#111827] text-white flex flex-col">
      <div className="p-4 bg-[#1F2937] ">
        <h3 className="text-lg font-medium">Meeting: {id}</h3>
      </div>

      {/* <div className="flex-grow overflow-y-auto p-6 bg-[#111827]">
        <div className="grid gap-5 grid-cols-3">
          {participants.map((participant, index) => (
            <MeetingTile key={index} />
          ))}
        </div>
      </div> */}

      <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
        </div>

      <div className="flex-shrink-0 bottom-0 left-0 w-full bg-[#1F2937] p-3 text-center flex items-center justify-center">
        <button
          onClick={handleMicClick}
          className={`rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 ${
            micOn ? "bg-[#374151]  hover:bg-gray-600" : "bg-red-700"
          }`}
        >
          {micOn ? (
            <PiMicrophone className="size-6" />
          ) : (
            <PiMicrophoneSlashLight className="size-6" />
          )}
        </button>

        <button
          onClick={handleVideoClick}
          className={`rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 ${
            videoOn ? "bg-[#374151]  hover:bg-gray-600" : "bg-red-700"
          }`}
        >
          {videoOn ? (
            <CiVideoOn className="size-6" />
          ) : (
            <CiVideoOff className="size-7" />
          )}
        </button>

        <button className="rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 bg-[#374151] hover:bg-gray-600">
          <LuMonitorUp className="size-6" />
        </button>

        <button className="rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 bg-red-700 hover:bg-red-600">
          <FiPhoneOff className="size-6" />
        </button>
      </div>
      
    </div>
  );
}
