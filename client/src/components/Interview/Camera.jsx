import React, { useState } from "react";
import Webcam from "react-webcam";
import { RiVideoLine, RiVideoOffLine } from "react-icons/ri";

const Camera = ({ webcamRef, enabled = true }) => {
  const [error, setError] = useState(false);

  if (!enabled) {
    return (
      <div className="rounded-xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center">
        <div className="text-center text-slate-400">
          <RiVideoOffLine className="text-4xl mx-auto mb-2" />
          <p className="text-xs">Camera off</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-slate-800 aspect-video relative">
      {error ? (
        <div className="w-full h-full flex items-center justify-center text-center text-slate-400 p-4">
          <div>
            <RiVideoLine className="text-3xl mx-auto mb-2" />
            <p className="text-xs">Camera unavailable</p>
          </div>
        </div>
      ) : (
        <Webcam
          ref={webcamRef}
          mirrored
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          onUserMediaError={() => setError(true)}
        />
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
      </div>
    </div>
  );
};

export default Camera;
