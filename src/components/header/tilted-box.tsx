"use client";

import useGammaColor, { GammaColorProps } from "@/hooks/useGammaColor";
import { shimmerBrightColor, shimmerDullColor, shimmerSensitivity } from "@/lib/shimmer-colors";

export default function TiltedBox({width, className }: { width: string, className?: string }) {
  const options={
        type: 'twoHsvColors',
        dullHsv: shimmerDullColor,
        brightHsv: shimmerBrightColor,
        sensitivity: shimmerSensitivity,
    };
    const {
        color,
    } = useGammaColor(options as GammaColorProps); // optionally pass { h: 120 } etc. for hue overrides



    return (
        <div className={`${className} w-${width} h-4 transform -skew-x-15 transition-colors duration-0`} style={{ backgroundColor: color }}>

        </div>

    );
}
