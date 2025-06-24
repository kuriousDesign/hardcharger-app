// utils/colorFade.ts

/**
 * Convert HSV color to RGB
 */
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
  
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
  
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }
  
  /**
   * Interpolate color brightness based on gamma value
   * @param gamma deviceOrientation.gamma, in degrees
   * @param h hue (default 36 = gold)
   * @param s saturation (default 0.47)
   * @param vMax max brightness (default 0.96)
   * @param vMin min brightness (default 0.26)
   */
  export function interpolateColorFromGamma(
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
  