import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { checkIsAdmin } from './utils/roles';
import { getLinks } from './lib/link-urls';

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/',                    // Home page
  '/sign-in(.*)',        // Sign-in routes
  '/sign-up(.*)',        // Sign-up routes
  '/api(.*)',            // API routes
  '/trpc(.*)',           // TRPC routes
  '/opengraph-image.png', // Open Graph image
  '/site.webmanifest',   // Web manifest
  '/favicon.ico',        // Favicon
  '/favicon-16x16.png',  // Shortcut icon
  '/apple-touch-icon.png', // Apple touch icon
]);

// Define admin routes (requires admin role)
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',          // All /admin routes (e.g., /admin/drivers, /admin/events)
]);



export default clerkMiddleware(async (auth, req) => {

  // Protect non-public routes
  if (!isPublicRoute(req)) await auth.protect()

  // Protect admin routes with role check
  if (isAdminRoute(req)) {
    if (!checkIsAdmin()){
      // Redirect to dashboard if logged in, else to home
      const redirectUrl = new URL(getLinks().getDashboardUrl(), req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
});

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and specific static files
    '/((?!_next/static|_next/image|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|woff2?|ttf)).*)',
    // Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};