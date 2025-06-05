import type { Metadata } from "next"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { fontVariables } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/hooks/use-layout"
import { ActiveThemeProvider } from "@/components/active-theme"
// import { Analytics } from "@/components/analytics"
// import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"
import Script from 'next/script';
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  //metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  description: siteConfig.description,
  keywords: ["Next.js", "React", "Tailwind CSS", "Components", "shadcn"],
  authors: [
    {
      name: "shadcn",
      url: "https://shadcn.com",
    },
  ],
  creator: "shadcn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL!,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
        <meta name="theme-color" content={META_THEME_COLORS.light} />
        <Script id="theme-and-layout-handler" strategy="afterInteractive">
            {`
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `}
          </Script>
          
        </head>
        <body
          className={cn(
            "text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
            fontVariables
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutProvider>
              <ActiveThemeProvider>
                <header className="flex justify-end items-center p-4 gap-4 h-16 bg-opacity-10 backdrop-blur-md">
                  <SignedOut>
                    <SignInButton>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </header>
                    <div className="bg-background relative z-10 flex min-h-svh flex-col">
                    <SiteHeader />
                    <main className="flex flex-1 flex-col">{children}</main>
                    <SiteFooter />
                  </div>
                {/* <TailwindIndicator /> */}
                <Toaster position="top-center" />
                {/* <Analytics /> */}
              </ActiveThemeProvider>
            </LayoutProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}