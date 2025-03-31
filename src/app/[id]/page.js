"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { LuMonitorUp } from "react-icons/lu";
import { FiPhoneOff } from "react-icons/fi";
import { useMeeting } from "../hooks/useMeeting";
import { useRouter } from "next/navigation";
import Participant from "../components/Participant";
import {
  generateRandomName,
  generateUserId,
  generateColor,
  getInitials,
} from "../utils/Utils";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  //const [loading, setLoading] = useState(true);
  const [localUserTalking, setLocalUserTalking] = useState(false);
  const [participantList, setParticipantList] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || generateRandomName()
  );
  const [userId] = useState(generateUserId());
 
  const {
    localVideoRef,
    remoteStreams,
    localStream,
    sendAudioEvent,
    sendVideoEvent,
  } = useMeeting(id, userName, userId);

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
    sendVideoEvent(userId, videoTrack.enabled);
  };



  const stopCamera = () => {
    const stream = localStream;
    stream.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        track.stop();
      }
    });
  };
  

  const handleLeave = () => {
    window.location.href = "/";
  };

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
      <div className="flex items-center space-x-4 bg-[#1F2937] p-4">
        <h1 className="text-white text-lg font-medium">Meeting: {id}</h1>
        <div className="flex items-center text-gray-300 text-sm">
          <LuUsers className="h-4 w-4 mr-1" />
          <span>{remoteStreams.length + 1}</span>
        </div>
      </div>

      

      <div className="flex-grow overflow-y-auto p-6 bg-[#111827] relative">
        <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${participantList && "mr-80"}`}>
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
              className={`h-[220px] rounded-lg w-full object-cover ${
                videoOn == false && "hidden"
              }`}
            />

            {videoOn == false && (
              <div className="h-[220px] rounded-lg w-full bg-[#1F2937]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`font-semibold text-4xl rounded-full w-24 h-24 flex items-center justify-center ${generateColor(
                      userName
                    )}`}
                  >
                    {getInitials(userName)}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-lg absolute bottom-0 left-0 right-0 p-3 ">
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
                className={`h-[220px] rounded-lg w-full object-cover ${
                  !stream.videoEnabled && "hidden"
                }`}
              />
              <div className="rounded-lg absolute bottom-0 left-0 right-0 p-3">
                <p>{stream.name}</p>
              </div>

              {!stream.videoEnabled && (
                <div className="h-[220px] rounded-lg w-full bg-[#1F2937]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`font-semibold text-4xl rounded-full w-24 h-24 flex items-center justify-center ${generateColor(
                        stream.name
                      )}`}
                    >
                      {getInitials(stream.name)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>


        <Participant
        micOn={micOn}
        videoOn={videoOn}
        remoteStreams={remoteStreams}
        name={userName}
        isOpen={participantList}
        close={() => setParticipantList(false)}
      />


      </div>

      
      <div className="flex-shrink-0 bottom-0 left-0 z-20 w-full bg-[#1F2937] p-3 text-center flex items-center justify-center">
        <button
          onClick={toggleAudio}
          className={`rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 ${
            micOn
              ? "bg-[#374151]  hover:bg-gray-600"
              : "bg-red-700 hover:bg-red-600"
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
          className={`rounded-full w-12 h-12  flex items-center justify-center p-2 mr-4 ${
            videoOn
              ? "bg-[#374151]  hover:bg-gray-600"
              : "bg-red-700 hover:bg-red-600"
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
          className={
            "rounded-full w-12 h-12 flex items-center justify-center bg-[#374151] hover:bg-gray-600 p-2 mr-4"
          } onClick={() => setParticipantList(!participantList)}
        >
          <LuUsers className="size-6" />
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
