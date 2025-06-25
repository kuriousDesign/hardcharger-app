"use client";

import useDeviceOrientation from "@/hooks/useDeviceOrientation";
import { hsvToRgb } from "@/utils/colorFade";

/**
 * Convert gamma orientation to interpolated RGB string
 */

export type HsvMinMaxProps = {
  h: number,
  s: number,
  vMax: number,
  vMin: number,
};

export type GammaSensitivityProps = {
  deadBand: number,
  maxAngle: number,
};  

function interpolateHsvMinMax(
  gamma: number | null,
  colorOptions: HsvMinMaxProps = { h: 120, s: 1, vMax: 1, vMin: 0.2 },
  sensitivityOptions: GammaSensitivityProps = { deadBand: 2.5, maxAngle: 20 }
): string {
  if (gamma === null) gamma = 0;

  const absGamma = Math.max(sensitivityOptions.deadBand, Math.min(Math.abs(gamma), sensitivityOptions.maxAngle));
  const ratio = (absGamma - sensitivityOptions.deadBand) / (sensitivityOptions.maxAngle - sensitivityOptions.deadBand);

  const v = colorOptions.vMax - ratio * (colorOptions.vMax - colorOptions.vMin);
  const [r, g, b] = hsvToRgb(colorOptions.h, colorOptions.s, v);
  return `rgb(${r}, ${g}, ${b})`;
}

//returns rgb value using gamma and HSV color options
function interpolateBetweenTwoHsvColors(
  gamma: number | null,
  dullColor: { h: number, s: number, v: number },
  brightColor: { h: number, s: number, v: number },
  sensitivityOptions: GammaSensitivityProps = { deadBand: 2.5, maxAngle: 20 }
): string {
  if (gamma === null) gamma = 0;

  const absGamma = Math.max(sensitivityOptions.deadBand, Math.min(Math.abs(gamma), sensitivityOptions.maxAngle));
  const ratio = (absGamma - sensitivityOptions.deadBand) / (sensitivityOptions.maxAngle - sensitivityOptions.deadBand);

  const h = brightColor.h - ratio * (brightColor.h - dullColor.h);
  const s = brightColor.s - ratio * (brightColor.s - dullColor.s);
  const v = brightColor.v - ratio * (brightColor.v - dullColor.v);

  const [r, g, b] = hsvToRgb(h, s, v);
  return `rgb(${r}, ${g}, ${b})`;
}



/**
 * Hook that provides dynamic RGB color based on device orientation (gamma)
 */

export type GammaColorProps = {
  type: 'twoHsvColors' | 'hsvWithValueMinMax';
  sensitivity?: 'low' | 'medium' | 'high';
  dullHsv?: { h: number; s: number; v: number }; // Dull color HSV
  brightHsv?: { h: number; s: number; v: number }; // Bright color HSV
  hsvMinMax?: HsvMinMaxProps; // HSV Min/Max values
};


export default function useGammaColor(
  options?: GammaColorProps
) {
  const {
    deviceOrientation,
    requestAccess,
    isPermissionGranted,
    isSupported,
    error,
  } = useDeviceOrientation();

  const gamma = isPermissionGranted && isSupported ? deviceOrientation.gamma : null;
  let color = 'rgb(0, 0, 0)'; // Default color

  const sensitivities = {
    low: { deadBand: 5, maxAngle: 30 },
    medium: { deadBand: 2.5, maxAngle: 20 },  
    high: { deadBand: 1, maxAngle: 10 },
  };


  switch (options?.type) {
    case 'twoHsvColors':
      if (options.dullHsv && options.brightHsv) {
        color = interpolateBetweenTwoHsvColors(
          gamma,
          options.dullHsv,
          options.brightHsv,
          sensitivities[options.sensitivity || 'medium']
        );
      }
      break;
    case 'hsvWithValueMinMax':
      if (options.hsvMinMax) {
        color = interpolateHsvMinMax(
          gamma,
          options.hsvMinMax,
          sensitivities[options.sensitivity || 'medium']
        );
      }
      break;
    default:
      // Default behavior if no options are provided
      color = interpolateHsvMinMax(
        gamma,
        { h: 120, s: 1, vMax: 1, vMin: 0.2 }, // Default HSV values
        sensitivities[options?.sensitivity || 'medium']
      );      
  }

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