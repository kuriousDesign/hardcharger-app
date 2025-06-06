import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)', '/sign-up(.*)', '/(api|trpc)(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/events(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones (including API routes)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  
  // Protect admin routes with role check
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    let url = new URL('/', req.url);
    //if a user is logged in, redirect to dashboard, otherwise go to home
    if (await auth()) {
      url = new URL('/dashboard', req.url);
    } 
    return NextResponse.redirect(url);
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};