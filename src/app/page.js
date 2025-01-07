import Image from "next/image";
import { VideoCameraIcon } from "@heroicons/react/outline";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="block text-center">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-16 w-16 mb-6 text-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>

        <h1 className="text-5xl mb-4">Connect Instantly</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
          High Quality video meetings accessible to everyone. Start or Join a
          meeting with just one click.
        </p>
      </div>

      <div className="flex justify-center">
        <div className=" m-4 p-10 w-96 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-indigo-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-indigo-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
          <h3 className="text-2xl mb-2 font-semibold">Join Meeting</h3>
          <p className="text-indigo-100">
            Enter a meeting code or link to connect with others instantly
          </p>
        </div>

        <div className="m-4 p-10 w-96 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-indigo-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-indigo-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
          <h3 className="text-2xl mb-2 font-semibold">Start Meeting</h3>
          <p className="text-indigo-100">
            Create a new meeting and invite others to join
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex w-3/4 text-center">
          <div className="basis-1/3 p-8">
            <h3 className="text-lg font-bold">No Downloads</h3>
            <p className="pt-1 pr-8 pl-8 text-center">
              Connect directly through your browser
            </p>
          </div>

          <div className="basis-1/3 p-8">
            <h3 className="text-lg font-bold text-center">HD Quality</h3>
            <p className="pt-1 pr-8 pl-8 text-center">
              Crystal clear video and audio streaming
            </p>
          </div>

          <div className="basis-1/3 p-8">
            <h3 className="text-lg font-bold text-center">Secure</h3>
            <p className="pt-1 pr-8 pl-8 text-center">
              End-to-end encrypted connections
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
