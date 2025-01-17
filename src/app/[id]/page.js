"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { LuMonitorUp } from "react-icons/lu";
import { FiPhoneOff } from "react-icons/fi";
import MeetingTile from "../components/MeetingTile";
import { useMeeting } from "../hooks/useMeeting";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  const peerRefs = useRef(new Map());
  const { localVideoRef } = useMeeting(id)


  const participants = [
    { id: 1, name: "You", isLocal: true },
    { id: 2, name: "John Doe" },
    { id: 3, name: "Jane Smith" },
    { id: 4, name: "Mike Johnson" }
  ];

  useEffect(() => {}, [])


   return (
    <div className="h-screen w-screen bg-[#111827] text-white flex flex-col">
      <div className="p-4 bg-[#1F2937] ">
        <h3 className="text-lg font-medium">Meeting: {id}</h3>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[#111827]">
        {/* <div className="grid gap-5 grid-cols-3">
          {participants.map((participant, index) => (
            <MeetingTile key={index} />
          ))}
        </div> */}
      </div>

      <video ref={localVideoRef} autoPlay playsInline muted className="w-1/3 border border-gray-600 ml-4"/>

      <div className="flex-grow flex justify-center items-center">
        
      </div>

      <div className="flex-shrink-0 bottom-0 left-0 w-full bg-[#1F2937] p-3 text-center flex items-center justify-center">
        <button
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

        <button className="rounded-full w-12 h-12 flex items-center justify-center p-2 mr-4 bg-red-700 hover:bg-red-600">
          <FiPhoneOff className="size-6" />
        </button>
      </div>
    </div>
  );
}
