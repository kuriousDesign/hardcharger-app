"use client";

import useGammaColor from "@/hooks/useGammaColor";

export default function OrientationInfo() {
  const {
    color,
    gamma,
    deviceOrientation,
    requestAccess,
    isPermissionGranted,
    isSupported,
    error,
    ratio,
  } = useGammaColor(); // optionally pass { h: 120 } etc. for hue overrides

  return (
    <div className="p-4 text-white">
      <h1 className="text-lg font-bold mb-2 transition-colors duration-0" style={{ color }}>
        Device Orientation
      </h1>

      {(!isSupported || !isPermissionGranted) && (
        <p className="text-red-500">Device Orientation API not supported.</p>
      )}

      {error && <p className="text-red-400">Error: {error.message}</p>}

      {isSupported && !isPermissionGranted && (
        <button
          className="bg-blue-500 px-4 py-2 rounded text-white"
          onClick={requestAccess}
        >
          Request Access
        </button>
      )}

      {isSupported && isPermissionGranted && (
        <ul className="mt-4 space-y-2">
          <li> Ratio: {ratio}</li>
          <li>Alpha (Z-axis): {deviceOrientation.alpha ?? "N/A"}</li>
          <li>Beta (X-axis): {deviceOrientation.beta ?? "N/A"}</li>
          <li style={{ color }} className="font-semibold transition-colors duration-0">
            Gamma (Y-axis): {gamma ?? "N/A"}
          </li>
          <li>Absolute: {deviceOrientation.absolute ? "Yes" : "No"}</li>
          <li style={{ color }} className="font-semibold transition-colors duration-0">
            Y-axis Color Fade
          </li>
        </ul>
      )}
    </div>
  );
}
