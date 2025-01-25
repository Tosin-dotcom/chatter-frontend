import { PiMicrophone, PiMicrophoneSlashLight } from "react-icons/pi";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { generateColor, getInitials } from "../utils/Utils";

export default function Participant({
  micOn,
  videoOn,
  name,
  remoteStreams,
  isOpen,
  close
}) {
  if (!isOpen) {
    return null;
  }
  const totalLength = remoteStreams?.length + 1;

  return (
    <section
      className={`text-white absolute right-0 top-0 z-10 bg-gray-900 border-l border-gray-700 shadow-xl h-full w-80 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="border-b border-gray-500 p-4 flex justify-between">
        <h2 className="text-lg font-semibold">Participants - {totalLength}</h2>
        <span onClick={close} className="cursor-pointer">x</span>
      </div>

      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {/* local user */}
        <div className="flex justify-between hover:bg-gray-800 px-3 py-3">
          <div className="flex">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center p-5 mr-2 ${generateColor(
                name
              )}`}
            >
              <span>{getInitials(name)}</span>
            </div>
            <div className="flex items-center justify-center">
              <h1>{name} (You)</h1>
            </div>
          </div>

          <div className="text-white flex items-center justify-center">
            <div
              className={`mr-2 rounded-full p-1 ${
                micOn == false && "bg-red-700"
              }`}
            >
              {micOn == true ? (
                <PiMicrophone className="h-5 w-5 " />
              ) : (
                <PiMicrophoneSlashLight className="h-5 w-5" />
              )}
            </div>

            <div
              className={`mr-1 rounded-full p-1 ${
                videoOn == false && "bg-red-700"
              }`}
            >
              {videoOn == true ? (
                <CiVideoOn className="h-5 w-5" />
              ) : (
                <CiVideoOff className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>

        {/* remote users */}
        {remoteStreams.map((remoteStream, index) => {
          return (
            <div
              key={index}
              className="flex justify-between hover:bg-gray-800 px-3 py-3"
            >
              <div className="flex">
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center p-5 mr-2 ${generateColor(
                    remoteStream.name
                  )}`}
                >
                  <span>{getInitials(remoteStream.name)}</span>
                </div>
                <div className="flex items-center justify-center">
                  <h1>{remoteStream.name}</h1>
                </div>
              </div>

              <div className="text-white flex items-center justify-center">
                <div
                  className={`mr-2 rounded-full p-1 ${
                    remoteStream.audioEnabled == false && "bg-red-700"
                  }`}
                >
                  {remoteStream.audioEnabled == true ? (
                    <PiMicrophone className="h-5 w-5 " />
                  ) : (
                    <PiMicrophoneSlashLight className="h-5 w-5" />
                  )}
                </div>

                <div
                  className={`mr-1 rounded-full p-1 ${
                    remoteStream.videoEnabled == false && "bg-red-700"
                  }`}
                >
                  {remoteStream.videoEnabled == true ? (
                    <CiVideoOn className="h-5 w-5" />
                  ) : (
                    <CiVideoOff className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
