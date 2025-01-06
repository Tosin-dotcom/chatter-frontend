import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-blue-600 text-white">
      <div className="block text-center">
        <h1 className="text-6xl">Connect Instantly</h1>
        <p>
          High Quality video meetings accessible to everyone. Start or Join a
          meeting with just one click.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex w-3/4 text-center">
          <div className="basis-1/3 p-8">
            <h3 className="text-lg font-bold">No Downloads</h3>
            <p className="pt-1 pr-8 pl-8 text-center">Connect directly through your browser</p>
          </div>

          <div className="basis-1/3 p-8 border-2 border-red-600">
            <h3 className="text-lg font-bold text-center">HD Quality</h3>
            <p className="pt-1 pr-8 pl-8 text-center">Crystal clear video and audio streaming</p>
          </div>

          <div className="basis-1/3 p-8">
            <h3 className="text-lg font-bold text-center">Secure</h3>
            <p className="pt-1 pr-8 pl-8 text-center">End-to-end encrypted connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
