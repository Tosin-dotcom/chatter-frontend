"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { LuMonitorUp } from "react-icons/lu";
import { FiPhoneOff } from "react-icons/fi";
import { useMeeting } from "../hooks/useMeeting";
import { useRouter } from "next/navigation";
import {
  generateRandomName,
  generateUserId,
} from "../utils/generateRandomName";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  //const [loading, setLoading] = useState(true);
  const [localUserTalking, setLocalUserTalking] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || generateRandomName()
  );
  const [userId] = useState(generateUserId());

  const { localVideoRef, remoteStreams, localStream, sendAudioEvent } =
    useMeeting(id, userName, userId);

  const toggleAudio = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
    sendAudioEvent(userId, audioTrack.enabled);
  };

  const toggleVideo = async () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setVideoOn(videoTrack.enabled);
  };

  const handleLeave = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    console.log("Remote stream use effect", remoteStreams);
  }, [remoteStreams]);

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack.enabled == true) {
        setLocalUserTalking(true);
      } else {
        setLocalUserTalking(false);
      }
    }
  }, [micOn]);

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

  return (
    <div className="h-screen w-screen bg-[#111827] text-white flex flex-col">
      <div className="p-4 bg-[#1F2937] ">
        <h3 className="text-lg font-medium">Meeting: {id}</h3>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[#111827]">
        <div className="grid gap-5 grid-cols-3">
          <div
            className={`relative rounded-lg transition duration-300 ease-in-out 
              ${
                localUserTalking
                  ? "ring-4 ring-cyan-500 ring-opacity-75 shadow-lg shadow-cyan-500/50 "
                  : ""
              }`}
          >
            {micOn == false ? (
              <div className="rounded-lg absolute up-0 left-0 right-0 p-3 flex justify-end pr-2">
                <p className="rounded-full bg-gray-700 p-1">
                  {micOn == false ? (
                    <PiMicrophoneSlashLight className="h-5 w-5" />
                  ) : null}
                </p>
              </div>
            ) : null}

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
            <div
              className={`relative rounded-lg transition duration-300 ease-in-out ${
                stream.audioEnabled
                  ? "ring-4 ring-cyan-500 ring-opacity-75 shadow-lg shadow-cyan-500/50"
                  : ""
              }`}
              key={index}
            >
              {!stream.audioEnabled ? (
                <div className="rounded-lg absolute up-0 left-0 right-0 p-3 flex justify-end pr-2">
                  <p className="rounded-full bg-gray-700 p-1">
                    {!stream.audioEnabled ? (
                      <PiMicrophoneSlashLight className="h-5 w-5" />
                    ) : null}
                  </p>
                </div>
              ) : null}

              <video
                ref={(videoElement) => {
                  if (videoElement && stream) {
                    videoElement.srcObject = stream.stream;
                  }
                }}
                autoPlay
                playsInline
                className="h-[230px] rounded-lg w-full object-cover"
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

        <button
          onClick={handleLeave}
          className="rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 bg-red-700 hover:bg-red-600"
        >
          <FiPhoneOff className="size-6" />
        </button>
      </div>
    </div>
  );
}
