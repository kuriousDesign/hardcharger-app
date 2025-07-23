import {
  Geist_Mono as FontMono,
  Geist as FontSans,
  Goldman,
  Inter,
  Orbitron,
  Permanent_Marker,
} from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Configure Permanent Marker
export const fontPermanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400', // Permanent Marker only supports 400
  variable: '--font-permanent-marker',
});

export const fontGoldman = Goldman({
  subsets: ['latin'],
  weight: '400', // Goldman only supports 400
  variable: '--font-goldman',
}); 

export const fontOrbitron = Orbitron({
  subsets: ['latin'],
  weight: '700', 
  variable: '--font-orbitron',
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontPermanentMarker.variable,
  fontGoldman.variable,
  fontOrbitron.variable
);