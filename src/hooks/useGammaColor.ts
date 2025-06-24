"use client";

import useDeviceOrientation from "@/hooks/useDeviceOrientation";
import { hsvToRgb } from "@/utils/colorFade";

/**
 * Convert gamma orientation to interpolated RGB string
 */
function interpolateColorFromGamma(
  gamma: number | null,
  h = 36,
  s = 0.47,
  vMax = 0.96,
  vMin = 0.26
): string {
  if (gamma === null) gamma = 0;

  const maxAngle = 20;
  const deadBand = 2.5;
  const absGamma = Math.max(deadBand, Math.min(Math.abs(gamma), maxAngle));
  const ratio = (absGamma - deadBand) / (maxAngle - deadBand);

  const v = vMax - ratio * (vMax - vMin);
  const [r, g, b] = hsvToRgb(h, s, v);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Hook that provides dynamic RGB color based on device orientation (gamma)
 */
export default function useGammaColor(
  options?: { h?: number; s?: number; vMax?: number; vMin?: number }
) {
  const {
    deviceOrientation,
    requestAccess,
    isPermissionGranted,
    isSupported,
    error,
  } = useDeviceOrientation();

  const gamma = isPermissionGranted && isSupported ? deviceOrientation.gamma : null;
  const color = interpolateColorFromGamma(
    gamma,
    options?.h,
    options?.s,
    options?.vMax,
    options?.vMin
  );

  return {
    color,                 // `rgb(...)` string
    gamma,
    deviceOrientation,
    requestAccess,
    isPermissionGranted,
    isSupported,
    error,
  };
}
