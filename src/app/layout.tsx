import type { Metadata } from 'next';
import { META_THEME_COLORS, siteConfig } from '@/lib/config';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ActiveThemeProvider } from '@/components/active-theme';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import Script from 'next/script';
import { SiteFooter } from '@/components/footer/site-footer';
import { SiteHeader } from '@/components/header/site-header';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'HardCharger', 'Games 2025'],
  authors: [
    {
      name: 'Kurious Design',
      url: 'https://hardcharger.netlify.app',
    },
  ],
  creator: 'Kurious Design',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/', // Relative path, resolved by metadataBase
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/opengraph-image.png', // Relative path, resolved by metadataBase
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/opengraph-image.png'], // Relative path, resolved by metadataBase
    creator: '@hardcharger', // Update if you have a Twitter handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // Relative path, resolved by metadataBase
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
          'text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]',
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
          <ActiveThemeProvider>
            <div className="bg-background relative z-10 flex min-h-svh flex-col">
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter />
            </div>
            <Toaster position="top-center" />
          </ActiveThemeProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}