"use client";

import { useState } from "react";
import useDeviceOrientation from "../hooks/useDeviceOrientation";

export default function OrientationPermission() {
  const { requestAccess, isPermissionGranted, isSupported, error } = useDeviceOrientation();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    setIsRequesting(true);
    await requestAccess();
    setIsRequesting(false);
  };

  if (!isSupported) {
    return <p>Device Orientation API is not supported on this device.</p>;
  }

  return (
    <div className="p-4">
      {!isPermissionGranted && !error && (
        <button
          onClick={handleRequest}
          disabled={isRequesting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isRequesting ? "Requesting..." : "Allow Device Orientation Access"}
        </button>
      )}
      {isPermissionGranted && <p>Access granted! Orientation data is being tracked.</p>}
      {error && <p className="text-red-500">Error: </p>}
    </div>
  );
}