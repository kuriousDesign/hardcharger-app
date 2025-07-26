"use client";

import { useCallback, useEffect, useState } from "react";

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
}

interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  });

  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setError("Device Orientation API is not supported in this browser.");
      return;
    }

    setIsSupported(true);

    // No permission needed (non-iOS or older browsers)
    if (!("requestPermission" in DeviceOrientationEvent)) {
      window.addEventListener("deviceorientation", handleOrientation);
      setIsPermissionGranted(true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation]);

  const requestAccess = useCallback(async () => {
    if (typeof window === "undefined") return;

    const deviceOrientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

    if (deviceOrientationEvent.requestPermission) {
      try {
        const permission = await deviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setIsPermissionGranted(true);
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          setError("Permission to access device orientation was denied by the user.");
        }
      } catch (err) {
        setError("Failed to request permission: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    } else {
      setError("Permission request not supported on this device.");
    }
  }, [handleOrientation]);

  const revokeAccess = useCallback(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("deviceorientation", handleOrientation);
    }
    setIsPermissionGranted(false);
  }, [handleOrientation]);

  return {
    deviceOrientation: orientation,
    requestAccess,
    revokeAccess,
    isPermissionGranted,
    isSupported,
    error,
  };
}

export default useDeviceOrientation;