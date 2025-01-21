"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { LuMonitorUp } from "react-icons/lu";
import { FiPhoneOff } from "react-icons/fi";
import { useMeeting } from "../hooks/useMeeting";
import { useRouter } from "next/navigation";
import { generateRandomName } from "../utils/generateRandomName";


export default function Page() {
  const params = useParams();
  const { id} = params;
  const router = useRouter()
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem("name") || generateRandomName())

  useEffect(() => {
 
    setLoading(false); 
  }, []); 

  
  const { localVideoRef, remoteStreams, localStream } = useMeeting(id, userName);

  const toggleAudio = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  const toggleVideo = async () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setVideoOn(videoTrack.enabled);
  };

  const handleLeave = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    peers.forEach(peer => {
      peer.connection.close();
    });

    
  };
 

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];

      if (audioTrack) {
        audioTrack.enabled = false;
      }
      if (videoTrack) {
        videoTrack.enabled = false;
      }
    }
  }, [localStream]);


  if (loading) {
    return <div>Loading...</div>; 
  }


  return (
    <div className="h-screen w-screen bg-[#111827] text-white flex flex-col">
      <div className="p-4 bg-[#1F2937] ">
        <h3 className="text-lg font-medium">Meeting: {id}</h3>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[#111827]">
        <div className="grid gap-5 grid-cols-3">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-[230px] rounded-lg w-full object-cover"
            />
            <div className="rounded-lg absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p>(You) {userName}</p>
            </div>
          </div>
          {remoteStreams.map((stream, index) => (
            <div className="relative" key={index}>
            <video
              ref={(videoElement) => {
                if (videoElement && stream) {
                  videoElement.srcObject = stream.stream;
                }
              }}
              autoPlay
              playsInline
              muted
              className="h-[230px] rounded-lg"
            />
            <div className="rounded-lg absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
      
              <p>{stream.name}</p>
            </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 bottom-0 left-0 w-full bg-[#1F2937] p-3 text-center flex items-center justify-center">
        <button
          onClick={toggleAudio}
          //onClick={handleMicClick}
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
          onClick={toggleVideo}
          //onClick={handleVideoClick}
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

        <button onClick={() => router.push("/")} className="rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 bg-red-700 hover:bg-red-600">
          <FiPhoneOff className="size-6" />
        </button>
      </div>
    </div>
  );
}
