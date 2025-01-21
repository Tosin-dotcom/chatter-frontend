
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function JoinMeeting({isOpen, close}) {

  const [name, setName] = useState(null);
  const [meetingLink, setMeetingLink] = useState(null);

  const router = useRouter();

  const handleClick = async (e) => {

    e.preventDefault()
    localStorage.setItem("name", name)
    window.location.href = `/${meetingLink}`
  }

  if (!isOpen) {
    return null
  }
  return (
    <div className="h-screen w-screen fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="w-[420px] h-80 border bg-white rounded-2xl p-7">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold text-black">Join Meeting</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={close}
            className="size-6 cursor-pointer text-gray-500 hover:text-gray-950"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="mt-4">
          <label htmlFor="firstname" className="block text-black">
            Your Name
          </label>
          <input
          required
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Enter Your name"
            className="p-2 w-full rounded-lg mt-1 border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="meetingcode" className="block text-black">
            Meeting Code
          </label>
          <input
          required
            type="text"
            id="meetingcode"
            name="meetingcode"
            placeholder="Enter Meeting code"
            className="p-2 w-full rounded-lg mt-1 border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>

        <div>
          <button 
          onClick={handleClick}
          type="button"
          className="bg-blue-800 hover:bg-blue-700 w-full mt-4 p-2 rounded-lg text-white">
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
