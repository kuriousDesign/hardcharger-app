"use client";

import { useCallback, useEffect, useState } from "react";

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
}

// Extended interface for iOS 13+ permission
interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const startingOrientation: DeviceOrientationState = {
  alpha: null,
  beta: null,
  gamma: null,
  absolute: false,  
};

function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientationState>(startingOrientation);

  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [error, setError] = useState<Error | null>(null);



  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (startingOrientation.alpha === null && event.alpha !== null) {
      // Initialize with starting values if not set
      startingOrientation.alpha = event.alpha;
      startingOrientation.beta = event.beta;
      startingOrientation.gamma = event.gamma;
      startingOrientation.absolute = event.absolute ?? false;
    } 
    setOrientation({
      alpha: (event.alpha ?? 0) - (startingOrientation.alpha ?? 0),
      beta: (event.beta ?? 0) - (startingOrientation.beta ?? 0),
      gamma: (event.gamma ?? 0) - (startingOrientation.gamma ?? 0),
      absolute: event.absolute ?? false,
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.DeviceOrientationEvent !== "undefined") {
      setIsSupported(true);

      const deviceOrientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

      // If no permission required, automatically start listening
      if (typeof deviceOrientationEvent.requestPermission !== "function") {
        setIsPermissionGranted(true);
        window.addEventListener("deviceorientation", handleOrientation);
      }

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [handleOrientation]);

  const requestAccess = useCallback(async () => {
    if (typeof window === "undefined") return;

    const deviceOrientationEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventExtended;

    if (typeof deviceOrientationEvent.requestPermission === "function") {
      try {
        const permissionState = await deviceOrientationEvent.requestPermission();
        if (permissionState === "granted") {
          setIsPermissionGranted(true);
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          setError(new Error("Permission to access device orientation was denied"));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error during permission request"));
      }
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
