"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StartMeeting({ isOpen, close }) {
  const [name, setName] = useState(null);
  const [meetingLink, setMeetingLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("name", name)
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      //const api = `${apiBaseUrl}/meeting/start`;
      const api = `https://chatter-backend-b43o.onrender.com/api/meeting/start`;
    
      const response = await axios.post(api, null, {
        params: { name: name },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMeetingLink(response.data);
      //router.replace( `/${response.data}`);
      window.location.href = `/${response.data}`
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-screen w-screen fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="w-[420px] h-60 border bg-white rounded-2xl p-7">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold text-black">Start Meeting</h3>
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
            type="text"
            id="firstname"
            name="firstname"
            required
            placeholder="Enter Your name"
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full rounded-lg mt-1 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          {loading ? (
            <button
              type="button"
              disabled
              className="bg-blue-800 hover:bg-blue-700 w-full mt-4 p-[10px] rounded-lg text-white flex items-center justify-center"
            >
              <svg
                className="animate-spin h-5 w-5 text-center text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 12h4z"
                ></path>
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-800 hover:bg-blue-700 w-full mt-4 p-2 rounded-lg text-white"
            >
              Start Meeting
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
