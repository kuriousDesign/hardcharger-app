"use client";

import useGammaColor, { GammaColorProps } from "@/hooks/useGammaColor";

//#7C3A20
// HSV: 27°, 61%, 72% (#B77848)
// HSV: 20°, 74%, 49% (#7C3A20)
// HSV: 60°, 100%, 95% (#FFE1AF)

//brightColor hsv: 38, 45, 100
//dullColor hsv: 38, 100, 63

export default function DivShimmer({ title, options, className }: { title: string, options?: GammaColorProps, className?: string }) {
    const {
        color,
        isPermissionGranted,
        isSupported,
        error,
    } = useGammaColor(options); // optionally pass { h: 120 } etc. for hue overrides


    if (!isSupported || !isPermissionGranted) {
        return (
            <p className="text-red-500">{`Device Orientation API not supported. ${error?.message}`}</p>
        )
    }

    return (
        <div className={`${className} transition-colors duration-0`} style={{ color }}>
            {title}
        </div>
    );
}
