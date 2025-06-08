import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/',                  // Home page
  '/sign-in(.*)',      // Sign-in routes
  '/sign-up(.*)',      // Sign-up routes
  '/(api|trpc)(.*)',   // API and TRPC routes
]);

// Define admin routes (all routes under app/admin, requires admin role)
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',        // Maps to app/admin and all sub-routes (e.g., /admin/events, /admin/dashboard)
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();

  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect(); // Ensures user is logged in
  }

  // Protect all routes under app/admin with role check
  if (isAdminRoute(req)) {
    // Check if user is logged in and has admin role
    if (!userId || !sessionClaims?.metadata?.role || sessionClaims.metadata.role !== 'admin') {
      // Redirect based on login status
      const redirectUrl = new URL(userId ? '/dashboard' : '/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};